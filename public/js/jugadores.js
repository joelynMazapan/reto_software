document.addEventListener("DOMContentLoaded", () => {
    const formJugador = document.getElementById("formJugador");

    if (formJugador) {
        formJugador.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombre = document.getElementById("nombreJugador").value.trim();
            const gamertag = document.getElementById("gamertagJugador").value.trim();
            const correo = document.getElementById("correoJugador").value.trim();

            const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            if (!regexNombre.test(nombre)) {
                alert("Error: El nombre completo no debe contener números ni símbolos especiales.");
                return;
            }
            const regexCorreo = /^[^\s@]+@[^\s@]+\.com$/i;
            if (!regexCorreo.test(correo)) {
                alert("Error: El correo electrónico debe ser válido, contener '@' y terminar en '.com'.");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/jugadores`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre, gamertag, correo })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("¡Jugador registrado con éxito en la base de datos!");
                    formJugador.reset();
                } else {
                    alert(data.mensaje || "Error al registrar: Es posible que el Gamertag ya esté en uso.");
                }
            } catch (error) {
                console.error("Error de red al registrar jugador:", error);
                alert("No se pudo conectar con el servidor backend.");
            }
        });
    }
});