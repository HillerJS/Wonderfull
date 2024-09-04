const express = require("express")
global.app = express()
// se coloca global.app para que sea leido en todos los archivos y estos archivos la puedan interpretar, ya que en el terminal aparecio que la app is not define y era porque no sabía que función estaba cumpliendo la app en las rutas.js, en otras palabras es para colocarla expuesta para todo el proyecto
global.config = require("./config.js").config
// esta var config = require("./config").config es la forma para importar desde config.js
const mongoose = require("mongoose")
var cors = require("cors")
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
global.SHA256 = require('sha256')

mongoose.connect("mongodb://127.0.0.1:27017/" + config.bd).then((respuesta)=>{
    console.log("Conexión correcta a mongo")
}).catch((error)=> {
    console.log(error)
});

app.use(cors({
    origin:function(origin, callback){
        console.log(origin)
        if(!origin) return callback(null, true)
        if(config.origins.indexOf(origin) === -1){
            console.log('error')
            return callback('error de cors', false)
        }
        return callback(null, true)
    }
}));


require("./rutas.js")
// esta require("./rutas.js") es la forma de importar o llamar las funcionalidades de las rutas.js

app.use("/", express.static(__dirname + '/Pagina'))

app.listen(config.puerto , function(){
    console.log("servidor funcionando por el puerto " + config.puerto)
})
// App.js solamente se encarga de almacenar o tener todo lo referido a configuraciones del servidor ejemplo la verificaciones de pedido de archivos body, el levantamiento del servidor la expo
// esto app.use("/", express.static(__dirname + '/Pagina')) es para la exposición de carpetas para mostrar el contenido o sea una carpeta para guardar imagenes o archivos.
// con esta misma técnica puedes exponer archivos para que alguien lo descargue ejemplo en el caso de crear un sistema de descarga de peliculas