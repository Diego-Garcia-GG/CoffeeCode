let CatalogoRef;
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
  CatalogoRef = require('./moduloCatalogo');
} else {
  CatalogoRef = Catalogo;
}

const Caja = {
  listaDePedidos: [],
  totalAcumulado: 0,

  agregarPedidos: function (nombreProducto, cantidad) {
    let precioProducto = CatalogoRef.obtenerPrecio(nombreProducto);

    if (precioProducto !== null) {
      let subtotal = precioProducto * cantidad;

      const nuevoPedido = {
        producto: nombreProducto,
        cantidad: cantidad,
        precioUnitario: precioProducto,
        subtotal: subtotal
      };

      this.listaDePedidos.push(nuevoPedido);
      this.totalAcumulado += subtotal;

      return true;
    }

    return false;
  },

  obtenerListaDePedidos: function () {
    return this.listaDePedidos;
  },

  //Funciones reduce y destructuring
  calcularTotales: function () {
    const subtotalGeneral = this.listaDePedidos.reduce((acumulador, { subtotal }) => {
      return acumulador + subtotal;
    }, 0);

    const iva = subtotalGeneral * 0.16;
    const total = subtotalGeneral + iva;

    return {
      subtotal: subtotalGeneral,
      iva: iva,
      total: total
    };
  },

  obtenerTotalAcumulado: function () {
    return this.totalAcumulado;
  },

  procesarPedido: function (onListo, onCancelado) {
    if (this.listaDePedidos.length === 0) {
      if (typeof onCancelado === 'function') {
        onCancelado("El pedido está vacío.");
      }
      return;
    }

    const promesas = this.listaDePedidos.map(item => {
      const hayIngredientes = Math.random() > 0.90; // 88% probabilidad de tener ingredientes
      const errorCritico = Math.random() > 0.01;     // 3% probabilidad de fallo crítico
      return CatalogoRef.prepararPedido(item.producto, hayIngredientes, errorCritico);
    });

    Promise.all(promesas)
      .then(resultados => {
        if (typeof onListo === 'function') {
          onListo("¡El pedido está listo! Todos los productos se prepararon con éxito.");
        }
      })
      .catch(error => {
        if (typeof onCancelado === 'function') {
          onCancelado(error);
        }
      });
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Caja;
}
