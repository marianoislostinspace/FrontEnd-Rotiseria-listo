import { Routes, Route, Link, Navigate, useNavigate } from "react-router";
import { Navbar } from "./components/Navbar";
import { Menu } from "./components/Menu";
import './styles/App.css';
import './styles/Contacto.css';
import { useEffect, useState } from "react";
import { useData } from "./context/dataContext";
import type { Categoria } from "./types/type";





export const App = () => {

  const { platos, setPlatos, categorias, setCategorias } = useData()

  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleMenu = () => setIsNavOpen(prev => !prev);
  const closeMenu = () => setIsNavOpen(false);


  const urlApi = import.meta.env.VITE_API_URL


  useEffect(() => {
    const fetchDataCat = async () => {
      try {
        const resCategorias = await fetch(`${urlApi}GetCategoriasClient`, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        const dataCategorias = await resCategorias.json();

        setCategorias(dataCategorias);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchDataCat();
  }, []);

  useEffect(() => {


    const fetchDataPlat = async () => {
      try {
        const resPlatos = await fetch(`${urlApi}GetPlatosClient`, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        const dataPlatos = await resPlatos.json();

        setPlatos(dataPlatos);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }

    };

    fetchDataPlat();
  }, []);


  const navigate = useNavigate()

  const handleNavigate = (cat: Categoria) => {
    navigate("/Menu", {
      state: { scrollTo: cat.nombre }
    })
  }


  return (
    <div className="app-container">
      <Navbar
        isNavOpen={isNavOpen}
        toggleMenu={toggleMenu}
        closeMenu={closeMenu}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <>

              {/* SECCION DEL CATALOGO DE CATEGORIAS */}
              <div className="topContainer">
                <div className="titleContainer">
                  <h1 className="tituloGrid">Nuestro Catalogo</h1>
                </div>
              </div>

              <div className="contenedor-principal">

                <div className="izquierda">
                  {categorias && (
                    categorias.map((cat) => (
                      <div key={cat.id} id={cat.id} onClick={() => handleNavigate(cat)}>
                        <h1 className="tituloCat">{cat.nombre}</h1>
                        <img src={cat.imagen} alt={cat.nombre} className="fotoCat" />
                      </div>
                    ))
                  )}
                </div>
              </div>




              {/* SECCION DE LA BARRA AL MEDIO CON LOS 3 ICONOS */}
              <div className="barra">
                <div className="cont1">
                  <img src="img/logoBarra1.jpg" alt="Buena comida" />
                  <h1>Buena comida</h1>
                  <p>Contamos con comida sabrosa y de la mejor calidad</p>
                </div>

                <div className="cont1">
                  <img src="img/logoBarra3.jpg" alt="Preparación" />
                  <h1>Preparación en tiempo y forma</h1>
                  <p>Preparamos tu pedido lo antes posible para que se entregue rápido</p>
                </div>

                <div className="cont1">
                  <img src="img/logoBarra2.jpg" alt="Delivery" />
                  <h1>Delivery a domicilio</h1>
                  <p>Tenemos nuestro propio equipo de delivery para entregarte la comida en tu casa</p>
                </div>
              </div>


              {/* SECCION DE LA HAMURGUESA Y EL TEXTO AL LATERAL */}
              <div className="pagina">
                <div className="TituloDiv">
                  <h1 className="titulo">THE BEST FOOD QUALITY</h1>
                  <h4 className="subtituloGrande"><i className="cush">Cush</i> Burguer's</h4>
                  <p className="texto">La encontras en Cush burguers, donde trabajamos con los mejores y más frescos ingredientes</p>
                  <Link className="nav-link boton" to="/Menu">Ver Menu</Link>
                </div>

                <div className="imagenFondo">
                  <img src="img/imgApp.png" className="imgApp" alt="Burguer app" />
                </div>
              </div>





            </>
          } />

          <Route path="/Menu" element={<Menu isNavOpen={isNavOpen} />} />
        </Routes>
      </main>

    </div>
  );
};
