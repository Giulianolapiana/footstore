# app/producto/schema.py
# Schemas Pydantic para Producto, ProductoCategoria y ProductoIngrediente

from pydantic import BaseModel
from typing import List, Optional


# ── Producto ──────────────────────────────────────────────────────────────────

class ProductoCreate(BaseModel):
    """Schema para crear un nuevo producto"""
    nombre: str
    descripcion: str
    precio_base: float
    categoria_id: int
    imagenes_url: List[str] = []
    stock_cantidad: int = 0
    disponible: bool = True
    ingrediente_ids: List[int] = []


class ProductoUpdate(BaseModel):
    """Schema para actualizar un producto"""
    nombre: str
    descripcion: str
    precio_base: float
    categoria_id: int
    imagenes_url: List[str] = []
    stock_cantidad: int = 0
    disponible: bool = True
    ingrediente_ids: List[int] = []


class CategoriaInfo(BaseModel):
    """Info reducida de categoría para embeder en respuesta de producto"""
    id: int
    nombre: str

    class Config:
        from_attributes = True


class IngredienteInfo(BaseModel):
    """Info reducida de ingrediente para embeder en respuesta de producto"""
    id: int
    nombre: str

    class Config:
        from_attributes = True


class ProductoResponse(BaseModel):
    """Schema de respuesta para un producto"""
    id: int
    nombre: str
    descripcion: str
    precio_base: float
    categoria_id: int
    categoria_nombre: str = ""
    imagenes_url: List[str]
    stock_cantidad: int
    disponible: bool
    categorias: Optional[CategoriaInfo] = None
    ingredientes: List[IngredienteInfo] = []

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
