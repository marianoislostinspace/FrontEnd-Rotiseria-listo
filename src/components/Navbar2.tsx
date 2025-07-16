// Navbar.tsx
import { Link } from "react-router"; // react-router-dom, no "react-router"
import '../styles/nav2.css';

interface NavbarProps {
  isNavOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

export const Navbar2 = ({ isNavOpen, toggleMenu, closeMenu }: NavbarProps) => {
  return (
    <>
      <nav className="navbar">
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>

        <div className="logo">
          <img src="img/logo.png" alt="Logo" />
        </div>


      </nav>

      <div className={`side-menu ${isNavOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link" onClick={closeMenu}>Inicio</Link>
        <Link to="/Menu" className="nav-link" onClick={closeMenu}>Menú</Link>
        <Link to="/Contacto" className="nav-link" onClick={closeMenu}>Contacto</Link>

        <div className="horario">
          <h1>Horarios:</h1>

          <h4><i>Lunes</i>: de 20:00PM a 00:00AM.</h4> <br />
          <h4><i>Miércoles</i>: de 20:00PM a 00:00AM.</h4> <br />
          <h4><i>Jueves</i>: de 20:00PM a 00:00AM.</h4> <br />
          <h4><i>Viernes</i>: de 20:00PM a 00:30AM.</h4> <br />
          <h4><i>Sábado</i>: de 20:00PM a 00:30AM.</h4> <br />
          <h4><i>Domingo</i>: de 20:00PM a 00:30AM.</h4> <br />
        </div>
      </div>
    </>
  );
};