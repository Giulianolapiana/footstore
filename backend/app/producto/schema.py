# app/producto/schema.py
# Schemas Pydantic para Producto, ProductoCategoria y ProductoIngrediente

from pydantic import BaseModel
from typing import List


# ── Producto ──────────────────────────────────────────────────────────────────

class ProductoCreate(BaseModel):
    """Schema para crear un nuevo producto"""
    nombre: str
    descripcion: str
    precio_base: float
    imagenes_url: List[str] = []
    stock_cantidad: int = 0
    disponible: bool = True


class ProductoUpdate(BaseModel):
    """Schema para actualizar un producto"""
    nombre: str
    descripcion: str
    precio_base: float
    imagenes_url: List[str] = []
    stock_cantidad: int = 0
    disponible: bool = True


class ProductoResponse(BaseModel):
    """Schema de respuesta para un producto"""
    id: int
    nombre: str
    descripcion: str
    precio_base: float
    imagenes_url: List[str]
    stock_cantidad: int
    disponible: bool

    class Config:
        from_attributes = True


# ── ProductoCategoria ─────────────────────────────────────────────────────────

class ProductoCategoriaCreate(BaseModel):
    """Schema para asociar un producto con una categoria"""
    producto_id: int
    categoria_id: int
    es_principal: bool = False


class ProductoCategoriaResponse(BaseModel):
    """Schema de respuesta para la relacion producto-categoria"""
    producto_id: int
    categoria_id: int
    es_principal: bool

    class Config:
        from_attributes = True


# ── ProductoIngrediente ───────────────────────────────────────────────────────

class ProductoIngredienteCreate(BaseModel):
    """Schema para asociar un producto con un ingrediente"""
    producto_id: int
    ingrediente_id: int
    es_removible: bool = False


class ProductoIngredienteResponse(BaseModel):
    """Schema de respuesta para la relacion producto-ingrediente"""
    producto_id: int
    ingrediente_id: int
    es_removible: bool

    class Config:
        from_attributes = True
