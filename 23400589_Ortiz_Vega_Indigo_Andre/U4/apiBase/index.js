const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;

app.use(morgan("dev"));

app.get("/",(req, res) => {
    res.send("Hola mundo");
});

app.get("/mensaje", (req, res) => {
    res.send("Mensaje desde Express")
});

app.get("/pagina", (req, res) => {
    const nombre = "Indigo";
    res.send(`  
                <style>
                    .p1 {
                        color: teal;
                        background: cyan;
                    }
                </style>
                <h1> Mi pagina web </h1>
                <p class = "p1"> Creada con Express <p>
                <p > Hola ${nombre} <p>
        `);
});

app.get("/alumno", (req,res) => {
    res.json({
        nombre: "Indigo",
        carrera: "ISC",
        semestre: 7
    })
})

app.get("/materias",(req,res) => {
    res.json([
        {
            nombre: "NoSQL",
            hora: "8:00-11:00"
        },
        {
            nombre: "Programacion Web",
            hora: "14:00-17:00"
        }
    ])
})

app.get("/mensaje/:nombre", (req,res) => {
    res.send(`Hola ${req.params.nombre}`);
})

app.get("/suma/:a/:b", (req,res) => {
    const a = parseInt(req.params.a);
    const b = Number(req.params.b);
    res.send(`Resultado: ${a+b}`);
})

app.get("/multiplicar/:a/:b", (req, res) => {
    const a = Number(req.params.a);
    const b = Number(req.params.b);
    res.send(`Resultado: ${a*b}`);
})

app.get("/aleatorio", (req,res) => {
    const numero = Math.floor(Math.random()*100)+1;
    res.send(`Numero generado: ${numero}`);
})

app.listen(port, () => {
    console.log("Servidor iniciado en http://localhost:"+port);
})