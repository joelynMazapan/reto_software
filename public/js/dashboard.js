document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(`${API_URL}/statistics`);
        if (!response.ok) throw new Error("No se pudieron obtener las estadísticas");

        const stats = await response.json();
        const totalJugadores = stats.total_jugadores ?? 0;
        const totalVideojuegos = stats.total_videojuegos ?? 0;
        const totalPuntuaciones = stats.total_puntuaciones ?? 0;
        const promedio = stats.promedio_puntuacion ?? stats.puntuacion_promedio ?? 0;

        document.getElementById("totalJugadores").textContent = totalJugadores;
        document.getElementById("totalVideojuegos").textContent = totalVideojuegos;
        document.getElementById("totalPuntuaciones").textContent = totalPuntuaciones;
        document.getElementById("promedioPuntuacion").textContent = Number(promedio).toFixed(2);
    } catch (error) {
        console.log("Esperando conexión con el servidor MySQL/Backend...", error);
    }
});