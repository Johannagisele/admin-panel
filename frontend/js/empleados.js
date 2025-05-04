document.addEventListener("DOMContentLoaded", () => {
    const empleadosLista = document.getElementById("empleadosLista");
    const formulario = document.getElementById("formAgregarEmpleado");
    const busqueda = document.getElementById("busqueda");
    const filtroPuesto = document.getElementById("filtroPuesto");
    const btnModoOscuro = document.getElementById("modoOscuro");

    let empleados = JSON.parse(localStorage.getItem("empleados")) || [];
    let editandoIndex = -1; // Índice para saber si estamos editando

    function mostrarEmpleados() {
        empleadosLista.innerHTML = ""; 

        // Filtrar empleados según búsqueda y puesto
        const filtroBusqueda = busqueda.value.toLowerCase();
        const puestoSeleccionado = filtroPuesto.value;

        const empleadosFiltrados = empleados.filter(empleado => {
            const nombreCompleto = (empleado.nombre + " " + empleado.apellido).toLowerCase();
            const coincideBusqueda = nombreCompleto.includes(filtroBusqueda);
            const coincidePuesto = puestoSeleccionado === "" || empleado.puesto === puestoSeleccionado;
            return coincideBusqueda && coincidePuesto;
        });

        empleadosFiltrados.forEach((empleado, index) => {
            empleadosLista.innerHTML += `
                <tr data-index="${index}">
                    <td>${index + 1}</td>
                    <td>${empleado.nombre}</td>
                    <td>${empleado.apellido}</td>
                    <td>${empleado.puesto}</td>
                    <td>$${empleado.salario}</td>
                    <td>
                        <button class="btn btn-warning btn-sm btn-editar">✏ Editar</button>
                        <button class="btn btn-danger btn-sm btn-eliminar">🗑 Eliminar</button>
                    </td>
                </tr>
            `;
        });
    }

    // Función para agregar o editar un empleado
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const puesto = document.getElementById("puesto").value;
        const salario = parseFloat(document.getElementById("salario").value);

        if (editandoIndex === -1) {
            // Agregar un nuevo empleado
            empleados.push({ nombre, apellido, puesto, salario });
        } else {
            // Actualizar el empleado
            empleados[editandoIndex] = { nombre, apellido, puesto, salario };
            editandoIndex = -1; // Resetear la edición
        }

        // Guardar en el localStorage
        localStorage.setItem("empleados", JSON.stringify(empleados));
        
        // Limpiar el formulario después de agregar o editar
        formulario.reset();
        
        // Mostrar empleados
        mostrarEmpleados();
    });

    // Delegación de eventos para editar y eliminar empleados
    empleadosLista.addEventListener("click", function(e) {
        const target = e.target;
        const index = target.closest("tr").getAttribute("data-index");

        if (target.classList.contains("btn-editar")) {
            editarEmpleado(index);
        } else if (target.classList.contains("btn-eliminar")) {
            confirmarEliminar(index);
        }
    });

    // Función para confirmar la eliminación
    function confirmarEliminar(index) {
        const modalConfirmarEliminar = new bootstrap.Modal(document.getElementById("modalConfirmarEliminar"));
        const btnEliminarConfirmado = document.getElementById("btnEliminarConfirmado");

        btnEliminarConfirmado.onclick = function () {
            empleados.splice(index, 1);
            localStorage.setItem("empleados", JSON.stringify(empleados));
            mostrarEmpleados();
            modalConfirmarEliminar.hide();
        };

        modalConfirmarEliminar.show();
    }

    // Función para editar empleado
    window.editarEmpleado = function(index) {
        // Obtener los datos del empleado a editar
        const empleado = empleados[index];
        
        // Llenar el formulario con los datos existentes
        document.getElementById("nombre").value = empleado.nombre;
        document.getElementById("apellido").value = empleado.apellido;
        document.getElementById("puesto").value = empleado.puesto;
        document.getElementById("salario").value = empleado.salario;
        
        // Cambiar el texto del botón para indicar edición
        const btnSubmit = formulario.querySelector("button[type='submit']");
        btnSubmit.textContent = "Guardar Cambios";
    
        // Establecer el índice de edición
        editandoIndex = index;
    
        // Asegurarse de que al cerrar el modal, se reseteen los valores si es necesario
        const modal = new bootstrap.Modal(document.getElementById('modalAgregar'));
        modal.show();
    };
    

    // Filtro y búsqueda
    busqueda.addEventListener("input", mostrarEmpleados);
    filtroPuesto.addEventListener("change", mostrarEmpleados);

    // Modo oscuro
    btnModoOscuro.addEventListener("click", () => {
        document.body.classList.toggle("modo-oscuro");
    });

    // Mostrar los empleados al cargar
    mostrarEmpleados();
});





