//Aqui ahora lo exportaremos para que las rutas las puedan heredar y se puedan comunicar
// Aqui verificaremos que la información esté lo mas correctamente posible.

const { config } = require("../../config.js")

var usuariosModel = require("../modelos/usuariosModel.js").usuariosModel
// esta variable var usuariosModel = require("../modelos/usuariosModel.js").usuariosModel queda guardada en usuariosController con todas las funcionalidades del usuariosModel
var nodemailer = require('nodemailer')
// Sistema para envio de correos electronicos para validar cuentas
var usuariosController = {}

usuariosController.Guardar = function(requests, response){
    
    var post = {
        nombre:requests.body.nombre,
        email:requests.body.email,
        password:requests.body.password
    }
    if(post.nombre == undefined || post.nombre == null || post.nombre == ""){
        response.json({state:false, mensaje:"El campo nombre es obligatorio"})
        return false
    }
    if(post.nombre.length > 30){
        response.json({state:false, mensaje:"El campo nombre máximo 30 caracteres"})
            return false
    }
    if(post.nombre.length <1){
        response.json({state:false, mensaje:"El campo nombre debe ser mínimo 1 caracter"})
            return false
    }
// estos if(post.nombre.length > 30) son tipos de validaciones que se deben de hacer para que el usuario no burle la captura de información 

    if(post.email == undefined || post.email == null || post.email == ""){
        response.json({state:false, mensaje:"El campo email es obligatorio"})
        return false
    }
    if(post.password == undefined || post.password == null || post.password == ""){
        response.json({state:false, mensaje:"El campo password es obligatorio"})
        return false
    }
    const regex = /^(?=.*[A-Z])(?=(.*\d){2,}).{6,}$/;
    if(regex.test(post.password) == false){
        response.json({state: false, mensaje:"El campo password debe contener al menos 2 dígitos, una mayúscula y debe ser longitud mínima de 6"})
        return false
    }
    // usuariosModel.Guardar(post,function(respuestaModelo){
    //     response.json(respuestaModelo)
    // })
    // response.json({state: true, mensaje: "Sus datos son válidos"})
    post.password = SHA256(post.password + config.encriptado)
        usuariosModel.verificarEmail(post, function(verif){
            if(verif.continuar =="Si"){
                post.codigoAleatorio = "WonderFull- " + Math.floor(Math.random()* (9999 - 1000) + 1000);
                // enviar correo electrónico - configuracion establecida por google
                const transporter = nodemailer.createTransport({
                    host: config.email.host,
                    port: config.email.port,
                    secure: false,
                    requireTLS:true,
                    auth:{
                        // configurar gmail para que envie correos electrónicos
                        user:config.emailUser,
                        //contraseña para poder enviar correos electrónicos
                        pass:config.emailPass
                    }
                })
                // configurar correo electrónico
                let mailOptions = {
                    from:"",
                    to:post.email,
                    subject:post.nombre + " Verifica tu código  " + post.codigoAleatorio,
                    html:`<div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="padding: 20px 0 30px 0;">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; padding: 40px; border-radius: 10px;">
                                        <tr>
                                            <td align="center" style="padding: 20px 0;">
                                                <h1 style="color: #333;">Activación de Cuenta</h1>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 20px 0;">
                                                <p style="font-size: 16px; color: #666;">Hola ${post.nombre},</p>
                                                <p style="font-size: 16px; color: #666;">
                                                    Gracias por registrarte. Por favor, haz clic en el botón de abajo para activar tu cuenta.
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 30px 0;">
                                                <a href="${config.urlReal}/usuarios/activarCuenta/${post.email}/${post.codigoAleatorio}" style="background-color: #28a745; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                                                    Activar Cuenta
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 20px 0;">
                                                <p style="font-size: 14px; color: #999;">
                                                    Si no solicitaste esta activación, puedes ignorar este correo.
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 20px 0; border-top: 1px solid #dddddd;">
                                                <p style="font-size: 12px; color: #999;">
                                                    &copy; 2024 WonferFull. Todos los derechos reservados.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </div>`
                }
                transporter.sendMail(mailOptions, (error, info) => {
                    if(error){
                        console.log(error)
                    } else {
                        console.log(info)
                    }
                })
                usuariosModel.Guardar(post,function(respuestaModelo){
                    response.json(respuestaModelo)
                })
            } 
            else {
                response.json({state:false,mensaje:"Este Email ya existe en la BD"})
            }
    })
    // proceso de guardar en modelo - esta nota la dejamos al comienzo para saber que debiamos colcar la funcion usuarios model que recibe de la captura post y el envio de la respuesta callback por medio de la funcion(respuestaModelo)
// response.json({state: true, mensaje: "Sus datos son válidos"})

}


// aqui se compone en dos partes usuariosModel.Guardar(post,function(respuestaModelo), la primera que la sintaxis le pide que le entregue el post, o sea la información que capturaron y esta entregará la respuesta por medio de la funcion callback la cual la nombre respuestaModelo, pero siempre que vayamos a usar callback debe de hacerse como una función con la variable que usted quiera en este caso fue: function(respuestaModelo) ya que esta en realidad es la respuesta que viene del Modelo hacia el controlador y esta al frontend

// expresiones regulares, es lo que se usa para poder crear filtros específicos al momento de ingresar cierto dato, ejemplo las contraseñas, en este caso despues de lo que ingrese en password:request.body.password, pasará en las validaciones y antes de guardar se validará en const regex = /^(?=.*[A-Z])(?=(.*\d){2,}).{6,}$/; y en if(regex.test(post.password) == false) si todo está bien se guardará
//necesito una expresion regular en js que valide que un campo tenga minimo 2 numeros y una mayuscula.
// var post = {} es un objeto el cual usaremos para capturar información, en este caso los datos del usuario.
// Aqui ya capturamos y debemos colocar la primera condicion para responder en el sentido de validar que los datos que ingresen en esos campos sean correctos, ejemplo que llenen los campos, o que usen caracteres correctos etc.
// Si la información pasa los filtros se inicia con el proceso de guardar en modelo

usuariosController.Listar = function(requests, response){
    usuariosModel.Listar(null, function(respuestaModelo){
        response.json(respuestaModelo)
    })
}
// la idea de usuariosController.Listar es que llame y requiera para que usuarios model para que le debuelva la información, luego se invoca usuariosModel.Listar y se coloca Null por que esta no tiene que enviarle nada a diferencia del guardar que se tuvo que enviar por medio del post

usuariosController.Actualizar = function(requests, response){
    var post = {
        _id: requests.body._id,
        nombre:requests.body.nombre,

    }
    if(post._id == undefined || post._id == null || post._id == ""){
        // response.json({state:false, mensaje:"El campo email es obligatorio"})
        return false
    }
    if(post.nombre == undefined || post.nombre == null || post.nombre == ""){
        // response.json({state:false, mensaje:"El campo nombre es obligatorio"})
        return false
    }

    // usuariosModel.verificarEmail(post, function(existe){
    //     if(existe.continuar == "No"){
            // proceso de Actualizar en usuariosModel
            usuariosModel.Actualizar(post, function(actualiza){
                if(actualiza.state == true){
                    response.json({state:true,mensaje:"Usuario Actualizado correctamente"})
                }
                else{
                    response.json({state:false,mensaje:"Error al Actualizar"})
                }
            })
        // }
        // else{
        //     response.json({state:false, mensaje:"No podemos actualizar un email inexistente"})
        // }
    // })

}
usuariosController.ListarId = function(requests, response){
    var post = {
        _id: requests.body._id,
    }
    if(post._id == undefined || post._id == null || post._id == ""){
        response.json({state:false, mensaje:"El campo mail es obligatorio"})
        return false
    }

    usuariosModel.ListarId(post, function(respuestaModelo){
        response.json(respuestaModelo)
    })
}

// este usuariosController.Actualizar se realiza por dos criterios, el primero con el que se realizará la actualización y la otra que se utilizará como medio de busqueda, un dato fijo in cambiable en este caso sería el correo.
// En el caso del password se debería de hacer en una api individual
// la actualización se puede convinar con la verificación del email, para saber si existe o no, porque puede que manden un dato con un email que no existe y se realiza en el usuariosModel

usuariosController.Eliminar = function(requests, response){
    var post = {
        _id: requests.body._id,
    }
    if(post._id == undefined || post._id == null || post._id == ""){
        response.json({state:false, mensaje:"El campo mail es obligatorio"})
        return false
    }
    // usuariosModel.verificarEmail(post, function(existe){
    //     if(existe.continuar == "No"){
            // proceso de eliminar en usuariosModel
            usuariosModel.Eliminar(post, function(eliminarcuent){
                if(eliminarcuent.state == true){
                    response.json({state:true,mensaje:"Usuario Eliminado correctamente"})
                }
                else{
                    response.json({state:false,mensaje:"Error al Eliminar"})
                }
            })
    //     }
    //     else{
    //         response.json({state:false, mensaje:"No podemos eliminar una cuenta con un email inexistente"})
    //     }
    // })
}

usuariosController.Login = function(requests, response){
    var post = {
        email:requests.body.email,
        password:requests.body.password
    }
    if(post.email == undefined || post.email == null || post.email == ""){
        response.json({state:false, mensaje:"El campo email es obligatorio"})
        return false
    }
    if(post.password == undefined || post.password == null || post.password == ""){
        response.json({state:false, mensaje:"El campo password es obligatorio"})
        return false
    }
    post.password = SHA256(post.password + config.encriptado)
    
    usuariosModel.Login(post, function(respuesta){
        respuesta.token = ''
        if(respuesta.state == true){
            var payload = {
                nombre:respuesta.nombre,
                email:respuesta.email,
                rol:respuesta.rol,
                _id:respuesta._id
            }
            const token = jwt.sign(payload, config.encriptado, {expiresIn:config.tiempoSesion})
            respuesta.token = token
        }
        response.json(respuesta)
    })
}
usuariosController.ActivarCuenta = function(requests, response){
    var post = {
        email:requests.body.email,
        codigoAleatorio:requests.body.codigoAleatorio
    }
    if(post.email == undefined || post.email == null || post.email == ""){
        response.json({state:false, mensaje:"El campo email es obligatorio"})
        return false
    }
    if(post.codigoAleatorio == undefined || post.codigoAleatorio == null || post.codigoAleatorio == ""){
        response.json({state:false, mensaje:"El campo codigoAleatorio es obligatorio"})
        return false
    }
    usuariosModel.ActivarCuenta(post, function(respuesta){
        response.json(respuesta)
    })
}

usuariosController.ActualizarPass = function(requests, response){
    var post = {
        email: requests.body.email,
        password:requests.body.password,

    }
    if(post.email == undefined || post.email == null || post.email == ""){
        response.json({state:false, mensaje:"El campo email es obligatorio"})
        return false
    }
    if(post.password == undefined || post.password == null || post.password == ""){
        response.json({state:false, mensaje:"El campo password es obligatorio"})
        return false
    }

    usuariosModel.verificarEmail(post, function(existe){
        if(existe.continuar == "No"){
            // proceso de Actualizar en usuariosModel
            usuariosModel.ActualizarPass(post, function(actualiza){
                if(actualiza.state == true){
                    response.json({state:true,mensaje:"Password Actualizado correctamente"})
                }
                else{
                    response.json({state:false,mensaje:"Error al Actualizar el Password"})
                }
            })
        }
        else{
            response.json({state:false, mensaje:"No podemos actualizar un email inexistente"})
        }
    })

}
usuariosController.State          = function(request, response){
    var token = request.headers.autorization.split(" ")[1].trim()
    response.json({miToken:token})
}

module.exports.usuariosController = usuariosController
// la forma para exportar module.exports.usuariosController = usuariosController