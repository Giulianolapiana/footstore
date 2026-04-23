# app/categoria/model.py
# Representa la estructura interna de una Categoria en la "base de datos"

from typing import Optional


class Categoria:
    def __init__(
        self,
        id: int,
        nombre: str,
        descripcion: str,
        parent_id: Optional[int] = None,
        imagen_url: Optional[str] = None,
    ):
        self.id = id
        self.nombre = nombre
        self.descripcion = descripcion
        self.parent_id = parent_id
        self.imagen_url = imagen_url

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "parent_id": self.parent_id,
            "imagen_url": self.imagen_url,
        }
