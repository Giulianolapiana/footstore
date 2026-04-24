# app/producto/schema.py
# Definicion de DTOs (Data Transfer Objects) usando Pydantic para el modulo de Productos

from pydantic import BaseModel
from typing import List, Optional


# ── Schemas de Producto ───────────────────────────────────────────────────────

class ProductoCreate(BaseModel):
    """Estructura de datos requerida para crear un nuevo producto."""
    nombre: str
    descripcion: str
    precio_base: float
    categoria_id: int
    imagenes_url: List[str] = []
    stock_cantidad: int = 0
    disponible: bool = True
    ingrediente_ids: List[int] = [] # IDs de ingredientes iniciales para asociar


class ProductoUpdate(BaseModel):
    """Estructura de datos requerida para actualizar un producto existente."""
    nombre: str
    descripcion: str
    precio_base: float
    categoria_id: int
    imagenes_url: List[str] = []
    stock_cantidad: int = 0
    disponible: bool = True
    ingrediente_ids: List[int] = [] # Nueva lista completa de IDs de ingredientes


class CategoriaInfo(BaseModel):
    """Informacion simplificada de una categoria para incluir en las respuestas de productos."""
    id: int
    nombre: str

    class Config:
        from_attributes = True


class IngredienteInfo(BaseModel):
    """Informacion simplificada de un ingrediente para incluir en las respuestas de productos."""
    id: int
    nombre: str

    class Config:
        from_attributes = True


class ProductoResponse(BaseModel):
    """Estructura de datos que se devuelve al cliente cuando se solicita un producto."""
    id: int
    nombre: str
    descripcion: str
    precio_base: float
    categoria_id: int
    categoria_nombre: str = ""
    imagenes_url: List[str]
    stock_cantidad: int
    disponible: bool
    categorias: Optional[CategoriaInfo] = None # Objeto de categoria embebido
    ingredientes: List[IngredienteInfo] = [] # Lista de objetos de ingredientes embebidos

    class Config:
        from_attributes = True


# ── Schemas de ProductoIngrediente ───────────────────────────────────────────

class ProductoIngredienteCreate(BaseModel):
    """Estructura para crear una asociacion individual entre un producto y un ingrediente."""
    producto_id: int
    ingrediente_id: int
    es_removible: bool = False


class ProductoIngredienteResponse(BaseModel):
    """Estructura que representa la asociacion entre un producto y un ingrediente."""
    producto_id: int
    ingrediente_id: int
    es_removible: bool

    class Config:
        from_attributes = True
