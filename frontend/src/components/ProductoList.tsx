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
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Producto</th>
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Categoría</th>
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Info</th>
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Precio</th>
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Stock</th>
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {productos.map((producto, index) => (
            <tr key={producto.id} className="border-b border-slate-100 hover:bg-orange-50/40 transition-colors duration-150 group">
              <td className="px-5 py-3.5 text-slate-400 text-sm tabular-nums">{index + 1}</td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  {producto.imagenes_url && producto.imagenes_url.length > 0 && producto.imagenes_url[0] !== "" ? (
                    <img src={producto.imagenes_url[0]} alt={producto.nombre} className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0 shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                  )}
                  <span className="font-semibold text-slate-800">{producto.nombre}</span>
                </div>
              </td>
              <td className="px-5 py-3.5">
                {producto.categoria_nombre ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                    {producto.categoria_nombre}
                  </span>
                ) : (
                  <span className="text-slate-400 text-sm">—</span>
                )}
              </td>
              <td className="px-5 py-3.5 text-center">
                {producto.descripcion ? (
                  <div className="relative inline-flex items-center justify-center group/tooltip cursor-help">
                    <svg className="w-5 h-5 text-slate-400 hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-[200px] bg-slate-800 text-white text-xs text-center rounded-md py-2 px-3 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 shadow-xl z-20 pointer-events-none whitespace-normal break-words">
                      {producto.descripcion}
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-slate-800"></div>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm">—</span>
                )}
              </td>
              <td className="px-5 py-3.5 text-right font-semibold text-slate-800 tabular-nums">
                ${producto.precio_base.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-5 py-3.5 text-center tabular-nums">
                <span className={`text-sm font-semibold ${producto.stock_cantidad > 0 ? 'text-slate-700' : 'text-red-500'}`}>
                  {producto.stock_cantidad}
                </span>
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
