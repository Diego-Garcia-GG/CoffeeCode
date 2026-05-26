let CatalogoRef;
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
  CatalogoRef = require('./moduloCatalogo');
} else {
  CatalogoRef = Catalogo;
}

const Caja = {
  listaDePedidos: [],
  totalAcumulado: 0,
  contadorPedidos: 0,
  listeners: {
    pedidoListo: [],
    pedidoCancelado: []
  },

  registrarEvento: function(evento, callback) {
    if (this.listeners[evento]) {
      this.listeners[evento].push(callback);
      return true;
    }
    return false;
  },

  _notificar: function(evento, datosPedido) {
    if (this.listeners[evento]) {
      this.listeners[evento].forEach(callback => {
        callback(datosPedido);
      });
    }
  },

  agregarPedidos: function (nombreProducto, cantidad) {
    let precioProducto = CatalogoRef.obtenerPrecio(nombreProducto);

    if (precioProducto !== null) {
      let subtotal = precioProducto * cantidad;

      const nuevoPedido = {
        id: ++this.contadorPedidos,
        producto: nombreProducto,
        cantidad: cantidad,
        precioUnitario: precioProducto,
        subtotal: subtotal,
        estado: 'pendiente'
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

  cambiarEstadoPedido: function(idPedido, nuevoEstado) {
    const pedido = this.listaDePedidos.find(p => p.id === idPedido);

    if (pedido) {
      pedido.estado = nuevoEstado;

      if (nuevoEstado === 'listo') {
        this._notificar('pedidoListo', {
          id: pedido.id,
          producto: pedido.producto,
          cantidad: pedido.cantidad,
          timestamp: new Date()
        });
      } else if (nuevoEstado === 'cancelado') {
        this.totalAcumulado -= pedido.subtotal;
        this._notificar('pedidoCancelado', {
          id: pedido.id,
          producto: pedido.producto,
          cantidad: pedido.cantidad,
          subtotal: pedido.subtotal,
          timestamp: new Date()
        });
      }

      return true;
    }
    return false;
  },

  obtenerPedidoPorId: function(idPedido) {
    return this.listaDePedidos.find(p => p.id === idPedido);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Caja;
}
