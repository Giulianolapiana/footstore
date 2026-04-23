// src/components/IngredienteModal.tsx
// Modal con formulario para crear o editar un Ingrediente

import { useState, useEffect } from 'react'
import { Ingrediente, IngredienteForm } from '../types/ingrediente'

interface IngredienteModalProps {
  isOpen: boolean
  ingredienteEditar: Ingrediente | null
  onClose: () => void
  onSubmit: (datos: IngredienteForm) => void
}

const IngredienteModal = ({ isOpen, ingredienteEditar, onClose, onSubmit }: IngredienteModalProps) => {
  const [nombre, setNombre] = useState<string>('')
  const [descripcion, setDescripcion] = useState<string>('')
  const [esAlergeno, setEsAlergeno] = useState<boolean>(false)

  useEffect(() => {
    if (ingredienteEditar) {
      setNombre(ingredienteEditar.nombre)
      setDescripcion(ingredienteEditar.descripcion)
      setEsAlergeno(ingredienteEditar.es_alergeno)
    } else {
      setNombre('')
      setDescripcion('')
      setEsAlergeno(false)
    }
  }, [ingredienteEditar, isOpen])

  const handleSubmit = () => {
    if (!nombre.trim()) return
    onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      es_alergeno: esAlergeno,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {ingredienteEditar ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del ingrediente
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Mozzarella"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Queso mozzarella italiano"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={esAlergeno}
              onChange={(e) => setEsAlergeno(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Es alérgeno</span>
          </label>
          <p className="text-xs text-gray-400 mt-1 ml-6">
            Marcá esta opción si el ingrediente puede causar reacciones alérgicas.
          </p>
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
            disabled={!nombre.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

export default IngredienteModal
