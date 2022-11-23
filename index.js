const express = require("express");
const app = express();
require("dotenv").config();
const Port = process.env.PORT || 8080;
const hbs = require("hbs");
const mysql = require("mysql2");
const path = require("path");
const nodemailer = require("nodemailer");

//conectamos la app a una base de datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORTDB,
    database: process.env.DATABASE,
  });
  
  //Conectarse a la base de datos
  const conectar = (
    conexion.connect((error) => {
      if (error) throw error;
      console.log("Base de datos conectada");
    }));

//Configuramos la vista de la aplicacion
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views/partials"));


//Configuracion de Middelwares: 
//
//es una funcion que hace que mi aplicacion entienda tipo JS
app.use(express.json());
//Permite unir la carpeta de ubicacion main con public
app.use(express.static(path.join(__dirname, "public")));
//Permite que el servidor entienda los datos que traigo de los formularios
app.use(express.urlencoded({ extended: false }));
//Permite usar  los archivos estaticos 
app.use(express.static(path.join(__dirname, "js")));

/* app.get("/", (req, res) =>
  res.send("Nos estamos conectando a una Base de Datos")
); */


app.get("/", (req, res) =>
  res.render("index")
);

app.get("/confirmacion", (req, res) =>
  res.render("confirmacion")
);

app.post("/", (req, res, next) =>{
  
  const { correocliente } = req.body;

  //Validacion basica
  if (correocliente == "") {
    console.log("SIN CORREO");
    /* res.render("index"); */
  }
  else {

    console.log(correocliente);
 
    /* CONFIGURACION DEL MAIL */

    contenidoHTML = `
    
    <h1>Hola,</h1>
    <br>
    <br>
    <p>Hemos recibido tu solicitud para la suscripción a nuestras promociones semanales.</p>
    <br>
    <p>Tu correo registrado es:<h3>${correocliente}</h3></p>
    <br> 
   <p>Gracias por elegirnos,</p>
   <br>
   <br>
   <h3>Las Plantas 🍀</h3>
    `

    async function main(){

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: 'arturogomez1014@gmail.com',
          pass: 'agaxwimpvmdjmlfd',
        }
      });

      let info = await transporter.sendMail({
        from: '"Las Plantas" <arturogomez1014@gmail.com>',
        to: `${correocliente}`, /* ALT 96 para comillas objeto */
        subject: "Gracias por Suscribirte a la Tienda de Plantas",
        html: contenidoHTML/* "Este es el cuerpito del mensaje  <br> VEMOS bb <br><br> Las Plantas" */
      })
     /*  console.log("Message sent: %s", info.messageId); */
    }

    /* res.render("confirmacion", { correocliente }); */

    main().catch(console.error);

    /* conectar DB */

    let data = {

      emailcliente: correocliente,
      
    }

    let sql = "INSERT INTO tablaclientes SET ?";

    let query = conexion.query(sql, data, (err, results) => {
      if (err) throw err;
      res.render("confirmacion", {correocliente})
    })

  }


});



app.get("/tienda", (req, res) =>
  res.render("tienda")
);

app.get("/misplantas", (req, res) =>
  res.render("misplantas")
);

app.get("/contacto", (req, res) =>
  res.render("contacto")
);

app.post("/contacto", (req, res) =>{
  
  const { nombre, email, textocontacto } = req.body

  //Validacion basica
  if (email == "" || textocontacto == "") {

    let validacion = "Por favor ingrese su Email y Consulta";

    res.render("contacto", { validacion })
  }
  else {

    /* let validacion = "Su consulta ha sido enviada"; */

    /* res.render("contacto", { validacion }) */

    /* console.log(nombre);
    console.log(email);
    console.log(textocontacto); */

    /* CONFIGURACION DEL MAIL */

    contenidoHTML = `
    
    <h1>Hola, <h3>${nombre}</h3></h1>
    <br>
    <br>
    <p>Hemos recibido tu consulta, pronto recibiras una respuesta o quizas no</p>
    <br>
    <p>Tu correo registrado es:<h3>${email}</h3></p>
    <br> 
   <p>Gracias por elegirnos,</p>
   <br>
   <br>
   <h3>Las Plantas 🍀</h3>
    `

    async function main(){

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: 'arturogomez1014@gmail.com',
          pass: 'agaxwimpvmdjmlfd',
        }
      });

      let info = await transporter.sendMail({
        from: '"Las Plantas" <arturogomez1014@gmail.com>',
        to: `${email}`, /* ALT 96 para comillas objeto */
        subject: "Gracias por Suscribirte a la Tienda de Plantas",
        html: contenidoHTML/* "Este es el cuerpito del mensaje  <br> VEMOS bb <br><br> Las Plantas" */
      })
      /* console.log("Message sent: %s", info.messageId); */
    }

    res.render("confirmacion2", { nombre, email });

    main().catch(console.error);


    /* conectar la DB */

    let data = {
      nombre: nombre,
      correo: email,
      consulta: textocontacto,
      
    }


    let sql = "INSERT INTO tablaContacto SET ?";

    let query = conexion.query(sql, data, (err, results) => {
      if (err) throw err;
      /* res.render("contacto") */
    })

  }

});


app.listen(Port, () => console.log("Servidor corriendo en el puerto: ", Port));
app.on("error", (error) => console.log("tenemos un error", error));


