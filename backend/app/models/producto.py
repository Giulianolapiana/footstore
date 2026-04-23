from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, Column
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import String
from app.models.links import ProductoCategoria, ProductoIngrediente

class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True)
    descripcion: str
    precio: float
    imagenes_url: List[str] = Field(default=[], sa_column=Column(ARRAY(String)))
    stock_cantidad: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None

    # Relaciones
    categorias: List["Categoria"] = Relationship(back_populates="productos", link_model=ProductoCategoria)
    ingredientes: List["Ingrediente"] = Relationship(back_populates="productos", link_model=ProductoIngrediente)


