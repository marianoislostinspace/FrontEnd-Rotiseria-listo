// Navbar.tsx
import { Link } from "react-router"; // react-router-dom, no "react-router"
import '../styles/Navbar.css';
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

interface NavbarProps {
    isNavOpen: boolean;
    toggleMenu: () => void;
    closeMenu: () => void;
}



export const Navbar = ({ isNavOpen, toggleMenu, closeMenu }: NavbarProps) => {




    const horarios = () => {
        Swal.fire({
            title: "🍔🍟",
            imageUrl: "img/horarios.png",
            imageWidth: 400,
            imageHeight: 650,
            imageAlt: "schedule image"
        });
    }


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
            <nav className="navbar">
                <button className="hamburger" onClick={toggleMenu}>
                    ☰
                </button>
                <div className="textoMEdio"><Link className="homeNav" to="/"><h1 className="textoMid"><i className="cush">CUSH 🍔 </i>BURGUERS</h1></Link></div>
                <div className="logo">
                    <img src="img/logo.png" alt="Logo" />
                </div>


            </nav>

            <div className={`side-menu ${isNavOpen ? 'open' : ''}`}>
                <Link to="/" className="nav-link" onClick={closeMenu}><i className="fa-solid fa-house"></i>inicio</Link>
                <Link to="/Menu" className="nav-link" onClick={closeMenu}><i className="fa-solid fa-burger"></i>Menu</Link>
                <button className="horarios" onClick={horarios}><i className="fa-solid fa-calendar"></i>Horarios</button>

                {/* ICONOS DE REDES */}

                <div className="socialMedia">
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


                    <div className="rigthContainer">
                        <h1>Cush Burguers Web Site</h1>
                        <p>&copy; {año} Todos los derechos reservados. <br /></p>
                    </div>
                </div>




            </div>
        </>
    );
};
