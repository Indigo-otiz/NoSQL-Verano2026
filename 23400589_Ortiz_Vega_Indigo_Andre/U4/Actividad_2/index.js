const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;

app.use(morgan('dev'));

app.get('/', (req,res) => {
    res.send(`<h1> Actividad 2 </h1>`);
});

// Ejercicio 1. Número par o impar
app.get('/par/:numero', (req,res) => {
    const numero = Number(req.params.numero);
    if (numero % 2 === 0) res.send(`${numero} es un número par`);
    else res.send(`${numero} es un número impar`);
    
})

// Ejercicio 2. Mayor de edad
app.get(`/edad/:edad`, (req, res) => {
    const edad = Number(req.params.edad);
    if (edad > 17 )  res.send(`Eres mayor de edad`);
    else res.send(`Eres menor de edad`);
})

// Ejercicio 3. Calculadora
app.get('/calculadora/:operacion/:a/:b', (req, res) => {
    const operacion = req.params.operacion;
    const a = Number(req.params.a);
    const b = Number(req.params.b);
    let resultado;

    switch (operacion) {
        case 'suma':
            resultado = a + b;
            break;
        case 'resta':
            resultado = a - b;
            break;
        case 'multiplicacion':
            resultado = a * b;
            break;
        case 'division':
            resultado = a / b;
            break;
        default:
            res.send('Operaciones válidas: suma, resta, multiplicacion, division');
            return;
    }

    res.send(`Resultado: ${resultado}`);
});

// Ejercicio 4. Tabla de multiplicar
app.get('/tabla/:numero', (req, res) => {
    const numero = Number(req.params.numero);
    let tabla = '';
    for (let i = 1; i <= 10; i++) {
        tabla += `&emsp;&emsp;${numero} x ${i} = ${numero * i}<br>`;
    }

    res.send(`Respuesta: <br><br> ${tabla}`);
});

// Ejercicio 5. Calificación
app.get('/calificacion/:nota', (req,res) => {
    const nota = Number(req.params.nota);
    let respuesta = '';
    if (nota>=90) respuesta = "Excelente";
    else if (nota>=80) respuesta = "Muy bien";
    else if (nota>=70) respuesta = "Aprobado";
    else respuesta = "Reprobado"

    res.send(`Respuesta: ${respuesta}`);
})

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`); 
})