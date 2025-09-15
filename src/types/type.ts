export type Categoria = {
    id:string
    nombre:string
    imagen:string
}

export type Plato = {
    id: string
    nombre: string
    precio: number
    imagen: string
    descripcion: string
    categoriaId: string
    opciones: Opciones[] | null
}

export type PlatoConOpciones = Plato & {
    opcionesSeleccionadas: Opciones[],
    nota?: string
    cantidad: number
};

export type Opciones = {
    id: string
    nombre: string
    precioExtra?: number
}
