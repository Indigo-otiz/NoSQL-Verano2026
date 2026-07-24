//const API_URL = "http://localhost:3000";
const API_URL = "https://api-netflix-one.vercel.app";

//Películas
// Obtener películas
async function obtenerPeliculas() {

    const respuesta = await fetch(`${API_URL}/peliculas`);

    if (!respuesta.ok) {
        throw new Error("Error al consultar las películas");
    }

    return await respuesta.json();

}

// Agregar película
async function agregarPelicula(pelicula) {

    const respuesta = await fetch(`${API_URL}/peliculas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pelicula)
    });

    if (!respuesta.ok) {
        throw new Error("Error al guardar la película");
    }

    return await respuesta.json();

}

// Actualizar película
async function actualizarPelicula(id, pelicula) {
    const respuesta = await fetch(`${API_URL}/peliculas/${id}`, {
        method: "PUT", // Recuerda que en REST, PUT es para actualizar
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pelicula)
    });
    if (!respuesta.ok) throw new Error("Error al actualizar la película");
    return await respuesta.json();
}

// Eliminar película
async function eliminarPelicula(id) {
    const respuesta = await fetch(`${API_URL}/peliculas/${id}`, {
        method: "DELETE" // Método REST para borrar
    });
    if (!respuesta.ok) throw new Error("Error al eliminar la película");
    return await respuesta.json();
}


//Series
//Obtener series
async function obtenerSeries() {
    const respuesta = await fetch(`${API_URL}/series`);
    if (!respuesta.ok) throw new Error("Error al consultar las series");
    return await respuesta.json();
}

// Agregar serie
async function agregarSerie(serie) {
    const respuesta = await fetch(`${API_URL}/series`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serie)
    });
    if (!respuesta.ok) throw new Error("Error al guardar la serie");
    return await respuesta.json();
}

// Actualizar serie
async function actualizarSerie(id, serie) {
    const respuesta = await fetch(`${API_URL}/series/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serie)
    });
    if (!respuesta.ok) throw new Error("Error al actualizar la serie");
    return await respuesta.json();
}

// Eliminar serie
async function eliminarSerie(id) {
    const respuesta = await fetch(`${API_URL}/series/${id}`, {
        method: "DELETE"
    });
    if (!respuesta.ok) throw new Error("Error al eliminar la serie");
    return await respuesta.json();
}