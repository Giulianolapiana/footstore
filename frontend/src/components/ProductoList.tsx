// src/components/ProductoList.tsx
import { Producto } from '../types/producto'

interface ProductoListProps {
  productos: Producto[]
  onEditar: (producto: Producto) => void
  onEliminar: (id: number) => void
}

const EmptyIcon = () => (
  <svg className="mx-auto mb-3 text-slate-300" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
)

const ProductoList = ({ productos, onEditar, onEliminar }: ProductoListProps) => {
  if (productos.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 animate-fade-in">
        <EmptyIcon />
        <p className="text-base font-medium text-slate-500">Sin productos aún</p>
        <p className="text-sm mt-1">Hacé clic en "＋ Nuevo Producto" para empezar.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left" role="table">
        <thead>
          <tr className="border-b-2 border-slate-100">
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 w-14">#</th>
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Nombre</th>
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Descripción</th>
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Precio</th>
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Stock</th>
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Estado</th>
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {productos.map((producto, index) => (
            <tr key={producto.id} className="border-b border-slate-100 hover:bg-orange-50/40 transition-colors duration-150 group">
              <td className="px-5 py-3.5 text-slate-400 text-sm tabular-nums">{index + 1}</td>
              <td className="px-5 py-3.5 font-semibold text-slate-800">{producto.nombre}</td>
              <td className="px-5 py-3.5 text-slate-500 text-sm max-w-[180px] truncate" title={producto.descripcion}>
                {producto.descripcion || '—'}
              </td>
              <td className="px-5 py-3.5 text-right font-semibold text-slate-800 tabular-nums">
                ${producto.precio_base.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-5 py-3.5 text-center tabular-nums">
                <span className={`text-sm font-semibold ${producto.stock_cantidad > 0 ? 'text-slate-700' : 'text-red-500'}`}>
                  {producto.stock_cantidad}
                </span>
              </td>
              <td className="px-5 py-3.5 text-center">
                {producto.disponible ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    Disponible
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                    No disponible
                  </span>
                )}
              </td>
              <td className="px-5 py-3.5 text-right">
                <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={() => onEditar(producto)}
                    aria-label={`Editar ${producto.nombre}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors duration-150 cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onEliminar(producto.id)}
                    aria-label={`Eliminar ${producto.nombre}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-150 cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductoList
