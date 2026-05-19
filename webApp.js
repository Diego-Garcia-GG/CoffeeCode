// --- Lógica de Renderizado Dinámico ---
function inicializarUI() {
    // 1. Renderizar Promociones
    const promosDiv = document.getElementById('promociones');
    const promociones = Catalogo.obtenerPromociones();
    
    if (promociones.length > 0) {
        const promosHtml = promociones.map(p => 
            `<li><strong>${p.nombre}</strong> a solo $${p.precio}</li>`
        ).join('');
        promosDiv.innerHTML = `<ul>${promosHtml}</ul>`;
    } else {
        promosDiv.innerHTML = "<p>No hay promociones activas hoy.</p>";
    }

    // 2. Cargar menú completo por defecto
    filtrarMenu('todos');
}

// Función que hace uso de los métodos de filter() del Catálogo (Módulo de cocina)
window.filtrarMenu = function(filtro) {
    const menuDiv = document.getElementById('menu');
    let listaProductos = [];
    let titulo = "";

    switch (filtro) {
        case 'baratos':
            listaProductos = Catalogo.obtenerProductosBaratos(); // USA filter()
            titulo = "Opciones Económicas";
            break;
        case 'caros':
            listaProductos = Catalogo.obtenerProductosCaros(); // USA filter()
            titulo = "Opciones Premium";
            break;
        case 'bebidas':
            listaProductos = Catalogo.obtenerBebidas();
            titulo = "Bebidas Frias y Calientes";
            break;
        case 'postres':
            listaProductos = Catalogo.obtenerPostres();
            titulo = "Postres";
            break;
        default:
            // Para 'todos', mostramos las categorías separadas como antes
            const menuCompleto = Catalogo.obtenerMenuCompleto();
            let menuHtml = '';
            Object.keys(menuCompleto).forEach(categoria => {
                menuHtml += `<h3>${categoria.toUpperCase()}</h3><ul>`;
                menuHtml += menuCompleto[categoria].map(prod => 
                    `<li>${prod.nombre} - $${prod.precio} <span style="color:gray; font-size:0.8em">(${prod.cantidad})</span></li>`
                ).join('');
                menuHtml += `</ul>`;
            });
            menuDiv.innerHTML = menuHtml;
            return;
    }

    // Si se aplicó un filtro, renderizamos la lista plana filtrada
    let menuHtml = `<h3>${titulo}</h3><ul>`;
    if (listaProductos.length > 0) {
        menuHtml += listaProductos.map(prod => 
            `<li>${prod.nombre} - $${prod.precio} <span style="color:gray; font-size:0.8em">(${prod.cantidad})</span></li>`
        ).join('');
    } else {
        menuHtml += `<li>No se encontraron productos en esta categoría.</li>`;
    }
    menuHtml += `</ul>`;
    menuDiv.innerHTML = menuHtml;
}

// --- Interacción con el usuario ---
window.agregarAlPedido = function() {
    const nombreProducto = document.getElementById('producto').value.trim();
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const divMensaje = document.getElementById('mensaje');
    
    if (!nombreProducto || isNaN(cantidad) || cantidad <= 0) {
        divMensaje.style.color = "red";
        divMensaje.innerText = "Por favor ingresa un producto y una cantidad válida.";
        return;
    }

    // HACE USO DEL MÉTODO QUE UTILIZA find()
    const productoEncontrado = Catalogo.buscarProductoEspecifico(nombreProducto);

    if (productoEncontrado !== undefined && productoEncontrado !== null) {
        Caja.agregarPedidos(productoEncontrado.nombre, cantidad);
        divMensaje.style.color = "green";
        divMensaje.innerText = `¡Agregado: ${cantidad}x ${productoEncontrado.nombre}!`;
        document.getElementById('producto').value = '';
        document.getElementById('cantidad').value = '1';
        actualizarResumen();
    } else {
        divMensaje.style.color = "red";
        divMensaje.innerText = `El producto no existe.`;
    }
}

function actualizarResumen() {
    const resumenDiv = document.getElementById('resumen');
    const pedidos = Caja.obtenerListaDePedidos();
    
    if (pedidos.length === 0) return;

    let html = '<ul>' + pedidos.map(p => 
        `<li>${p.cantidad}x ${p.producto} - $${p.subtotal}</li>`
    ).join('') + '</ul>';
    
    // HACE USO DE reduce() Y DESTRUCTURING DEL MÓDULO DE CAJA
    const { subtotal, iva, total } = Caja.calcularTotales();

    html += `<div style="text-align: right; margin-top: 15px;">
                <p>Subtotal: $${subtotal.toFixed(2)}</p>
                <p>IVA (16%): $${iva.toFixed(2)}</p>
                <h3>Total a Pagar: $${total.toFixed(2)}</h3>
             </div>`;
             
    resumenDiv.innerHTML = html;
}

window.mostrarResumen = function() {
    actualizarResumen();
    document.getElementById('mensaje').style.color = "blue";
    document.getElementById('mensaje').innerText = "Pedido finalizado.";
    document.getElementById('producto').disabled = true;
    document.getElementById('cantidad').disabled = true;
}

// Inicializar cuando cargue la página
window.onload = inicializarUI;
