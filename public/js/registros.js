document.addEventListener("DOMContentLoaded", async () => {
    const tablaVideojuegosBody = document.getElementById("videojuegosTableBody");
    const formVideojuego = document.getElementById("formVideojuego");
    const modalVideojuego = document.getElementById("modalVideojuego");
    const mensajeVideojuego = document.getElementById("mensajeVideojuego");
    const modalTituloVideojuego = document.getElementById("modalTituloVideojuego");
    const btnSubmitVideojuego = document.getElementById("btnSubmitVideojuego");
    const idVideojuegoEditando = document.getElementById("idVideojuegoEditando");

    function mostrarMensaje(texto, tipo) {
        if (!mensajeVideojuego) return;
        mensajeVideojuego.style.display = "block";
        mensajeVideojuego.textContent = texto;
        mensajeVideojuego.className = `form-message ${tipo}`;
    }

    async function cargarVideojuegos() {
        if (!tablaVideojuegosBody) return;

        try {
            const endpoint = typeof API_URL !== "undefined" ? `${API_URL}/games` : "http://localhost:3000/api/games";
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error("No se pudo obtener el catálogo de videojuegos");

            const videojuegos = await res.json();
            tablaVideojuegosBody.innerHTML = "";

            if (!videojuegos || videojuegos.length === 0) {
                tablaVideojuegosBody.innerHTML = `<tr><td colspan="4" class="empty-state" style="text-align: center; padding: 20px; color: #94a3b8;">No hay videojuegos registrados en el sistema.</td></tr>`;
                return;
            }

            videojuegos.forEach(v => {
                const fila = document.createElement("tr");
                const idJuego = v.idVideoJuego || v.idVideojuego || v.id;
                
                fila.style.borderBottom = "1px solid rgba(56, 189, 248, 0.1)";
                fila.innerHTML = `
                    <td style="padding: 12px; color: #cbd5e1;">#${v.idVideojuego}</td>
                    <td style="padding: 12px; color: #fff; font-weight: 500;">${v.Nombre}</td>
                    <td style="padding: 12px; color: #38bdf8;">${v.Genero}</td>
                    <td style="padding: 12px; text-align: center;">
                        <button class="btn-editar-juego" data-id="${idJuego}" data-nombre="${v.Nombre}" data-genero="${v.Genero}">Editar</button>
                        <button class="btn-eliminar-juego" data-id="${idJuego}">Eliminar</button>
                    </td>
                `;
                tablaVideojuegosBody.appendChild(fila);
            });

            // Eventos para el botón Editar
            document.querySelectorAll(".btn-editar-juego").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const id = e.target.getAttribute("data-id");
                    const nombre = e.target.getAttribute("data-nombre");
                    const genero = e.target.getAttribute("data-genero");

                    idVideojuegoEditando.value = id;
                    document.getElementById("nombreVideojuego").value = nombre;
                    document.getElementById("generoVideojuego").value = genero;

                    modalTituloVideojuego.textContent = "Editar Videojuego";
                    btnSubmitVideojuego.textContent = "Actualizar Videojuego";
                    if (mensajeVideojuego) mensajeVideojuego.style.display = "none";

                    modalVideojuego.style.display = "flex";
                });
            });

            // Eventos para el botón Eliminar
            document.querySelectorAll(".btn-eliminar-juego").forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    const id = e.target.getAttribute("data-id");

                    if (confirm("¿Estás seguro de que deseas eliminar este videojuego?")) {
                        try {
                            const deleteEndpoint = typeof API_URL !== "undefined" ? `${API_URL}/games/${id}` : `http://localhost:3000/api/games/${id}`;
                            const res = await fetch(deleteEndpoint, {
                                method: "DELETE"
                            });

                            const data = await res.json().catch(() => ({}));

                            if (res.ok) {
                                await cargarVideojuegos();
                            } else {
                                alert(data.error || data.msg || "No se pudo eliminar el videojuego.");
                            }
                        } catch (err) {
                            console.error("Error de red:", err);
                            alert("Error de conexión con el servidor.");
                        }
                    }
                });
            });

        } catch (error) {
            console.error("Error al cargar videojuegos:", error);
            tablaVideojuegosBody.innerHTML = `<tr><td colspan="4" class="empty-state" style="text-align: center; padding: 20px; color: #94a3b8;">Sin conexión al servidor</td></tr>`;
        }
    }

    cargarVideojuegos();

    if (formVideojuego) {
        formVideojuego.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nombreInputEl = document.getElementById("nombreVideojuego");
            const generoInputEl = document.getElementById("generoVideojuego");
            const nombreInput = nombreInputEl.value.trim();
            const generoInput = generoInputEl.value.trim();
            const idEditando = idVideojuegoEditando.value;

            if (!nombreInput || !generoInput) {
                mostrarMensaje("Por favor, completa todos los campos.", "error");
                return;
            }

            const esEdicion = Boolean(idEditando);
            const baseApi = typeof API_URL !== "undefined" ? API_URL : "http://localhost:3000/api";
            const urlEndpoint = esEdicion ? `${baseApi}/games/${idEditando}` : `${baseApi}/games`;
            const metodoHTTP = esEdicion ? "PUT" : "POST";

            try {
                const res = await fetch(urlEndpoint, {
                    method: metodoHTTP,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre: nombreInput, genero: generoInput })
                });

                if (res.ok) {
                    mostrarMensaje(esEdicion ? "¡Videojuego actualizado con éxito!" : "¡Videojuego registrado con éxito!", "exito");
                    formVideojuego.reset();
                    idVideojuegoEditando.value = "";
                    
                    await cargarVideojuegos();

                    setTimeout(() => {
                        if (modalVideojuego) {
                            modalVideojuego.style.display = "none";
                            mensajeVideojuego.style.display = "none";
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