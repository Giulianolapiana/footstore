# app/categoria/router.py
# Endpoints REST para el CRUD de Categorias

from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlmodel import Session

from app.categoria.schema import CategoriaCreate, CategoriaUpdate, CategoriaResponse
from app.categoria import service
from app.core.database import get_session

router = APIRouter(
    prefix="/categorias",
    tags=["Categorias"],
)


@router.get("/", response_model=List[CategoriaResponse])
def listar_categorias(session: Session = Depends(get_session)):
    """GET /categorias — Retorna todas las categorias"""
    return service.get_all(session)


@router.get("/{categoria_id}", response_model=CategoriaResponse)
def obtener_categoria(categoria_id: int, session: Session = Depends(get_session)):
    """GET /categorias/{id} — Retorna una categoria por su id"""
    categoria = service.get_by_id(session, categoria_id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoria con id {categoria_id} no encontrada"
        )
    return categoria


@router.post("/", response_model=CategoriaResponse, status_code=status.HTTP_201_CREATED)
def crear_categoria(data: CategoriaCreate, session: Session = Depends(get_session)):
    """POST /categorias — Crea una nueva categoria"""
    return service.create(session, data)


@router.put("/{categoria_id}", response_model=CategoriaResponse)
def actualizar_categoria(categoria_id: int, data: CategoriaUpdate, session: Session = Depends(get_session)):
    """PUT /categorias/{id} — Actualiza una categoria existente"""
    categoria = service.update(session, categoria_id, data)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoria con id {categoria_id} no encontrada"
        )
    return categoria


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(categoria_id: int, session: Session = Depends(get_session)):
    """DELETE /categorias/{id} — Elimina una categoria"""
    eliminada = service.delete(session, categoria_id)
    if not eliminada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoria con id {categoria_id} no encontrada"
        )
