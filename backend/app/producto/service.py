# app/producto/service.py
# Capa de Logica de Negocio para el modulo de Productos

from typing import List, Optional
from sqlmodel import Session
from datetime import datetime, timezone

from app.models.producto import Producto
from app.models.categoria import Categoria
from app.models.ingrediente import Ingrediente
from app.models.links import ProductoIngrediente

from app.producto.schema import (
    ProductoCreate,
    ProductoUpdate,
    ProductoResponse,
    ProductoIngredienteCreate,
    ProductoIngredienteResponse,
    CategoriaInfo,
    IngredienteInfo,
)
from app.producto.unit_of_work import ProductoUnitOfWork

# ── Helpers ───────────────────────────────────────────────────────────────────

def _build_response(p: Producto) -> ProductoResponse:
    """
    Helper para transformar un objeto del modelo Producto (ORM) a un schema de respuesta (Pydantic).
    Se encarga de mapear las relaciones de categoria e ingredientes.
    """
    cat_info = None
    cat_nombre = ""
    if p.categoria:
        cat_info = CategoriaInfo(id=p.categoria.id, nombre=p.categoria.nombre)
        cat_nombre = p.categoria.nombre

    ingredientes_info = [
        IngredienteInfo(id=ing.id, nombre=ing.nombre)
        for ing in (p.ingredientes or [])
    ]

    return ProductoResponse(
        id=p.id,
        nombre=p.nombre,
        descripcion=p.descripcion,
        precio_base=p.precio_base,
        categoria_id=p.categoria_id,
        categoria_nombre=cat_nombre,
        imagenes_url=p.imagenes_url or [],
        stock_cantidad=p.stock_cantidad,
        disponible=p.disponible,
        categorias=cat_info,
        ingredientes=ingredientes_info,
    )


# ── ProductoService ───────────────────────────────────────────────────────────

class ProductoService:
    """
    Clase de servicio que orquestra todas las operaciones relacionadas con Productos.
    Utiliza el Unit of Work para garantizar atomicidad en las transacciones.
    """
    def __init__(self, session: Session) -> None:
        self._session = session

    def get_all(self) -> List[ProductoResponse]:
        """Obtiene todos los productos activos y los transforma a DTOs de respuesta"""
        with ProductoUnitOfWork(self._session) as uow:
            productos = uow.productos.get_active()
            return [_build_response(p) for p in productos]

    def get_by_id(self, producto_id: int) -> Optional[ProductoResponse]:
        """Busca un producto por ID y devuelve su representacion de respuesta"""
        with ProductoUnitOfWork(self._session) as uow:
            p = uow.productos.get_by_id(producto_id)
            if p and p.deleted_at is None:
                return _build_response(p)
            return None

    def create(self, data: ProductoCreate) -> Optional[ProductoResponse]:
        """Crea un nuevo producto validando la categoria e insertando relaciones con ingredientes"""
        with ProductoUnitOfWork(self._session) as uow:
            # Validar que la categoría existe y está activa
            cat = uow.categorias.get_by_id(data.categoria_id)
            if not cat or cat.deleted_at is not None:
                return None

            db_obj = Producto(
                nombre=data.nombre,
                descripcion=data.descripcion,
                precio_base=data.precio_base,
                disponible=data.disponible,
                categoria_id=data.categoria_id,
                imagenes_url=data.imagenes_url,
                stock_cantidad=data.stock_cantidad,
            )
            uow.productos.add(db_obj)
            # Como SQLModel necesita el ID para las relaciones, hacemos flush manual
            uow.productos.session.flush()

            # Crear relaciones con ingredientes (tabla muchos a muchos)
            for ing_id in data.ingrediente_ids:
                ing = uow.ingredientes.get_by_id(ing_id)
                if ing:
                    rel = ProductoIngrediente(producto_id=db_obj.id, ingrediente_id=ing_id)
                    uow.producto_ingredientes.add(rel)

            # El commit se ejecuta automaticamente al salir del bloque 'with' (Unit of Work)
            uow.productos.session.flush()
            uow.productos.session.refresh(db_obj)
            return _build_response(db_obj)

    def update(self, producto_id: int, data: ProductoUpdate) -> Optional[ProductoResponse]:
        """Actualiza un producto y sincroniza sus ingredientes (borra anteriores e inserta nuevos)"""
        with ProductoUnitOfWork(self._session) as uow:
            p = uow.productos.get_by_id(producto_id)
            if not p or p.deleted_at is not None:
                return None

            # Validar que la categoría nueva existe
            cat = uow.categorias.get_by_id(data.categoria_id)
            if not cat or cat.deleted_at is not None:
                return None

            p.nombre = data.nombre
            p.descripcion = data.descripcion
            p.precio_base = data.precio_base
            p.disponible = data.disponible
            p.categoria_id = data.categoria_id
            p.imagenes_url = data.imagenes_url
            p.stock_cantidad = data.stock_cantidad
            p.updated_at = datetime.now(timezone.utc)

            # Sincronizar ingredientes: borrar viejos y crear nuevos
            old_rels = uow.producto_ingredientes.get_by_producto(producto_id)
            for r in old_rels:
                uow.producto_ingredientes.delete(r)

            for ing_id in data.ingrediente_ids:
                ing = uow.ingredientes.get_by_id(ing_id)
                if ing:
                    rel = ProductoIngrediente(producto_id=producto_id, ingrediente_id=ing_id)
                    uow.producto_ingredientes.add(rel)

            uow.productos.add(p)
            uow.productos.session.flush()
            uow.productos.session.refresh(p)
            return _build_response(p)

    def delete(self, producto_id: int) -> bool:
        """Realiza el borrado logico del producto (soft delete)"""
        with ProductoUnitOfWork(self._session) as uow:
            p = uow.productos.get_by_id(producto_id)
            if not p or p.deleted_at is not None:
                return False

            p.deleted_at = datetime.now(timezone.utc)
            uow.productos.add(p)
            return True

    # ── ProductoIngrediente (Manejo manual de relaciones) ───────────────────────────

    def get_all_ingrediente_relaciones(self) -> List[ProductoIngredienteResponse]:
        """Lista todas las relaciones de ingredientes existentes"""
        with ProductoUnitOfWork(self._session) as uow:
            relaciones = uow.producto_ingredientes.get_all()
            return [ProductoIngredienteResponse(**r.model_dump()) for r in relaciones]

    def create_ingrediente_relacion(self, data: ProductoIngredienteCreate) -> Optional[ProductoIngredienteResponse]:
        """Crea una relacion especifica producto-ingrediente de forma manual"""
        with ProductoUnitOfWork(self._session) as uow:
            p = uow.productos.get_by_id(data.producto_id)
            i = uow.ingredientes.get_by_id(data.ingrediente_id)

            if not p or p.deleted_at is not None or not i:
                return None

            # Evitar duplicados
            existing = uow.producto_ingredientes.get_by_producto_and_ingrediente(data.producto_id, data.ingrediente_id)
            if existing:
                return None

            relacion = ProductoIngrediente(
                producto_id=data.producto_id,
                ingrediente_id=data.ingrediente_id,
                es_removible=data.es_removible,
            )
            uow.producto_ingredientes.add(relacion)
            uow.producto_ingredientes.session.flush()
            uow.producto_ingredientes.session.refresh(relacion)
            return ProductoIngredienteResponse(**relacion.model_dump())

    def delete_ingrediente_relacion(self, producto_id: int, ingrediente_id: int) -> bool:
        """Elimina una relacion producto-ingrediente especifica"""
        with ProductoUnitOfWork(self._session) as uow:
            r = uow.producto_ingredientes.get_by_producto_and_ingrediente(producto_id, ingrediente_id)
            if not r:
                return False
            
            uow.producto_ingredientes.delete(r)
            return True
