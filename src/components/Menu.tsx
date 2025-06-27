import { useEffect, useState } from 'react'
import '../styles/Menu.css'
import '../styles/carrito.css'
import Swal from 'sweetalert2'


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

type PlatoConOpciones = Plato & {
  opcionesSeleccionadas: Opciones[], // sin "?"
  nota?: string
  cantidad: number
};



type Opciones = {
  id: string
  nombre: string
  precioExtra?: number
}




type Props = {
  platoshome: Plato[]
  categoriashome: Categoria[]
}

export const Menu: React.FC<Props> = ({ platoshome, categoriashome }) => {


  useEffect(() => {
    const propLoad = () => {
      setCategorias(categoriashome)
      setPlatos(platoshome)

    }
    propLoad()
  }, [])




  const urlApi = import.meta.env.VITE_API_URL

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [platos, setPlatos] = useState<Plato[]>([])
  const [detalles, setdetalles] = useState<boolean>(false)
  const [singlePlato, setsinglePlato] = useState<Plato | null>(null)

  const [cart, setcart] = useState<PlatoConOpciones[]>(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });


  const [name, setname] = useState("")
  const [telefono, settelefono] = useState('')
  const [opcionSeleccionada, setopcionSeleccionada] = useState<string[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [notaPlato, setNotaPlato] = useState("");
  const [unidad, setunidad] = useState<number>(1)


  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(cart));
  }, [cart]);


  useEffect(() => {
    const fetchPlatosYCategorias = async () => {
      try {
        const resPlatos = await fetch(`${urlApi}platos`)
        const dataPlatos: Plato[] = await resPlatos.json()
        console.log('platos:', dataPlatos)  // Aquí ves los platos

        const resCategorias = await fetch(`${urlApi}categorias`)
        const dataCategorias: Categoria[] = await resCategorias.json()
        console.log('categorias:', dataCategorias)  // Aquí ves las categorías

        setPlatos(dataPlatos)
        setCategorias(dataCategorias)
      } catch (error) {
        console.error('Error al cargar datos:', error)
      }
    }

    fetchPlatosYCategorias()
  }, [])



  const getDetalles = (plato: Plato) => {
    setsinglePlato(plato)
    setdetalles(true)

  }

  const goBack = () => {
    setdetalles(false)
    console.log("Volviendo, detalles:", false)
  }

  const handleAddCart = (Product: Plato) => {
    const productoConOpciones: PlatoConOpciones = {
      ...Product,
      opcionesSeleccionadas: Product.opciones?.filter(op => opcionSeleccionada.includes(op.id)) || [],
      nota: notaPlato.trim() !== "" ? notaPlato.trim() : undefined,
      cantidad: unidad
    };

    setcart((prevCart) => [...prevCart, productoConOpciones]);

    Swal.fire({
      title: "Exito!!",
      icon: "success",
      text: `${Product.nombre} con ${productoConOpciones.opcionesSeleccionadas.map(op => op.nombre).join(', ')} agregado al carrito `,
      draggable: true
    });

    setopcionSeleccionada([]);
    setNotaPlato(""); // Limpiamos la nota después de agregar
    setunidad(1)
    console.log(Product)
    console.log(cart)
  };




  const removeFromCart = (index: number) => {
    const updateCart = [...cart]
    updateCart.splice(index, 1)
    setcart(updateCart)
  }

  // Toggle para abrir/cerrar el carrito y cambiar la visibilidad del botón
  const handleCartToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const getTotal = () => {
    return cart.reduce((acc, item) => {
      const precioBase = Number(item.precio) || 0;
      const precioOpciones = item.opcionesSeleccionadas?.reduce((sum, opc) => sum + (Number(opc.precioExtra) || 0), 0) || 0;
      const subtotal = (precioBase + precioOpciones) * item.cantidad
      return acc + subtotal;
    }, 0);
  };




  const handleCheckBoxChange = (option: Opciones, isCheked: boolean) => {
    setopcionSeleccionada((prev) => {
      if (isCheked) {
        return [...prev, option.id]
      } else {
        return prev.filter((id) => id !== option.id)
      }
    })

  }




  const realizarPedido = async () => {
    if (!name.trim() || !telefono.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, completá tu nombre y teléfono.",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
      return;
    }

    if (cart.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El carrito esta vacio.",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
      return;
    }

    try {
      // Armar el objeto para enviar al backend
      const pedidoData = {
        cliente: {
          nombre: name.trim(),
          telefono: telefono.trim()
        },
        total: getTotal(),
        items: cart.map(item => ({
          idPlato: item.id,
          nombre: item.nombre,
          precio: item.precio,
          opcionesSeleccionadas: item.opcionesSeleccionadas.map(opc => ({
            id: opc.id,
            nombre: opc.nombre,
            precioExtra: opc.precioExtra ?? 0
          })),
          cantidad: item.cantidad,
          nota: item.nota || ""
        })),
        fecha: new Date().toISOString()
      };

      // POST al backend
      const response = await fetch(`${urlApi}pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(pedidoData)
      });

      if (!response.ok) {
        throw new Error("Error al enviar el pedido");
      }

      // Si llegó acá es porque el pedido se guardó bien, armamos el mensaje para WhatsApp
      const itemsTexto = cart.map((item, index) => {
        const precio = item.precio;
        const opciones = item.opcionesSeleccionadas && item.opcionesSeleccionadas.length > 0
          ? item.opcionesSeleccionadas.map(op => `  - ${op.nombre} (+$${op.precioExtra ?? 0})`).join('\n')
          : '';

        const nota = item.nota ? `\n  📝 Nota: ${item.nota}` : '';

        return `${index + 1}. ${item.nombre} - $${precio}${opciones ? '\n' + opciones : ''}${nota}`;
      }).join('\n\n');

      const total = getTotal().toFixed(2);

      const message = `Hola! Me gustaría realizar el siguiente pedido:\n\n${itemsTexto}\n\nTotal:$${total}\n\nNombre:${name}\nTeléfono:${telefono}:\n\nTransferencia a:\n\n Alias: polirubro.grace.mp\nCBU: 0000003100012345678910\n\nPor favor, enviame el comprobante de pago por acá para confirmar el pedido. ¡Gracias!`;

      const encodedMessage = encodeURIComponent(message);
      const phoneNumber = 3512445293;
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      // Abrir WhatsApp en nueva pestaña
      window.open(whatsappURL, '_blank');

      // Limpiar carrito y formulario
      setcart([]);
      setname('');
      settelefono('');

    } catch (error) {
      console.error("Error enviando el pedido:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "ocurrio un error al enviar el pedido, intentalo de nuevo mas tarde",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
    }
  };



  const sumar = () => {
    setunidad(unidad + 1)
  }
  const restar = () => {
    if (unidad > 1)
      setunidad(unidad - 1)
  }




  return (
    <>

      <div className="carritoLateral">
        {/* Botón que abre el Sidebar, solo visible si el menú está cerrado */}
        {!isMenuOpen && (
          <button
            className="btn btn-primary m-3 filtroButton"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            onClick={handleCartToggle} // Cambia el estado del menú
          >
            Mi Carrito 🛒
          </button>
        )}

        {/* Menú Lateral Offcanvas */}
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
                  <input type="tel" id='telefono' placeholder='Telefono' value={telefono} required onChange={(e) => settelefono(e.target.value)} />
                  <button className='pedidoButton' type='submit' onClick={realizarPedido}>Realizar Pedido</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>



      {detalles ? (
        <div>
          {singlePlato && (
            <div className="detallesDivContainer">
              <button onClick={goBack} className='volverBtn'>Volver</button>
              <div className='singlePlato'>
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
                <button className='cartButton' onClick={() => handleAddCart(singlePlato)}>Agregar Al Carrito🛒</button>
              </div>
            </div>
          )}
        </div>
      ) : (

        <div className="rootDiv">
          <div className="menuDiv">
            {categorias.map((categoria) => {
              const platosDeCategoria = platos.filter(
                (plato) => plato.categoriaId === categoria.id
              )

              if (platosDeCategoria.length === 0) return null // Oculta categorías vacías

              return (
                <div key={categoria.id}>
                  <h1 className='catName'>{categoria.nombre}</h1>
                  <div className="platoContainer">
                    {platosDeCategoria.map((plato) => (
                      <div key={plato.id} className="plato" onClick={() => getDetalles(plato)}>
                        <h3>{plato.nombre}</h3>
                        <p>${plato.precio}</p>
                        <img src={plato.imagen} alt={plato.nombre} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

