import React, { useState } from 'react'
import '../styles/Contacto.css'

type Props = {}

export const Contacto = (props: Props) => {

  const [mapScreen, setmapScreen] = useState<boolean>(false)


  const changeScreen = () => {
    setmapScreen(true)
  }
  const changeScreenBack = () => {
    setmapScreen(false)
  }

  return (
    <div className='contacto-page'>


      <div className="info">
        <div className="texto2">
          <h1 className='tituloContacto'>¿Quiénes Somos? Somos <i>Cush Burguers</i></h1>
          <h2>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad distinctio saepe quis. Distinctio, dicta mollitia?</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus quasi quidem numquam itaque quis, voluptas quo blanditiis deleniti labore repellendus neque eius rem ab et. Dolorum sint consequuntur rerum odit.</p>
          <button className='botonContacto' onClick={changeScreen}>Nuestro Local</button>
        </div>

        {mapScreen ? (
          <div className="mapa">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d329.6844707176772!2d-64.16692584987332!3d-31.27558972727719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94329b00640ba111%3A0x96b6d5a161ba46bc!2sCush&#39;s%20Burger!5e1!3m2!1ses!2sar!4v1748647996937!5m2!1ses!2sar" // Poné tu URL aquí
              width="600"
              height="700"
              style={{ border: "0", width: "100%", height: "700px" }} // estilo como objeto
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa"
              className='iframe'
            ></iframe>
            <button className='botonContacto' onClick={changeScreenBack}>Ocultar mapa</button>
          </div>
        ) : (
          <img src="img/local.jpg" alt="Nuestro local" className="imagen-local" />
        )}
      </div>


    </div>
  )
}