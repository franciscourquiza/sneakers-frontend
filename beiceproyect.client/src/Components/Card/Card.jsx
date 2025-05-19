/* eslint-disable react/prop-types */
import './Card.css'
import { useNavigate } from "react-router-dom";

const Card = ({ producto }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        console.log("Navegando a producto con ID:", producto.id);
        navigate(`/${producto.category}/${producto.id}`);
    };

    return (
        <div className="card-container">
            <img
                src={producto.imageUrl}
                alt={producto.name}
                className="card-image"
            />
            <h4 className="card-name">{producto.name}</h4>
            <h5 className="card-price">${producto.price.toFixed(3)} ARS</h5>

            {producto.category === "sneaker" && producto.sizes && (
                <div className="card-sizes">
                    <p>Talles disponibles:</p>
                    {producto.sizes.map(s => (
                        <p key={s.size}>{s.size} EUR ({s.size - 1} ARG)</p>
                    ))}
                </div>
            )}

            {producto.category === "clothe" && producto.size && (
                <div className="card-sizes">
                    <p>Talles disponibles: {producto.size}</p>
                </div>
            )}

            {/* No mostrar talles para caps */}
            <button className="btn btn-primary" onClick={handleClick}>
                Ver mas
            </button>
        </div>
    );
};

export default Card;
