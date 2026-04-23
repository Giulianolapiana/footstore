# FastAPI Productos — Backend

API REST desarrollada con FastAPI para el CRUD de Categorías y Productos.

## Instalación

```bash
python -m venv .venv
source .venv/bin/activate   # macOS/Linux
.venv\Scripts\activate      # Windows

pip install -r requirements.txt
```

## Ejecución

```bash
python -m fastapi dev app/main.py
```

La API estará disponible en `http://localhost:8000`  
Documentación automática en `http://localhost:8000/docs`

## Endpoints

### Categorías
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | /categorias/ | Listar todas |
| GET | /categorias/{id} | Obtener una |
| POST | /categorias/ | Crear |
| PUT | /categorias/{id} | Actualizar |
| DELETE | /categorias/{id} | Eliminar |

### Productos
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | /productos/ | Listar todos |
| GET | /productos/{id} | Obtener uno |
| POST | /productos/ | Crear |
| PUT | /productos/{id} | Actualizar |
| DELETE | /productos/{id} | Eliminar |

### ProductoCategoria
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | /producto-categoria/ | Listar relaciones |
| POST | /producto-categoria/ | Crear relación |
| DELETE | /producto-categoria/{p_id}/{c_id} | Eliminar relación |
