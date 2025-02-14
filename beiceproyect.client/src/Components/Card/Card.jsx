/* eslint-disable react/prop-types */
import './Card.css'
import { useNavigate } from "react-router-dom";

const Card = ({ zapatilla }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        console.log("Navegando a sneaker con ID:", zapatilla.id);
        navigate(`/sneaker/${zapatilla.id}`);
    }

    return (
        <div className="card-container">
            <img
                src={zapatilla.imageUrl}
                alt={zapatilla.name}
                className="card-image"
            />
            <h4 className="card-name">{zapatilla.name}</h4>
            <h5 className="card-price">${zapatilla.price.toFixed(3)}ARS</h5>
            <p className="card-sizes">Talles disponibles: {zapatilla.sizes.map(s => s.size).join(", ")}</p>
            <button className="btn btn-primary" onClick={handleClick}>
                Ver mas
            </button>
        </div>
    )
}

export default Card;