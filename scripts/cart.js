// cart.js - Sistema de carrito FUNCIONAL con notificaciones
console.log('✅ Cart.js cargado correctamente');

/**
 * Función para agregar productos al carrito - ESTA ES LA QUE SE LLAMA DESDE LOS BOTONES
 */
function agregarAlCarrito(nombre, precio) {
  console.log('🛒 Agregando al carrito:', nombre, precio);
  
  // Obtener carrito actual del localStorage
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  // Buscar si el producto ya existe en el carrito
  let productoExistente = carrito.find(item => item.nombre === nombre);
  
  if (productoExistente) {
    // Si existe, incrementar cantidad
    productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
    console.log('📦 Producto existente, nueva cantidad:', productoExistente.cantidad);
  } else {
    // Si no existe, agregar nuevo producto
    carrito.push({
      nombre: nombre,
      precio: precio,
      cantidad: 1
    });
    console.log('✨ Nuevo producto agregado al carrito');
  }
  
  // Guardar carrito actualizado
  localStorage.setItem('carrito', JSON.stringify(carrito));
  console.log('💾 Carrito guardado:', carrito);
  
  // Mostrar notificación INMEDIATAMENTE
  mostrarNotificacion(`✅ ${nombre} agregado al carrito`, 'success');
  
  // Actualizar contador INMEDIATAMENTE
  actualizarContadorCarrito();
}

/**
 * Función para mostrar notificación - MEJORADA Y VISIBLE
 */
function mostrarNotificacion(mensaje, tipo = 'success') {
  console.log('🔔 Mostrando notificación:', mensaje);
  
  // Buscar o crear elemento de notificación
  let notificacion = document.getElementById('notificacion-carrito');
  
  if (!notificacion) {
    console.log('📝 Creando elemento de notificación');
    notificacion = document.createElement('div');
    notificacion.id = 'notificacion-carrito';
    notificacion.className = 'notificacion-carrito';
    document.body.appendChild(notificacion);
  }
  
  // Establecer mensaje y clase
  notificacion.textContent = mensaje;
  notificacion.className = `notificacion-carrito ${tipo}`;
  
  // Forzar reflow para que la animación funcione
  notificacion.offsetHeight;
  
  // Mostrar notificación
  notificacion.classList.add('visible');
  console.log('👁️ Notificación visible');
  
  // Ocultar después de 3 segundos
  setTimeout(() => {
    notificacion.classList.remove('visible');
    console.log('👋 Notificación ocultada');
  }, 3000);
}

/**
 * Función para actualizar el contador del carrito
 */
function actualizarContadorCarrito() {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  let totalProductos = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  
  console.log('🔢 Actualizando contador. Total productos:', totalProductos);
  
  // Buscar elemento del contador
  let contador = document.getElementById('cart-count');
  
  if (contador) {
    contador.textContent = totalProductos;
    contador.style.display = totalProductos > 0 ? 'inline-block' : 'none';
    console.log('✅ Contador actualizado a:', totalProductos);
  } else {
    console.warn('⚠️ No se encontró el elemento cart-count');
  }
}

/**
 * Función para vaciar el carrito
 */
function vaciarCarrito() {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    localStorage.removeItem('carrito');
    console.log('🗑️ Carrito vaciado');
    
    // Si existe la función de mostrar carrito (en cart.html)
    if (typeof mostrarCarrito === 'function') {
      mostrarCarrito();
    }
    
    // Si existe la función de display (en cart.html)
    if (typeof displayCartItems === 'function') {
      displayCartItems();
    }
    
    mostrarNotificacion('🗑️ Carrito vaciado', 'info');
    actualizarContadorCarrito();
  }
}

/**
 * Función para eliminar un producto específico
 */
function eliminarProducto(index) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  if (index >= 0 && index < carrito.length) {
    let productoEliminado = carrito[index].nombre;
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    console.log('❌ Producto eliminado:', productoEliminado);
    
    // Si existe la función de mostrar carrito (en cart.html)
    if (typeof mostrarCarrito === 'function') {
      mostrarCarrito();
    }
    
    // Si existe la función de display (en cart.html)
    if (typeof displayCartItems === 'function') {
      displayCartItems();
    }
    
    mostrarNotificacion(`❌ ${productoEliminado} eliminado`, 'error');
    actualizarContadorCarrito();
  }
}

/**
 * Función para cambiar cantidad
 */
function cambiarCantidad(index, nuevaCantidad) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  if (index >= 0 && index < carrito.length) {
    if (nuevaCantidad <= 0) {
      eliminarProducto(index);
    } else {
      carrito[index].cantidad = nuevaCantidad;
      localStorage.setItem('carrito', JSON.stringify(carrito));
      
      console.log('🔄 Cantidad actualizada:', nuevaCantidad);
      
      // Si existe la función de mostrar carrito (en cart.html)
      if (typeof mostrarCarrito === 'function') {
        mostrarCarrito();
      }
      
      // Si existe la función de display (en cart.html)
      if (typeof displayCartItems === 'function') {
        displayCartItems();
      }
      
      actualizarContadorCarrito();
    }
  }
}

/**
 * Función para mostrar el carrito (solo en cart.html)
 */
function mostrarCarrito() {
  let carritoDiv = document.getElementById('carrito');
  let totalDiv = document.getElementById('total');
  
  if (!carritoDiv || !totalDiv) return;
  
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  if (carrito.length === 0) {
    carritoDiv.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Tu carrito está vacío 🛒</div>';
    totalDiv.textContent = 'Total: S/. 0.00';
    return;
  }
  
  let html = '<div class="carrito-items">';
  let total = 0;
  
  carrito.forEach((item, index) => {
    let precioTexto = String(item.precio);
    let precioLimpio = precioTexto.replace(/[^\d.]/g, '');
    let precioNumerico = parseFloat(precioLimpio) || 0;
    let cantidad = parseInt(item.cantidad) || 1;
    let subtotal = precioNumerico * cantidad;
    total += subtotal;
    
    html += `
      <div class="carrito-item" style="display: flex; gap: 1rem; padding: 1rem; background: #f9f9f9; border-radius: 10px; margin-bottom: 1rem; align-items: center;">
        <div style="flex: 1;">
          <h3 style="margin: 0 0 0.5rem 0; font-size: 16px;">${item.nombre}</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">Precio: S/. ${precioNumerico.toFixed(2)}</p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <button onclick="cambiarCantidad(${index}, ${cantidad - 1})" style="width: 30px; height: 30px; border: 1px solid #28a745; background: white; color: #28a745; border-radius: 5px; cursor: pointer; font-weight: bold;">-</button>
          <input type="number" value="${cantidad}" min="1" max="99" onchange="cambiarCantidad(${index}, parseInt(this.value))" style="width: 50px; text-align: center; padding: 5px; border: 1px solid #ccc; border-radius: 5px;">
          <button onclick="cambiarCantidad(${index}, ${cantidad + 1})" style="width: 30px; height: 30px; border: 1px solid #28a745; background: white; color: #28a745; border-radius: 5px; cursor: pointer; font-weight: bold;">+</button>
        </div>
        <div style="min-width: 100px; text-align: right;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #28a745;">S/. ${subtotal.toFixed(2)}</p>
        </div>
        <button onclick="eliminarProducto(${index})" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">🗑️</button>
      </div>
    `;
  });
  
  html += '</div>';
  carritoDiv.innerHTML = html;
  totalDiv.innerHTML = `<strong>Total: S/. ${total.toFixed(2)}</strong>`;
}

/**
 * INICIALIZAR cuando carga la página
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Inicializando carrito...');
  
  // Actualizar contador al cargar
  actualizarContadorCarrito();
  
  // Si estamos en la página del carrito, mostrar productos
  if (document.getElementById('carrito')) {
    console.log('📄 Página de carrito detectada');
    mostrarCarrito();
  }
  
  // Crear estilos para las notificaciones
  crearEstilosNotificacion();
  
  console.log('✅ Carrito inicializado correctamente');
});

/**
 * Crear estilos CSS para las notificaciones
 */
function crearEstilosNotificacion() {
  if (!document.getElementById('notificacion-styles')) {
    const style = document.createElement('style');
    style.id = 'notificacion-styles';
    style.textContent = `
      .notificacion-carrito {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #00D9A3 0%, #00B386 100%);
        color: white;
        padding: 18px 28px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 217, 163, 0.4);
        font-weight: 600;
        font-size: 16px;
        max-width: 350px;
        z-index: 999999;
        opacity: 0;
        transform: translateY(100px) scale(0.8);
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        pointer-events: none;
      }
      
      .notificacion-carrito.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      
      .notificacion-carrito.success {
        background: linear-gradient(135deg, #00D9A3 0%, #00B386 100%);
      }
      
      .notificacion-carrito.error {
        background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
      }
      
      .notificacion-carrito.info {
        background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
      }
      
      @media (max-width: 768px) {
        .notificacion-carrito {
          bottom: 100px;
          right: 15px;
          left: 15px;
          max-width: none;
          text-align: center;
        }
      }
    `;
    document.head.appendChild(style);
    console.log('🎨 Estilos de notificación creados');
  }
}

// Hacer funciones globales
window.agregarAlCarrito = agregarAlCarrito;
window.vaciarCarrito = vaciarCarrito;
window.eliminarProducto = eliminarProducto;
window.cambiarCantidad = cambiarCantidad;
window.mostrarCarrito = mostrarCarrito;
window.actualizarContadorCarrito = actualizarContadorCarrito;

console.log('🌐 Funciones globales exportadas');