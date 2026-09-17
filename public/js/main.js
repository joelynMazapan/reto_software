// URL base del backend para toda la aplicación
const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Lógica global del botón de Cerrar Sesión
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", () => {
            // Limpiamos sesión si usaras tokens, y redirigimos al login
            window.location.href = "../index.html"; // Ajusta la ruta si es necesario
        });
    }

    // 2. Lógica global de la barra de búsqueda en el Navbar
    const inputBuscar = document.getElementById("inputBuscarJugador");
    if (inputBuscar) {
        inputBuscar.addEventListener("input", async (e) => {
            const query = e.target.value.trim();
            if (query.length === 0) return;

            try {
                // Petición real al backend usando la consulta LIKE del reto
                const response = await fetch(`${API_URL}/jugadores/buscar?q=${encodeURIComponent(query)}`);
                const resultados = await response.json();
                console.log("Coincidencias de jugadores:", resultados);
                // Aquí puedes pintar los resultados en pantalla según tu diseño HTML
            } catch (error) {
                console.error("Error buscando jugadores:", error);
            }
        });
    }
});