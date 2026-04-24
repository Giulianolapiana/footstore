import { useState, useEffect } from 'react'
import { Categoria, CategoriaForm } from '../types/categoria'
import CategoriaList from '../components/CategoriaList'
import CategoriaModal from '../components/CategoriaModal'

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/categorias`

// ── Layout compartido de página ─────────────────────────────────────────────
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
    {/* Alerta de error */}
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

    {/* Card principal */}
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header del panel */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          {count > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 tabular-nums">
              {count}
            </span>
          )}
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700
            transition-colors duration-150 cursor-pointer
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M7 1v12M1 7h12" />
          </svg>
          {addLabel}
        </button>
      </div>

      {/* Contenido */}
      <div>{children}</div>
    </div>
  </main>
)

// ── CategoriasPage ──────────────────────────────────────────────────────────
const CategoriasPage = () => {
  const [categorias, setCategorias]               = useState<Categoria[]>([])
  const [modalAbierto, setModalAbierto]           = useState<boolean>(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null)
  const [error, setError]                         = useState<string | null>(null)

  useEffect(() => { cargarCategorias() }, [])

  const cargarCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/`)
      if (!res.ok) throw new Error()
      setCategorias(await res.json())
    } catch {
      setError('No se pudo conectar con el servidor. Verificá que el backend esté corriendo.')
    }
  }

  const handleCreate = async (datos: CategoriaForm) => {
    try {
      const res = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      if (!res.ok) throw new Error()
      const nueva: Categoria = await res.json()
      setCategorias((prev) => [...prev, nueva])
      cerrarModal()
    } catch {
      setError('Error al crear la categoría.')
    }
  }

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
      setCategorias((prev) => prev.map((c) => (c.id === actualizada.id ? actualizada : c)))
      cerrarModal()
    } catch {
      setError('Error al actualizar la categoría.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar esta categoría?')) return
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setCategorias((prev) => prev.filter((c) => c.id !== id))
    } catch {
      setError('Error al eliminar la categoría.')
    }
  }

  const handleSubmit = (datos: CategoriaForm) =>
    categoriaSeleccionada ? handleUpdate(datos) : handleCreate(datos)

  const abrirModalCrear = () => { setCategoriaSeleccionada(null); setModalAbierto(true) }
  const abrirModalEditar = (c: Categoria) => { setCategoriaSeleccionada(c); setModalAbierto(true) }
  const cerrarModal = () => { setModalAbierto(false); setCategoriaSeleccionada(null) }

  return (
    <>
      <PageShell
        title="Categorías"
        count={categorias.length}
        onAdd={abrirModalCrear}
        addLabel="Nueva Categoría"
        error={error}
        onDismissError={() => setError(null)}
      >
        <CategoriaList categorias={categorias} onEditar={abrirModalEditar} onEliminar={handleDelete} />
      </PageShell>

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
