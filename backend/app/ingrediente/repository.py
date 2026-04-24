from typing import List
from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.models.ingrediente import Ingrediente

class IngredienteRepository(BaseRepository[Ingrediente]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Ingrediente)

    def get_active(self, offset: int = 0, limit: int = 100) -> List[Ingrediente]:
        return self.session.exec(
            select(Ingrediente)
            .where(Ingrediente.deleted_at.is_(None))
            .offset(offset)
            .limit(limit)
        ).all()
