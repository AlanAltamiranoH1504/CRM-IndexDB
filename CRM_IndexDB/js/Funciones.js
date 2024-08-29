//Selector de divAlertas 
const divAlertasHTML = document.querySelector("#alertas");

//Funcion que se conecta a la DB
function conectarDB(){
    //Variable para crear o conectar la DB
    const abrirConexion = window.indexedDB.open("crm", 1);

    //Mandamos posibles mensajes de error o exito en la conexion a la DB
    abrirConexion.onerror = () =>{
        console.log("Ha ocurrido un error en la conexion a la DB");
    }
    abrirConexion.onsuccess = function(e){
        //Reasignamos el valor de la variable DB
        DB = e.target.result;
        console.log("Conexion a la DB exitosa");
    }
}

//Funcion que envia distintos tipos de alertas 
function imprimirAlerta(mensaje, tipo){
    //Llamamos a la funcion que limpia el divAlertasHTML
    limpiarAlertas();

    //Creamos un div de alerta 
    const divAlerta = document.createElement("div");
    divAlerta.classList.add("px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "text-center", "border");

    //Agregamos el contenido y clases de estilo extra al div de la alerta 
    if(tipo === "error"){
        divAlerta.classList.add("bg-red-100", "border-red-400", "text-red-700");
        divAlerta.textContent = mensaje;
    }else{
        divAlerta.classList.add("br-green-100", "border-green-400", "text-green-700");
        divAlerta.textContent = mensaje;
    }

    //Agregamos el divAlerta al html
    divAlertasHTML.appendChild(divAlerta);
    //Depues de 3 segundos eliminamos la alerta del html 
    setTimeout(() => {
        divAlerta.remove();
    }, 3000);
}

//Funcion que limpia las alertas 
function limpiarAlertas(){
    divAlertasHTML.innerHTML = "";
}