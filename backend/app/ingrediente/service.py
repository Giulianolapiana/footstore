# app/ingrediente/service.py
# Logica de negocio para el CRUD de Ingredientes

from typing import List, Optional
from sqlmodel import Session
from datetime import datetime, timezone

from app.models.ingrediente import Ingrediente
from app.ingrediente.schema import IngredienteCreate, IngredienteUpdate, IngredienteResponse
from app.ingrediente.unit_of_work import IngredienteUnitOfWork

class IngredienteService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def get_all(self) -> List[IngredienteResponse]:
        """Retorna todos los ingredientes activos"""
        with IngredienteUnitOfWork(self._session) as uow:
            ingredientes = uow.ingredientes.get_active()
            return [IngredienteResponse(**i.model_dump()) for i in ingredientes]

    def get_by_id(self, ingrediente_id: int) -> Optional[IngredienteResponse]:
        """Retorna un ingrediente por su id, o None si no existe"""
        with IngredienteUnitOfWork(self._session) as uow:
            i = uow.ingredientes.get_by_id(ingrediente_id)
            if i and i.deleted_at is None:
                return IngredienteResponse(**i.model_dump())
            return None

    def create(self, data: IngredienteCreate) -> IngredienteResponse:
        """Crea un nuevo ingrediente y lo persiste"""
        with IngredienteUnitOfWork(self._session) as uow:
            db_obj = Ingrediente(**data.model_dump())
            uow.ingredientes.add(db_obj)
            return IngredienteResponse(**db_obj.model_dump())

    def update(self, ingrediente_id: int, data: IngredienteUpdate) -> Optional[IngredienteResponse]:
        """Actualiza un ingrediente existente. Retorna None si no existe"""
        with IngredienteUnitOfWork(self._session) as uow:
            i = uow.ingredientes.get_by_id(ingrediente_id)
            if not i or i.deleted_at is not None:
                return None
            
            update_data = data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(i, key, value)
            
            i.updated_at = datetime.now(timezone.utc)
            uow.ingredientes.add(i)
            return IngredienteResponse(**i.model_dump())

    def delete(self, ingrediente_id: int) -> bool:
        """Elimina (soft delete) un ingrediente. Retorna True si se elimino, False si no existia"""
        with IngredienteUnitOfWork(self._session) as uow:
            i = uow.ingredientes.get_by_id(ingrediente_id)
            if not i or i.deleted_at is not None:
                return False
            
            i.deleted_at = datetime.now(timezone.utc)
            uow.ingredientes.add(i)
            return True
