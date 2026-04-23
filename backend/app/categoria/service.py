# app/categoria/service.py
# Logica de negocio para el CRUD de Categorias

from typing import List, Optional
from sqlmodel import Session, select
from datetime import datetime

from app.models.categoria import Categoria
from app.categoria.schema import CategoriaCreate, CategoriaUpdate, CategoriaResponse


def get_all(session: Session) -> List[CategoriaResponse]:
    """Retorna todas las categorias"""
    categorias = session.exec(select(Categoria).where(Categoria.deleted_at == None)).all()
    return [CategoriaResponse(**c.model_dump()) for c in categorias]


def get_by_id(session: Session, categoria_id: int) -> Optional[CategoriaResponse]:
    """Retorna una categoria por su id, o None si no existe"""
    c = session.get(Categoria, categoria_id)
    if c and c.deleted_at is None:
        return CategoriaResponse(**c.model_dump())
    return None


def create(session: Session, data: CategoriaCreate) -> CategoriaResponse:
    """Crea una nueva categoria y la persiste"""
    db_obj = Categoria(**data.model_dump())
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return CategoriaResponse(**db_obj.model_dump())


def update(session: Session, categoria_id: int, data: CategoriaUpdate) -> Optional[CategoriaResponse]:
    """Actualiza una categoria existente. Retorna None si no existe"""
    c = session.get(Categoria, categoria_id)
    if not c or c.deleted_at is not None:
        return None
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(c, key, value)
    
    c.updated_at = datetime.utcnow()
    session.add(c)
    session.commit()
    session.refresh(c)
    return CategoriaResponse(**c.model_dump())


def delete(session: Session, categoria_id: int) -> bool:
    """Elimina (soft delete) una categoria. Retorna True si se elimino, False si no existia"""
    c = session.get(Categoria, categoria_id)
    if not c or c.deleted_at is not None:
        return False
    
    c.deleted_at = datetime.utcnow()
    session.add(c)
    session.commit()
    return True
