// Este es un archivo unico en donde irán las configuraciones, este va a almacenar contraseñas, puertos configuraciones, correos electrónicos, datos en especial que le parmitan obtener, tomar su aplicacion llevarselo para otro lado y solo configurando un archivo. esto es para no tener que estar yendo a todos los controladores donde se haya configurado algo en especial para ir a hacer una modificación ejemplo si voy a agregar un sistema de envio de correos electrónicos y eso lo hacen los controladores y con este archivo ya no tocaría ir a ese controlador, ya en el controlador se colocará un vinculo que heredarán la configuracion que se coloque en el config.js

var config = {
    email:{}
}
// var config = {} se coloca en objetos porque se van a ingresar muchisimas variables internamente, será esa caja grande que contenga el poco de cajitas pequeñas

config.urlReal = "http://localhost:4200"
config.puerto = 3000
config.bd = "Backend-clase"
config.encriptado = 'hilla384@xOolHFLEh07PJGoPkLv1IbSaacEPsjñonjuwe6432168455%&/#$%&##sdfsTNtaedAcos2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI@N'
config.origins = [
    'http://localhost:4200'
]
// config.puerto = 3000 esto es el puerto 3000
// Pero para poder usar este archivo o vincularlo para hacer uso de esta variable debo exportar esta información y para exportar en node se usa module.exports.config = config  aqui estaremos exportando todas las configuraciones que se almacenen en var config
config.email.host = "smtp.gmail.com" // el correo electrónico que se va a implementar para hacer envio de correos electronicos
config.email.port = 587 // Puerto por donde trabaja gmail
config.emailUser = "hillsaaacosta@gmail.com"
config.emailPass = "nydhqggqalwtpfdo"

module.exports.config = config
// la forma para exportar

