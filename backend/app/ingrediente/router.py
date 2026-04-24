# app/ingrediente/router.py
# Endpoints REST para el CRUD de Ingredientes

from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlmodel import Session

from app.ingrediente.schema import IngredienteCreate, IngredienteUpdate, IngredienteResponse
from app.ingrediente.service import IngredienteService
from app.core.database import get_session

router = APIRouter(
    prefix="/ingredientes",
    tags=["Ingredientes"],
)


@router.get("/", response_model=List[IngredienteResponse])
def listar_ingredientes(session: Session = Depends(get_session)):
    """GET /ingredientes — Retorna todos los ingredientes"""
    service = IngredienteService(session)
    return service.get_all()


@router.get("/{ingrediente_id}", response_model=IngredienteResponse)
def obtener_ingrediente(ingrediente_id: int, session: Session = Depends(get_session)):
    """GET /ingredientes/{id} — Retorna un ingrediente por su id"""
    service = IngredienteService(session)
    ingrediente = service.get_by_id(ingrediente_id)
    if not ingrediente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ingrediente con id {ingrediente_id} no encontrado"
        )
    return ingrediente


@router.post("/", response_model=IngredienteResponse, status_code=status.HTTP_201_CREATED)
def crear_ingrediente(data: IngredienteCreate, session: Session = Depends(get_session)):
    """POST /ingredientes — Crea un nuevo ingrediente"""
    service = IngredienteService(session)
    return service.create(data)


@router.put("/{ingrediente_id}", response_model=IngredienteResponse)
def actualizar_ingrediente(ingrediente_id: int, data: IngredienteUpdate, session: Session = Depends(get_session)):
    """PUT /ingredientes/{id} — Actualiza un ingrediente existente"""
    service = IngredienteService(session)
    ingrediente = service.update(ingrediente_id, data)
    if not ingrediente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ingrediente con id {ingrediente_id} no encontrado"
        )
    return ingrediente


@router.delete("/{ingrediente_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_ingrediente(ingrediente_id: int, session: Session = Depends(get_session)):
    """DELETE /ingredientes/{id} — Elimina un ingrediente"""
    service = IngredienteService(session)
    eliminado = service.delete(ingrediente_id)
    if not eliminado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ingrediente con id {ingrediente_id} no encontrado"
        )
