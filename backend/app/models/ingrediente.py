from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship
from app.models.links import ProductoIngrediente

class Ingrediente(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True)
    descripcion: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship with productos
    productos: List["Producto"] = Relationship(back_populates="ingredientes", link_model=ProductoIngrediente)

