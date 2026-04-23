// src/components/CategoriaModal.tsx
import { useState, useEffect, useCallback } from 'react'
import { Categoria, CategoriaForm } from '../types/categoria'

interface CategoriaModalProps {
  isOpen: boolean
  categoriaEditar: Categoria | null
  categorias: Categoria[]
  onClose: () => void
  onSubmit: (datos: CategoriaForm) => void
}

const CategoriaModal = ({ isOpen, categoriaEditar, categorias, onClose, onSubmit }: CategoriaModalProps) => {
  const [nombre, setNombre]       = useState<string>('')
  const [descripcion, setDescripcion] = useState<string>('')
  const [parentId, setParentId]   = useState<number | null>(null)
  const [loading, setLoading]     = useState(false)

  const modoEdicion = Boolean(categoriaEditar)

  useEffect(() => {
    if (categoriaEditar) {
      setNombre(categoriaEditar.nombre)
      setDescripcion(categoriaEditar.descripcion)
      setParentId(categoriaEditar.parent_id ?? null)
    } else {
      setNombre('')
      setDescripcion('')
      setParentId(null)
    }
    setLoading(false)
  }, [categoriaEditar, isOpen])

  // Cerrar con Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  const handleSubmit = async () => {
    if (!nombre.trim() || !descripcion.trim()) return
    setLoading(true)
    await onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      parent_id: parentId,
    })
    setLoading(false)
  }

  if (!isOpen) return null

  // Filtrar: no podemos ser padre de nosotros mismos
  const posiblesPadres = categorias.filter(c => {
    if (categoriaEditar && c.id === categoriaEditar.id) return false
    return true
  })

  // Construir nombres jerárquicos para el select
  const getNombreConPadre = (cat: Categoria): string => {
    if (cat.parent_id) {
      const padre = categorias.find(c => c.id === cat.parent_id)
      if (padre) return `${padre.nombre} → ${cat.nombre}`
    }
    return cat.nombre
  }

  const isValid = nombre.trim().length > 0 && descripcion.trim().length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-categoria-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel del modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 id="modal-categoria-title" className="text-lg font-bold text-slate-800">
            {modoEdicion ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 2l12 12M14 2L2 14" />
            </svg>
          </button>
        </div>

        {/* Formulario */}
        <div className="px-6 py-5 space-y-4">

          <div>
            <label htmlFor="cat-nombre" className="block text-sm font-medium text-slate-700 mb-1.5">
              Nombre <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="cat-nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Pizzas"
              autoFocus
              autoComplete="off"
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                transition-shadow duration-150"
            />
          </div>

          <div>
            <label htmlFor="cat-descripcion" className="block text-sm font-medium text-slate-700 mb-1.5">
              Descripción <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="cat-descripcion"
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Pizzas artesanales con masa fresca"
              autoComplete="off"
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                transition-shadow duration-150"
            />
          </div>

          {/* Selector de categoría padre */}
          <div>
            <label htmlFor="cat-parent" className="block text-sm font-medium text-slate-700 mb-1.5">
              Categoría padre <span className="text-slate-400 text-xs">(opcional — dejar vacío para categoría raíz)</span>
            </label>
            <select
              id="cat-parent"
              value={parentId ?? ''}
              onChange={(e) => setParentId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800
                focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                transition-shadow duration-150 bg-white"
            >
              <option value="">— Sin padre (categoría raíz) —</option>
              {posiblesPadres.map(c => (
                <option key={c.id} value={c.id}>
                  {getNombreConPadre(c)}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Footer con acciones */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors duration-150 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg
              hover:bg-orange-600 active:bg-orange-700
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-150 cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
          >
            {loading ? 'Guardando…' : (modoEdicion ? 'Actualizar' : 'Crear categoría')}
          </button>
        </div>

      </div>
    </div>
  )
}

export default CategoriaModal
