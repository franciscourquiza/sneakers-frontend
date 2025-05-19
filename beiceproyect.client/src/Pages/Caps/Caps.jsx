import { useState, useEffect } from 'react';
import './Caps.css';
import Card from '../../Components/Card/Card';


const Caps = () => {
    const [filteredResults, setFilteredResults] = useState([]);
    const [allCaps, setAllCaps] = useState([]);
    const [name, setName] = useState("");


    const fetchAllCaps = async () => {
        try {
            const response = await fetch('https://sneakers-backend-production.up.railway.app/api/Cap/GetAll');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setAllCaps(data); // Set all sneakers from API
            setFilteredResults(data); // Initially set all sneakers as filtered results
        } catch (error) {
            console.error("Error fetching all sneakers:", error);
        }
    };


    const fetchCapsByName = async (name) => {
        try {
            const response = await fetch('https://sneakers-backend-production.up.railway.app/api/Cap/GetByName?name=${name}');
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            const data = await response.json();
            setFilteredResults(data);
        } catch (error) {
            console.error("Error al traer la ropa:", error);
        }
    }

    useEffect(() => {
        fetchAllCaps(); // Fetch all sneakers when the component mounts
    }, []);

    const handleFilter = () => {
        let filteredData = allCaps;

        if (name.trim()) {
            filteredData = filteredData.filter((producto) =>
                producto.name.toLowerCase().includes(name.trim().toLowerCase())
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
                    filteredResults.map((producto) => <Card key={producto.id} producto={producto} />)
                ) : (
                    <p>No se encontraron resultados.</p>
                )}
            </div>
        </div>
    )
}

export default Caps;