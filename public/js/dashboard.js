document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(`${API_URL}/estadisticas`);
        if (!response.ok) throw new Error("No se pudieron obtener las estadísticas");
        
        const stats = await response.json();

        // Asegúrate de que estos IDs existan en tu HTML del dashboard
        document.getElementById("totalJugadores").textContent = stats.total_jugadores || 0;
        document.getElementById("totalVideojuegos").textContent = stats.total_videojuegos || 0;
        document.getElementById("totalPuntuaciones").textContent = stats.total_puntuaciones || 0;
        document.getElementById("promedioPuntuacion").textContent = stats.promedio_puntuacion ? Number(stats.promedio_puntuacion).toFixed(2) : "0";
    } catch (error) {
        console.log("Esperando conexión con el servidor MySQL/Backend...", error);
    }
});