document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("rankingTableBody");
    if (!tbody) return;

    try {
        const response = await fetch(`${API_URL}/ranking`);
        const ranking = await response.json();
        
        tbody.innerHTML = "";

        if (ranking.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No hay puntuaciones registradas.</td></tr>`;
            return;
        }

        ranking.forEach((item, index) => {
            tbody.innerHTML += `
                <tr>
                    <td><strong>#${index + 1}</strong></td>
                    <td>${item.Gamertag || item.Nombre}</td>
                    <td>${item.Videojuego}</td>
                    <td style="text-align: right; font-weight: bold;">${item.Puntuacion}</td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: gray;">Esperando conexión con el backend y MySQL...</td></tr>`;
    }
});