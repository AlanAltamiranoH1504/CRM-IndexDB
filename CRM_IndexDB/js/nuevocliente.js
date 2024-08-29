//Creamos IFI para mantener metodos y variables de manera local
(function(){
    //Variable que maneja la DB
    let DB;
    //Selector del formulario 
    const formulario = document.querySelector("#formulario");
    //Selector de alertass 
    const divAlertasHTML = document.querySelector("#alertas");

    //Cargamos todo el documento html
    document.addEventListener("DOMContentLoaded", () =>{
        console.log("DOCUMENTO HTML CARGADO Y LISTO");
        
        //Llamamos a la funcion que se conecta la DB
        conectarDB();
        //Agregamos evento submit al formulario
        formulario.addEventListener("submit", validarCliente);
    });

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

    //Funcion que valida que el formulario este lleno
    function validarCliente(e){
        e.preventDefault();
        
        //Selectores de los input
        const inputNombre = document.querySelector("#nombre").value;
        const inputCorreo = document.querySelector("#email").value;
        const inputTelefono = document.querySelector("#telefono").value;
        const inputEmpresa = document.querySelector("#empresa").value;

        //Validamos cada uno de los input
        if(inputNombre === "" || inputCorreo === "" || inputTelefono === "" || inputEmpresa === ""){
            //Mandamos a llamar la funcion imprimirAlerta 
            imprimirAlerta("Los campos son obligatorios", "error");
            return;
        }else if(isNaN(inputTelefono)){
            //Mandamos a llamar la funcion imprimirAlerta 
            imprimirAlerta("El campo de telefono debe ser un valor numerico", "error")
            return;
        }
        
        //Mandamos alerta de datos correctos
        imprimirAlerta("Datos ingresados de manera correcta");
        //Creamos un nuevo objeto con los valores de los input
        const cliente = {
            nombre: inputNombre,
            correo: inputCorreo,
            telefono: Number(inputTelefono),
            empresa: inputEmpresa,
            id: Date.now()
        }
        //Llamamos a la funcion agregarEnDB(cliente)
        agregarEnDB(cliente);
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

    //Funcion que agrega los objetos a la base de datos 
    function agregarEnDB(cliente){
        //Creamos variable de transaccion 
        const transaccion = DB.transaction(["crm"], "readwrite");
        //Creamos variable de objectStore
        let objectStore = transaccion.objectStore("crm");

        //Agregamos el objeto "cliente" que recibimos en la base de datos 
        objectStore.add(cliente);

        //Mandamos mensaje de transaccion completada o fallida
        transaccion.oncomplete = () =>{
            imprimirAlerta("Cliente agregado a la base de datos");
            //Reseteamos el formulario 
            formulario.reset();
            //Tres segundos despues de la alerta nos dirigimos al index
            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
        }
        transaccion.onerror = () => {
            imprimirAlerta("Error, cliente no agregado a la base de datos", "error");
        }
    }
})();
