import { useState, useEffect } from 'react';
import './Home.css';
import Card from '../../Components/Card/Card';

const Home = () => {
    const [filteredResults, setFilteredResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [name, setName] = useState("");
    const [size, setSize] = useState("");

    const fetchAllProducts = async () => {
        try {
            const response = await fetch('https://sneakers-backend-production.up.railway.app/api/Sneaker/GetAllNoDiscount');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setAllProducts(data);
            setFilteredResults(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const handleFilter = () => {
        let filteredData = allProducts;

        if (name.trim()) {
            filteredData = filteredData.filter((producto) =>
                producto.name.toLowerCase().includes(name.trim().toLowerCase())
            );
        }

        if (size) {
            filteredData = filteredData.filter((producto) =>
                producto.sizes && producto.sizes.some((s) => s.size === parseInt(size))
            );
        }

        setFilteredResults(filteredData);
    };

    return (
        <div className="wraper">
            <div className="searchbar-container">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control mb-2 mb-sm-0 me-sm-2"
                />

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

                <button
                    onClick={handleFilter}
                    className="btn btn-primary"
                >
                    Buscar
                </button>
            </div>

            <div className="results-container">
                {filteredResults.length > 0 ? (
                    filteredResults.map((producto) => (
                        <Card key={producto.id} producto={producto} />
                    ))
                ) : (
                    <p>No se encontraron resultados.</p>
                )}
            </div>
        </div>
    );
};

export default Home;