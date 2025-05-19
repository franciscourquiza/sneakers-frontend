import { useState, useEffect } from 'react';
import './DiscountsPage.css';
import Card from '../../Components/Card/Card';

const DiscountsPage = () => {
    const [filteredResults, setFilteredResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [name, setName] = useState("");

    const fetchAllDiscountedProducts = async () => {
        try {
            const response = await fetch('https://sneakers-backend-production.up.railway.app/api/Sneaker/GetAllInDiscount');
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

    useEffect(() => {
        fetchAllDiscountedProducts();
    }, []);

    const handleFilter = () => {
        if (!name.trim()) {
            setFilteredResults(allProducts);
            return;
        }

        const filteredData = allProducts.filter(producto =>
            producto.name.toLowerCase().includes(name.trim().toLowerCase())
        );

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
                        <Card
                            key={`${producto.category}-${producto.id}`}
                            producto={producto}
                        />
                    ))
                ) : (
                    <p>No se encontraron resultados.</p>
                )}
            </div>
        </div>
    );
};

export default DiscountsPage;
