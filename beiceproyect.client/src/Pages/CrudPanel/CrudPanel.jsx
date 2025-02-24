/* eslint-disable react/prop-types */
import './CrudPanel.css';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import CrudCard from '../../Components/CrudCard/CrudCard';

const CrudPanel = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [isAdding, setIsAdding] = useState(false); // Estado para el formulario de agregar
    const [newSneaker, setNewSneaker] = useState({
        name: '',
        price: '',
        sizes: '',
        imageUrl: '',
        isInDiscount: false  // Nueva propiedad para liquidación
    });

    const signOutClicked = () => {
        localStorage.removeItem("token");
        localStorage.setItem('isAuthenticated', 'false');
        setIsAuthenticated(false);
        navigate("/home");
    }

    const [filteredResults, setFilteredResults] = useState([]);
    const [allSneakers, setAllSneakers] = useState([]);
    const [name, setName] = useState("");
    const [size, setSize] = useState("");

    const fetchAllSneakers = async () => {
        try {
            const response = await fetch(`https://beiceservice.azurewebsites.net/api/Sneaker/GetAll`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setAllSneakers(data); // Set all sneakers from API
            setFilteredResults(data); // Initially set all sneakers as filtered results
            console.log(data);
        } catch (error) {
            console.error("Error fetching all sneakers:", error);
        }
    };

    const fetchSneakersByName = async (name) => {
        try {
            const response = await fetch(`https://beiceservice.azurewebsites.net/api/Sneaker/GetByName?name=${name}`);
            if (!response.ok) {
                throw new Error("HTTP Error! Status: ${response.status}");
            }
            const data = await response.json();
            setFilteredResults(data);
        } catch (error) {
            console.error("Error al traer las zapatillas:", error);
        }
    }

    const fetchSneakersBySize = async (size) => {
        try {
            const response = await fetch(`https://beiceservice.azurewebsites.net/api/Sneaker/GetBySize?size=${size}`);
            if (!response.ok) {
                throw new Error("HTTP Error! Status: ${response.status}");
            }
            const data = await response.json();
            setFilteredResults(data);
        } catch (error) {
            console.error("Error al traer las zapatillas:", error);
        }
    }

    useEffect(() => {
        fetchAllSneakers(); // Fetch all sneakers when the component mounts
    }, []);

    const handleAddSneaker = () => {
        setIsAdding(true);
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setNewSneaker({
            name: '',
            price: '',
            sizes: '',
            imageUrl: '',
            isInDiscount: false
        });
    };

    const handleInputChange = (e) => {
        setNewSneaker({
            ...newSneaker,
            [e.target.name]: e.target.value
        });
    };

    // Manejo específico para el checkbox
    const handleCheckboxChange = (e) => {
        setNewSneaker({
            ...newSneaker,
            isInDiscount: e.target.checked
        });
    };

    const handleFilter = () => {
        let filteredData = allSneakers;

        if (name.trim()) {
            filteredData = filteredData.filter((zapatilla) =>
                zapatilla.name.toLowerCase().includes(name.trim().toLowerCase())
            );
        }

        if (size) {
            filteredData = filteredData.filter((zapatilla) =>
                zapatilla.sizes.some((s) => s.size === parseInt(size))
            );
        }

        setFilteredResults(filteredData); // Update filtered results based on name and size
    };

    const handleSaveAdd = async () => {
        try {
            const response = await fetch(`https://beiceservice.azurewebsites.net/api/Sneaker/Create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newSneaker.name,
                    price: parseFloat(newSneaker.price),
                    sizes: newSneaker.sizes.split(',').map(size => parseInt(size.trim())),
                    imageUrl: newSneaker.imageUrl,
                    isInDiscount: newSneaker.isInDiscount // Enviar la propiedad de liquidación
                }),
            });

            if (!response.ok) {
                throw new Error('Error al agregar el producto');
            }

            alert('Sneaker agregada correctamente');
            setIsAdding(false);
            fetchAllSneakers(); // Actualiza la lista de sneakers después de agregar
        } catch (error) {
            console.error('Error agregando sneaker:', error);
            alert('Hubo un error al agregar la sneaker');
        }
    }

    return (
        <div className="wraper">
            <h3>Panel de Alta-Baja-Modificacion de Productos</h3>
            <div className="logout-button">
                <button className="button" onClick={signOutClicked}>Cerrar Sesion</button>
            </div>
            <button onClick={handleAddSneaker} className="btn btn-add">Agregar Producto +</button>

            {isAdding && (
                <div className="add-form">
                    <h4>Agregar nuevo producto</h4>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        value={newSneaker.name}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Precio (Ej: 100.000) usar puntos cada 3 digitos"
                        value={newSneaker.price}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                    <input
                        type="text"
                        name="sizes"
                        placeholder="Talles en EUR (separados por coma, Ejemplo: 40, 41, 42)"
                        value={newSneaker.sizes}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                    <input
                        type="url"
                        name="imageUrl"
                        placeholder="URL de la imagen (Link, usar resoluciones cuadradas en lo posible, 400px X 400px por ejemplo)"
                        value={newSneaker.imageUrl}
                        onChange={handleInputChange}
                        className="form-input"
                    />

                    {/* Nuevo checkbox para "Producto en Liquidación" */}
                    <div className="form-input">
                        <label>
                            <input
                                type="checkbox"
                                name="isInDiscount"
                                checked={newSneaker.isInDiscount}
                                onChange={handleCheckboxChange}
                            />
                            Producto en Liquidacion(Tildar la opcion para agregar el producto en la seccion "Liquidacion")
                        </label>
                    </div>

                    <div className="form-buttons">
                        <button onClick={handleSaveAdd} className="btn btn-save">Guardar</button>
                        <button onClick={handleCancelAdd} className="btn btn-cancel">Cancelar</button>
                    </div>
                </div>
            )}

            <div className="searchbar-container">
                {/* Barra de búsqueda por nombre */}
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control mb-2 mb-sm-0 me-sm-2"
                />

                {/* Barra de búsqueda por talle */}
                <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="form-select mb-2 mb-sm-0 me-sm-2"
                >
                    <option value="">Seleccionar talle</option>
                    {Array.from({ length: 11 }, (_, i) => 35 + i).map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>

                {/* Botón para filtrar */}
                <button
                    onClick={handleFilter}
                    className="btn btn-primary"
                >
                    Buscar
                </button>
            </div>
            <div className="results-container">
                {filteredResults.length > 0 ? (
                    filteredResults.map((zapatilla) => (
                        <CrudCard key={zapatilla.id} zapatilla={zapatilla} onUpdate={fetchAllSneakers} />
                    ))
                ) : (
                    <p>No se encontraron resultados.</p>
                )}
            </div>
        </div>
    );
}

export default CrudPanel;
