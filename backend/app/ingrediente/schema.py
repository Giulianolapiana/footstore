# app/ingrediente/schema.py
# Schemas Pydantic para validacion de datos de Ingrediente

from pydantic import BaseModel


class IngredienteCreate(BaseModel):
    """Schema para crear un nuevo ingrediente"""
    nombre: str
    descripcion: str = ""
    es_alergeno: bool = False


class IngredienteUpdate(BaseModel):
    """Schema para actualizar un ingrediente"""
    nombre: str
    descripcion: str = ""
    es_alergeno: bool = False


class IngredienteResponse(BaseModel):
    """Schema de respuesta para un ingrediente"""
    id: int
    nombre: str
    descripcion: str
    es_alergeno: bool

    class Config:
        from_attributes = True
