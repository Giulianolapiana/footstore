from typing import List
from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.models.categoria import Categoria

class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Categoria)

    def get_active(self, offset: int = 0, limit: int = 100) -> List[Categoria]:
        return self.session.exec(
            select(Categoria)
            .where(Categoria.deleted_at.is_(None))
            .offset(offset)
            .limit(limit)
        ).all()
