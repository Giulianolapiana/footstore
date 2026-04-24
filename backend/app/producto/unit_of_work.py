# app/producto/unit_of_work.py
# Patron Unit of Work para coordinar repositorios en el modulo de productos

from sqlmodel import Session
from app.core.unit_of_work import UnitOfWork
from app.producto.repository import ProductoRepository, ProductoIngredienteRepository
from app.categoria.repository import CategoriaRepository
from app.ingrediente.repository import IngredienteRepository

class ProductoUnitOfWork(UnitOfWork):
    """
    Gestiona la transaccionalidad y el acceso a todos los repositorios
    necesarios para las operaciones complejas de productos.
    """
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        # Inicializacion de repositorios especificos
        self.productos = ProductoRepository(session)
        self.producto_ingredientes = ProductoIngredienteRepository(session)
        self.categorias = CategoriaRepository(session)
        self.ingredientes = IngredienteRepository(session)
