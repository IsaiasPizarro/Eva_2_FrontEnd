// Arreglo donde se almacenarán los usuarios
let usuarios = [];
// varriable de tipo boolean para controlar ordenamiento por edad de los usuarios
let ordenadoPorEdad = false;

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnAgregar').addEventListener('click', agregarUsuario);
    document.getElementById('filtroRol').addEventListener('change', filtrarUsuarios);
    document.getElementById('btnOrdenar').addEventListener('click', ordenarPorEdad);
    // Mostrar estadísticas iniciales
    actualizarEstadisticas();
});

// ==================== VALIDACIÓN ====================

function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const edad = parseInt(document.getElementById('edad').value);

    // Validar nombre el espacio no puede estar vacío y debe tener al menos 4 caracteres
    if (!nombre || nombre.length < 4) {
        alert('El nombre debe tener al menos 4 caracteres');
        return false;
    }

    // Validar edad de activdad lavoral entre 0 y 150 años 
    if (isNaN(edad) || edad <= 0 || edad > 150) {
        alert('La edad debe ser un número entre 1 y 150');
        return false;
    }

    return true;
}

// ==================== AGREGAR USUARIO ====================
// Función para agregar un nuevo usuario al arreglo y actualizar la vista
function agregarUsuario() {
    if (!validarFormulario()) {
        return;
    }
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const edad = parseInt(document.getElementById('edad').value);
    const rol = document.getElementById('rol').value;

    // crea objeto usuario con ID único basado en fecha actual, nombre, edad, rol y estado inicial "Activo"
    const usuario = {
        id: Date.now(), // ID único basado en timestamp
        nombre: nombre,
        edad: edad,
        rol: rol,
        estado: 'Activo' // Estado inicial por defecto al agregar un nuevo usuario
    };

    // Agregar usuario al arreglo
    usuarios.push(usuario);

    // Limpiar formulario
    document.getElementById('formUsuario').reset();

    // Actualiza la tabla de usuarios y las estadísticas
    filtrarUsuarios();
    actualizarEstadisticas();

    console.log('Usuario agregado:', usuario);
}

// ==================== MOSTRAR USUARIOS ====================
// Función para mostrar los usuarios en la tabla
function mostrarUsuarios() {
    const tbody = document.getElementById('tablaUsuarios');
    tbody.innerHTML = ''; // Limpiar tabla

    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay usuarios registrados</td></tr>';
        return;
    }
// Recorrer el arreglo de usuarios y crear filas para cada uno
    usuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        
       // color de estado: verde para "Activo" y rojo para "Inactivo"
        const colorEstado = usuario.estado === 'Activo' ? 'success' : 'danger';
        
        const colorRol = usuario.rol === 'Administrador' ? 'warning' : 'info';
         // contenido del html de la fila por cada usuario, mostrando nombre, edad, rol con badge de color y estado con badge de color, además de botones para cambiar estado y eliminar usuario
        fila.innerHTML = `
            <td><strong>${usuario.nombre}</strong></td>
            <td>${usuario.edad}</td>
            <td><span class="badge bg-${colorRol}">${usuario.rol}</span></td>
            <td><span class="badge bg-${colorEstado}">${usuario.estado}</span></td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="cambiarEstado(${usuario.id})">
                    ${usuario.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${usuario.id})">
                    Eliminar
                </button> 
            </td>
        `;

        tbody.appendChild(fila);
    });
}

// ==================== FILTRAR USUARIOS ====================
// Función para filtrar usuarios por rol seleccionado
function filtrarUsuarios() {

    // Obtener el valor del filtro seleccionado
    const filtro = document.getElementById('filtroRol').value;
    const tbody = document.getElementById('tablaUsuarios');
    tbody.innerHTML = '';
    // copiar el arreglo de usuarios a una nueva variable para aplicar el filtro sin modificar el arreglo original
    let usuariosFiltrados = usuarios;

    if (filtro !== 'Todos') {
        usuariosFiltrados = usuarios.filter(u => u.rol === filtro);
    }
// Si no hay usuarios que coincidan con el filtro, mostrar mensaje en la tabla
    if (usuariosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay usuarios con ese rol</td></tr>';
        return;
    }
// Recorrer el arreglo de usuarios filtrados y crear filas para cada uno, similar a la función mostrarUsuarios pero aplicando el filtro
    usuariosFiltrados.forEach(usuario => {
        const fila = document.createElement('tr');
        const colorEstado = usuario.estado === 'Activo' ? 'success' : 'danger';
        const colorRol = usuario.rol === 'Administrador' ? 'warning' : 'info';

        fila.innerHTML = `
            <td><strong>${usuario.nombre}</strong></td>
            <td>${usuario.edad}</td>
            <td><span class="badge bg-${colorRol}">${usuario.rol}</span></td>
            <td><span class="badge bg-${colorEstado}">${usuario.estado}</span></td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="cambiarEstado(${usuario.id})">
                    ${usuario.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${usuario.id})">
                    Eliminar
                </button>
            </td>
        `;

        tbody.appendChild(fila);
    });
}

// ==================== CAMBIAR ESTADO ====================
// Función para cambiar el estado de un usuario entre "Activo" e "Inactivo"
function cambiarEstado(id) {
    const usuario = usuarios.find(u => u.id === id);
    
    if (usuario) {
        usuario.estado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
        filtrarUsuarios();
        actualizarEstadisticas();
        console.log('Estado cambió para:', usuario.nombre);
    }
}

// ==================== ELIMINAR USUARIO ====================
// Función para eliminar un usuario del arreglo y actualizar la vista
function eliminarUsuario(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        usuarios = usuarios.filter(u => u.id !== id);
        filtrarUsuarios();
        actualizarEstadisticas();
        console.log('Usuario eliminado');
    }
}

// ==================== ORDENAR POR EDAD ====================
// Función para ordenar usuarios por edad, alternando entre orden ascendente y descendente cada vez que se hace clic en el botón
function ordenarPorEdad() {
    ordenadoPorEdad = !ordenadoPorEdad;
    
    if (ordenadoPorEdad) {
        usuarios.sort((a, b) => a.edad - b.edad);
    } else {
        usuarios.sort((a, b) => b.edad - a.edad);
    }

    filtrarUsuarios();
    
    // Cambiar texto del botón
    const btn = document.getElementById('btnOrdenar');
    btn.textContent = ordenadoPorEdad ? 'Ordenar: Menor a Mayor' : 'Ordenar: Mayor a Menor';
}

// ==================== ESTADÍSTICAS ====================
// Función para actualizar las estadísticas de usuarios, 
// contando el total, activos, inactivos, administradores y usuarios normales, y mostrando esta información en un div específico  
function actualizarEstadisticas() {
    const total = usuarios.length;
    const activos = usuarios.filter(u => u.estado === 'Activo').length;
    const inactivos = usuarios.filter(u => u.estado === 'Inactivo').length;
    const administradores = usuarios.filter(u => u.rol === 'Administrador').length;
    const usuariosNormales = usuarios.filter(u => u.rol === 'Usuario').length;
    // Mostrar estadísticas dinamica en el div con id "stats"
    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = `
        <strong>Total:</strong> ${total} <br>
        <strong>Activos:</strong> ${activos} <br>
        <strong>Inactivos:</strong> ${inactivos} <br>
        <strong>Administradores:</strong> ${administradores} <br>
        <strong>Usuarios:</strong> ${usuariosNormales}
    `;
}