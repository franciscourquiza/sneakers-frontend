/* eslint-disable react/prop-types */
import './CrudPanel.css';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import CrudCard from '../../Components/CrudCard/CrudCard';

const CrudPanel = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [isAdding, setIsAdding] = useState(false);
    const [addCategory, setAddCategory] = useState(''); // 'sneaker' | 'clothe' | 'cap'

    const [newSneaker, setNewSneaker] = useState({
        name: '',
        price: '',
        sizes: '',
        size: '', // para clothe
        imageUrl: '',
        isInDiscount: false,  // para sneaker y clothe
    });

    const signOutClicked = () => {
        localStorage.removeItem("token");
        localStorage.setItem('isAuthenticated', 'false');
        setIsAuthenticated(false);
        navigate("/home");
    };

    const [filteredResults, setFilteredResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [name, setName] = useState("");
    const [size, setSize] = useState("");

    const fetchAllProducts = async () => {
        try {
            const response = await fetch('https://sneakers-backend-production.up.railway.app/api/Sneaker/GetAllTheProducts');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Agregar la propiedad category a cada tipo de producto
            const sneakers = data.sneakers.map(p => ({ ...p, category: 'sneaker' }));
            const clothes = data.clothes.map(p => ({ ...p, category: 'clothe' }));
            const caps = data.caps.map(p => ({ ...p, category: 'cap' }));

            const all = [...sneakers, ...clothes, ...caps];

            setAllProducts(all);
            setFilteredResults(all);
        } catch (error) {
            console.error("Error fetching discounted products:", error);
        }
    };

    const fetchSneakersByName = async (name) => {
        try {
            const response = await fetch(`https://sneakers-backend-production.up.railway.app/api/Sneaker/GetByName?name=${name}`);
            if (!response.ok) {
                throw new Error("HTTP Error! Status: ${response.status}");
            }
            const data = await response.json();
            setFilteredResults(data);
        } catch (error) {
            console.error("Error al traer las zapatillas:", error);
        }
    };

    const fetchSneakersBySize = async (size) => {
        try {
            const response = await fetch(`https://sneakers-backend-production.up.railway.app/api/Sneaker/GetBySize?size=${size}`);
            if (!response.ok) {
                throw new Error("HTTP Error! Status: ${response.status}");
            }
            const data = await response.json();
            setFilteredResults(data);
        } catch (error) {
            console.error("Error al traer las zapatillas:", error);
        }
    };

    useEffect(() => {
        fetchAllProducts(); // Fetch all products when the component mounts
    }, []);

    const handleAddProduct = (category) => {
        setAddCategory(category);
        setIsAdding(true);
        // Limpiar formulario al cambiar categoría
        setNewSneaker({
            name: '',
            price: '',
            sizes: '',
            size: '',
            imageUrl: '',
            isInDiscount: false,
        });
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setNewSneaker({
            name: '',
            price: '',
            sizes: '',
            size: '',
            imageUrl: '',
            isInDiscount: false,
        });
    };

    const handleInputChange = (e) => {
        setNewSneaker({
            ...newSneaker,
            [e.target.name]: e.target.value
        });
    };

    const handleCheckboxChange = (e) => {
        setNewSneaker({
            ...newSneaker,
            isInDiscount: e.target.checked
        });
    };

    const handleFilter = () => {
        let filteredData = allProducts;

        if (name.trim()) {
            filteredData = filteredData.filter((producto) =>
                producto.name.toLowerCase().includes(name.trim().toLowerCase())
            );
        }

        if (size) {
            filteredData = filteredData.filter((producto) => {
                if (producto.category === 'sneaker' && Array.isArray(producto.sizes)) {
                    return producto.sizes.some((s) => s.size === parseInt(size));
                }
                return false; // No mostrar otros productos si estás filtrando por talle
            });
        }


        setFilteredResults(filteredData); // Update filtered results based on name and size
    };

    const handleSaveAdd = async () => {
        try {
            const body = {
                name: newSneaker.name,
                price: parseFloat(newSneaker.price),
                imageUrl: newSneaker.imageUrl,
            };

            if (addCategory === 'sneaker') {
                body.sizes = newSneaker.sizes.split(',').map(size => parseInt(size.trim()));
                body.isInDiscount = newSneaker.isInDiscount;
            } else if (addCategory === 'clothe') {
                body.size = newSneaker.size;  // talla como string
                body.isInDiscount = newSneaker.isInDiscount;
            }
            // cap no tiene talle ni descuento

            const endpointMap = {
                sneaker: 'Sneaker',
                clothe: 'Clothe',
                cap: 'Cap',
            };

            console.log(body);
            const response = await fetch(`https://sneakers-backend-production.up.railway.app/api/${endpointMap[addCategory]}/Create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Error al agregar el producto');
            }

            alert(`${addCategory} agregado correctamente`);
            setIsAdding(false);
            fetchAllProducts();
        } catch (error) {
            console.error(`Error agregando ${addCategory}:`, error);
            alert('Hubo un error al agregar el producto');
        }
    };

    return (
        <div className="wraper">
            <h3>Panel de Alta-Baja-Modificacion de Productos</h3>
            <div className="logout-button">
                <button className="button" onClick={signOutClicked}>Cerrar Sesion</button>
            </div>

            <div className="add-buttons">
                <button onClick={() => handleAddProduct('sneaker')} className="btn btn-add">Agregar Sneaker +</button>
                <button onClick={() => handleAddProduct('clothe')} className="btn btn-add">Agregar Prenda +</button>
                <button onClick={() => handleAddProduct('cap')} className="btn btn-add">Agregar Gorra +</button>
            </div>

            {isAdding && (
                <div className="add-form">
                    <h4>Agregar nueva {addCategory === 'sneaker' ? 'Sneaker' : addCategory === 'clothe' ? 'Prenda' : 'Gorra'}</h4>

                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre del producto"
                        value={newSneaker.name}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Precio (Ej: 100.000)"
                        value={newSneaker.price}
                        onChange={handleInputChange}
                        className="form-input"
                    />

                    {/* Talles segun categoria */}
                    {addCategory === 'sneaker' && (
                        <input
                            type="text"
                            name="sizes"
                            placeholder="Talles en EUR (Ej: 40, 41, 42)"
                            value={newSneaker.sizes}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                    )}

                    {addCategory === 'clothe' && (
                        <input
                            type="text"
                            name="size"
                            placeholder="Talle (Ej: S, M, L)"
                            value={newSneaker.size}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                    )}

                    <input
                        type="url"
                        name="imageUrl"
                        placeholder="URL de la imagen (Ej: 400px X 400px)"
                        value={newSneaker.imageUrl}
                        onChange={handleInputChange}
                        className="form-input"
                    />

                    {/* Checkbox */}
                    {(addCategory === 'sneaker' || addCategory === 'clothe' || addCategory === 'cap') && (
                        <div className="form-input">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isInDiscount"
                                    checked={newSneaker.isInDiscount}
                                    onChange={handleCheckboxChange}
                                />
                                Producto en Liquidacion
                            </label>
                        </div>
                    )}

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
                            {t} EUR
                        </option>
                    ))}
                </select>

                <button onClick={handleFilter} className="btn btn-primary">Buscar</button>
            </div>

            <div className="results-container">
                {filteredResults.length > 0 ? (
                    filteredResults.map((producto) => (
                        <CrudCard
                            key={`${producto.id}-${producto.category}`}
                            producto={producto}
                            onUpdate={fetchAllProducts}
                        />
                    ))
                ) : (
                    <p>No se encontraron productos.</p>
                )}
            </div>
        </div>
    );
};

export default CrudPanel;

