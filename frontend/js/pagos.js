document.addEventListener('DOMContentLoaded', () => {
    const tablaPagos = document.getElementById('tablaPagos');
    const formAgregar = document.getElementById('formAgregarPago');
    const formEditar = document.getElementById('formEditarEstado');
    const modalEditar = new bootstrap.Modal(document.getElementById('modalEditarEstado'));

    // Cargar pagos
    const cargarPagos = async () => {
        try {
            const res = await fetch('/api/pagos');
            const pagos = await res.json();
            tablaPagos.innerHTML = '';
pagos.forEach(pago => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${pago.id}</td>
        <td>${new Date(pago.fecha).toLocaleDateString()}</td>
        <td>$${pago.monto}</td>
        <td>${pago.metodo_pago}</td>
        <td>${pago.nombre_usuario}</td> <!-- Mostrar nombre del usuario -->
        <td>${pago.estado}</td>
        <td>
            <button class="btn btn-sm btn-primary btn-editar" data-id="${pago.id}" data-estado="${pago.estado}">Editar</button>
            <button class="btn btn-sm btn-danger btn-eliminar" data-id="${pago.id}">Eliminar</button>
        </td>
    `;
    tablaPagos.appendChild(fila);
});


            // Botones
            document.querySelectorAll('.btn-eliminar').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    if (confirm('¿Eliminar este pago?')) {
                        await fetch(`/api/pagos/${id}`, { method: 'DELETE' });
                        cargarPagos();
                    }
                });
            });

            document.querySelectorAll('.btn-editar').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id;
                    const estado = btn.dataset.estado;
                    formEditar.id.value = id;
                    formEditar.estado.value = estado;
                    modalEditar.show();
                });
            });

        } catch (err) {
            console.error('❌ Error al cargar pagos:', err);
        }
    };

    // Agregar pago
    formAgregar.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(formAgregar));
        try {
            await fetch('/api/pagos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            formAgregar.reset();
            bootstrap.Modal.getInstance(document.getElementById('modalAgregarPago')).hide();
            cargarPagos();
        } catch (err) {
            console.error('❌ Error al agregar pago:', err);
        }
    });

    // Editar estado
    formEditar.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = formEditar.id.value;
        const estado = formEditar.estado.value;
        try {
            await fetch(`/api/pagos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado })
            });
            modalEditar.hide();
            cargarPagos();
        } catch (err) {
            console.error('❌ Error al actualizar estado:', err);
        }
    });

    cargarPagos();
});
