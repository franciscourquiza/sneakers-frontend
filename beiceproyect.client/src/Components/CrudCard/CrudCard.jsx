/* eslint-disable react/prop-types */
import { useState } from "react";
import "./CrudCard.css";

const CrudCard = ({ zapatilla, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({
        name: zapatilla.name,
        price: zapatilla.price,
        imageUrl: zapatilla.imageUrl,
        sizes: zapatilla.sizes.map(s => s.size).join(", "),
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedData({
            name: zapatilla.name,
            price: zapatilla.price,
            imageUrl: zapatilla.imageUrl,
            sizes: zapatilla.sizes.map(s => s.size).join(", "),
        });
    };

    const handleInputChange = (e) => {
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`https://beiceservice.azurewebsites.net/api/Sneaker/EditById?id=${zapatilla.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: editedData.name,
                    price: parseFloat(editedData.price),
                    imageUrl: editedData.imageUrl,
                    sizes: editedData.sizes.split(",").map(size => parseInt(size.trim())) // Convertir a número
                }),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar la sneaker");
            }
            
            alert("Sneaker actualizada correctamente.");
            onUpdate();
            setIsEditing(false);
        } catch (error) {
            console.error("Error actualizando sneaker:", error);
            alert("Hubo un error al actualizar la sneaker.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(`¿Seguro que quieres eliminar ${zapatilla.name}?`);
        if (!confirmDelete) return;

        try {
            const response = await fetch(`https://beiceservice.azurewebsites.net/api/Sneaker/DeleteById?id=${zapatilla.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar la sneaker");
            }
            
            alert("Sneaker eliminada correctamente.");
            onUpdate();
        } catch (error) {
            console.error("Error eliminando sneaker:", error);
            alert("Hubo un error al eliminar la sneaker.");
        }
    };

    return (
        <div className="card-container">
            <img src={zapatilla.imageUrl} alt={zapatilla.name} className="card-image" />

            {isEditing ? (
                <div className="edit-form">
                    <input type="text" name="name" placeholder="Nombre" value={editedData.name} onChange={handleInputChange} />
                    <input type="number" name="price" placeholder="Precio (Ej: '100.000') usar puntos" value={editedData.price} onChange={handleInputChange} />
                    <input type="text" name="sizes" placeholder="Talles en EUR (separados por coma)"  value={editedData.sizes} onChange={handleInputChange} />
                    <input type="url" name="imageUrl" placeholder="URL de la imagen (Link, usar resoluciones cuadradas en lo posible)" value={editedData.imageUrl} onChange={handleInputChange} />

                    <div className="card-buttons">
                        <button className="btn btn-save" onClick={handleSaveEdit}>Guardar</button>
                        <button className="btn btn-cancel" onClick={handleCancelEdit}>Cancelar</button>
                    </div>
                </div>
            ) : (
                <>
                    <h4 className="card-name">{zapatilla.name}</h4>
                    <h5 className="card-price">${zapatilla.price.toFixed(3)} ARS</h5>
                        <div className="card-sizes">
                            <p>Talles disponibles:</p>
                            {zapatilla.sizes.map(s => (
                                <p key={s.size}>{s.size} EUR ({s.size - 1} ARG)</p>
                            ))}
                        </div>

                    <div className="card-buttons">
                        <button className="btn btn-edit" onClick={handleEditClick}>Editar</button>
                        <button className="btn btn-delete" onClick={handleDelete}>Eliminar</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CrudCard;
