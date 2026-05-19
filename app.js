const readline = require('readline');
const Catalogo = require('./moduloCatalogo');
const Caja = require('./moduloCaja');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function mostrarMenu() {
  console.log("\n=== MENÚ DISPONIBLE ===");
  const menu = Catalogo.obtenerMenuCompleto();
  for (let categoria in menu) {
    console.log(`\n-- ${categoria.toUpperCase()} --`);
    menu[categoria].forEach(prod => {
      console.log(`- ${prod.nombre} ($${prod.precio})`);
    });
  }
  console.log("=======================\n");
}

function preguntarProducto() {
  rl.question('¿Qué producto deseas agregar? (escribe "salir" para terminar): ', (respuesta) => {
    if (respuesta.toLowerCase() === 'salir') {
      mostrarResumen();
      return;
    }

    const precio = Catalogo.obtenerPrecio(respuesta);
    if (precio !== null) {
      preguntarCantidad(respuesta);
    } else {
      preguntarProducto();
    }
  });
}

function preguntarCantidad(nombreProducto) {
  rl.question(`¿Cuántas unidades de ${nombreProducto} deseas?: `, (cantidadStr) => {
    const cantidad = parseInt(cantidadStr);
    if (!isNaN(cantidad) && cantidad > 0) {
      Caja.agregarPedidos(nombreProducto, cantidad);
      console.log(`\n¡Se agregaron ${cantidad}x ${nombreProducto} a tu pedido!`);
    } else {
      console.log("Por favor ingresa una cantidad válida mayor a 0.");
    }
    preguntarProducto();
  });
}

function mostrarResumen() {
  console.log("\n=== RESUMEN FINAL DEL PEDIDO ===");
  const pedidos = Caja.obtenerListaDePedidos();
  if (pedidos.length === 0) {
    console.log("No agregaste ningún producto.");
  } else {
    pedidos.forEach(p => {
      console.log(`${p.cantidad}x ${p.producto} - $${p.subtotal} ($${p.precioUnitario} c/u)`);
    });
    console.log("--------------------------------");
    console.log(`TOTAL A PAGAR: $${Caja.obtenerTotalAcumulado()}`);
  }
  console.log("================================\n");
  rl.close();
}

mostrarMenu();
preguntarProducto();
