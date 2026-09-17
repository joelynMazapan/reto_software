// Asegúrate de que API_URL esté definido (puedes declararlo aquí o en main.js)
// const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    
    const formLogin = document.getElementById("formLogin");

    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault();

            const identificador = document.getElementById("inputUsuario").value.trim();
            const password = document.getElementById("inputPassword").value.trim();

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ identificador, password })
                });

                const data = await response.json();

                if (response.ok) {
                    window.location.href = "pages/dashboard.html";
                } else {
                    alert(data.mensaje || "Credenciales incorrectas. Verifique su correo/gamertag y contraseña.");
                }
            } catch (error) {
                console.error("Error de conexión al intentar iniciar sesión:", error);
                alert("No se pudo conectar con el servidor backend.");
            }
        });
    }

    
    const formJugador = document.getElementById("formJugador");

    if (formJugador) {
        formJugador.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombre = document.getElementById("nombreJugador").value.trim();
            const gamertag = document.getElementById("gamertagJugador").value.trim();
            const correo = document.getElementById("correoJugador").value.trim();

            try {
                const response = await fetch(`${API_URL}/jugadores`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre, gamertag, correo })
                });

                if (response.ok) {
                    alert("¡Jugador registrado con éxito en la base de datos!");
                    formJugador.reset();
                } else {
                    const errorData = await response.json();
                    alert(errorData.mensaje || "Error al registrar el jugador. Verifique que el Gamertag o correo no estén repetidos.");
                }
            } catch (error) {
                console.error("Error de red al registrar jugador:", error);
                alert("No se pudo conectar con el servidor.");
            }
        });
    }

});