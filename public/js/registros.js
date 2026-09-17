document.addEventListener("DOMContentLoaded", async () => {
    // 1. Cargar datos en los select al abrir la vista de registros
    try {
        const [resJ, resV] = await Promise.all([
            fetch(`${API_URL}/jugadores`),
            fetch(`${API_URL}/videojuegos`)
        ]);

        const jugadores = await resJ.json();
        const videojuegos = await resV.json();

        const selectJugador = document.getElementById("selectJugador");
        const selectVideojuego = document.getElementById("selectVideojuego");

        if (selectJugador) {
            jugadores.forEach(j => {
                selectJugador.innerHTML += `<option value="${j.idJugador}">${j.Gamertag} (${j.Nombre})</option>`;
            });
        }

        if (selectVideojuego) {
            videojuegos.forEach(v => {
                selectVideojuego.innerHTML += `<option value="${v.idVideojuego}">${v.Nombre}</option>`;
            });
        }
    } catch (error) {
        console.log("Servidor backend no disponible para poblar selects todavía.");
    }

    // 2. Manejar envío del formulario de Videojuegos
    const formVideojuego = document.getElementById("formVideojuego");
    if (formVideojuego) {
        formVideojuego.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nombre = document.getElementById("nombreVideojuego").value;
            const genero = document.getElementById("generoVideojuego").value;

            try {
                const res = await fetch(`${API_URL}/videojuegos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre, genero })
                });

                if (res.ok) {
                    alert("Videojuego registrado con éxito");
                    formVideojuego.reset();
                } else {
                    alert("Error: Verifique que el videojuego no esté duplicado.");
                }
            } catch (err) {
                console.error("Error de red:", err);
            }
        });
    }

    // 3. Manejar envío del formulario de Puntuaciones
    const formPuntuacion = document.getElementById("formPuntuacion");
    if (formPuntuacion) {
        formPuntuacion.addEventListener("submit", async (e) => {
            e.preventDefault();
            const jugador_id = document.getElementById("selectJugador").value;
            const videojuego_id = document.getElementById("selectVideojuego").value;
            const puntuacion = document.getElementById("valorPuntuacion").value;

            try {
                const res = await fetch(`${API_URL}/puntuaciones`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ jugador_id, videojuego_id, puntuacion })
                });

                if (res.ok) {
                    alert("Puntuación guardada correctamente");
                    formPuntuacion.reset();
                } else {
                    alert("Error: La puntuación no puede ser negativa y los datos deben existir.");
                }
            } catch (err) {
                console.error("Error de red:", err);
            }
        });
    }
});