# app/producto/service.py
# Logica de negocio para el CRUD de Productos, ProductoCategoria y ProductoIngrediente

from typing import List, Optional
from sqlmodel import Session, select
from datetime import datetime

from app.models.producto import Producto
from app.models.categoria import Categoria
from app.models.ingrediente import Ingrediente
from app.models.links import ProductoCategoria, ProductoIngrediente

from app.producto.schema import (
    ProductoCreate,
    ProductoUpdate,
    ProductoResponse,
    ProductoCategoriaCreate,
    ProductoCategoriaResponse,
    ProductoIngredienteCreate,
    ProductoIngredienteResponse,
)


# ── Producto ──────────────────────────────────────────────────────────────────

def get_all(session: Session) -> List[ProductoResponse]:
    productos = session.exec(select(Producto).where(Producto.deleted_at == None)).all()
    # Mapeamos precio a precio_base y disponible para no romper compatibilidad temporal
    res = []
    for p in productos:
        d = p.model_dump()
        d["precio_base"] = d.get("precio", 0.0)
        d["disponible"] = True # No existe en BD temporalmente
        res.append(ProductoResponse(**d))
    return res


def get_by_id(session: Session, producto_id: int) -> Optional[ProductoResponse]:
    p = session.get(Producto, producto_id)
    if p and p.deleted_at is None:
        d = p.model_dump()
        d["precio_base"] = d.get("precio", 0.0)
        d["disponible"] = True
        return ProductoResponse(**d)
    return None


def create(session: Session, data: ProductoCreate) -> ProductoResponse:
    db_obj = Producto(
        nombre=data.nombre,
        descripcion=data.descripcion,
        precio=data.precio_base,
        imagenes_url=data.imagenes_url,
        stock_cantidad=data.stock_cantidad
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    d = db_obj.model_dump()
    d["precio_base"] = d.get("precio", 0.0)
    d["disponible"] = True
    return ProductoResponse(**d)


def update(session: Session, producto_id: int, data: ProductoUpdate) -> Optional[ProductoResponse]:
    p = session.get(Producto, producto_id)
    if not p or p.deleted_at is not None:
        return None
    
    p.nombre = data.nombre
    p.descripcion = data.descripcion
    p.precio = data.precio_base
    p.imagenes_url = data.imagenes_url
    p.stock_cantidad = data.stock_cantidad
    p.updated_at = datetime.utcnow()
    
    session.add(p)
    session.commit()
    session.refresh(p)
    
    d = p.model_dump()
    d["precio_base"] = d.get("precio", 0.0)
    d["disponible"] = True
    return ProductoResponse(**d)


def delete(session: Session, producto_id: int) -> bool:
    p = session.get(Producto, producto_id)
    if not p or p.deleted_at is not None:
        return False
    
    p.deleted_at = datetime.utcnow()
    session.add(p)
    session.commit()
    return True


# ── ProductoCategoria ─────────────────────────────────────────────────────────

def get_all_relaciones(session: Session) -> List[ProductoCategoriaResponse]:
    relaciones = session.exec(select(ProductoCategoria)).all()
    return [ProductoCategoriaResponse(**r.model_dump()) for r in relaciones]


def create_relacion(session: Session, data: ProductoCategoriaCreate) -> Optional[ProductoCategoriaResponse]:
    """Asocia un producto con una categoria (verifica que ambos existen)"""
    p = session.get(Producto, data.producto_id)
    c = session.get(Categoria, data.categoria_id)
    
    if not p or p.deleted_at is not None or not c or c.deleted_at is not None:
        return None

    # Evitar duplicados
    ya_existe = session.get(ProductoCategoria, {"producto_id": data.producto_id, "categoria_id": data.categoria_id})
    if ya_existe:
        return None

    relacion = ProductoCategoria(
        producto_id=data.producto_id,
        categoria_id=data.categoria_id,
        es_principal=data.es_principal,
    )
    session.add(relacion)
    session.commit()
    session.refresh(relacion)
    return ProductoCategoriaResponse(**relacion.model_dump())


def delete_relacion(session: Session, producto_id: int, categoria_id: int) -> bool:
    r = session.get(ProductoCategoria, {"producto_id": producto_id, "categoria_id": categoria_id})
    if not r:
        return False
    session.delete(r)
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
    ya_existe = session.get(ProductoIngrediente, {"producto_id": data.producto_id, "ingrediente_id": data.ingrediente_id})
    if ya_existe:
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
    r = session.get(ProductoIngrediente, {"producto_id": producto_id, "ingrediente_id": ingrediente_id})
    if not r:
        return False
    session.delete(r)
    session.commit()
    return True
