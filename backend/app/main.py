# app/main.py
# Punto de entrada de la aplicacion FastAPI

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.categoria.router import router as categoria_router
from app.ingrediente.router import router as ingrediente_router
from app.producto.router import (
    router as producto_router,
    router_pi as producto_ingrediente_router,
)

from contextlib import asynccontextmanager
from app.core.database import create_db_and_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(
    title="API Food Store — Catálogo",
    description="CRUD de Categorías, Productos e Ingredientes — Parcial 1 Programación IV",
    version="2.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Permite que el frontend en localhost:5173 consuma la API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(categoria_router)
app.include_router(ingrediente_router)
app.include_router(producto_router)
app.include_router(producto_ingrediente_router)


@app.get("/")
def root():
    return {"mensaje": "API Food Store funcionando. Documentacion en /docs"}
