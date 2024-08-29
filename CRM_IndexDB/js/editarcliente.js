/**
 * VIDEO NO. 256 QUERY PARA OBTENER CADA CLIENTE2
 */

//Creamos IFI para que metodos y variables sean solo locales
(function(){
    //Variable que va a menejar todo lo referente a la DB
    let DB;
    //Variable del idCliente 
    let idCliente;

    //Selectores de los input del formulario 
    const inputNombre = document.querySelector("#nombre");
    const inputEmail = document.querySelector("#email");
    const inputTelefono = document.querySelector("#telefono");
    const inputEmpresa = document.querySelector("#empresa");
    //Selector del formulario 
    const formulario = document.querySelector("#formulario");

    //Agregamos evento al formulario para ir a la funcion actualizarRegistro
    formulario.addEventListener("submit", actualizarRegistro);

    //Cargamos el documento html
    document.addEventListener("DOMContentLoaded", () => {
        console.log("DOCUMENTO HTML CARGADO Y LISTO");
        //Llamamos a la funcion que nos conecta la DB
        conectarDB();
        
        //Retresamos la obtencion de los datos de cliente 1 segundo
        setTimeout(() => {
            //Verificamos el ID de la URL
            const parametrosURL = new URLSearchParams(window.location.search)
            //Guardamos el ID que recibimos como parametro
            idCliente = parametrosURL.get("id");  
            
            //Si tenemos idCliente llamamos a la funcion obtenerCliente
            if(idCliente){
                obtenerCliente(idCliente);
            }
        }, 100);        
    });

    //Funcion que nos conecta la DB
    function conectarDB(){
        //Realizamos la conexion a la DB
        const conexionAbierta = window.indexedDB.open("crm", 1);

        //Mensajes de posible error o exito en la conexion a la base de datos 
        conexionAbierta.onerror = () =>{
            console.log("Ocurrio un error en la conexion a la DB");
        }
        conexionAbierta.onsuccess = function(e){
            //Reasignamos el valor de DB
            DB = e.target.result;
            console.log("Conexion a la DB exitosa");
        }
    }

    //Funcion que obtiene los datos del cliente acorde al ID dado
    function obtenerCliente(idCliente){
        //Definimos variable de transacion 
        let transacion = DB.transaction(["crm"], "readwrite");
        //Definimos variable de objectStore
        let objectStore = transacion.objectStore("crm");

        //Abrimos un cursor
        objectStore.openCursor().onsuccess = function(e){
            //Definimos cursor
            let cursor = e.target.result;

            if(cursor){
                //Nos traemos el registro acorde al id
                if(cursor.value.id === Number(idCliente)){
                    //Llamamos a la funcion llenarFormulario, le pasamos el cursor.value
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    //Funcion que llena el formulario
    function llenarFormulario(datosCliente){
        //Hacemos destructuring de los datos del cliente
        const {nombre, correo, telefono, empresa} = datosCliente;

        //Selectores con nuevos valores
        inputNombre.value = nombre;
        inputEmail.value = correo;
        inputTelefono.value = telefono;
        inputEmpresa.value = empresa;
    }

    //Funcion que actualiza el registro en la DB
    function actualizarRegistro(e){
        e.preventDefault();
        
        //Validamos los input
        if(inputNombre.value === "" || inputEmail.value === "" || inputTelefono.value === "" || inputEmpresa.value === ""){
            imprimirAlerta("Los campos no deben estar vacios", "error");
            return;
        }else if(isNaN(inputTelefono.value)){
            imprimirAlerta("El campo Telefono debe ser numerico", "error");
            return
        }

        //Actualizamos el cliente 
        const clienteActualizado = {
            nombre: inputNombre.value,
            correo: inputEmail.value,
            telefono: inputTelefono.value,
            empresa: inputEmpresa.value,
            id: Number(idCliente) 
        }

        //Variable de transaccion 
        const transaccion = DB.transaction(["crm"], "readwrite");
        //Variable de objectStore
        const objectStore = transaccion.objectStore("crm");

        //Actualizamos en la DB
        objectStore.put(clienteActualizado);
        
        //Completado y falla de la transaccion 
        transaccion.oncomplete = () => {
            //Mandamos alerta 
            imprimirAlerta("Registro Actualizado");
            //No redirigimos al index
            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
        }
        transaccion.onerror = () => {
            imprimirAlerta("Registro no actualizado", "error");
        }
    }
})();