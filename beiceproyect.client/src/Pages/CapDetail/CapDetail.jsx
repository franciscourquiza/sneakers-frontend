import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./CapDetail.css"
import { FaWhatsapp } from "react-icons/fa";


const CapDetail = () => {
    const { id } = useParams();
    const [cap, setCap] = useState(null);

    useEffect(() => {
        const fetchCap = async () => {
            try {
                const response = await fetch(`https://sneakers-backend-production.up.railway.app/api/Cap/GetById?id=${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setCap(data);
            } catch (error) {
                console.error("Error fetching sneaker details:", error);
            }
        }
        fetchCap();
    }, [id]);

    if (!cap) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="sneaker-detail-container">
            <div className="image-container">
                <img src={cap.imageUrl} alt={cap.name} className="sneaker-image" />
            </div>
            <div className="info-container">
                <h2>{cap.name}</h2>
                <p className="price">Precio: ${cap.price.toFixed(3)} ARS</p>
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
    )
}

export default CapDetail;
