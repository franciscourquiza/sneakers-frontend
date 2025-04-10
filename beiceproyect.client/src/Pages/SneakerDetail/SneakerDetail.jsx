import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./SneakerDetail.css"

const SneakerDetail = () => {
    const { id } = useParams();
    const [sneaker, setSneaker] = useState(null);

    useEffect(() => {
        const fetchSneaker = async () => {
            try {
                const response = await fetch(`https://bei-ice-api.azurewebsites.net/api/Sneaker/GetById?id=${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setSneaker(data);
            } catch (error) {
                console.error("Error fetching sneaker details:", error);
            }
        }
        fetchSneaker();
    }, [id]);

    if (!sneaker) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="sneaker-detail-container">
            <div className="image-container">
                <img src={sneaker.imageUrl} alt={sneaker.name} className="sneaker-image" />
            </div>
            <div className="info-container">
                <h2>{sneaker.name}</h2>
                <p className="price">Precio: ${sneaker.price.toFixed(3)} ARS</p>
                <div className="sizes">
                    {sneaker.sizes.map((size) => (
                        <div key={size.size} className="size-badge in-stock">
                            {`En stock Talle ${size.size} EUR (${size.size - 1} ARG)`}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SneakerDetail;
