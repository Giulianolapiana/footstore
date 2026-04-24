from typing import Optional
from sqlmodel import Field, SQLModel



class ProductoIngrediente(SQLModel, table=True):
    __tablename__ = "productoingrediente"
    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    ingrediente_id: int = Field(foreign_key="ingrediente.id", primary_key=True)
    es_removible: bool = Field(default=False)
    es_opcional: bool = Field(default=False)
