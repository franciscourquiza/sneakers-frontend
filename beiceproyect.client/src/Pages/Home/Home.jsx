import { useState, useEffect } from 'react';
import './Home.css';
import Card from '../../Components/Card/Card';


const Home = () => {
    const [filteredResults, setFilteredResults] = useState([]);
    const [allSneakers, setAllSneakers] = useState([]);
    const [name, setName] = useState("");
    const [size, setSize] = useState("");

 
    const fetchAllSneakers = async () => {
        try {
            const response = await fetch('https://bei-ice-api.azurewebsites.net/api/Sneaker/GetAllNoDiscount');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setAllSneakers(data); // Set all sneakers from API
            setFilteredResults(data); // Initially set all sneakers as filtered results
        } catch (error) {
            console.error("Error fetching all sneakers:", error);
        }
    };
  

    const fetchSneakersByName = async (name) => {
        try {
            const response = await fetch('https://bei-ice-api.azurewebsites.net/api/Sneaker/GetByName?name=${name}');
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
            const response = await fetch('https://bei-ice-api.azurewebsites.net/api/Sneaker/GetBySize?size=${size}');
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

    return (
        <div className="wraper">
            {/*<h1 id="tableLabel">Weather forecast</h1>*/}
            {/*<p>This component demonstrates fetching data from the server.</p>*/}
            {/*{contents}*/}
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
                    filteredResults.map((zapatilla) => <Card key={zapatilla.id} zapatilla={zapatilla} />)
                ) : (
                    <p>No se encontraron resultados.</p>
                )}
            </div>
        </div>
    )
}

export default Home;