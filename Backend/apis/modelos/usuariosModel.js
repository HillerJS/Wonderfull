const mongoose = require("mongoose") // ahora se arma la estructura que me permita definir de como va a ser la coleccion, como va a ir armado y Schema es la estructura de como va a ir armada esa colección, ejemplo: Nombre, Apellido, Dirección etc... y indicarle que tipo de es cada uno. El seguiente paso es crear el modelo, el mdoelo es colocarle nombre a la colección y asociarlo a un schema que exista
var usuariosModel = {}

var Schema = mongoose.Schema
var usuariosSchema = new Schema({
    nombre:String,
    email:String,
    password:String,
    rol:String,
    estado:String,
    codigoAleatorio:String,
    rol:String
})

const MyModel = mongoose.model("usuarios", usuariosSchema)

// Esto const MyModel = mongoose.model("usuarios", usuariosSchema) significa que va a quedar una coleccion con el nombre usuarios con una structura schema que está en var usuariosSchema = new schema

// En este hay una particularidad debido que este no solo recibe información, si no, que tambien devuelve hacia el frontend, y lo realiza por medio callback en las funciones, es una funcion que devuelve una función.
// aqui es usuariosModel.Guardar = function(post, callback) y post porque es la variable en el controlador que se encarga de hacer el filtro y entregar la información organizada ya que el es el que captura la información del usuario y luego generaros lo que decimos el callback, aqui podemos colocar cualquier nombre, pero para efectos de hacer las cosas más sencillas se le coloca el mismo nombre y esta se va a devolver por medio de return callback() con algun contenido, pero antes se le coloca la información que viene en camino usuarios.push, pero en la estructura tambien se puede colocar solo post en vez de nombre:post.nombre, pero se coloca como esta ultima por temas de que sea bastante legible y esteticamente visible

// de esta forma var usuariosModel = require("../modelos/usuariosModel.js").usuariosModel vinculamos las funciones del usuarios model en el usuarios controlador

// var usuarios = []
usuariosModel.Guardar       = function(post, callback){
    const instancia = new MyModel
    instancia.nombre = post.nombre
    instancia.email = post.email
    instancia.password = post.password
    instancia.rol = "cliente"
    instancia.estado = "0"
    instancia.codigoAleatorio = post.codigoAleatorio
    instancia.rol = "Cliente"

    instancia.save().then((respuesta) => {
        console.log(respuesta)
        return callback({state:true, mensaje:"Usuario Guardado Correctamente"})
    }).catch((error) => {
        console.log(error)
        return callback({state:false, mensaje:"Ups error al almacenar"})
    })
    // usuarios.push({nombre:post.nombre, email:post.email, password:post.password})
    // return callback({state:true, mensaje:"Usuario Guardado Correctamente"})
}

usuariosModel.Listar        = function(post, callback){
    MyModel.find({},{password:0,__v:0}).then((respuesta) =>{
        return callback({state: true, datos:respuesta})
    }).catch((error) => {
        console.log(error)
        return callback({state: false, error:error, datos:[]})
    })
    // MyModel.find({},{}) el primero es el criterio y el segundo la proyección, este punto se coloca vacío para que me traiga todo, y se coloca datos:[] es para que en el error no muestre ninguna información que pueda comprometer
}

usuariosModel.ListarId      = function(post, callback){
    MyModel.find({_id:post._id},{password:0,__v:0}).then((respuesta) =>{
        return callback({state: true, datos:respuesta})
    }).catch((error) => {
        console.log(error)
        return callback({state: false, error:error, datos:[]})
    })
    // MyModel.find({},{}) el primero es el criterio y el segundo la proyección, este punto se coloca vacío para que me traiga todo, y se coloca datos:[] es para que en el error no muestre ninguna información que pueda comprometer
}

usuariosModel.verificarEmail = function(post, callback){
    MyModel.find({email:post.email},{}).then((respuesta) => {
        console.log(respuesta.length)
        if(respuesta.length >= 1){
            return callback({continuar:"No"})
        } 
        else{
            return callback({continuar:"Si"})
        }
    }).catch((error) => {
        console.log(error)
        return callback({state:false, error:error})
    })

    // var posicion = usuarios.findIndex((item) => item.email == post.email)
    // if(posicion == -1){
    //     return callback({continuar:"Si"})
    // }
    // else {
    //     return callback({continuar:"No"})
    // }
}

usuariosModel.Actualizar    = function(post, callback){
    MyModel.findOneAndUpdate({_id:post._id},{
        nombre:post.nombre
    }).then((respuesta) => {
        console.log(respuesta)
        return callback({state: true})
    }).catch((error) => {
        console.log(error)
        return callback({state: false, error:error})
    })
    // este ({email:post.email} es el criterio de busqueda y nombre:post.nombre es el elemento a actualizar
    // var posicion = usuarios.findIndex((item) => item.email == post.email)
    // if(posicion >= 0){
    //     usuarios[posicion].nombre = post.nombre
    //     return callback({state: true})
    // }
    // else{
    //     return callback({state: false})
    // }
    
}

usuariosModel.Eliminar      = function(post, callback){
    MyModel.findOneAndDelete({_id:post._id}).then((respuesta) => {
        console.log(respuesta)
        return callback({state: true})
    }).catch((error) => {
        console.log(error)
        return callback({state: false, error:error})
    })
    // var posicion = usuarios.findIndex((item) => item.email == post.email)
    // if(posicion >= 0){
    //     usuarios.splice(posicion,1) // se le coloca 1 para que solo borre uno

    //     return callback({state: true})
    // }
    // else{
    //     return callback({state: false})
    // }
    
}

usuariosModel.Login         = function(post, callback){
    MyModel.find({email:post.email, password:post.password, estado:'1'},{}).then((respuesta) => {
        if(respuesta.length == 1){
            console.log(respuesta)
            return callback({state:true, mensaje: "Bienvenido: " + respuesta[0].nombre,
                nombre:respuesta[0].nombre,
                email:respuesta[0].email,
                rol:respuesta[0].rol,
            })
        }
        else{
            return callback({state: false, mensaje: "Credenciales inválidas, verifique que su cuenta esté activa"})
        }

    }).catch((error) => {
        console.log(error)
        return callback({state: false, error:error})
    })
    // var posicion = usuarios.findIndex((item) => item.email == post.email && item.password == post.password )
    // if(posicion >= 0){
    //     return callback({state:true, mensaje: "Bienvenido: " + usuarios[posicion].nombre})
    // }
    // else{
    //     return callback({state: false, mensaje: "Credenciales inválidas"})
    // }
}
usuariosModel.ActivarCuenta    = function(post, callback){
    MyModel.findOneAndUpdate({email:post.email, codigoAleatorio:post.codigoAleatorio},{
        estado:"1"
    }).then((respuesta) => {
        
        if(respuesta == undefined){
            return callback({state: false, mensaje: "Uppss Su cuenta no ha sido activada"})
        } else {
            console.log(respuesta)
            return callback({state: true, mensaje: "Su cuenta ha sido activada"})
        }
        
    }).catch((error) => {
        console.log(error)
        return callback({state: false, error:error})
    })
}


usuariosModel.ActualizarPass = function(post, callback){
    MyModel.findOneAndUpdate({email:post.email},{
        password:post.password
    }).then((respuesta) => {
        console.log(respuesta)
        return callback({state: true})
    }).catch((error) => {
        console.log(error)
        return callback({state: false, error:error})
    })
    // var posicion = usuarios.findIndex((item) => item.email == post.email)
    // if(posicion >= 0){
    //     usuarios[posicion].password = post.password
    //     return callback({state: true})
    // }
    // else{
    //     return callback({state: false})
    // }
    
}

// recibe un post y devuelve una repuesta por medio del callback
// la lectura de esto usuarios[posicion].nombre = post.nombre, sería la siguiente, usuarios[posicion] la posición en que encontró al usuario y el .nombre, que es lo que va a modificar o actualizar
// esto es var posicion = usuarios.findIndex((item) => item.email = post.email) para que busque y me indique si el item ya está creado, si retorna con un -1 quiere decir que no existe y si existe retornará con un valor desde 0 hasta el infinito

// aqui se le debolvera a Listar toda la información del usuario datos:usuarios que está almacenado en el var usuarios = []
module.exports.usuariosModel = usuariosModel