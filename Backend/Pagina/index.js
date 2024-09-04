var cargarDatos = function(codigo){

    // WARNING: For POST requests, body is set to null by browsers.

    var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
    var misdatos = JSON.parse(this.responseText)

    var micontenido = document.getElementById("micontenido")
    micontenido.innerHTML = ""

    for (let a = 0; a < misdatos.length; a++){
        if(misdatos[a].unidades > 0){
            micontenido.innerHTML +=`
            <div class="item col-12 col-md-4 col-lg-3">
            <div class="alert alert-primary" role="alert">
            codigo:${misdatos[a].codproducto} unidades:${misdatos[a].unidades}
            </div>
            <div class="mititulo">${misdatos[a].titulo}</div>
            <div class="midescripcion">${misdatos[a].texto} </div>
            <button type="button" class="btn btn-success" onclick="Comprar('${misdatos[a].codproducto}')">Comprar</button>
            </div>
        `
        }

    }
    }
});
// el for es para recorrer a cada uno de los datos del array
xhr.open("POST", "http://localhost:3000/cargardatos");
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
var data = "codigo=" + codigo;
xhr.send(data);
}
var Comprar = function(codigo){
    console.log("Intentando comprar " + codigo)
    // WARNING: For POST requests, body is set to null by browsers.
var data = "codproducto=" + codigo;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function() {
if(this.readyState === 4) {
    console.log(this.responseText);
    cargarDatos(200)
}
});

xhr.open("POST", "http://localhost:3000/descontar");
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

xhr.send(data);
}
// Modelo para el loging, esto es para validar antes que llegue al servidor
var registrar = function(){
    var nombre = document.getElementById("nombre").value
    var email = document.getElementById("email").value
    var password = document.getElementById("password").value

    if(nombre == undefined || nombre == null || nombre == ""){
        alert("El campo nombre es obligatorio")
        return false
    }
    if(nombre.length > 30){
        alert("El campo nombre máximo 30 caracteres")
            return false
    }
    if(nombre.length <1){
        alert("El campo nombre debe ser mínimo 1 caracter")
            return false
    } 
    if(email == undefined || email == null || email == ""){
        alert("El campo email es obligatorio")
        return false
    }
    if(password == undefined || password == null || password == ""){
        alert("El campo password es obligatorio")
        return false
    }
    const regex = /^(?=.*[A-Z])(?=(.*\d){2,}).{6,}$/;
    if(regex.test(password) == false){
        alert("el campo password debe contener al menos 2 dígitos, una mayúscula y debe ser longitud mínima de 6")
        return false
    }

    // WARNING: For requests, body is set to null by browsers.
    var data = "nombre="+ nombre +"&email="+ email +"&password="+ password

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
        console.log(this.responseText);
    }
    });

    xhr.open("POST", "http://localhost:3000/usuarios/guardar");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.send(data);
    // esto se llama refactorización, y es convertir tu código en un código mas eficiente y aqui estavamos convirtiendo una funcionalidad en algo que tuviera parametros, cuando es get toda la información viaja por la URL y cuando es Post tiene que meterse en una data, en un elemento data. Cuando yo creo una función de tipo get o post lo que uno hace es armar la estructura que sea compatible con con el tipo de peticion que uno está haciendo, en angular se hace en la parte de funcionalidades
}