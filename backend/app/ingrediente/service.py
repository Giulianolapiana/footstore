# app/ingrediente/service.py
# Logica de negocio para el CRUD de Ingredientes

from typing import List, Optional
from sqlmodel import Session, select
from datetime import datetime

from app.models.ingrediente import Ingrediente
from app.ingrediente.schema import IngredienteCreate, IngredienteUpdate, IngredienteResponse


def get_all(session: Session) -> List[IngredienteResponse]:
    """Retorna todos los ingredientes"""
    ingredientes = session.exec(select(Ingrediente)).all()
    return [IngredienteResponse(**i.model_dump()) for i in ingredientes]


def get_by_id(session: Session, ingrediente_id: int) -> Optional[IngredienteResponse]:
    """Retorna un ingrediente por su id, o None si no existe"""
    i = session.get(Ingrediente, ingrediente_id)
    if i:
        return IngredienteResponse(**i.model_dump())
    return None


def create(session: Session, data: IngredienteCreate) -> IngredienteResponse:
    """Crea un nuevo ingrediente y lo persiste"""
    db_obj = Ingrediente(**data.model_dump())
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return IngredienteResponse(**db_obj.model_dump())


def update(session: Session, ingrediente_id: int, data: IngredienteUpdate) -> Optional[IngredienteResponse]:
    """Actualiza un ingrediente existente. Retorna None si no existe"""
    i = session.get(Ingrediente, ingrediente_id)
    if not i:
        return None
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(i, key, value)
    
    i.updated_at = datetime.utcnow()
    session.add(i)
    session.commit()
    session.refresh(i)
    return IngredienteResponse(**i.model_dump())


def delete(session: Session, ingrediente_id: int) -> bool:
    """Elimina un ingrediente. Retorna True si se elimino, False si no existia"""
    i = session.get(Ingrediente, ingrediente_id)
    if not i:
        return False
    
    session.delete(i)
    session.commit()
    return True
