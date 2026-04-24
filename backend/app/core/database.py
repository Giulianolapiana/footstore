from __future__ import annotations

import os
from sqlalchemy import text
from sqlmodel import SQLModel, Session, create_engine

from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Importaciones de modelos para que SQLModel los registre
from app.models.categoria import Categoria  # noqa: F401
from app.models.ingrediente import Ingrediente  # noqa: F401
from app.models.links import ProductoIngrediente  # noqa: F401
from app.models.producto import Producto  # noqa: F401

# Leemos de las variables de entorno sin dejar passwords "hardcodeados" en el código
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    raise ValueError("❌ No se encontró DATABASE_URL en el archivo .env")

SQL_ECHO = os.getenv('SQL_ECHO', 'false').lower() == 'true'

engine = create_engine(DATABASE_URL, echo=SQL_ECHO)


def create_db_and_tables() -> None:
    # Creamos las tablas basándonos estrictamente en los modelos de SQLModel
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
