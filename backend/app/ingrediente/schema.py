# app/ingrediente/schema.py
# Schemas Pydantic para validacion de datos de Ingrediente

from pydantic import BaseModel
from typing import Optional


class IngredienteCreate(BaseModel):
    """Schema para crear un nuevo ingrediente"""
    nombre: str
    descripcion: str = ""


class IngredienteUpdate(BaseModel):
    """Schema para actualizar un ingrediente"""
    nombre: str
    descripcion: str = ""


class IngredienteResponse(BaseModel):
    """Schema de respuesta para un ingrediente"""
    id: int
    nombre: str
    descripcion: Optional[str] = ""

    class Config:
        from_attributes = True

