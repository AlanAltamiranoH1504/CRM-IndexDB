//Creamos un IFI para que las variables y metodos solo sean locales
(function(){
    //Variable que va a manejar todos lo respecto a la DB
    let DB;
    //Selector para el tbody
    const listaClientes = document.querySelector("#listado-clientes");

    //Cargamos todo el documento html 
    document.addEventListener("DOMContentLoaded", () =>{
        //Mandamos a llamar la funcion que crea la DB
        crearDB();

        //Agregamos evento al listadocliente 
        listaClientes.addEventListener("click", eliminarCliente);
    });

    //Funcion que crea la DB
    function crearDB(){
        //Creamos la base de datos
        const crearDB = window.indexedDB.open("crm", 1);

        //Posibles mensajes de error o exito en la creacion de la DB
        crearDB.onsuccess = function(e){
            //Reasignamos el valor de DB
            DB = e.target.result;
            //Si ya hemos creado la DB mandamos a llamar la funcion que lista los clientes 
            listarClientes();
        }
        crearDB.onerror = () =>{
            console.log("Ha surgido un error en la creacion de la DB");
        }

        //Metodo que configura la base de datos 
        crearDB.onupgradeneeded = function(e){
            //Variable de referencia para la DB
            let db = e.target.result;
            //Creamos el objectStore 
            const objectStore = db.createObjectStore("crm", {
                keyPath: "id",
                autoIncrement: true
            });

            //Creamos la columnas de la base de datos
            objectStore.createIndex("nombre", "nombre", {unique: false});
            objectStore.createIndex("email", "email", {unique: true});
            objectStore.createIndex("telefono", "telefono", {unique:false});
            objectStore.createIndex("empresa", "empresa", {unique: false});
            objectStore.createIndex("id", "id", {unique: true});

            //Mandamos mensaje a la consola 
            console.log("Base de datos con columnas creada de manera correcta");
        }
    }

    //Funcion que lista los clientes de la DB
    function listarClientes(){
        //Creamos variable de tipo transaccion 
        const transaccion = DB.transaction(["crm"], "readwrite");
        //Creamos variable de tipo objectStore
        const objectStore = transaccion.objectStore("crm");


        //Leemos lo que hay en la DB
        objectStore.openCursor().onsuccess = function(e){
            const cursor = e.target.result;

            if(cursor){
                //Aplicamos destructuring al cursor
                const {nombre, correo, telefono, empresa, id} = cursor.value;
                
                //Si el valor de cursor es igual a true creamos un nuevo tr
                const tr = document.createElement("tr");
                //Agregamos contenido al tr
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                        <p class="text-sm leading-10 text-gray-700"> ${correo} </p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                        <p class="text-gray-700">${telefono}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                        <p class="text-gray-600">${empresa}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                        <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                        <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                    </td>
                `;

                //Agregamos el tr como hijo del tbody
                listaClientes.appendChild(tr);
                //Iteramos el cursor
                cursor.continue();
            }else{
                console.log("No hay mas registros");
            }
        }
    }

    //Funcion que elimina un cliente 
    function eliminarCliente(e){
        //Si damos click en el boton con la clase eliminar
        if(e.target.classList.contains = "eliminar"){
            //Obtenemos el id que hay en el boton eliminar 
            const idCLiente = Number(e.target.getAttribute("data-cliente"));
            
            //Creamos variable de transaccion 
            const transaccion = DB.transaction(["crm"], "readwrite");
            //Variable del objectStore
            const objectStore = transaccion.objectStore("crm");

            //Elimianmos el registro de la DB
            objectStore.delete(idCLiente);

            //Exito o falla de la transaccion 
            transaccion.oncomplete = () =>{
                console.log("Transaccion completa");
                //Recargamos la pagina index.html
                window.location.reload();
            }
        }
    }
})();
