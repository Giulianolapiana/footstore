from typing import List
from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.models.producto import Producto
from app.models.links import ProductoIngrediente

class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def get_active(self, offset: int = 0, limit: int = 100) -> List[Producto]:
        return self.session.exec(
            select(Producto)
            .where(Producto.deleted_at.is_(None))
            .offset(offset)
            .limit(limit)
        ).all()

class ProductoIngredienteRepository(BaseRepository[ProductoIngrediente]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, ProductoIngrediente)
        
    def get_by_producto_and_ingrediente(self, producto_id: int, ingrediente_id: int) -> ProductoIngrediente | None:
        return self.session.exec(
            select(ProductoIngrediente).where(
                ProductoIngrediente.producto_id == producto_id,
                ProductoIngrediente.ingrediente_id == ingrediente_id
            )
        ).first()

    def get_by_producto(self, producto_id: int) -> List[ProductoIngrediente]:
        return self.session.exec(
            select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
        ).all()
