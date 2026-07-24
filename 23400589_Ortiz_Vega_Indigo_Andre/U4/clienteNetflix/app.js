// Variable de estado para saber qué estamos gestionando
let modoActual = "peliculas"; 

// Referencias a elementos del DOM
const btnVerPeliculas = document.getElementById("btnVerPeliculas");
const btnVerSeries = document.getElementById("btnVerSeries");
const tituloFormulario = document.getElementById("tituloFormulario");
const grupoPelicula = document.getElementById("grupoPelicula");
const grupoSerie = document.getElementById("grupoSerie");
const formulario = document.getElementById("formulario");

const idElemento = document.getElementById("idElemento");
const titulo = document.getElementById("titulo");
const genero = document.getElementById("genero");
const año = document.getElementById("año");
const duracion = document.getElementById("duracion");
const temporadas = document.getElementById("temporadas");
const episodios = document.getElementById("episodios");
const idioma = document.getElementById("idioma");
const calificacion = document.getElementById("calificacion");
const portada = document.getElementById("portada");
const nc = document.getElementById("nc");

const btnConsultar = document.getElementById("btnConsultar");
const btnEliminar = document.getElementById("btnEliminar");
const btnLimpiar = document.getElementById("btnLimpiar");
const listaCatalogo = document.getElementById("listaCatalogo");

// --- LOGICA DE ALTERNANCIA (TOGGLE) ---
btnVerPeliculas.addEventListener("click", () => {
    btnEliminar.style.display = "none";
    modoActual = "peliculas";
    btnVerPeliculas.classList.add("activo");
    btnVerSeries.classList.remove("activo");
    
    tituloFormulario.textContent = "Registrar Película";
    grupoPelicula.style.display = "block";
    grupoSerie.style.display = "none";
    
    formulario.reset();
    listaCatalogo.innerHTML = ""; // Limpiamos la lista al cambiar
});

btnVerSeries.addEventListener("click", () => {
    btnEliminar.style.display = "none";
    modoActual = "series";
    btnVerSeries.classList.add("activo");
    btnVerPeliculas.classList.remove("activo");
    
    tituloFormulario.textContent = "Registrar Serie";
    grupoPelicula.style.display = "none";
    grupoSerie.style.display = "block";
    
    formulario.reset();
    listaCatalogo.innerHTML = ""; 
});


// --- LÓGICA DE CONSULTA Y RENDERIZADO ---
btnConsultar.addEventListener("click", async () => {
    try {
        let datos = [];
        if (modoActual === "peliculas") {
            datos = await obtenerPeliculas();
        } else {
            datos = await obtenerSeries();
        }

        listaCatalogo.innerHTML = "";

        datos.forEach((item) => {
            const li = document.createElement("li");
            const urlPortada = item.portada || 'https://via.placeholder.com/150x225?text=Sin+Portada';
            
            // Evaluamos si mostramos duración o temporadas/episodios
            const infoEspecifica = modoActual === "peliculas" 
                ? `⏱️ ${item.duracion} min | 🌐 ${item.idioma}`
                : `📺 ${item.temporadas} Temp | 🎬 ${item.episodios} Eps`;

            li.innerHTML = `
                <img src="${urlPortada}" alt="${item.titulo}" class="img-portada">
                <div class="info-item">
                    <h3 class="titulo-item">${item.titulo}</h3>
                    <p class="meta-item">${item.genero} • ${item.año}</p>
                    <p class="meta-item">${infoEspecifica}</p>
                    <p class="calificacion-item">⭐ ${item.calificacion} / 10</p>
                </div>
            `;

            // EVENTO CLICK: Al dar clic en la tarjeta, los datos pasan al formulario
            li.addEventListener("click", () => {
                // Guardamos el ID por si en el futuro programas el método PUT para actualizar
                idElemento.value = item._id ? (item._id.$oid || item._id) : ""; 
                
                titulo.value = item.titulo;
                genero.value = item.genero;
                año.value = item.año;
                idioma.value = item.idioma;
                calificacion.value = item.calificacion;
                portada.value = item.portada || "https://via.placeholder.com/150x225?text=Sin+Portada";
                nc.value = item.nc;

                if (modoActual === "peliculas") {
                    duracion.value = item.duracion;
                } else {
                    temporadas.value = item.temporadas;
                    episodios.value = item.episodios;
                }
                
                btnEliminar.style.display = "block";
                // Opcional: Hacer scroll hacia arriba para que el usuario vea el formulario lleno
                window.scrollTo({ top: 0, behavior: 'smooth' });
                tituloFormulario.textContent = modoActual === "peliculas" ? "Editar Película" : "Editar Serie";
            });

            listaCatalogo.appendChild(li);
        });
    } catch (error) {
        alert(error.message);
    }
});


// --- LÓGICA DE GUARDADO ---
formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    btnEliminar.style.display = "none";
    // Construimos el objeto dinámicamente según el modo
    const nuevoElemento = {
        titulo: titulo.value,
        genero: genero.value,
        año: Number(año.value),
        idioma: idioma.value,
        calificacion: Number(calificacion.value),
        portada: portada.value,
        nc: nc.value
    };

    if (modoActual === "peliculas") {
        nuevoElemento.duracion = Number(duracion.value);
    } else {
        nuevoElemento.temporadas = Number(temporadas.value);
        nuevoElemento.episodios = Number(episodios.value);
    }

    try {
        let respuesta;
        const idActual = idElemento.value; // Leemos el ID oculto

        // VERIFICAMOS SI VAMOS A CREAR O A EDITAR
        if (idActual) {
            // MODO EDICIÓN (Ya existe un ID)
            if (modoActual === "peliculas") {
                respuesta = await actualizarPelicula(idActual, nuevoElemento);
            } else {
                respuesta = await actualizarSerie(idActual, nuevoElemento);
            }
            alert(respuesta.mensaje || "Actualizado exitosamente");
        } else {
            // MODO CREACIÓN (El ID está vacío)
            if (modoActual === "peliculas") {
                respuesta = await agregarPelicula(nuevoElemento);
            } else {
                respuesta = await agregarSerie(nuevoElemento);
            }
            alert(respuesta.mensaje || "Guardado exitosamente");
        }

        // Limpiamos el formulario y recargamos el catálogo
        formulario.reset();
        idElemento.value = ""; // Vaciamos el ID para futuras creaciones
        
        // Regresamos el título del formulario a la normalidad
        tituloFormulario.textContent = modoActual === "peliculas" ? "Registrar Película" : "Registrar Serie";

        btnConsultar.click(); 

    } catch (error) {
        alert(error.message);
    }
});

// --- LÓGICA DE ELIMINAR ---
btnEliminar.addEventListener("click", async () => {
    const idActual = idElemento.value;
    
    // Si no hay ID, no hacemos nada por seguridad
    if (!idActual) return; 

    // Ventana de confirmación del navegador
    const seguro = confirm(`¿Estás seguro de que deseas eliminar esta ${modoActual === "peliculas" ? "película" : "serie"}?`);
    
    if (seguro) {
        try {
            let respuesta;
            
            if (modoActual === "peliculas") {
                respuesta = await eliminarPelicula(idActual);
            } else {
                respuesta = await eliminarSerie(idActual);
            }

            alert(respuesta.mensaje || "Eliminado exitosamente");
            
            // Reiniciamos todo el formulario a su estado original
            formulario.reset();
            idElemento.value = ""; 
            tituloFormulario.textContent = modoActual === "peliculas" ? "Registrar Película" : "Registrar Serie";
            btnEliminar.style.display = "none"; // Volvemos a ocultar el botón
            
            // Recargamos el catálogo
            btnConsultar.click(); 

        } catch (error) {
            alert(error.message);
        }
    }
});

// --- LÓGICA DE LIMPIAR FORMULARIO ---
btnLimpiar.addEventListener("click", () => {
    // 1. Limpia todo el texto y números de los inputs
    formulario.reset();
    
    // 2. Vaciamos el ID oculto para salir del "modo edición"
    idElemento.value = ""; 
    
    // 3. Regresamos el título a su estado original dependiendo si estamos en películas o series
    tituloFormulario.textContent = modoActual === "peliculas" ? "Registrar Película" : "Registrar Serie";
    
    // 4. Nos aseguramos de que el botón rojo de Eliminar desaparezca
    btnEliminar.style.display = "none";
});