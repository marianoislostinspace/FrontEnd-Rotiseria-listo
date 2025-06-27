import { use, useEffect, useState } from "react"
import '../styles/footer.css'
import { Link } from "react-router"


type Props = {}

export const Footer = (props: Props) => {

    const [año, setaño] = useState(2025)

    useEffect(() => {
        const añofunc = () => {
            const añoActual = new Date().getFullYear()
            setaño(añoActual)
        }
        añofunc()
    }, [])




    return (
        <>
            <footer className="bloque-final">


                <div className="social-icons">
                    <div className="social-item">
                        <i className="fa-brands fa-whatsapp"></i>
                        <a href="#" target="_blank">WhatsApp</a>
                    </div>
                    <div className="social-item">
                        <i className="fa-brands fa-instagram"></i>
                        <a href="#" target="_blank">Instagram</a>
                    </div>
                    <div className="social-item">
                        <i className="fa-brands fa-facebook"></i>
                        <a href="#" target="_blank">Facebook</a>
                    </div>
                </div>

                <div className="social-item">
                    <i className="fa-brands fa-instagram"></i>
                    <a href="#" target="_blank">Juanito (Dueño)</a>
                </div>

                <div className="rigthContainer">
                    <h1>Cush Burguers Web Site</h1>
                    <p>&copy; {año} Todos los derechos reservados. <br /> Desarrollado por <strong><i className="dev">Mariano Ferreyra</i></strong> &#8226; <br />📞 +54 3551 244 5293</p>
                </div>
                <hr />



            </footer>
        </>
    )
}