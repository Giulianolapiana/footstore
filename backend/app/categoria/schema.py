# app/categoria/schema.py
# Schemas Pydantic para validacion de datos de entrada y salida

from pydantic import BaseModel
from typing import Optional


class CategoriaCreate(BaseModel):
    """Schema para crear una nueva categoria (sin id)"""
    nombre: str
    descripcion: str
    parent_id: Optional[int] = None
    imagen_url: Optional[str] = None


class CategoriaUpdate(BaseModel):
    """Schema para actualizar una categoria (sin id)"""
    nombre: str
    descripcion: str
    parent_id: Optional[int] = None
    imagen_url: Optional[str] = None


class CategoriaResponse(BaseModel):
    """Schema para la respuesta al cliente (incluye id)"""
    id: int
    nombre: str
    descripcion: str
    parent_id: Optional[int] = None
    imagen_url: Optional[str] = None

    class Config:
        from_attributes = True
