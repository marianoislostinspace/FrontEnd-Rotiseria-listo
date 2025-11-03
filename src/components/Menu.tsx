import { useEffect, useState } from 'react'
import '../styles/Menu.css'
import '../styles/desktopNavbar.css'
import '../styles/mobileNavbar.css'
import '../styles/carrito.css'
import Swal from 'sweetalert2'
import { useData } from '../context/dataContext'
import { useLocation, useNavigate } from 'react-router'
import { useCart } from '../context/carritoContext'

import type { Categoria, Plato, PlatoConOpciones, Opciones } from '../types/type'


interface MenuProps {
  isNavOpen: boolean;
}

export const Menu = ({ isNavOpen }: MenuProps) => {

  const location = useLocation();

  useEffect(() => {
    const categoriaId = location.state?.scrollTo;
    if (categoriaId) {
      const section = document.getElementById(categoriaId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.state?.scrollTo]);




  const { platos, setPlatos, categorias, setCategorias } = useData();
  const { cart, handleAddCart, removeFromCart, getTotal, realizarPedido } = useCart()

  const urlApi = import.meta.env.VITE_API_URL

  const [detalles, setdetalles] = useState<boolean>(false)
  const [singlePlato, setsinglePlato] = useState<Plato | null>(null)


  const [name, setname] = useState("")
  const [telefono, settelefono] = useState('')
  const [opcionSeleccionada, setopcionSeleccionada] = useState<string[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [notaPlato, setNotaPlato] = useState("");
  const [unidad, setunidad] = useState<number>(1)
  const [pago, setpago] = useState<"efectivo" | "transferencia" | "">("")
  const [adress, setadress] = useState("")
  const [isAddressOpen, setisAddressOpen] = useState<Boolean>(false)


  const getDetalles = (plato: Plato) => {
    setsinglePlato(plato)
    setdetalles(true)

  }

  const goBack = () => {
    setdetalles(false)
    console.log("Volviendo, detalles:", false)
  }

  const handleCartToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  }


  const sumar = () => {
    setunidad(unidad + 1)
  }
  const restar = () => {
    if (unidad > 1)
      setunidad(unidad - 1)
  }



  const handleCheckBoxChange = (opcion: Opciones, checked: boolean) => {
    if (checked) {
      setopcionSeleccionada([...opcionSeleccionada, opcion.id]);
    } else {
      setopcionSeleccionada(opcionSeleccionada.filter((id) => id !== opcion.id));
    }
  };





  const navigate = useNavigate()

  const handleNavigate = (cat: Categoria) => {
    navigate("/Menu", {
      state: { scrollTo: cat.nombre }
    })
  }




  const handleDivClick = () => {
    setisAddressOpen(prev => !prev);
    setadress("Ingrese su direccion")
  };





  const [open, setOpen] = useState(false);

  return (
    <>

      <div className={`sidebar ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
        <h1 className='navTitle'>Navegacion Rapida</h1>
        {categorias.map((categoria) => {
          return (
            <>
              <ul className='catNameSide' onClick={() => handleNavigate(categoria)}>{categoria.nombre}</ul>
            </>
          )
        })}
      </div>

      <button className='filterButton' onClick={() => setOpen(!open)}>Filtros de busqueda</button>

      <div className="carritoLateral">
        {!isMenuOpen && (
          <button
            className={`filtroButton `}
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            onClick={handleCartToggle}
          >
            Mi Carrito 🛒
          </button>
        )}

        <div className={`offcanvas offcanvas-start ${isMenuOpen ? 'show' : ''}`} id="sidebarMenu" tabIndex={-1}>
          <div className="offcanvas-header carritoHeader">
            <h5 className="offcanvas-title">Carrito de Compras🛒</h5>
            <button className="btn-close" data-bs-dismiss="offcanvas" onClick={handleCartToggle}></button>
          </div>
          <div className="offcanvas-body">
            <div className='contenidoCarrito'>
              <h2 className='H1cart'>Carrito</h2>
              {cart.length === 0 ? (
                <p>Tu carrito está vacío</p>
              ) : (
                cart.map((item, index) => (
                  <div className='itemContainer' key={item.id}>
                    <p className='itemsCarrito'>{item.nombre} - ${item.precio} - <br /> cantidad: x{item.cantidad}</p>
                    <button className='eliminar' onClick={() => removeFromCart(index)}>Eliminar</button>
                  </div>
                ))
              )}
              <p>
                <strong className='Total'>Total:</strong>{' '}
                <strong className='TotalPrice'>${Math.round(getTotal())}</strong>
              </p>



              <div className="pedidoContainer">
                <form onSubmit={(e) => e.preventDefault()}>
                  <input type="text" id='nombre' placeholder='Nombre' value={name} required onChange={(e) => setname(e.target.value)} />
                  <input type="number" id='telefono' placeholder='Telefono' value={telefono} required onChange={(e) => settelefono(e.target.value)} />
                  <button className='pedidoButton' type='submit' onClick={() => realizarPedido(name, telefono, adress, pago)}>Realizar Pedido</button>
                </form>
              </div>


              <div className="envioContainer">
                <div className="envio" onClick={() => setadress("retiro en local")}>retiro</div>
                <div className="envio" onClick={handleDivClick}>delivery</div>
              </div>





              <div className="pagoContainer">

                <div className="pago" onClick={() => setpago("efectivo")}
                  style={{
                    backgroundColor: pago === "efectivo" ? "#4CAF50" : "white",
                    color: pago === "efectivo" ? "white" : "black",
                    border: "1px solid gray",
                    padding: "10px",
                    cursor: "pointer",
                    borderRadius: "6px",
                  }}
                >efectivo</div>

                <div className="pago" onClick={() => setpago("transferencia")}
                  style={{
                    backgroundColor: pago === "transferencia" ? "#4CAF50" : "white",
                    color: pago === "transferencia" ? "white" : "black",
                    border: "1px solid gray",
                    padding: "10px",
                    cursor: "pointer",
                    borderRadius: "6px",
                  }}
                > transferencia</div>

              </div>

              {isAddressOpen ? (
                <input
                  onChange={(e) => setadress(e.target.value)}
                  type="text"
                  value={adress}
                  autoFocus
                  className="sapo"
                  placeholder='Ingrese su Direccion'
                />
              ) : (
                <div onClick={handleDivClick} className="cursor-pointer">
                  {adress}
                </div>
              )}

            </div>
          </div>
        </div>
      </div >


      {
        detalles ? (
          <div>
            {singlePlato && (
              <div className="detallesDivContainer">
                <div className='singlePlato'>
                  <button onClick={goBack} className='volverBtn'>Volver</button>
                  <h1>{singlePlato.nombre}</h1>
                  <p className='descripcion'>{singlePlato.descripcion}</p>
                  <p className='singlePlatoPrecio'>${singlePlato.precio}</p>
                  <img src={singlePlato.imagen} alt={singlePlato.nombre} />
                  <div className="counterdiv">
                    <button className='counter' onClick={sumar}>+</button>
                    <h1 className='counterh1'>Cantidad: {unidad}</h1>
                    <button className='counter' onClick={restar}>-</button>
                  </div>

                  {singlePlato.opciones?.map((opc) => (
                    <label key={opc.id} className='label'>
                      <input
                        type="checkbox"
                        className='checkbox'
                        checked={opcionSeleccionada.includes(opc.id)}
                        onChange={(e) => handleCheckBoxChange(opc, e.target.checked)}
                      />
                      {opc.nombre} -- ${opc.precioExtra}
                    </label>
                  ))}
                  <input
                    placeholder="Especificaciones (ej: sin cebolla...)"
                    value={notaPlato}
                    onChange={(e) => setNotaPlato(e.target.value)}
                    className="inputNota"
                  />



                  <button className='cartButton' onClick={() => {
                    if (singlePlato) {
                      handleAddCart(singlePlato, opcionSeleccionada, notaPlato, unidad);
                      setopcionSeleccionada([]);
                      setNotaPlato("");
                      setunidad(1);
                      setdetalles(false);
                    }
                  }}>Agregar Al Carrito🛒</button>
                </div>
              </div>
            )
            }
          </div >
        ) : (

          <div className="rootDiv">
            <div className="menuDiv">
              {categorias.map((categoria) => {
                const platosDeCategoria = platos.filter(
                  (plato) => plato.categoriaId === categoria.id
                )

                if (platosDeCategoria.length === 0) return null

                return (
                  <section id={categoria.nombre} >
                    <div key={categoria.id}>
                      <h1 className='catName'>{categoria.nombre}</h1>
                      <div className="platoContainer">
                        {platosDeCategoria.map((plato) => (
                          <div key={plato.id} className="plato" onClick={() => getDetalles(plato)}>
                            <img src={plato.imagen} alt={plato.nombre} />
                            <h3>{plato.nombre}</h3>
                            <p>${plato.precio}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        )}
    </>
  )
}

