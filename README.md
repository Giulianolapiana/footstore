# 🍕 Food Store - Full Stack Application

¡Bienvenido a **Food Store**! Una aplicación robusta para la gestión de productos, categorías e ingredientes, desarrollada con un enfoque profesional en arquitectura de software y diseño de interfaces.

Este proyecto fue desarrollado como parte del **Parcial 1 de Programación 4**, implementando patrones de diseño avanzados para asegurar escalabilidad y mantenibilidad.

---

## 🏗️ Arquitectura del Sistema

El backend sigue una arquitectura de **Capas** inspirada en estándares de industria:

- **Router**: Maneja las peticiones HTTP y la validación de entrada (FastAPI).
- **Service Layer**: Contiene la lógica de negocio, desacoplada de la persistencia.
- **Unit of Work (UoW)**: Gestiona la atomicidad de las transacciones, asegurando que todas las operaciones se realicen correctamente o se haga un rollback.
- **Repository Pattern**: Abstracción total del acceso a datos, utilizando repositorios genéricos y específicos para cada entidad.

### Diagrama de Flujo
`Request` -> `Router` -> `Service` -> `Unit of Work` -> `Repository` -> `Database`

---

## 🛠️ Tech Stack

### Backend
- **Lenguaje**: Python 3.10+
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **ORM**: [SQLModel](https://sqlmodel.tiangolo.com/) (SQLAlchemy + Pydantic)
- **Base de Datos**: PostgreSQL
- **Patrones**: Unit of Work, Generic Repository, Layered Architecture.

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Routing**: React Router

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/proyectoparcial.git
cd proyectoparcial
```

### 2. Configuración del Backend
```bash
cd backend
# Crear un entorno virtual
python -m venv venv
source venv/Scripts/activate  # En Windows

# Instalar dependencias
pip install -r requirements.txt
# Nota: Asegúrate de tener instalado SQLModel y psycopg2-binary
pip install sqlmodel psycopg2-binary
```

Configura tu archivo `.env` en la carpeta `backend/`:
```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_db
```

Ejecutar el servidor:
```bash
uvicorn app.main:app --reload
```

### 3. Configuración del Frontend
```bash
cd ../frontend
npm install  # o pnpm install
npm run dev
```

---

## ✨ Características Principales

- **Gestión de Productos**: Alta, baja, modificación y listado.
- **Categorías Jerárquicas**: Soporte para categorías padre y subcategorías.
- **Ingredientes Dinámicos**: Relación muchos-a-muchos entre productos e ingredientes.
- **Soft Delete**: Eliminación lógica de datos para preservar la integridad referencial.
- **UI Responsiva**: Diseño adaptado a dispositivos móviles con menú hamburguesa dinámico.
- **Validaciones Pro**: Manejo estricto de tipos con Pydantic y TypeScript.

---

## 👤 Autor

- **Giuliano La Piana** - [giulianolapianam@gmail.com](mailto:giulianolapianam@gmail.com)

## 📄 Licencia
Este proyecto fue realizado con fines académicos.

---
*Desarrollado con ❤️ para Programación 4*
