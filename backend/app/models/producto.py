from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, Column
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import String
from app.models.links import ProductoIngrediente

if TYPE_CHECKING:
    from app.models.categoria import Categoria
    from app.models.ingrediente import Ingrediente

class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True)
    descripcion: str
    precio_base: float
    disponible: bool = Field(default=True)
    categoria_id: int = Field(foreign_key="categoria.id")
    imagenes_url: List[str] = Field(default=[], sa_column=Column(ARRAY(String)))
    stock_cantidad: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None

    # Relación directa con Categoria (N:1)
    categoria: Optional["Categoria"] = Relationship(back_populates="productos")
    # Relación M:N con Ingrediente via link table
    ingredientes: List["Ingrediente"] = Relationship(back_populates="productos", link_model=ProductoIngrediente)


