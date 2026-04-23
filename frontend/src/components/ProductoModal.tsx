// src/components/ProductoModal.tsx
// Modal con formulario para crear o editar un Producto

import { useState, useEffect } from 'react'
import { Producto, ProductoForm } from '../types/producto'

interface ProductoModalProps {
  isOpen: boolean
  productoEditar: Producto | null
  onClose: () => void
  onSubmit: (datos: ProductoForm) => void
}

const ProductoModal = ({ isOpen, productoEditar, onClose, onSubmit }: ProductoModalProps) => {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precioBase, setPrecioBase] = useState<number>(0)
  const [stockCantidad, setStockCantidad] = useState<number>(0)
  const [disponible, setDisponible] = useState(true)
  const [imagenesUrl, setImagenesUrl] = useState('')

  useEffect(() => {
    if (productoEditar) {
      setNombre(productoEditar.nombre)
      setDescripcion(productoEditar.descripcion)
      setPrecioBase(productoEditar.precio_base)
      setStockCantidad(productoEditar.stock_cantidad)
      setDisponible(productoEditar.disponible)
      setImagenesUrl(productoEditar.imagenes_url.join(', '))
    } else {
      setNombre('')
      setDescripcion('')
      setPrecioBase(0)
      setStockCantidad(0)
      setDisponible(true)
      setImagenesUrl('')
    }
  }, [productoEditar, isOpen])

  const handleSubmit = () => {
    if (!nombre.trim() || precioBase <= 0) return
    const imagenes = imagenesUrl
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0)

    onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio_base: precioBase,
      imagenes_url: imagenes,
      stock_cantidad: stockCantidad,
      disponible,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {productoEditar ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>

        {/* Nombre */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Pizza Margherita"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Precio y Stock en fila */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio base ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={precioBase}
              onChange={(e) => setPrecioBase(parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              min="0"
              value={stockCantidad}
              onChange={(e) => setStockCantidad(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Imágenes URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URLs de imágenes (separadas por coma)
          </label>
          <input
            type="text"
            value={imagenesUrl}
            onChange={(e) => setImagenesUrl(e.target.value)}
            placeholder="Ej: https://ejemplo.com/img1.jpg, https://ejemplo.com/img2.jpg"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Disponible */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={disponible}
              onChange={(e) => setDisponible(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Disponible para venta</span>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!nombre.trim() || precioBase <= 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductoModal
