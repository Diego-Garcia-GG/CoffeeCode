const Caja = {
  listaDePedidos: [],
  totalAcumulado: 0,

  agregarPedidos: function(nombreProducto, cantidad) {
    let precioProducto = Catalogo.obtenerPrecio(nombreProducto);
    
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

  obtenerListaDePedidos: function() {
    return this.listaDePedidos;
  },

  obtenerTotalAcumulado: function() {
    return this.totalAcumulado;
  }
};
