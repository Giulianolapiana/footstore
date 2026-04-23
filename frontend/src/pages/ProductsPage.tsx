// src/pages/ProductsPage.tsx
import { useState, useEffect } from 'react'
import { Producto, ProductoForm } from '../types/producto'
import { Categoria } from '../types/categoria'
import { Ingrediente } from '../types/ingrediente'
import ProductoList from '../components/ProductoList'
import ProductoModal from '../components/ProductoModal'

const API_URL = 'http://localhost:8000/productos'
const CAT_API = 'http://localhost:8000/categorias'
const ING_API = 'http://localhost:8000/ingredientes'

// PageShell reutilizable (mismo patrón que CategoriasPage)
interface PageShellProps {
  title: string; count: number; onAdd: () => void; addLabel: string
  children: React.ReactNode; error: string | null; onDismissError: () => void
}
const PageShell = ({ title, count, onAdd, addLabel, children, error, onDismissError }: PageShellProps) => (
  <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
    {error && (
      <div role="alert" aria-live="polite" className="mb-5 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm animate-fade-in">
        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 1a.5.5 0 0 1 .437.257l7 12A.5.5 0 0 1 15 14H1a.5.5 0 0 1-.437-.743l7-12A.5.5 0 0 1 8 1zm0 4a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-3A.5.5 0 0 0 8 5zm0 6a.75.75 0 1 0 0 1.5A.75.75 0 0 0 8 11z" /></svg>
        <span className="flex-1">{error}</span>
        <button onClick={onDismissError} aria-label="Cerrar error" className="ml-auto text-red-400 hover:text-red-600 font-bold cursor-pointer">✕</button>
      </div>
    )}
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          {count > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 tabular-nums">{count}</span>}
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M7 1v12M1 7h12" /></svg>
          {addLabel}
        </button>
      </div>
      <div>{children}</div>
    </div>
  </main>
)

const ProductsPage = () => {
  const [productos, setProductos]             = useState<Producto[]>([])
  const [categorias, setCategorias]           = useState<Categoria[]>([])
  const [ingredientes, setIngredientes]       = useState<Ingrediente[]>([])
  const [modalOpen, setModalOpen]             = useState(false)
  const [productoEditar, setProductoEditar]   = useState<Producto | null>(null)
  const [error, setError]                     = useState<string | null>(null)

  const fetchProductos = async () => {
    try {
      const res = await fetch(`${API_URL}/`)
      if (!res.ok) throw new Error()
      setProductos(await res.json())
    } catch {
      setError('No se pudo conectar con el servidor.')
    }
  }

  const fetchCategorias = async () => {
    try {
      const res = await fetch(`${CAT_API}/`)
      if (!res.ok) throw new Error()
      setCategorias(await res.json())
    } catch { /* silencioso — se muestra alerta en modal */ }
  }

  const fetchIngredientes = async () => {
    try {
      const res = await fetch(`${ING_API}/`)
      if (!res.ok) throw new Error()
      setIngredientes(await res.json())
    } catch { /* silencioso */ }
  }

  useEffect(() => {
    fetchProductos()
    fetchCategorias()
    fetchIngredientes()
  }, [])

  const handleSubmit = async (datos: ProductoForm) => {
    try {
      if (productoEditar) {
        const res = await fetch(`${API_URL}/${productoEditar.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos),
        })
        if (!res.ok) {
          const errBody = await res.json().catch(() => null)
          throw new Error(errBody?.detail || 'Error al guardar')
        }
        const actualizado: Producto = await res.json()
        setProductos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)))
      } else {
        const res = await fetch(`${API_URL}/`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos),
        })
        if (!res.ok) {
          const errBody = await res.json().catch(() => null)
          throw new Error(errBody?.detail || 'Error al crear')
        }
        const nuevo: Producto = await res.json()
        setProductos((prev) => [...prev, nuevo])
      }
      setModalOpen(false); setProductoEditar(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar el producto.')
    }
  }

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      setProductos((prev) => prev.filter((p) => p.id !== id))
    } catch {
      setError('Error al eliminar el producto.')
    }
  }

  const handleEditar = (p: Producto) => { setProductoEditar(p); setModalOpen(true) }
  const handleNuevo  = () => {
    setProductoEditar(null)
    // Recargar categorías e ingredientes frescos al abrir modal
    fetchCategorias()
    fetchIngredientes()
    setModalOpen(true)
  }

  return (
    <>
      <PageShell title="Productos" count={productos.length} onAdd={handleNuevo} addLabel="Nuevo Producto" error={error} onDismissError={() => setError(null)}>
        <ProductoList productos={productos} onEditar={handleEditar} onEliminar={handleEliminar} />
      </PageShell>
      <ProductoModal
        isOpen={modalOpen}
        productoEditar={productoEditar}
        categorias={categorias}
        ingredientes={ingredientes}
        onClose={() => { setModalOpen(false); setProductoEditar(null) }}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default ProductsPage
