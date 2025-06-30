import { useState } from "react";
import '../styles/Navbar.css';
import { Link } from "react-router";

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">

                {/* Logo a la izquierda */}
                <div className="logo">
                    <img src="img/logo.png" alt="logo" />
                </div>

                {/* Frase central */}
                {!isMenuOpen && (
                    <div className="fraseDiv">
                        <p className="frase">"La cocina es alquimia de amor." - Guy de Maupassant</p>
                    </div>
                )}

                {/* Menú flotante a la derecha */}
                <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <button className="hamburger" onClick={toggleMenu}>
                        ☰
                    </button>
                    <div className={`links ${isMenuOpen ? 'visible' : ''}`}>
                        <Link to="/" className="nav-link">Inicio</Link>
                        <Link to="/Menu" className="nav-link">Menú</Link>
                        <Link to="/Contacto" className="nav-link">Contacto</Link>
                    </div>
                </div>

            </div>
        </nav>
    );
};
