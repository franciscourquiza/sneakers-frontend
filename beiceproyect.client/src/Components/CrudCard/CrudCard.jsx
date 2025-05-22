/* eslint-disable react/prop-types */
import { useState } from "react";
import "./CrudCard.css";

const endpointMap = {
    Sneaker: "sneaker",
    Clothe: "clothe",
    Cap: "cap"
};

const CrudCard = ({ producto, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);

    const [editedData, setEditedData] = useState({
        name: producto.name,
        price: producto.price,
        imageUrl: producto.imageUrl,
        sizes: producto.category === "sneaker"
            ? Array.isArray(producto.sizes)
                ? producto.sizes.map(s => s.size).join(", ")
                : ""
            : producto.category === "clothe"
                ? producto.size ?? ""
                : producto.sizes ?? "",
        isInDiscount: producto.isInDiscount
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedData({
            name: producto.name,
            price: producto.price,
            imageUrl: producto.imageUrl,
            sizes: producto.category === "sneaker"
                ? Array.isArray(producto.sizes)
                    ? producto.sizes.map(s => s.size).join(", ")
                    : ""
                : producto.category === "clothe"
                    ? producto.size ?? ""
                    : producto.sizes ?? "",
            isInDiscount: producto.isInDiscount
        });
    };

    const handleInputChange = (e) => {
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        setEditedData({
            ...editedData,
            isInDiscount: e.target.checked
        });
    };

    const handleSaveEdit = async () => {
        try {
            const normalizedCategory = producto.category?.charAt(0).toUpperCase() + producto.category?.slice(1).toLowerCase();
            const endpoint = endpointMap[normalizedCategory];

            const body = {
                name: editedData.name,
                price: parseFloat(editedData.price),
                imageUrl: editedData.imageUrl,
                isInDiscount: editedData.isInDiscount,
            };

            if (producto.category === "sneaker") {
                body.sizes = editedData.sizes
                    .split(",")
                    .map(s => parseInt(s.trim()))
                    .filter(n => !isNaN(n));
            } else if (producto.category === "clothe") {
                body.size = editedData.sizes.trim();
            } else {
                body.size = editedData.sizes;
            }

            const response = await fetch(
                `https://sneakers-backend-production.up.railway.app/api/${endpoint}/EditById?id=${producto.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );

            if (!response.ok) {
                throw new Error("Error al actualizar el producto");
            }

            alert("Producto actualizado correctamente.");
            onUpdate();
            setIsEditing(false);
        } catch (error) {
            console.error("Error actualizando producto:", error);
            alert("Hubo un error al actualizar el producto.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(`¿Seguro que quieres eliminar ${producto.name}?`);
        if (!confirmDelete) return;

        try {
            const normalizedCategory =
                producto.category.charAt(0).toUpperCase() + producto.category.slice(1).toLowerCase();

            const endpoint = endpointMap[normalizedCategory];

            const response = await fetch(
                `https://sneakers-backend-production.up.railway.app/api/${endpoint}/DeleteById?id=${producto.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Error al eliminar el producto");
            }

            alert("Producto eliminado correctamente.");

            if (typeof onUpdate === "function") {
                onUpdate(); // Actualiza la lista en el componente padre
            }

        } catch (error) {
            console.error("Error eliminando producto:", error);
            alert("Hubo un error al eliminar el producto.");
        }
    };

    return (
        <div className="card-container">
            <img src={producto.imageUrl} alt={producto.name} className="card-image" />

            {isEditing ? (
                <div className="edit-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        value={editedData.name}
                        onChange={handleInputChange}
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Precio"
                        value={editedData.price}
                        onChange={handleInputChange}
                    />
                    {(producto.category === "sneaker" || producto.category === "clothe" || producto.category === "cap") && (
                        <input
                            type="text"
                            name="sizes"
                            placeholder="Talles (Ej: 42, 43...) o texto"
                            value={editedData.sizes}
                            onChange={handleInputChange}
                        />
                    )}
                    <input
                        type="url"
                        name="imageUrl"
                        placeholder="URL de la imagen"
                        value={editedData.imageUrl}
                        onChange={handleInputChange}
                    />
                    <label>
                        <input
                            type="checkbox"
                            name="isInDiscount"
                            checked={editedData.isInDiscount}
                            onChange={handleCheckboxChange}
                        />
                        Producto en Liquidación
                    </label>

                    <div className="card-buttons">
                        <button className="btn btn-save" onClick={handleSaveEdit}>
                            Guardar
                        </button>
                        <button className="btn btn-cancel" onClick={handleCancelEdit}>
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h4 className="card-name">{producto.name}</h4>
                    <h5 className="card-price">${producto.price.toFixed(3)} ARS</h5>

                    {(producto.category === "sneaker" || producto.category === "clothe" || producto.category === "cap") && (
                        <div className="card-sizes">
                            <p>Talles:</p>
                            {producto.category === "sneaker" ? (
                                Array.isArray(producto.sizes) && producto.sizes.length > 0 ? (
                                    producto.sizes.map((s, index) => (
                                        <p key={index}>{s.size} EUR ({s.size - 1} ARG)</p>
                                    ))
                                ) : (
                                    <p>No hay talles cargados</p>
                                )
                            ) : (
                                <p>{producto.size || producto.sizes || "No hay talles cargados"}</p>
                            )}
                        </div>
                    )}

                    <div className="card-buttons">
                        <button className="btn btn-edit" onClick={handleEditClick}>
                            Editar
                        </button>
                        <button className="btn btn-delete" onClick={handleDelete}>
                            Eliminar
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CrudCard;
