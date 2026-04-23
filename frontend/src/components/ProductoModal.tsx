// src/components/ProductoModal.tsx
// Modal con formulario para crear o editar un Producto
// Incluye selector de categoría (obligatorio) e ingredientes (opcional)

import { useState, useEffect } from 'react'
import { Producto, ProductoForm } from '../types/producto'
import { Categoria } from '../types/categoria'
import { Ingrediente } from '../types/ingrediente'

interface ProductoModalProps {
  isOpen: boolean
  productoEditar: Producto | null
  categorias: Categoria[]
  ingredientes: Ingrediente[]
  onClose: () => void
  onSubmit: (datos: ProductoForm) => void
}

/**
 * Ordena categorías jerárquicamente para el <select>
 */
function buildCategoriaOptions(categorias: Categoria[]): { id: number; label: string }[] {
  const result: { id: number; label: string }[] = []
  const raices = categorias.filter(c => !c.parent_id)
  const hijasPorPadre = new Map<number, Categoria[]>()
  for (const c of categorias) {
    if (c.parent_id) {
      const lista = hijasPorPadre.get(c.parent_id) || []
      lista.push(c)
      hijasPorPadre.set(c.parent_id, lista)
    }
  }

  function agregar(cat: Categoria, prefix: string) {
    result.push({ id: cat.id, label: prefix + cat.nombre })
    const hijas = hijasPorPadre.get(cat.id) || []
    for (const hija of hijas) {
      agregar(hija, prefix + '  ↳ ')
    }
  }

  for (const raiz of raices) {
    agregar(raiz, '')
  }

  return result
}

const ProductoModal = ({ isOpen, productoEditar, categorias, ingredientes, onClose, onSubmit }: ProductoModalProps) => {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precioBase, setPrecioBase] = useState<number>(0)
  const [stockCantidad, setStockCantidad] = useState<number>(0)
  const [imagenesUrl, setImagenesUrl] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | ''>('')
  const [ingredienteIds, setIngredienteIds] = useState<number[]>([])

  useEffect(() => {
    if (productoEditar) {
      setNombre(productoEditar.nombre)
      setDescripcion(productoEditar.descripcion)
      setPrecioBase(productoEditar.precio_base)
      setStockCantidad(productoEditar.stock_cantidad)
      setImagenesUrl(productoEditar.imagenes_url.join(', '))
      setCategoriaId(productoEditar.categoria_id)
      setIngredienteIds(productoEditar.ingredientes?.map(i => i.id) || [])
    } else {
      setNombre('')
      setDescripcion('')
      setPrecioBase(0)
      setStockCantidad(0)
      setImagenesUrl('')
      setCategoriaId('')
      setIngredienteIds([])
    }
  }, [productoEditar, isOpen])

  const toggleIngrediente = (id: number) => {
    setIngredienteIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleSubmit = () => {
    if (!nombre.trim() || precioBase <= 0 || categoriaId === '') return
    const imagenes = imagenesUrl
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0)

    onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio_base: precioBase,
      categoria_id: categoriaId as number,
      imagenes_url: imagenes,
      stock_cantidad: stockCantidad,
      disponible: true,
      ingrediente_ids: ingredienteIds,
    })
  }

  if (!isOpen) return null

  const noCategorias = categorias.length === 0
  const isValid = nombre.trim().length > 0 && precioBase > 0 && categoriaId !== ''
  const catOptions = buildCategoriaOptions(categorias)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {productoEditar ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>

        {/* Alerta si no hay categorías */}
        {noCategorias && (
          <div className="mb-4 flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a.5.5 0 0 1 .437.257l7 12A.5.5 0 0 1 15 14H1a.5.5 0 0 1-.437-.743l7-12A.5.5 0 0 1 8 1zm0 4a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-3A.5.5 0 0 0 8 5zm0 6a.75.75 0 1 0 0 1.5A.75.75 0 0 0 8 11z" />
            </svg>
            <span>Primero creá al menos una <strong>categoría</strong> antes de agregar productos.</span>
          </div>
        )}

        {/* Nombre */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Pizza Margherita"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Pizza con salsa, mozzarella y albahaca"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Categoría (obligatoria) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría <span className="text-red-500">*</span>
          </label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value ? parseInt(e.target.value) : '')}
            disabled={noCategorias}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">— Seleccionar categoría —</option>
            {catOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Precio y Stock en fila */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio base ($) <span className="text-red-500">*</span></label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={precioBase}
              onChange={(e) => setPrecioBase(parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              min="0"
              value={stockCantidad}
              onChange={(e) => setStockCantidad(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Imágenes URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URLs de imágenes <span className="text-slate-400 text-xs">(separadas por coma)</span>
          </label>
          <input
            type="text"
            value={imagenesUrl}
            onChange={(e) => setImagenesUrl(e.target.value)}
            placeholder="Ej: https://ejemplo.com/img1.jpg"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Ingredientes (opcional) */}
        {ingredientes.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredientes <span className="text-slate-400 text-xs">(opcional)</span>
            </label>
            <div className="border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-1.5">
              {ingredientes.map(ing => (
                <label key={ing.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded">
                  <input
                    type="checkbox"
                    checked={ingredienteIds.includes(ing.id)}
                    onChange={() => toggleIngrediente(ing.id)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400"
                  />
                  <span className="text-sm text-slate-700">{ing.nombre}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || noCategorias}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {productoEditar ? 'Actualizar' : 'Crear producto'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductoModal
