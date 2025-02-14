import { useNavigate } from "react-router";
import "./PageNotFound.css"

const PageNotFound = () => {
    const navigate = useNavigate();

    const backToHomePageHandler = () => {
        navigate("/home");
    }

    return (
        <div className="container404">
            <h2>La pagina solicitada no fue encontrada</h2>
            <button onClick={backToHomePageHandler}>Volver a la pagina principal</button>
        </div>
    )
}

export default PageNotFound;