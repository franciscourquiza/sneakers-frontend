/* eslint-disable react/prop-types */
import './AdminPanel.css'
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router'

const AdminPanel = ({ setIsAuthenticated }) => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        if (storedAuth === 'true') {
            // Si ya está autenticado, redirigir a /crudpanel
            navigate("/crudpanel");
        }
    }, [navigate]);

    const emailChangeHandler = (e) => {
        emailRef.current.style.borderColor = "";
        emailRef.current.style.outline = "";
        setEmail(e.target.value);
        setEmailError(""); // Limpiar el error cuando el usuario empieza a escribir
    };

    const passwordChangeHandler = (e) => {
        passwordRef.current.style.borderColor = "";
        passwordRef.current.style.outline = "";
        setPassword(e.target.value);
        setPasswordError(""); // Limpiar el error cuando el usuario empieza a escribir
    };

    const signInClicked = async (e) => {
        e.preventDefault();

        let valid = true;

        // Validación de los campos
        if (!email) {
            setEmailError("El email es requerido.");
            emailRef.current.style.borderColor = "red";
            valid = false;
        }

        if (!password) {
            setPasswordError("La clave es requerida.");
            passwordRef.current.style.borderColor = "red";
            valid = false;
        }

        if (!valid) return;

        try {
            const response = await fetch("https://bei-ice-api.azurewebsites.net/api/Authentication/Login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Credenciales incorrectas.");
            }

            const data = await response.json();
            if (data.token) {
                localStorage.setItem("token", data.token);
                setIsAuthenticated(true);
                localStorage.setItem('isAuthenticated', 'true');
                navigate("/crudpanel");
            } else {
                setEmailError("Credenciales incorrectas.");
                setPasswordError("Credenciales incorrectas.");
            }
        } catch (error) {
            setEmailError(error.message);
            setPasswordError(error.message);
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h4>Bienvenido al Panel de Administrador</h4>
                <div className="input-container">
                    <input
                        className={`input-control ${emailError ? 'input-error' : ''}`}
                        id="email"
                        onChange={emailChangeHandler}
                        placeholder="Email"
                        type="email"
                        ref={emailRef}
                        value={email}
                    />
                    {emailError && <p className="error-message">{emailError}</p>}
                </div>
                <div className="input-container">
                    <input
                        className={`input-control ${passwordError ? 'input-error' : ''}`}
                        id="password"
                        onChange={passwordChangeHandler}
                        placeholder="Password"
                        type="password"
                        ref={passwordRef}
                        value={password}
                    />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                </div>
                <button onClick={signInClicked} className="signin-button" type="button">
                    Iniciar sesion
                </button>
                <div className="p">
                    <p>(Unicamente para personal autorizado)</p>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;
