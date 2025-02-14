import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SizesTable from '../src/Pages/SizesTable/SizesTable';
import AdminPanel from '../src/Pages/AdminPanel/AdminPanel';
import SneakerDetail from '../src/Pages/SneakerDetail/SneakerDetail';
import PageNotFound from '../src/Pages/PageNotFound/PageNotFound';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Banner from './Components/Banner/Banner';
import Home from "./Pages/Home/Home";
import CrudPanel from "./Pages/CrudPanel/CrudPanel";
import Protected from "./Components/Protected/Protected";
import { useState } from "react";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Verifica si ya está autenticado en el localStorage (o sessionStorage)
        const storedAuth = localStorage.getItem('isAuthenticated');
        return storedAuth === 'true'; // Devuelve true o false
    });
    


    return (
        <Router>
            <Navbar></Navbar>
            <Banner></Banner>
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/sneaker/:id" element={<SneakerDetail />} />
                <Route path="/sizestable" element={<SizesTable />} />
                <Route path="/adminpanel" element={<AdminPanel setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/crudpanel" element=
                    {<Protected isAuthenticated={isAuthenticated}>
                        <CrudPanel setIsAuthenticated={setIsAuthenticated} />
                    </Protected>}
                />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            <Footer></Footer>
        </Router>
    );
    
    
}

export default App;