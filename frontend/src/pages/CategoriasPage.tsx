import { useState, useEffect } from 'react'
import { Categoria, CategoriaForm } from '../types/categoria'
import CategoriaList from '../components/CategoriaList'
import CategoriaModal from '../components/CategoriaModal'

// URL base de la API para categorias
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/categorias`


interface PageShellProps {
  title: string
  count: number
  onAdd: () => void
  addLabel: string
  children: React.ReactNode
  error: string | null
  onDismissError: () => void
}

const PageShell = ({ title, count, onAdd, addLabel, children, error, onDismissError }: PageShellProps) => (
  <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
    {/* Banner de alerta para errores globales en la pagina */}
    {error && (
      <div
        role="alert"
        aria-live="polite"
        className="mb-5 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm animate-fade-in"
      >
        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 1a.5.5 0 0 1 .437.257l7 12A.5.5 0 0 1 15 14H1a.5.5 0 0 1-.437-.743l7-12A.5.5 0 0 1 8 1zm0 4a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-3A.5.5 0 0 0 8 5zm0 6a.75.75 0 1 0 0 1.5A.75.75 0 0 0 8 11z" />
        </svg>
        <span className="flex-1">{error}</span>
        <button onClick={onDismissError} aria-label="Cerrar error" className="ml-auto text-red-400 hover:text-red-600 font-bold cursor-pointer">✕</button>
      </div>
    )}

    {/* Contenedor principal estilizado con borde y sombra suave */}
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Encabezado de la seccion */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          {/* Badge que muestra el total de elementos cargados */}
          {count > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 tabular-nums">
              {count}
            </span>
          )}
        </div>
        {/* Boton principal de accion (crear) */}
        <button
          onClick={onAdd}
          className="w-full sm:w-auto inline-flex justify-center items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M7 1v12M1 7h12" />
          </svg>
          {addLabel}
        </button>
      </div>

      {/* Area de contenido donde se renderiza el listado u otros componentes hijos */}
      <div>{children}</div>
    </div>
  </main>
)

/**
 * CategoriasPage: Pagina principal para administrar las categorias de productos.
 * Maneja el estado local de las categorias y la comunicacion con la API.
 */
const CategoriasPage = () => {
  // Estados para datos, visibilidad del modal y manejo de errores
  const [categorias, setCategorias]               = useState<Categoria[]>([])
  const [modalAbierto, setModalAbierto]           = useState<boolean>(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null)
  const [error, setError]                         = useState<string | null>(null)

  // Carga inicial de datos al montar el componente
  useEffect(() => { cargarCategorias() }, [])

  // Obtiene el listado de categorias desde el backend GET
  const cargarCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/`)
      if (!res.ok) throw new Error()
      setCategorias(await res.json())
    } catch {
      setError('No se pudo conectar con el servidor. Verificá que el backend esté corriendo.')
    }
  }

  // Envia una nueva categoria al servidor POST
  const handleCreate = async (datos: CategoriaForm) => {
    try {
      const res = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      if (!res.ok) throw new Error()
      const nueva: Categoria = await res.json()
      // Actualizacion optimista del estado local
      setCategorias((prev) => [...prev, nueva])
      cerrarModal()
    } catch {
      setError('Error al crear la categoría.')
    }
  }

  // Actualiza una categoria existente en el servidor PUT
  const handleUpdate = async (datos: CategoriaForm) => {
    if (!categoriaSeleccionada) return
    try {
      const res = await fetch(`${API_URL}/${categoriaSeleccionada.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      if (!res.ok) throw new Error()
      const actualizada: Categoria = await res.json()
      // Reemplaza la categoria editada en la lista local
      setCategorias((prev) => prev.map((c) => (c.id === actualizada.id ? actualizada : c)))
      cerrarModal()
    } catch {
      setError('Error al actualizar la categoría.')
    }
  }

  // Ejecuta la eliminacion logica (soft delete) de una categoria
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar esta categoría?')) return
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      // Remueve el elemento de la lista local
      setCategorias((prev) => prev.filter((c) => c.id !== id))
    } catch {
      setError('Error al eliminar la categoría.')
    }
  }

  // Decide si disparar creacion o actualizacion segun si hay una categoria seleccionada
  const handleSubmit = (datos: CategoriaForm) =>
    categoriaSeleccionada ? handleUpdate(datos) : handleCreate(datos)

  // Funciones auxiliares para el control del modal
  const abrirModalCrear = () => { setCategoriaSeleccionada(null); setModalAbierto(true) }
  const abrirModalEditar = (c: Categoria) => { setCategoriaSeleccionada(c); setModalAbierto(true) }
  const cerrarModal = () => { setModalAbierto(false); setCategoriaSeleccionada(null) }

  return (
    <>
      {/* Contenedor visual de la pagina */}
      <PageShell
        title="Categorías"
        count={categorias.length}
        onAdd={abrirModalCrear}
        addLabel="Nueva Categoría"
        error={error}
        onDismissError={() => setError(null)}
      >
        {/* Listado de categorias */}
        <CategoriaList categorias={categorias} onEditar={abrirModalEditar} onEliminar={handleDelete} />
      </PageShell>

      {/* Modal para crear o editar categorias */}
      <CategoriaModal
        isOpen={modalAbierto}
        categoriaEditar={categoriaSeleccionada}
        categorias={categorias}
        onClose={cerrarModal}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default CategoriasPage
