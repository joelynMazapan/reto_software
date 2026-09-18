document.addEventListener("DOMContentLoaded", () => {
    const formJugador = document.getElementById("formJugador");

    if (formJugador) {
        formJugador.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombreInput = document.getElementById("nombreJugador");
            const gamertagInput = document.getElementById("gamertagJugador");
            const correoInput = document.getElementById("correoJugador");

            const nombre = nombreInput.value.trim();
            const gamertag = gamertagInput.value.trim();
            const correo = correoInput.value.trim();

            if (!nombre || !gamertag || !correo) {
                alert("Todos los campos son obligatorios.");
                return;
            }

            if (nombre.length < 2 || nombre.length > 50) {
                alert("El nombre debe tener entre 2 y 50 caracteres.");
                nombreInput.focus();
                return;
            }

            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
                alert("El nombre no debe contener números ni símbolos especiales.");
                nombreInput.focus();
                return;
            }

            if (gamertag.length < 3 || gamertag.length > 30) {
                alert("El Gamertag debe tener entre 3 y 30 caracteres.");
                gamertagInput.focus();
                return;
            }

            if (!/^[a-zA-Z0-9_\-]+$/.test(gamertag)) {
                alert("El Gamertag solo puede contener letras, números, guion bajo y guion medio.");
                gamertagInput.focus();
                return;
            }

            const regexCorreo = /^[^\s@]+@[^\s@]+\.com$/i;
            if (!regexCorreo.test(correo)) {
                alert("El correo debe ser válido y terminar en .com");
                correoInput.focus();
                return;
            }

            try {
                const response = await fetch(`${API_URL}/players`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: nombre, gamerTag: gamertag, email: correo })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("¡Jugador registrado con éxito en la base de datos!");
                    formJugador.reset();
                } else {
                    alert(data.msg || data.mensaje || "Error al registrar: Es posible que el Gamertag ya esté en uso.");
                }
            } catch (error) {
                console.error("Error de red al registrar jugador:", error);
                alert("No se pudo conectar con el servidor backend.");
            }
        });
    }
});