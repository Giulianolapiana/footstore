from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship
from app.models.links import ProductoCategoria

class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True)
    descripcion: str
    parent_id: Optional[int] = Field(default=None, foreign_key="categoria.id")
    imagen_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None

    # Relationship with productos
    productos: List["Producto"] = Relationship(back_populates="categorias", link_model=ProductoCategoria)

