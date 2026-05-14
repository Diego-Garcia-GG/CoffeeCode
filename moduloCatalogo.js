// moduloCatalogo.js

const Catalogo = {
  // ==========================================
  // 1. DATOS
  // ==========================================
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

  // ==========================================
  // 2. FUNCIONES
  // ==========================================

  // Obtener todos los productos (Menú completo)
  obtenerMenuCompleto: function() {
    return this.productos;
  },

  // Obtener un solo producto por su nombre
  obtenerProducto: function(nombreProducto) {
    // 1. Recorremos cada categoría (cafes, postres, etc.)
    for (let categoria in this.productos) {
      let listaDeProductos = this.productos[categoria];
      
      // 2. Usamos un bucle 'for' clásico para revisar producto por producto
      for (let i = 0; i < listaDeProductos.length; i++) {
        let productoActual = listaDeProductos[i];
        
        // 3. Comparamos los nombres
        if (productoActual.nombre.toLowerCase() === nombreProducto.toLowerCase()) {
          return productoActual; // Lo encontramos, lo devolvemos
        }
      }
    }
    return null; // Si termina todos los bucles y no encontró nada
  },

  // Obtener solo el precio 
  obtenerPrecio: function(nombreProducto) {
    let producto = this.obtenerProducto(nombreProducto);
    if (producto !== null) {
      return producto.precio;
    } else {
      console.log("Error: El producto '" + nombreProducto + "' no existe.");
      return null;
    }
  },

  // Añadir un nuevo producto a una categoría específica
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

  // Actualizar los datos de un producto existente
  actualizarProducto: function(nombreProducto, nuevosDatos) {
    for (let categoria in this.productos) {
      let listaDeProductos = this.productos[categoria];
      
      for (let i = 0; i < listaDeProductos.length; i++) {
        let productoActual = listaDeProductos[i];
        
        if (productoActual.nombre.toLowerCase() === nombreProducto.toLowerCase()) {
          // Si lo encuentra, actualizamos sus propiedades una por una
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

  // Eliminar un producto del catálogo
  eliminarProducto: function(nombreProducto) {
    for (let categoria in this.productos) {
      let listaDeProductos = this.productos[categoria];
      
      for (let i = 0; i < listaDeProductos.length; i++) {
        if (listaDeProductos[i].nombre.toLowerCase() === nombreProducto.toLowerCase()) {
          // El método splice elimina elementos. Le decimos: en la posición 'i', borra '1' elemento.
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
