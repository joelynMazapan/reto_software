document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("rankingTableBody");
    const selectJugador = document.getElementById("selectJugador");
    const selectVideojuego = document.getElementById("selectVideojuego");
    const formPuntuacion = document.getElementById("formPuntuacion");
    const modalPuntuacion = document.getElementById("modalPuntuacion");
    const mensajePuntuacion = document.getElementById("mensajePuntuacion");
    const modalTitle = modalPuntuacion?.querySelector("h3");
    const btnAbrirModal = document.getElementById("btnAbrirModal");

    let editandoId = null; // Variable para saber si estamos editando

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
                tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #94a3b8;">No hay puntuaciones registradas.</td></tr>`;
                return;
            }

            ranking.forEach((item, index) => {
                const idPuntuacion = item.idPuntuacion || item.IdPuntuacion || item.id;
                const jugador = item.JUGADOR || item.Gamertag || item.GamerTag || "Jugador";
                const videojuego = item.VIDEOJUEGO || item.Videojuego || item.Nombre || "Videojuego";
                const puntuacion = item.PUNTUACIÓN ?? item.Puntuacion ?? item.puntuacion ?? 0;

                const fkJugador = item.fkJugador || item.IdJugador || "";
                const fkVideoJuego = item.fkVideoJuego || item.IdVideoJuego || "";

                tbody.innerHTML += `
                    <tr style="border-bottom: 1px solid rgba(56, 189, 248, 0.1);">
                        <td><strong>#${index + 1}</strong></td>
                        <td style="color: #fff; font-weight: 500;">${jugador}</td>
                        <td style="color: #38bdf8;">${videojuego}</td>
                        <td style="text-align: right; font-weight: bold; color: #4ade80;">${puntuacion}</td>
                        <td>
                            <div class="acciones-cell">
                                <button class="btn-editar btn-accion-editar" data-id="${idPuntuacion}" data-jugador="${fkJugador}" data-juego="${fkVideoJuego}" data-puntos="${puntuacion}">Editar</button>
                                <button class="btn-eliminar btn-accion-eliminar" data-id="${idPuntuacion}">Eliminar</button>
                            </div>
                        </td>
                    </tr>
                `;
            });

            // Asignar eventos a los botones de editar
            document.querySelectorAll(".btn-editar").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    editandoId = e.target.dataset.id;
                    const idJugador = e.target.dataset.jugador;
                    const idJuego = e.target.dataset.juego;
                    const puntos = e.target.dataset.puntos;

                    if (modalTitle) modalTitle.textContent = "Editar Puntuación";
                    if (selectJugador) selectJugador.value = idJugador;
                    if (selectVideojuego) selectVideojuego.value = idJuego;
                    document.getElementById("valorPuntuacion").value = puntos;

                    if (modalPuntuacion) modalPuntuacion.style.display = "flex";
                });
            });

            // Asignar eventos a los botones de eliminar
            document.querySelectorAll(".btn-eliminar").forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    const id = e.target.dataset.id;
                    if (confirm("¿Estás seguro de eliminar esta puntuación?")) {
                        try {
                            const res = await fetch(`${API_URL}/puntuation/${id}`, { method: "DELETE" });
                            if (res.ok) {
                                cargarRanking();
                            } else {
                                alert("No se pudo eliminar la puntuación.");
                            }
                        } catch (err) {
                            console.error("Error al eliminar:", err);
                        }
                    }
                });
            });

        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #f87171;">Sin conexión al servidor</td></tr>`;
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
                    const idVideojuego = v.idVideoJuego || v.idVideoJuego || v.id;
                    selectVideojuego.innerHTML += `<option value="${idVideojuego}">${v.Nombre}</option>`;
                });
            }
        } catch (error) {
            console.log("No se pudieron poblar los selects para las puntuaciones.");
        }
    }

    cargarRanking();
    cargarSelects();

    // Resetear modal al abrir para crear una nueva puntuación
    if (btnAbrirModal) {
        btnAbrirModal.addEventListener("click", () => {
            editandoId = null;
            if (modalTitle) modalTitle.textContent = "Registrar Nueva Puntuación";
            if (formPuntuacion) formPuntuacion.reset();
            if (mensajePuntuacion) mensajePuntuacion.style.display = "none";
            if (modalPuntuacion) modalPuntuacion.style.display = "flex";
        });
    }

    // Manejo del envío del formulario (Crear o Actualizar)
    if (formPuntuacion) {
        formPuntuacion.addEventListener("submit", async (e) => {
            e.preventDefault();
            const jugador_id = selectJugador.value;
            const videojuego_id = selectVideojuego.value;
            const puntuacionInput = document.getElementById("valorPuntuacion");
            const puntuacion = puntuacionInput.value.trim();

            if (!jugador_id || !videojuego_id || puntuacion === "") {
                mostrarMensaje("Por favor, completa todos los campos.", "error");
                return;
            }

            const valorPuntuacion = Number(puntuacion);
            if (!Number.isFinite(valorPuntuacion) || valorPuntuacion < 0 || valorPuntuacion > 1000000) {
                mostrarMensaje("La puntuación debe ser un número válido entre 0 y 1,000,000.", "error");
                puntuacionInput.focus();
                return;
            }

            const url = editandoId ? `${API_URL}/puntuation/${editandoId}` : `${API_URL}/puntuation`;
            const method = editandoId ? "PUT" : "POST";

            try {
                const res = await fetch(url, {
                    method: method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ jugador_id, videojuego_id, puntuacion })
                });

                if (res.ok) {
                    mostrarMensaje(editandoId ? "¡Puntuación actualizada correctamente!" : "¡Puntuación guardada correctamente!", "exito");
                    formPuntuacion.reset();
                    editandoId = null;

                    await cargarRanking();

                    setTimeout(() => {
                        if (modalPuntuacion) {
                            modalPuntuacion.style.display = "none";
                            mensajePuntuacion.style.display = "none";
                        }
                    }, 1200);

                } else {
                    mostrarMensaje(data.msg || data.error || "Error al procesar la solicitud.", "error");
                }
            } catch (err) {
                console.error("Error de red:", err);
                mostrarMensaje("Error de conexión con el servidor.", "error");
            }
        });
    }
});