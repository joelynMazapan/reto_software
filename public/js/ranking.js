document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("rankingTableBody");
    const selectJugador = document.getElementById("selectJugador");
    const selectVideojuego = document.getElementById("selectVideojuego");
    const formPuntuacion = document.getElementById("formPuntuacion");
    const modalPuntuacion = document.getElementById("modalPuntuacion");
    const mensajePuntuacion = document.getElementById("mensajePuntuacion");

    function mostrarMensaje(texto, tipo) {
        if (!mensajePuntuacion) return;
        mensajePuntuacion.style.display = "block";
        mensajePuntuacion.textContent = texto;
        mensajePuntuacion.style.color = tipo === "error" ? "#f87171" : "#4ade80";
        mensajePuntuacion.style.backgroundColor = tipo === "error" ? "rgba(248, 113, 113, 0.1)" : "rgba(74, 222, 128, 0.1)";
        mensajePuntuacion.style.padding = "8px 12px";
        mensajePuntuacion.style.borderRadius = "6px";
        mensajePuntuacion.style.border = `1px solid ${tipo === "error" ? "rgba(248, 113, 113, 0.3)" : "rgba(74, 222, 128, 0.3)"}`;
    }

    async function cargarRanking() {
        if (!tbody) return;

        try {
            const response = await fetch(`${API_URL}/ranking`);
            if (!response.ok) throw new Error("Error al obtener el ranking");
            
            const ranking = await response.json();
            tbody.innerHTML = "";

            if (ranking.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: #94a3b8;">No hay puntuaciones registradas.</td></tr>`;
                return;
            }

            ranking.forEach((item, index) => {
                tbody.innerHTML += `
                    <tr style="border-bottom: 1px solid rgba(56, 189, 248, 0.1);">
                        <td style="padding: 12px;"><strong>#${index + 1}</strong></td>
                        <td style="padding: 12px; color: #fff; font-weight: 500;">${item.Gamertag || item.Nombre}</td>
                        <td style="padding: 12px; color: #38bdf8;">${item.Videojuego}</td>
                        <td style="padding: 12px; text-align: right; font-weight: bold; color: #4ade80;">${item.Puntuacion}</td>
                    </tr>
                `;
            });
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: #f87171;">Sin conexión al servidor</td></tr>`;
        }
    }

    async function cargarSelects() {
        try {
            const [resJ, resV] = await Promise.all([
                fetch(`${API_URL}/jugadores`),
                fetch(`${API_URL}/videojuegos`)
            ]);

            const jugadores = await resJ.json();
            const videojuegos = await resV.json();

            if (selectJugador) {
                selectJugador.innerHTML = `<option value="" disabled selected>Seleccione un jugador...</option>`;
                jugadores.forEach(j => {
                    selectJugador.innerHTML += `<option value="${j.idJugador}">${j.Gamertag} (${j.Nombre})</option>`;
                });
            }

            if (selectVideojuego) {
                selectVideojuego.innerHTML = `<option value="" disabled selected>Seleccione un videojuego...</option>`;
                videojuegos.forEach(v => {
                    selectVideojuego.innerHTML += `<option value="${v.idVideojuego}">${v.Nombre}</option>`;
                });
            }
        } catch (error) {
            console.log("No se pudieron poblar los selects para las puntuaciones.");
        }
    }

    cargarRanking();
    cargarSelects();

    if (formPuntuacion) {
        formPuntuacion.addEventListener("submit", async (e) => {
            e.preventDefault();
            const jugador_id = document.getElementById("selectJugador").value;
            const videojuego_id = document.getElementById("selectVideojuego").value;
            const puntuacion = document.getElementById("valorPuntuacion").value;

            if (!jugador_id || !videojuego_id || puntuacion === "") {
                mostrarMensaje("Por favor, completa todos los campos.", "error");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/puntuaciones`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ jugador_id, videojuego_id, puntuacion })
                });

                if (res.ok) {
                    mostrarMensaje("¡Puntuación guardada correctamente!", "exito");
                    formPuntuacion.reset();
                    
                    await cargarRanking();

                    setTimeout(() => {
                        if (modalPuntuacion) {
                            modalPuntuacion.style.display = "none";
                            mensajePuntuacion.style.display = "none";
                        }
                    }, 1200);

                } else {
                    mostrarMensaje("Error: La puntuación no puede ser negativa y los datos deben existir.", "error");
                }
            } catch (err) {
                console.error("Error de red:", err);
                mostrarMensaje("Error de conexión con el servidor.", "error");
            }
        });
    }
});