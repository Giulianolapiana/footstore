# app/producto/router.py
# Endpoints REST para el CRUD de Productos y ProductoIngrediente

from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlmodel import Session

from app.producto.schema import (
    ProductoCreate,
    ProductoUpdate,
    ProductoResponse,
    ProductoIngredienteCreate,
    ProductoIngredienteResponse,
)
from app.producto.service import ProductoService
from app.core.database import get_session

router = APIRouter(
    prefix="/productos",
    tags=["Productos"],
)

router_pi = APIRouter(
    prefix="/producto-ingrediente",
    tags=["ProductoIngrediente"],
)


# ── Producto ──────────────────────────────────────────────────────────────────

@router.get("/", response_model=List[ProductoResponse])
def listar_productos(session: Session = Depends(get_session)):
    """GET /productos — Retorna todos los productos"""
    service = ProductoService(session)
    return service.get_all()


@router.get("/{producto_id}", response_model=ProductoResponse)
def obtener_producto(producto_id: int, session: Session = Depends(get_session)):
    """GET /productos/{id} — Retorna un producto por su id"""
    service = ProductoService(session)
    producto = service.get_by_id(producto_id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {producto_id} no encontrado"
        )
    return producto


@router.post("/", response_model=ProductoResponse, status_code=status.HTTP_201_CREATED)
def crear_producto(data: ProductoCreate, session: Session = Depends(get_session)):
    """POST /productos — Crea un nuevo producto (requiere categoria_id válido)"""
    service = ProductoService(session)
    resultado = service.create(data)
    if not resultado:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"La categoría con id {data.categoria_id} no existe o fue eliminada. Un producto debe tener una categoría válida."
        )
    return resultado


@router.put("/{producto_id}", response_model=ProductoResponse)
def actualizar_producto(producto_id: int, data: ProductoUpdate, session: Session = Depends(get_session)):
    """PUT /productos/{id} — Actualiza un producto existente"""
    service = ProductoService(session)
    producto = service.update(producto_id, data)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {producto_id} no encontrado o categoría inválida"
        )
    return producto


@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(producto_id: int, session: Session = Depends(get_session)):
    """DELETE /productos/{id} — Elimina un producto"""
    service = ProductoService(session)
    eliminado = service.delete(producto_id)
    if not eliminado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {producto_id} no encontrado"
        )


# ── ProductoIngrediente ───────────────────────────────────────────────────────

@router_pi.get("/", response_model=List[ProductoIngredienteResponse])
def listar_ingrediente_relaciones(session: Session = Depends(get_session)):
    """GET /producto-ingrediente — Lista todas las relaciones"""
    service = ProductoService(session)
    return service.get_all_ingrediente_relaciones()


@router_pi.post("/", response_model=ProductoIngredienteResponse, status_code=status.HTTP_201_CREATED)
def crear_ingrediente_relacion(data: ProductoIngredienteCreate, session: Session = Depends(get_session)):
    """POST /producto-ingrediente — Asocia un producto con un ingrediente"""
    service = ProductoService(session)
    relacion = service.create_ingrediente_relacion(data)
    if not relacion:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Producto o Ingrediente no existen, o la relacion ya existe"
        )
    return relacion


@router_pi.delete("/{producto_id}/{ingrediente_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_ingrediente_relacion(producto_id: int, ingrediente_id: int, session: Session = Depends(get_session)):
    """DELETE /producto-ingrediente/{producto_id}/{ingrediente_id} — Elimina una relacion"""
    service = ProductoService(session)
    eliminada = service.delete_ingrediente_relacion(producto_id, ingrediente_id)
    if not eliminada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relacion no encontrada"
        )
