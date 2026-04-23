from __future__ import annotations

import os
from sqlalchemy import text
from sqlmodel import SQLModel, Session, create_engine

# Importaciones de modelos para que SQLModel los registre
from app.models.categoria import Categoria  # noqa: F401
from app.models.ingrediente import Ingrediente  # noqa: F401
from app.models.links import ProductoCategoria, ProductoIngrediente  # noqa: F401
from app.models.producto import Producto  # noqa: F401

DEFAULT_DATABASE_URL = 'postgresql://postgres:2622@localhost:5433/parcial_pedidos'
DATABASE_URL = os.getenv('DATABASE_URL', DEFAULT_DATABASE_URL)
SQL_ECHO = os.getenv('SQL_ECHO', 'true').lower() == 'true'

engine = create_engine(DATABASE_URL, echo=SQL_ECHO)


def sync_catalog_schema() -> None:
    statements = [
        "ALTER TABLE categoria ADD COLUMN IF NOT EXISTS imagen_url TEXT",
        "ALTER TABLE categoria ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL",
        "ALTER TABLE categoria ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL",
        "UPDATE categoria SET updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)",
        "ALTER TABLE ingrediente ADD COLUMN IF NOT EXISTS descripcion TEXT",
        "ALTER TABLE ingrediente ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL",
        "ALTER TABLE ingrediente ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL",
        "UPDATE ingrediente SET created_at = COALESCE(created_at, CURRENT_TIMESTAMP), updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP)",
        "ALTER TABLE producto ADD COLUMN IF NOT EXISTS imagenes_url TEXT[] DEFAULT '{}'::TEXT[] NOT NULL",
        "ALTER TABLE producto ADD COLUMN IF NOT EXISTS stock_cantidad INTEGER DEFAULT 0 NOT NULL",
        "ALTER TABLE producto ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL",
        "ALTER TABLE producto ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL",
        "UPDATE producto SET imagenes_url = COALESCE(imagenes_url, '{}'::TEXT[]), stock_cantidad = COALESCE(stock_cantidad, 0), updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)",
        "ALTER TABLE producto DROP COLUMN IF EXISTS tiempo_prep_min",
        "ALTER TABLE productoingrediente ALTER COLUMN es_removible SET DEFAULT false",
        "UPDATE productoingrediente SET es_removible = false WHERE es_removible IS NULL",
        # Migración: agregar categoria_id directo a producto (1:N)
        "ALTER TABLE producto ADD COLUMN IF NOT EXISTS categoria_id INTEGER",
        "UPDATE producto SET categoria_id = (SELECT id FROM categoria LIMIT 1) WHERE categoria_id IS NULL",
        "ALTER TABLE producto ALTER COLUMN categoria_id SET NOT NULL",
        """DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_producto_categoria') THEN
                ALTER TABLE producto ADD CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id);
            END IF;
        END $$""",
    ]

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)
    sync_catalog_schema()


def get_session():
    with Session(engine) as session:
        yield session
