import { Routes, Route, Link } from "react-router"
import { Navbar } from "./components/Navbar"
import { Contacto } from "./components/Contacto"
import { Menu } from "./components/Menu"
import './styles/App.css'
import { Footer } from "./components/Footer"
import { useState } from "react"
import { Navbar2 } from "./components/Navbar2"

export const App = () => {

  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleMenu = () => setIsNavOpen(prev => !prev);
  const closeMenu = () => setIsNavOpen(false);


  return (
    <>
      <Navbar
        isNavOpen={isNavOpen}
        toggleMenu={toggleMenu}
        closeMenu={closeMenu}
      />

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

        <Route path="/Menu" element={<Menu  isNavOpen={isNavOpen} />} />
        <Route path="/Contacto" element={<Contacto />} />
      </Routes>
      <Footer></Footer>
    </>
  )
}