const Catalogo = {
  productos: {
    cafes: [
      { nombre: "Mokka", precio: 55, cantidad: "300ml" },
      { nombre: "Capucchino", precio: 45, cantidad: "250ml" },
      { nombre: "Espresso", precio: 30, cantidad: "60ml" },
      { nombre: "Latte Macchiato", precio: 50, cantidad: "300ml" }
    ],
    postres: [
      { nombre: "Brownie", precio: 35, cantidad: "100gr" },
      { nombre: "Pastel de Zanahoria", precio: 60, cantidad: "1 rebanada" },
      { nombre: "Galleta de Chispas", precio: 20, cantidad: "1 pieza" },
      { nombre: "Cheesecake", precio: 65, cantidad: "1 rebanada" }
    ],
    bebidasFrias: [
      { nombre: "Smoothie de Mango", precio: 50, cantidad: "400ml" },
      { nombre: "Frappe de Oreo", precio: 70, cantidad: "500ml" },
      { nombre: "Té Helado de Limón", precio: 35, cantidad: "400ml" }
    ]
  },

  obtenerMenuCompleto: function() {
    return this.productos;
  },

  obtenerProducto: function(nombreProducto) {
    for (let categoria in this.productos) {
      let listaDeProductos = this.productos[categoria];
      
      for (let i = 0; i < listaDeProductos.length; i++) {
        let productoActual = listaDeProductos[i];
        
        if (productoActual.nombre.toLowerCase() === nombreProducto.toLowerCase()) {
          return productoActual;
        }
      }
    }
    return null;
  },

  obtenerPrecio: function(nombreProducto) {
    let producto = this.obtenerProducto(nombreProducto);
    if (producto !== null) {
      return producto.precio;
    } else {
      console.log("Error: El producto '" + nombreProducto + "' no existe.");
      return null;
    }
  },

  agregarProducto: function(categoria, nuevoProducto) {
    if (this.productos[categoria] !== undefined) {
      this.productos[categoria].push(nuevoProducto);
      console.log("Éxito: " + nuevoProducto.nombre + " añadido a " + categoria + ".");
      return true;
    } else {
      console.log("Error: La categoría '" + categoria + "' no existe.");
      return false;
    }
  },

  actualizarProducto: function(nombreProducto, nuevosDatos) {
    for (let categoria in this.productos) {
      let listaDeProductos = this.productos[categoria];
      
      for (let i = 0; i < listaDeProductos.length; i++) {
        let productoActual = listaDeProductos[i];
        
        if (productoActual.nombre.toLowerCase() === nombreProducto.toLowerCase()) {
          for (let propiedad in nuevosDatos) {
            productoActual[propiedad] = nuevosDatos[propiedad];
          }
          console.log("Éxito: " + nombreProducto + " ha sido actualizado.");
          return true;
        }
      }
    }
    console.log("Error: No se pudo actualizar. '" + nombreProducto + "' no encontrado.");
    return false;
  },

  eliminarProducto: function(nombreProducto) {
    for (let categoria in this.productos) {
      let listaDeProductos = this.productos[categoria];
      
      for (let i = 0; i < listaDeProductos.length; i++) {
        if (listaDeProductos[i].nombre.toLowerCase() === nombreProducto.toLowerCase()) {
          listaDeProductos.splice(i, 1);
          console.log("Éxito: " + nombreProducto + " ha sido eliminado del menú.");
          return true;
        }
      }
    }
    console.log("Error: No se pudo eliminar. '" + nombreProducto + "' no encontrado.");
    return false;
  }
};

module.exports = Catalogo;
