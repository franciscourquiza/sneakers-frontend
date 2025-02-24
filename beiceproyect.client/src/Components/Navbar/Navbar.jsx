import { useState } from 'react';
import './Navbar.css';
import { Link } from "react-router-dom";

const Navbar = () => {
    
    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click); 
    const closeMobileMenu = () => setClick(false);

    return (
        <nav className="navbar">
            <div>
                <ul className="navbar-title">
                    <li><a href="" className="title" onClick={closeMobileMenu}>Calzado Importado</a></li>
                </ul>
            </div>

            <div className='menu-icon' onClick={handleClick}>
                <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
            </div>

            <div>
                <ul className={click ? "navbar-right active" : "navbar-right"}>
                    <li><Link to="/home" onClick={closeMobileMenu}>Zapatillas</Link></li>
                    <li><Link to="/discounts" onClick={closeMobileMenu}>Liquidacion</Link></li>
                    <li><Link to="/sizestable" onClick={closeMobileMenu}>Tabla de Talles</Link></li>
                    <li><Link to="/adminpanel" onClick={closeMobileMenu}>Panel</Link></li>
                </ul>
            </div>
        </nav>
  );
}

export default Navbar;