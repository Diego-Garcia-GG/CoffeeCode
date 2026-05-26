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
            const menuCompleto = Catalogo.productos;
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

const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function iniciarSeguimiento(resultadoPedidoPromesa) {
    const contenedor = document.getElementById('seguimiento-pedido');
    contenedor.style.display = 'block';
    
    const pasoRecibido = document.getElementById('paso-recibido');
    const pasoPreparando = document.getElementById('paso-preparando');
    const pasoEmpacando = document.getElementById('paso-empacando');
    const pasoFinal = document.getElementById('paso-final');
    
    const iconoFinal = document.getElementById('icono-final');
    const nombreFinal = document.getElementById('nombre-final');
    const barra = document.getElementById('barra-progreso');
    const estadoTexto = document.getElementById('estado-texto');
    
    [pasoRecibido, pasoPreparando, pasoEmpacando, pasoFinal].forEach(p => {
        p.className = 'paso';
    });
    pasoFinal.classList.remove('cancelado');
    barra.style.width = '0%';
    barra.style.background = 'linear-gradient(90deg, #ffd700, #00ff00)';
    iconoFinal.innerText = '✓';
    nombreFinal.innerText = 'Estado Final';
    estadoTexto.innerText = '';
    estadoTexto.style.color = '#fff';

    // 1. Pedido Recibido
    pasoRecibido.classList.add('activo');
    estadoTexto.innerText = "Estado: Pedido recibido. Registrando en cocina...";
    await esperar(1500);
    
    pasoRecibido.classList.remove('activo');
    pasoRecibido.classList.add('completado');
    barra.style.width = '33%';

    // 2. Preparando
    pasoPreparando.classList.add('activo');
    estadoTexto.innerText = "Estado: Preparando tu pedido en la cocina (esperando confirmación)...";
    
    try {
        // Promesas
        const resultado = await resultadoPedidoPromesa;
        
        pasoPreparando.classList.remove('activo');
        pasoPreparando.classList.add('completado');
        barra.style.width = '66%';

        // 3. Empacando
        pasoEmpacando.classList.add('activo');
        estadoTexto.innerText = "Estado: Empacando y sellando tus bebidas/postres...";
        await esperar(1500);
        
        pasoEmpacando.classList.remove('activo');
        pasoEmpacando.classList.add('completado');
        barra.style.width = '100%';

        // 4. Estado Final (Entregado)
        pasoFinal.classList.add('activo');
        pasoFinal.classList.add('completado');
        iconoFinal.innerText = '✓';
        nombreFinal.innerText = 'Entregado';
        estadoTexto.innerText = "Estado: " + resultado.mensaje;
        estadoTexto.style.color = "green";
        
        const divMensaje = document.getElementById('mensaje');
        divMensaje.style.color = "green";
        divMensaje.innerText = "¡Pedido finalizado con éxito!";
    } catch (errorFallo) {
        // En caso de que falle la preparación en cocina, se interrumpe y se cancela de inmediato
        pasoPreparando.classList.remove('activo');
        pasoPreparando.classList.add('cancelado');
        
        pasoFinal.classList.add('cancelado');
        iconoFinal.innerText = '✗';
        nombreFinal.innerText = 'Cancelado';
        estadoTexto.innerText = "Estado: " + errorFallo;
        estadoTexto.style.color = "red";
        barra.style.background = 'red';
        
        const divMensaje = document.getElementById('mensaje');
        divMensaje.style.color = "red";
        divMensaje.innerText = "El pedido no pudo completarse.";
    }
}

window.mostrarResumen = function() {
    actualizarResumen();
    
    // Si el pedido está vacío, mostrar error de inmediato sin animar
    const pedidos = Caja.obtenerListaDePedidos();
    if (pedidos.length === 0) {
        const divMensaje = document.getElementById('mensaje');
        divMensaje.style.color = "red";
        divMensaje.innerText = "Error: No has agregado ningún producto al pedido.";
        return;
    }

    document.getElementById('producto').disabled = true;
    document.getElementById('cantidad').disabled = true;

    // Deshabilitar botones para evitar clics dobles mientras procesa
    const botones = document.querySelectorAll('button');
    botones.forEach(btn => btn.disabled = true);

    const divMensaje = document.getElementById('mensaje');
    divMensaje.style.color = "blue";
    divMensaje.innerText = "Pedido en proceso...";

    // Envolver la ejecución del callback de procesarPedido en una promesa para esperar su resultado
    const resultadoPedidoPromesa = new Promise((resolve, reject) => {
        Caja.procesarPedido(
            function(mensajeListo) {
                resolve({ exito: true, mensaje: mensajeListo });
            },
            function(mensajeCancelado) {
                reject(mensajeCancelado);
            }
        );
    });

    // Iniciar la animación asíncrona pasando la promesa del pedido
    iniciarSeguimiento(resultadoPedidoPromesa);
}

// Inicializar cuando cargue la página
window.onload = inicializarUI;
