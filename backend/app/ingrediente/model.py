# app/ingrediente/model.py
# Representa la estructura interna de un Ingrediente en la "base de datos"


class Ingrediente:
    def __init__(self, id: int, nombre: str, descripcion: str, es_alergeno: bool):
        self.id = id
        self.nombre = nombre
        self.descripcion = descripcion
        self.es_alergeno = es_alergeno

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "es_alergeno": self.es_alergeno,
        }
