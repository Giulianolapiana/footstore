# app/producto/model.py
# Representa la estructura interna de un Producto en la "base de datos"

from typing import List


class Producto:
    def __init__(
        self,
        id: int,
        nombre: str,
        descripcion: str,
        precio_base: float,
        imagenes_url: List[str],
        stock_cantidad: int,
        disponible: bool,
    ):
        self.id = id
        self.nombre = nombre
        self.descripcion = descripcion
        self.precio_base = precio_base
        self.imagenes_url = imagenes_url
        self.stock_cantidad = stock_cantidad
        self.disponible = disponible

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "precio_base": self.precio_base,
            "imagenes_url": self.imagenes_url,
            "stock_cantidad": self.stock_cantidad,
            "disponible": self.disponible,
        }
