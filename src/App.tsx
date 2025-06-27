import { Routes, Route, Link } from "react-router"
import { Navbar } from "./components/Navbar"
import { Contacto } from "./components/Contacto"
import { Menu } from "./components/Menu"
import './styles/App.css'
import { useEffect, useState } from "react"
import { Footer } from "./components/Footer"



type Categoria = {
  id: string
  nombre: string
}

type Plato = {
  id: string
  nombre: string
  precio: number
  imagen: string
  descripcion: string
  categoriaId: string
  opciones: Opciones[] | null
}


type Opciones = {
  id: string
  nombre: string
  precioExtra?: number
}

type Props = {}

export const App = (props: Props) => {

  const urlApi = 'https://backend-crud-firebase-production.up.railway.app/'

  const [platosHome, setplatosHome] = useState<Plato[]>([])
  const [categoriasHome, setcategoriasHome] = useState<Categoria[]>([])

  useEffect(() => {
    const fetchPlatosYCategorias = async () => {
      try {
        const resPlatos = await fetch(`${urlApi}platos`)
        const dataPlatos: Plato[] = await resPlatos.json()
        console.log('platos:', dataPlatos)  // Aquí ves los platos

        const resCategorias = await fetch(`${urlApi}categorias`)
        const dataCategorias: Categoria[] = await resCategorias.json()
        console.log('categorias:', dataCategorias)  // Aquí ves las categorías

        setplatosHome(dataPlatos)
        setcategoriasHome(dataCategorias)
      } catch (error) {
        console.error('Error al cargar datos:', error)
      }
    }

    fetchPlatosYCategorias()
  }, [])






  return (
    <>
      <Navbar></Navbar>

      <Routes>
        <Route path="/" element={
          <div className="pagina">
            <div className="imagenFondo">

              <div className="TituloDiv">
                <h1 className="titulo">THE BEST FOOD QUALITY</h1>
                <h4 className="subtituloGrande"><i className="cush">Cush</i> Burguer's</h4>
                <p className="texto">La encontras en Cush burguers, donde trabajamos con los mejores y mas frescos ingredientes para que puedas disfrutar de nuestros sabrosos platos</p>
                <Link className="nav-link boton" to="/Menu">Ver Menu</Link>
              </div>

            </div>
          </div>
        }
        />

        <Route path="/Menu" element={<Menu platoshome={platosHome} categoriashome={categoriasHome} />} />
        <Route path="/Contacto" element={<Contacto />} />
      </Routes>
      <Footer></Footer>
    </>
  )
}