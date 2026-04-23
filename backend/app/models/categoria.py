from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship

class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True)
    descripcion: str
    parent_id: Optional[int] = Field(default=None, foreign_key="categoria.id")
    imagen_url: Optional[str] = None
    orden_display: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None

    # Relación directa 1:N con Producto (FK en producto.categoria_id)
    productos: List["Producto"] = Relationship(back_populates="categoria")
