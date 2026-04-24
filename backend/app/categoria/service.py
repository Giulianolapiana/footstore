# app/categoria/service.py
# Logica de negocio para el CRUD de Categorias

from typing import List, Optional
from sqlmodel import Session
from datetime import datetime, timezone

from app.models.categoria import Categoria
from app.categoria.schema import CategoriaCreate, CategoriaUpdate, CategoriaResponse
from app.categoria.unit_of_work import CategoriaUnitOfWork

class CategoriaService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def get_all(self) -> List[CategoriaResponse]:
        """Retorna todas las categorias activas"""
        with CategoriaUnitOfWork(self._session) as uow:
            categorias = uow.categorias.get_active()
            return [CategoriaResponse(**c.model_dump()) for c in categorias]

    def get_by_id(self, categoria_id: int) -> Optional[CategoriaResponse]:
        """Retorna una categoria por su id, o None si no existe o esta eliminada"""
        with CategoriaUnitOfWork(self._session) as uow:
            c = uow.categorias.get_by_id(categoria_id)
            if c and c.deleted_at is None:
                return CategoriaResponse(**c.model_dump())
            return None

    def create(self, data: CategoriaCreate) -> CategoriaResponse:
        """Crea una nueva categoria y la persiste"""
        with CategoriaUnitOfWork(self._session) as uow:
            db_obj = Categoria(**data.model_dump())
            uow.categorias.add(db_obj)
            return CategoriaResponse(**db_obj.model_dump())

    def update(self, categoria_id: int, data: CategoriaUpdate) -> Optional[CategoriaResponse]:
        """Actualiza una categoria existente. Retorna None si no existe"""
        with CategoriaUnitOfWork(self._session) as uow:
            c = uow.categorias.get_by_id(categoria_id)
            if not c or c.deleted_at is not None:
                return None
            
            update_data = data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(c, key, value)
            
            c.updated_at = datetime.now(timezone.utc)
            uow.categorias.add(c)
            return CategoriaResponse(**c.model_dump())

    def delete(self, categoria_id: int) -> bool:
        """Elimina (soft delete) una categoria. Retorna True si se elimino, False si no existia"""
        with CategoriaUnitOfWork(self._session) as uow:
            c = uow.categorias.get_by_id(categoria_id)
            if not c or c.deleted_at is not None:
                return False
            
            c.deleted_at = datetime.now(timezone.utc)
            uow.categorias.add(c)
            return True
