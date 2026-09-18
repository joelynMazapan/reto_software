// URL base del backend para toda la aplicación
const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Lógica global del botón de Cerrar Sesión
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", () => {
            window.location.href = "../index.html";
        });
    }

    // 2. Lógica global de la barra de búsqueda en el Navbar
    const inputBuscar = document.getElementById("inputBuscarJugador");
    const dropdown = document.getElementById("searchResultsDropdown");

    if (inputBuscar && dropdown) {
        const closeModal = () => {
            dropdown.style.display = "none";
            dropdown.innerHTML = "";
        };

        const renderResultados = (resultados) => {
            const content = !resultados || resultados.length === 0
                ? `
                    <div class="search-dropdown-header">
                        <h3>Resultados</h3>
                        <button type="button" class="search-dropdown-close" aria-label="Cerrar">×</button>
                    </div>
                    <div style="padding: 10px 0; color: #94a3b8; font-size: 0.8rem;">No se encontraron coincidencias similares.</div>
                `
                : `
                    <div class="search-dropdown-header">
                        <h3>Jugadores similares</h3>
                        <button type="button" class="search-dropdown-close" aria-label="Cerrar">×</button>
                    </div>
                    ${resultados.map((jugador) => {
                        const nombre = jugador.Nombre || "Jugador";
                        const gamerTag = jugador.Gamertag || "";
                        const texto = gamerTag ? `${gamerTag} <strong>•</strong> ${nombre}` : nombre;

                        return `
                            <button type="button" class="search-result-item" data-id="${jugador.idUsuario}">
                                ${texto}
                            </button>
                        `;
                    }).join("")}
                `;

            dropdown.innerHTML = `<div class="search-dropdown-panel">${content}</div>`;
            dropdown.style.display = "flex";

            const closeBtn = dropdown.querySelector(".search-dropdown-close");
            if (closeBtn) closeBtn.addEventListener("click", closeModal);

            dropdown.querySelectorAll(".search-result-item").forEach((item) => {
                item.addEventListener("click", () => {
                    inputBuscar.value = item.textContent.replace(/\s*•\s*/g, " ").trim();
                    closeModal();
                });
            });
        };

        const buscarJugadores = async () => {
            const query = inputBuscar.value.trim();
            if (!query || query.length < 2) {
                closeModal();
                return;
            }

            try {
                const response = await fetch(`${API_URL}/players/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) throw new Error("No se pudo buscar");

                const resultados = await response.json();
                renderResultados(resultados);
            } catch (error) {
                dropdown.innerHTML = `
                    <div class="search-dropdown-panel">
                        <div class="search-dropdown-header">
                            <h3>Resultados</h3>
                            <button type="button" class="search-dropdown-close" aria-label="Cerrar">×</button>
                        </div>
                        <div style="padding: 10px 0; color: #f87171; font-size: 0.8rem;">Error al buscar jugadores.</div>
                    </div>
                `;
                dropdown.style.display = "flex";
                dropdown.querySelector(".search-dropdown-close").addEventListener("click", closeModal);
            }
        };

        inputBuscar.addEventListener("input", buscarJugadores);

        dropdown.addEventListener("click", (event) => {
            if (event.target === dropdown) {
                closeModal();
            }
        });
    }
});