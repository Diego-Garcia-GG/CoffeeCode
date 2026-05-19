const CatalogoRef = (typeof window !== 'undefined' && window.Catalogo) 
    ? window.Catalogo 
    : require('./moduloCatalogo');

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
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Caja;
}
