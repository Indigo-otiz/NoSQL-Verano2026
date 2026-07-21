require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    console.log("Conectado correctamente a MongoDB");
})
.catch((error) => {
    console.error("Error al conectar con MongoDB:", error);
});

const peliculaSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        genero: { type: String, required: true, trim: true },
        año: { type: Number, required: true, min: 1900 },
        duracion: { type: Number, required: true, min: 1 },
        idioma: { type: String, required: true, trim: true },
        calificacion: { type: Number, required: true, min: 0, max:10 },
        nc: { type: String, required: true, trim: true, minlength: 8 }
    },
    {
        timestamps: true
    }
)

const serieSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        genero: { type: String, required: true, trim: true },
        año: { type: Number, required: true, min: 1900 },
        temporadas: { type: Number, required: true, min: 1 },
        episodios: { type: Number, required: true, min: 1},
        idioma: { type: String, required: true, trim: true },
        calificacion: { type: Number, required: true, min: 0, max:10 },
        nc: { type: String, required: true, trim: true, minlength: 8 }
    },
    {
        timestamps: true
    }
)

const Pelicula = mongoose.model("Pelicula", peliculaSchema, "peliculas");
const Serie = mongoose.model("Serie", serieSchema, "series");

app.get("/", (req, res) => {
    res.send(`<h1>Bienvenido a la API de Netflix</h1>
            <h2>Explora las películas y series</h2>
            <a href="/peliculas">Películas</a><br>
            <a href="/series">Series</a><br>`);
})

// Películas 
// Get
app.get("/peliculas", async (req, res) => {
    try {
        const peliculas = await Pelicula.find().limit(10);
        res.json(peliculas);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las películas",
            error: error
        });
    }
})

// Get por ID
app.get("/peliculas/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const pelicula = await Pelicula.findById(id);

        if(!pelicula){
            return res.status(404).json({
                mensaje: "Película no encontrada"
            })
        }

        res.json(pelicula);

    } catch (error){
        res.status(500).json({
            mensaje: "Error al obtener la película",
            error: error
        });
    }
})

// Post
app.post("/peliculas", async (req,res) => {
    try{
        const { titulo, genero, año, duracion, idioma, calificacion, nc } = req.body;

        if (!titulo || !genero || !año || !duracion || !idioma || !calificacion || !nc) {
            return res.status(400).json({
                mensaje: "Faltan datos de la película"
            })
        }

        const nuevaPelicula = new Pelicula({
            titulo, genero, año, duracion, idioma, calificacion, nc
        })

        const peliculaGuardada = await nuevaPelicula.save();

        res.status(201).json({
            mensaje: "Película registrada correctamente",
            pelicula: peliculaGuardada
        });
    } catch(error){
        res.status(500).json({
            mensaje: "Error al registrar la película",
            error: error
        });
    }
})

// Put
app.put("/peliculas/:id", async (req,res) => {
    try{
        const id = req.params.id;
        const { titulo, genero, año, duracion, idioma, calificacion, nc } = req.body;

        if (!titulo || !genero || !año || !duracion || !idioma || !calificacion || !nc) {
            return res.status(400).json({
                mensaje: "Faltan datos de la película"
            })
        }

        const peliculaActualizada = await Pelicula.findByIdAndUpdate(
            id, 
            { titulo, genero, año, duracion, idioma, calificacion, nc},
            { new: true, runValidators: true });

        if (!peliculaActualizada) {
            return res.status(404).json({
                mensaje: "Película no encontrada"
            });
        }

        res.json({
            mensaje: "Película actualizada correctamente",
            pelicula: peliculaActualizada
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar la película",
            error: error
        });
    }
})

// Delete
app.delete("/peliculas/:id", async (req,res) => {
    try{
        const id = req.params.id;
        const peliculaEliminada = await Pelicula.findByIdAndDelete(id);

        if (!peliculaEliminada) {
            return res.status(404).json({
                mensaje: "Película no encontrada"
            });
        }

        res.json({
            mensaje: "Película eliminada correctamente",
            pelicula: peliculaEliminada
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar la película",
            error: error
        });
    }
})

// Series
// Get
app.get("/series", async (req, res) => {
    try{
        const series = await Serie.find().limit(10);
        res.json(series);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las series",
            error: error
        });
    }
})

// Get por ID
app.get("/series/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const serie = await Serie.findById(id);

        if(!serie){
            return res.status(404).json({
                mensaje: "Serie no encontrada"
            })
        }

        res.json(serie);

    } catch (error){
        res.status(500).json({
            mensaje: "Error al obtener la serie",
            error: error
        });
    }
})

// Post
app.post("/series", async (req,res) => {
    try{
        const { titulo, genero, año, temporadas, episodios, idioma, calificacion, nc } = req.body;

        if (!titulo || !genero || !año || !temporadas || !episodios || !idioma || !calificacion || !nc) {
            return res.status(400).json({
                mensaje: "Faltan datos de la serie"
            })
        }

        const nuevaSerie = new Serie({
            titulo, genero, año, temporadas, episodios, idioma, calificacion, nc
        })

        const serieGuardada = await nuevaSerie.save();

        res.status(201).json({
            mensaje: "Serie registrada correctamente",
            serie: serieGuardada
        });
    } catch(error){
        res.status(500).json({
            mensaje: "Error al registrar la serie",
            error: error
        });
    }
})

// Put
app.put("/series/:id", async (req,res) => {
    try{
        const id = req.params.id;
        const { titulo, genero, año, temporadas, episodios, idioma, calificacion, nc } = req.body;

        if (!titulo || !genero || !año || !temporadas || !episodios || !idioma || !calificacion || !nc) {
            return res.status(400).json({
                mensaje: "Faltan datos de la serie"
            })
        }

        const serieActualizada = await Serie.findByIdAndUpdate(
            id, 
            { titulo, genero, año, temporadas, episodios, idioma, calificacion, nc},
            { new: true, runValidators: true });

        if (!serieActualizada) {
            return res.status(404).json({
                mensaje: "Serie no encontrada"
            });
        }

        res.json({
            mensaje: "Serie actualizada correctamente",
            serie: serieActualizada
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar la serie",
            error: error
        });
    }
})

// Delete
app.delete("/series/:id", async (req,res) => {
    try{
        const id = req.params.id;
        const serieEliminada = await Serie.findByIdAndDelete(id);

        if (!serieEliminada) {
            return res.status(404).json({
                mensaje: "Serie no encontrada"
            });
        }

        res.json({
            mensaje: "Serie eliminada correctamente",
            serie: serieEliminada
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar la serie",
            error: error
        });
    }
})

app.listen(3000, () => {
    console.log("Servidor iniciado en el puerto 3000");
});