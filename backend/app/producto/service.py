# app/producto/service.py
# Logica de negocio para el CRUD de Productos y ProductoIngrediente

from typing import List, Optional
from sqlmodel import Session, select
from datetime import datetime

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


# ── Helpers ───────────────────────────────────────────────────────────────────

def _build_response(p: Producto) -> ProductoResponse:
    """Construye un ProductoResponse a partir de un modelo ORM cargado."""
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


# ── Producto ──────────────────────────────────────────────────────────────────

def get_all(session: Session) -> List[ProductoResponse]:
    productos = session.exec(select(Producto).where(Producto.deleted_at == None)).all()
    return [_build_response(p) for p in productos]


def get_by_id(session: Session, producto_id: int) -> Optional[ProductoResponse]:
    p = session.get(Producto, producto_id)
    if p and p.deleted_at is None:
        return _build_response(p)
    return None


def create(session: Session, data: ProductoCreate) -> Optional[ProductoResponse]:
    # Validar que la categoría existe
    cat = session.get(Categoria, data.categoria_id)
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
    session.add(db_obj)
    session.flush()  # obtener el ID antes de crear relaciones

    # Crear relaciones con ingredientes (opcional)
    for ing_id in data.ingrediente_ids:
        ing = session.get(Ingrediente, ing_id)
        if ing:
            rel = ProductoIngrediente(producto_id=db_obj.id, ingrediente_id=ing_id)
            session.add(rel)

    session.commit()
    session.refresh(db_obj)
    return _build_response(db_obj)


def update(session: Session, producto_id: int, data: ProductoUpdate) -> Optional[ProductoResponse]:
    p = session.get(Producto, producto_id)
    if not p or p.deleted_at is not None:
        return None

    # Validar que la categoría existe
    cat = session.get(Categoria, data.categoria_id)
    if not cat or cat.deleted_at is not None:
        return None

    p.nombre = data.nombre
    p.descripcion = data.descripcion
    p.precio_base = data.precio_base
    p.disponible = data.disponible
    p.categoria_id = data.categoria_id
    p.imagenes_url = data.imagenes_url
    p.stock_cantidad = data.stock_cantidad
    p.updated_at = datetime.utcnow()

    # Sincronizar ingredientes: borrar viejos, crear nuevos
    old_rels = session.exec(
        select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
    ).all()
    for r in old_rels:
        session.delete(r)

    for ing_id in data.ingrediente_ids:
        ing = session.get(Ingrediente, ing_id)
        if ing:
            rel = ProductoIngrediente(producto_id=producto_id, ingrediente_id=ing_id)
            session.add(rel)

    session.add(p)
    session.commit()
    session.refresh(p)
    return _build_response(p)


def delete(session: Session, producto_id: int) -> bool:
    p = session.get(Producto, producto_id)
    if not p or p.deleted_at is not None:
        return False

    p.deleted_at = datetime.utcnow()
    session.add(p)
    session.commit()
    return True


# ── ProductoIngrediente ───────────────────────────────────────────────────────

def get_all_ingrediente_relaciones(session: Session) -> List[ProductoIngredienteResponse]:
    relaciones = session.exec(select(ProductoIngrediente)).all()
    return [ProductoIngredienteResponse(**r.model_dump()) for r in relaciones]


def create_ingrediente_relacion(session: Session, data: ProductoIngredienteCreate) -> Optional[ProductoIngredienteResponse]:
    """Asocia un producto con un ingrediente (verifica que ambos existen)"""
    p = session.get(Producto, data.producto_id)
    i = session.get(Ingrediente, data.ingrediente_id)

    if not p or p.deleted_at is not None or not i:
        return None

    # Evitar duplicados
    existing = session.exec(
        select(ProductoIngrediente).where(
            ProductoIngrediente.producto_id == data.producto_id,
            ProductoIngrediente.ingrediente_id == data.ingrediente_id
        )
    ).first()
    if existing:
        return None

    relacion = ProductoIngrediente(
        producto_id=data.producto_id,
        ingrediente_id=data.ingrediente_id,
        es_removible=data.es_removible,
    )
    session.add(relacion)
    session.commit()
    session.refresh(relacion)
    return ProductoIngredienteResponse(**relacion.model_dump())


def delete_ingrediente_relacion(session: Session, producto_id: int, ingrediente_id: int) -> bool:
    r = session.exec(
        select(ProductoIngrediente).where(
            ProductoIngrediente.producto_id == producto_id,
            ProductoIngrediente.ingrediente_id == ingrediente_id
        )
    ).first()
    if not r:
        return False
    session.delete(r)
    session.commit()
    return True
