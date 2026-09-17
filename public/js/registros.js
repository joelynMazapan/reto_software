document.addEventListener("DOMContentLoaded", async () => {
    
    const tablaVideojuegosBody = document.getElementById("videojuegosTableBody");
    const formVideojuego = document.getElementById("formVideojuego");
    const modalVideojuego = document.getElementById("modalVideojuego");
    const mensajeVideojuego = document.getElementById("mensajeVideojuego");

    function mostrarMensaje(texto, tipo) {
        if (!mensajeVideojuego) return;
        mensajeVideojuego.style.display = "block";
        mensajeVideojuego.textContent = texto;
        mensajeVideojuego.style.color = tipo === "error" ? "#f87171" : "#4ade80";
        mensajeVideojuego.style.backgroundColor = tipo === "error" ? "rgba(248, 113, 113, 0.1)" : "rgba(74, 222, 128, 0.1)";
        mensajeVideojuego.style.padding = "8px 12px";
        mensajeVideojuego.style.borderRadius = "6px";
        mensajeVideojuego.style.border = `1px solid ${tipo === "error" ? "rgba(248, 113, 113, 0.3)" : "rgba(74, 222, 128, 0.3)"}`;
    }

    async function cargarVideojuegos() {
        if (!tablaVideojuegosBody) return;

        try {
            const res = await fetch(`${API_URL}/videojuegos`);
            if (!res.ok) throw new Error("No se pudo obtener el catálogo de videojuegos");

            const videojuegos = await res.json();
            tablaVideojuegosBody.innerHTML = "";

            if (videojuegos.length === 0) {
                tablaVideojuegosBody.innerHTML = `<tr><td colspan="3" class="empty-state" style="text-align: center; padding: 20px; color: #94a3b8;">No hay videojuegos registrados en el sistema.</td></tr>`;
                return;
            }

            videojuegos.forEach(v => {
                const fila = document.createElement("tr");
                fila.style.borderBottom = "1px solid rgba(56, 189, 248, 0.1)";
                fila.innerHTML = `
                    <td style="padding: 12px; color: #cbd5e1;">#${v.idVideojuego}</td>
                    <td style="padding: 12px; color: #fff; font-weight: 500;">${v.Nombre}</td>
                    <td style="padding: 12px; color: #38bdf8;">${v.Genero}</td>
                `;
                tablaVideojuegosBody.appendChild(fila);
            });
        } catch (error) {
            console.error("Error al cargar videojuegos:", error);
            tablaVideojuegosBody.innerHTML = `<tr><td colspan="3" class="empty-state" style="text-align: center; padding: 20px; color: #f87171;">Sin conexión al servidor</td></tr>`;
        }
    }

    cargarVideojuegos();

    if (formVideojuego) {
        formVideojuego.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nombreInput = document.getElementById("nombreVideojuego").value.trim();
            const generoInput = document.getElementById("generoVideojuego").value.trim();

            if (!nombreInput || !generoInput) {
                mostrarMensaje("Por favor, completa todos los campos.", "error");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/videojuegos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre: nombreInput, genero: generoInput })
                });

                if (res.ok) {
                    mostrarMensaje("¡Videojuego registrado con éxito!", "exito");
                    formVideojuego.reset();
                    
                    await cargarVideojuegos();

                    setTimeout(() => {
                        if (modalVideojuego) {
                            modalVideojuego.style.display = "none";
                            mensajeVideojuego.style.display = "none";
                        }
                    }, 1200);

                } else {
                    mostrarMensaje("Error: El videojuego ya existe o los datos son inválidos.", "error");
                }
            } catch (err) {
                console.error("Error de red:", err);
                mostrarMensaje("Error de conexión con el servidor.", "error");
            }
        });
    }
});