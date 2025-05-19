import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ClotheDetail.css"
import { FaWhatsapp } from "react-icons/fa";

const ClotheDetail = () => {
    const { id } = useParams();
    const [clothe, setClothe] = useState(null);

    useEffect(() => {
        const fetchClothe = async () => {
            try {
                const response = await fetch(`https://sneakers-backend-production.up.railway.app/api/Clothe/GetById?id=${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setClothe(data);
            } catch (error) {
                console.error("Error fetching sneaker details:", error);
            }
        }
        fetchClothe();
    }, [id]);

    if (!clothe) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="sneaker-detail-container">
            <div className="image-container">
                <img src={clothe.imageUrl} alt={clothe.name} className="sneaker-image" />
            </div>
            <div className="info-container">
                <h2>{clothe.name}</h2>
                <p className="price">Precio: ${clothe.price.toFixed(3)} ARS</p>
                <div className="sizes">
                    <p className="sizes">Talles:{clothe.size}</p>
                </div>

                {/* Botón WhatsApp justo debajo de talles */}
                <a
                    href="https://wa.me/5493462626817"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-button"
                    aria-label="Contactar por WhatsApp"
                >
                    <FaWhatsapp className="whatsapp-icon" />
                    Contactanos
                </a>
            </div>
        </div>
    )
}

export default ClotheDetail;
