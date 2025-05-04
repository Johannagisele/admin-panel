document.addEventListener("DOMContentLoaded", function () {
    const productosLista = document.getElementById("productosLista");
    const formularioAgregar = document.getElementById("formAgregarProducto");
    const formularioEditar = document.getElementById("formEditarProducto");
    const btnEliminarConfirmado = document.getElementById("btnEliminarConfirmado");

    let productos = [];
    let productoAEliminar = null;
    let productoEditandoId = null;

    const API_URL = "http://localhost:3000/api/productos";

    // ✅ Mostrar productos desde el backend
    async function cargarProductos() {
        const res = await fetch(API_URL);
        productos = await res.json();

        productosLista.innerHTML = "";
        productos.forEach((producto) => {
            productosLista.innerHTML += `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>$${producto.precio}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.categoria}</td>
                    <td><img src="${producto.imagen_url}" alt="${producto.nombre}" width="50"></td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarProducto(${producto.id})">✏️ Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="confirmarEliminacion(${producto.id})">🗑 Eliminar</button>
                    </td>
                </tr>
            `;
        });
    }

    // 🆕 Agregar producto
    formularioAgregar.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();
        const precio = parseFloat(document.getElementById("precio").value);
        const stock = parseInt(document.getElementById("stock").value);
        const categoria = document.getElementById("categoria").value.trim();
        const imagen_url = document.getElementById("imagen_url").value.trim();

        // Validaciones
        const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        const urlImagenRegex = /\.(jpeg|jpg|png|gif|webp)$/i;

        if (!soloLetras.test(nombre)) {
            return alert("⚠️ El nombre solo puede contener letras y espacios.");
        }

        if (!soloLetras.test(descripcion)) {
            return alert("⚠️ La descripción solo puede contener letras y espacios.");
        }

        if (isNaN(precio) || precio <= 0) {
            return alert("⚠️ El precio debe ser un número mayor a 0.");
        }

        if (!Number.isInteger(stock) || stock < 0) {
            return alert("⚠️ El stock debe ser un número entero mayor o igual a 0.");
        }

        if (!soloLetras.test(categoria)) {
            return alert("⚠️ La categoría solo puede contener letras.");
        }

        if (!urlImagenRegex.test(imagen_url)) {
            return alert("⚠️ La URL de la imagen debe terminar en .jpg, .png, etc.");
        }

        const nuevoProducto = {
            nombre,
            descripcion,
            precio,
            stock,
            categoria,
            imagen_url
        };

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProducto)
            });

            const data = await res.json();
            console.log("✅ Respuesta del servidor:", data);

            if (res.ok) {
                await cargarProductos();
                formularioAgregar.reset();
                bootstrap.Modal.getInstance(document.getElementById("modalAgregar")).hide();
            } else {
                alert("❌ Error al agregar el producto: " + (data?.error || "Desconocido"));
            }
        } catch (error) {
            console.error("❌ Error en la solicitud:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });

    // ✏️ Editar producto
    window.editarProducto = function (id) {
        const producto = productos.find(p => p.id === id);
        productoEditandoId = id;

        document.getElementById("editNombre").value = producto.nombre;
        document.getElementById("editDescripcion").value = producto.descripcion;
        document.getElementById("editPrecio").value = producto.precio;
        document.getElementById("editStock").value = producto.stock;
        document.getElementById("editCategoria").value = producto.categoria;
        document.getElementById("editImagenUrl").value = producto.imagen_url;

        new bootstrap.Modal(document.getElementById("modalEditar")).show();
    };

    formularioEditar.addEventListener("submit", async function (e) {
        e.preventDefault();

        const actualizado = {
            nombre: document.getElementById("editNombre").value,
            descripcion: document.getElementById("editDescripcion").value,
            precio: parseFloat(document.getElementById("editPrecio").value),
            stock: parseInt(document.getElementById("editStock").value),
            categoria: document.getElementById("editCategoria").value,
            imagen_url: document.getElementById("editImagenUrl").value
        };

        const res = await fetch(`${API_URL}/${productoEditandoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(actualizado)
        });

        if (res.ok) {
            await cargarProductos();
            bootstrap.Modal.getInstance(document.getElementById("modalEditar")).hide();
        } else {
            alert("❌ Error al actualizar el producto");
        }
    });

    // 🗑 Confirmar eliminación
    window.confirmarEliminacion = function (id) {
        productoAEliminar = id;
        new bootstrap.Modal(document.getElementById("modalEliminar")).show(); // Cambio de modalConfirmarEliminar a modalEliminar
    };

    // 🗑 Eliminar producto
    btnEliminarConfirmado.addEventListener("click", async function () {
        if (productoAEliminar !== null) {
            const res = await fetch(`${API_URL}/${productoAEliminar}`, {
                method: "DELETE"
            });

            if (res.ok) {
                await cargarProductos();
                bootstrap.Modal.getInstance(document.getElementById("modalEliminar")).hide();
                productoAEliminar = null;
            } else {
                alert("❌ Error al eliminar el producto");
            }
        }
    });

    // 🔁 Cargar productos al iniciar
    cargarProductos();
});
