import { useEffect, useState } from "react"
import '../styles/footer.css'


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


                <div className="rigthContainer">
                    <h1>Cush Burguers Web Site</h1>
                    <p>&copy; {año} Todos los derechos reservados. <br /> Desarrollado por <strong><i className="dev">Adolfo hitler</i></strong> &#8226; <br />📞 +54 3551 244 5293</p>
                </div>
                <hr />
            </footer>
        </>
    )
}