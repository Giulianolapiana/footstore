# app/ingrediente/model.py
# Representa la estructura interna de un Ingrediente en la "base de datos"


class Ingrediente:
    def __init__(self, id: int, nombre: str, descripcion: str):
        self.id = id
        self.nombre = nombre
        self.descripcion = descripcion

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
        }
