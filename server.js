// const express = require('express');
// const users = require('./data/agentes.js');
// const app = express();
// const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser');
const PORT = 3000;

const express = require("express");
const users = require("./data/agentes.js");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

// console.log(users);
// app.use(bodyParser.json()); // activas el middleware importado

//middleware para recibir json
app.use(express.json());

// app.get('/', (req, res) => {
// res.send('Probando...')
// })
const secretKey = "secretKey";
// crear ruta login
app.get("/SignIn", (req, res) => {
  // traigo datos
  const { email, password } = req.query;
try {
    // verifico usuario y clave
    const usuario = users.results.find(
      (u) => u.email == email && u.password == password
    );
  
    if (usuario) {
      //
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 120,
          data: usuario,
        },
        secretKey
      );
  
      res.send(
        `
        <a href="/dashboard?token=${token}"> <p> Ir al Dashboard </p></a>
        Bienvenido, ${email}.
  
        <script>
          sessionStorage.setItem('token', '${token}')
        </script>`
      );
    } else {
      res.send("Usuario o contraseña incorrecta");
    }
} catch (error) {
  console.log("error", error, error.message);
  res.json({ error: error.message });
}

});

// crear ruta dashboard
app.get("/dashboard", (req, res) => {
  try {
    console.log("Bienvenido a Dashboard");
    const token = req.query.token;
  
    if (!token) {
      res.status(404).send("Token no autorizado");
    } else {
      jwt.verify(token, secretKey, (err, data) => {
        console.log("Valor de data: ", data);
        err
          ? res.status(403).send("Token inválido o expirado")
          : res.status(200).send(`Autorizado a la ruta: ${data.data.email}`);
      });
    }
  } catch (error) {
    console.log("error", error, error.message);
    res.json({ error: error.message });
  }

});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
