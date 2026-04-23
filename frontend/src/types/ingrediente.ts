// src/types/ingrediente.ts
// Tipos para el módulo de Ingredientes

export interface Ingrediente {
  id: number
  nombre: string
  descripcion: string
}

export interface IngredienteForm {
  nombre: string
  descripcion: string
}
