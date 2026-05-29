const Catalogo = {
  // ==========================================
  // DATOS
  // ==========================================
  productos: {
    cafes: [
      { nombre: "Mokka", precio: 55, cantidad: "300ml" },
      { nombre: "Capucchino", precio: 45, cantidad: "250ml" },
      // Agregamos la propiedad enPromocion a algunos productos
      { nombre: "Espresso", precio: 30, cantidad: "60ml", enPromocion: true },
      { nombre: "Latte Macchiato", precio: 50, cantidad: "300ml" }
    ],
    postres: [
      { nombre: "Brownie", precio: 35, cantidad: "100gr" },
      { nombre: "Pastel de Zanahoria", precio: 60, cantidad: "1 rebanada" },
      { nombre: "Galleta de Chispas", precio: 20, cantidad: "1 pieza", enPromocion: true },
      { nombre: "Cheesecake", precio: 65, cantidad: "1 rebanada" }
    ],
    bebidasFrias: [
      { nombre: "Smoothie de Mango", precio: 50, cantidad: "400ml" },
      { nombre: "Frappe de Oreo", precio: 70, cantidad: "500ml" },
      { nombre: "Té Helado de Limón", precio: 35, cantidad: "400ml", enPromocion: true }
    ]
  },

  // Función interna (utilidad) para unir todos los productos en un solo array.
  // Facilita muchísimo usar filter() y find() después.
  _obtenerTodoEnUnaLista: function() {
    let todos = [];
    for (let categoria in this.productos) {
      // concat() une dos arrays en uno solo
      todos = todos.concat(this.productos[categoria]);
    }
    return todos;
  },

  mostrarMenuDinamico: function() {
    console.log("--- MENÚ DE LA CAFETERÍA ---");
    for (let categoria in this.productos) {
      console.log(`\n** ${categoria.toUpperCase()} **`);
      
      let lista = this.productos[categoria];
      for(let i = 0; i < lista.length; i++) {
        console.log("- " + lista[i].nombre + " ($" + lista[i].precio + ")");
      }
    }
  },

  obtenerPromociones: function() {
    let todosLosProductos = this._obtenerTodoEnUnaLista();
    // filter() crea una lista nueva solo con los que tengan enPromocion === true
    return todosLosProductos.filter(producto => producto.enPromocion === true);
  },

  obtenerProductosDisponibles: function() {
    return this._obtenerTodoEnUnaLista();
  },


  // Usamos find() para traer un solo objeto
  obtenerProducto: function(nombreProducto) {
    let todosLosProductos = this._obtenerTodoEnUnaLista();
    
    let encontrado = todosLosProductos.find(
      producto => producto.nombre.toLowerCase() === nombreProducto.toLowerCase()
    );
    
    // Si no encuentra nada, find() devuelve 'undefined'. Lo convertimos a 'null'
    if (encontrado !== undefined) {
      return encontrado;
    } else {
      return null;
    }
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

  // Usamos filter() para traer UNA LISTA de objetos
  obtenerProductosBaratos: function(precioMaximo = 40) {
    let todosLosProductos = this._obtenerTodoEnUnaLista();
    return todosLosProductos.filter(producto => producto.precio <= precioMaximo);
  },

  obtenerProductosCaros: function(precioMinimo = 60) {
    let todosLosProductos = this._obtenerTodoEnUnaLista();
    return todosLosProductos.filter(producto => producto.precio >= precioMinimo);
  },

  obtenerBebidas: function() {
    return this.productos.cafes.concat(this.productos.bebidasFrias);
  },

  obtenerPostres: function() {
    return this.productos.postres;
  },

  // CRUD

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
  },

  // Filtros y Búsquedas

  // Une todas las categorías en una sola lista para facilitar el uso de filter y find
  _obtenerTodosLosProductos: function() {
    let todos = [];
    for (let categoria in this.productos) {
      todos = todos.concat(this.productos[categoria]);
    }
    return todos;
  },

  // Usa filter() para devolver un array con productos de $40 o menos
  obtenerProductosBaratos: function() {
    let todos = this._obtenerTodosLosProductos();
    return todos.filter(producto => producto.precio <= 40);
  },

  // Usa filter() para devolver un array con productos mayores a $60
  obtenerProductosCaros: function() {
    let todos = this._obtenerTodosLosProductos();
    return todos.filter(producto => producto.precio > 60);
  },

  obtenerBebidas: function() {
    return this.productos.cafes.concat(this.productos.bebidasFrias);
  },

  obtenerPostres: function() {
    return this.productos.postres;
  },

  // Usa find() para devolver un único objeto que coincida con el nombre
  buscarProductoEspecifico: function(nombreProducto) {
    let todos = this._obtenerTodosLosProductos();
    return todos.find(producto => producto.nombre.toLowerCase() === nombreProducto.toLowerCase());
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Catalogo;
}