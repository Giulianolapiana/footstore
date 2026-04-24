# app/producto/router.py
# Capa de Controladores (Endpoints REST) para el modulo de Productos

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

# Router principal para la gestion de productos
router = APIRouter(
    prefix="/productos",
    tags=["Productos"],
)

# Router para la gestion de la tabla intermedia producto-ingrediente
router_pi = APIRouter(
    prefix="/producto-ingrediente",
    tags=["ProductoIngrediente"],
)


# ── Endpoints de Producto ──────────────────────────────────────────────────────

@router.get("/", response_model=List[ProductoResponse])
def listar_productos(session: Session = Depends(get_session)):
    """Retorna el listado completo de todos los productos activos."""
    service = ProductoService(session)
    return service.get_all()


@router.get("/{producto_id}", response_model=ProductoResponse)
def obtener_producto(producto_id: int, session: Session = Depends(get_session)):
    """Retorna los detalles de un producto especifico por su ID."""
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
    """
    Crea un nuevo producto en el sistema. 
    Requiere que la categoria_id proporcionada exista y este activa.
    """
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
    """Actualiza los datos de un producto existente y sincroniza sus ingredientes."""
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
    """Realiza la baja logica de un producto por su ID."""
    service = ProductoService(session)
    eliminado = service.delete(producto_id)
    if not eliminado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {producto_id} no encontrado"
        )


# ── Endpoints de ProductoIngrediente ──────────────────────────────────────────

@router_pi.get("/", response_model=List[ProductoIngredienteResponse])
def listar_ingrediente_relaciones(session: Session = Depends(get_session)):
    """Lista todas las asociaciones entre productos e ingredientes."""
    service = ProductoService(session)
    return service.get_all_ingrediente_relaciones()


@router_pi.post("/", response_model=ProductoIngredienteResponse, status_code=status.HTTP_201_CREATED)
def crear_ingrediente_relacion(data: ProductoIngredienteCreate, session: Session = Depends(get_session)):
    """Crea una nueva asociacion manual entre un producto y un ingrediente."""
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
    """Elimina la asociacion entre un producto y un ingrediente especifico."""
    service = ProductoService(session)
    eliminada = service.delete_ingrediente_relacion(producto_id, ingrediente_id)
    if not eliminada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relacion no encontrada"
        )
