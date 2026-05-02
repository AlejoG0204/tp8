// Comentarios.js - Sistema de comentarios para la tienda online

class SistemaComentarios {
    constructor(contenedorId = 'comentarios-section') {
        this.contenedorId = contenedorId;
        this.comentarios = this.cargarComentarios();
        this.filtroActual = 'todos';
    }

    // Cargar comentarios del localStorage
    cargarComentarios() {
        const comentariosGuardados = localStorage.getItem('comentarios_tienda');
        return comentariosGuardados ? JSON.parse(comentariosGuardados) : this.obtenerComentariosIniciales();
    }

    // Comentarios iniciales de ejemplo
    obtenerComentariosIniciales() {
        return [
            {
                id: 1,
                nombre: "María García",
                email: "maria@example.com",
                producto: "Lechuga",
                rating: 5,
                fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                comentario: "¡Excelente producto! La lechuga llegó muy fresca y de gran calidad. Volveré a comprar.",
                verificado: true
            },
            {
                id: 2,
                nombre: "Juan Pérez",
                email: "juan@example.com",
                producto: "Tomate",
                rating: 4,
                fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                comentario: "Buen servicio de entrega. Los tomates estaban bien, aunque algunos estaban un poco verdes.",
                verificado: true
            },
            {
                id: 3,
                nombre: "Ana López",
                email: "ana@example.com",
                producto: "Zanahoria",
                rating: 5,
                fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                comentario: "Productos frescos y entrega rápida. Muy satisfecha con la compra.",
                verificado: true
            }
        ];
    }

    // Guardar comentarios en localStorage
    guardarComentarios() {
        localStorage.setItem('comentarios_tienda', JSON.stringify(this.comentarios));
    }

    // Inicializar la sección
    inicializar() {
        const contenedor = document.getElementById(this.contenedorId);
        if (!contenedor) {
            console.error(`Contenedor con id '${this.contenedorId}' no encontrado`);
            return;
        }
        this.crearEstructura(contenedor);
        this.renderizarComentarios();
    }

    // Crear la estructura HTML de la sección
    crearEstructura(contenedor) {
        contenedor.innerHTML = `
            <div class="comentarios-container">
                <!-- Header -->
                <div class="comentarios-header">
                    <h2>Opiniones de Clientes</h2>
                    <p>Comparte tu experiencia con nuestros productos</p>
                </div>

                <!-- Formulario para nuevo comentario -->
                <div class="formulario-comentario">
                    <h3>Deja tu comentario</h3>
                    <form id="form-nuevo-comentario">
                        <div class="form-group">
                            <label for="nombre">Nombre:</label>
                            <input type="text" id="nombre" name="nombre" required placeholder="Tu nombre completo">
                        </div>

                        <div class="form-group">
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" required placeholder="tu@email.com">
                        </div>

                        <div class="form-group">
                            <label for="producto">Producto:</label>
                            <select id="producto" name="producto" required>
                                <option value="">Selecciona un producto</option>
                                <option value="Lechuga">Lechuga</option>
                                <option value="Tomate">Tomate</option>
                                <option value="Zanahoria">Zanahoria</option>
                                <option value="Papa">Papa</option>
                                <option value="Palta">Palta</option>
                                <option value="Zapallo">Zapallo</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="rating">Calificación:</label>
                            <div class="rating-input">
                                ${[1, 2, 3, 4, 5].map(star => `
                                    <input type="radio" id="star-${star}" name="rating" value="${star}">
                                    <label for="star-${star}" class="star-label">
                                        <i class="fas fa-star"></i>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="comentario">Comentario:</label>
                            <textarea id="comentario" name="comentario" required placeholder="Comparte tu opinión sobre el producto..." rows="4"></textarea>
                        </div>

                        <button type="submit" class="btn-enviar-comentario">Publicar Comentario</button>
                    </form>
                </div>

                <!-- Filtros y estadísticas -->
                <div class="comentarios-stats">
                    <div class="stats-box">
                        <h4>Calificación Promedio</h4>
                        <div class="promedio-rating">
                            <span id="promedio-valor">4.8</span>
                            <div class="promedio-stars">★★★★★</div>
                        </div>
                    </div>
                    <div class="stats-box">
                        <h4>Total de Opiniones</h4>
                        <span id="total-comentarios" class="total-valor">0</span>
                    </div>
                </div>

                <!-- Filtros -->
                <div class="comentarios-filtros">
                    <button class="filtro-btn active" data-filtro="todos">
                        Todos
                    </button>
                    ${[5, 4, 3, 2, 1].map(star => `
                        <button class="filtro-btn" data-filtro="rating-${star}">
                            ${star} <i class="fas fa-star"></i>
                        </button>
                    `).join('')}
                </div>

                <!-- Lista de comentarios -->
                <div id="lista-comentarios" class="lista-comentarios"></div>
            </div>
        `;

        // Agregar event listeners al formulario
        document.getElementById('form-nuevo-comentario').addEventListener('submit', (e) => this.handleSubmitFormulario(e));

        // Agregar event listeners a los filtros
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.aplicarFiltro(e.target.closest('.filtro-btn')));
        });
    }

    // Manejar envío del formulario
    handleSubmitFormulario(e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const producto = document.getElementById('producto').value;
        const rating = parseInt(document.querySelector('input[name="rating"]:checked')?.value || 0);
        const comentario = document.getElementById('comentario').value;

        if (rating === 0) {
            alert('Por favor, selecciona una calificación');
            return;
        }

        const nuevoComentario = {
            id: Date.now(),
            nombre,
            email,
            producto,
            rating,
            fecha: new Date().toISOString(),
            comentario,
            verificado: false
        };

        this.comentarios.unshift(nuevoComentario);
        this.guardarComentarios();

        // Limpiar formulario
        e.target.reset();
        document.querySelectorAll('.star-label').forEach(label => label.classList.remove('selected'));

        // Mostrar mensaje de éxito
        this.mostrarNotificacion('¡Comentario publicado exitosamente!', 'success');

        // Actualizar vista
        this.filtroActual = 'todos';
        document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-filtro="todos"]').classList.add('active');
        this.renderizarComentarios();
    }

    // Aplicar filtro
    aplicarFiltro(boton) {
        document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
        boton.classList.add('active');
        this.filtroActual = boton.dataset.filtro;
        this.renderizarComentarios();
    }

    // Filtrar comentarios
    filtrarComentarios() {
        if (this.filtroActual === 'todos') {
            return this.comentarios;
        }

        if (this.filtroActual.startsWith('rating-')) {
            const rating = parseInt(this.filtroActual.split('-')[1]);
            return this.comentarios.filter(c => c.rating === rating);
        }

        return this.comentarios;
    }

    // Renderizar comentarios
    renderizarComentarios() {
        const comentariosFiltrados = this.filtrarComentarios();
        const contenedorLista = document.getElementById('lista-comentarios');

        // Actualizar estadísticas
        this.actualizarEstadisticas();

        if (comentariosFiltrados.length === 0) {
            contenedorLista.innerHTML = `
                <div class="sin-comentarios">
                    <p>No hay comentarios que coincidan con tu búsqueda.</p>
                </div>
            `;
            return;
        }

        contenedorLista.innerHTML = comentariosFiltrados.map(comentario => `
            <div class="comentario-card">
                <div class="comentario-header">
                    <div class="comentario-info">
                        <h4 class="comentario-nombre">${this.escaparHTML(comentario.nombre)}</h4>
                        <div class="comentario-meta">
                            <span class="producto-badge">${this.escaparHTML(comentario.producto)}</span>
                            <span class="fecha-comentario">${this.formatearFecha(comentario.fecha)}</span>
                            ${comentario.verificado ? '<span class="badge-verificado"><i class="fas fa-check-circle"></i> Compra verificada</span>' : ''}
                        </div>
                    </div>
                    <div class="comentario-rating">
                        ${this.generarEstrellas(comentario.rating)}
                    </div>
                </div>
                <p class="comentario-texto">${this.escaparHTML(comentario.comentario)}</p>
                <div class="comentario-acciones">
                    <button class="btn-accion" onclick="sistemaComentarios.toggleUtil(${comentario.id})">
                        <i class="fas fa-thumbs-up"></i> Útil
                    </button>
                    <button class="btn-accion" onclick="sistemaComentarios.eliminarComentario(${comentario.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Actualizar estadísticas
    actualizarEstadisticas() {
        const total = this.comentarios.length;
        const promedio = total > 0 
            ? (this.comentarios.reduce((sum, c) => sum + c.rating, 0) / total).toFixed(1)
            : 0;

        document.getElementById('total-comentarios').textContent = total;
        document.getElementById('promedio-valor').textContent = promedio;

        // Mostrar estrellas del promedio
        const estrellas = Math.round(promedio);
        document.querySelector('.promedio-stars').textContent = '★'.repeat(estrellas) + '☆'.repeat(5 - estrellas);
    }

    // Generar estrellas
    generarEstrellas(rating) {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    }

    // Formatear fecha
    formatearFecha(fecha) {
        const date = new Date(fecha);
        const ahora = new Date();
        const diferencia = ahora - date;
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

        if (dias === 0) return 'Hoy';
        if (dias === 1) return 'Ayer';
        if (dias < 7) return `Hace ${dias} días`;
        if (dias < 30) return `Hace ${Math.floor(dias / 7)} semanas`;
        return date.toLocaleDateString('es-AR');
    }

    // Escapar HTML para evitar inyecciones
    escaparHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    // Toggle útil (simulado)
    toggleUtil(id) {
        this.mostrarNotificacion('¡Gracias por tu voto!', 'info');
    }

    // Eliminar comentario
    eliminarComentario(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
            this.comentarios = this.comentarios.filter(c => c.id !== id);
            this.guardarComentarios();
            this.mostrarNotificacion('Comentario eliminado', 'success');
            this.renderizarComentarios();
        }
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje, tipo = 'info') {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${mensaje}</span>
        `;
        document.body.appendChild(notificacion);

        setTimeout(() => notificacion.remove(), 3000);
    }

    // Exportar comentarios como JSON
    exportarComentarios() {
        const dataStr = JSON.stringify(this.comentarios, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `comentarios_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
}

// Instancia global para acceso desde HTML
let sistemaComentarios;

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    sistemaComentarios = new SistemaComentarios('comentarios-section');
    sistemaComentarios.inicializar();
});
// Menu Dropdown - Sistema de menú desplegable para login/register (CORREGIDO)

class UserMenuDropdown {
    constructor() {
        this.userIcon = document.getElementById('user_icon');
        this.userAccess = document.querySelector('.user-access');
        this.dropdown = null;
        this.overlay = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        // Crear el menú desplegable
        this.createDropdown();
        this.createOverlay();
        
        // Agregar event listeners
        this.userIcon.addEventListener('click', (e) => this.toggleDropdown(e));
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeDropdown());
        }
        document.addEventListener('click', (e) => this.closeDropdownOnOutsideClick(e));
        
        // Cerrar menú al hacer resize
        window.addEventListener('resize', () => this.closeDropdown());
        
        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeDropdown();
        });
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'dropdown-overlay';
        document.body.appendChild(this.overlay);
    }

    createDropdown() {
        // Crear contenedor del dropdown
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'user-dropdown-menu';
        
        // HTML del menú desplegable
        this.dropdown.innerHTML = `
            <div class="dropdown-header">
                <i class="fa-solid fa-circle-user"></i>
                <span>Mi Cuenta</span>
            </div>
            <ul class="dropdown-items">
                <li>
                    <a href="Index2.html" class="dropdown-link">
                        <i class="fa-solid fa-user-plus"></i>
                        <span>Crear Cuenta</span>
                    </a>
                </li>
                <li>
                    <a href="Index3.html" class="dropdown-link">
                        <i class="fa-solid fa-sign-in-alt"></i>
                        <span>Iniciar Sesión</span>
                    </a>
                </li>
                <li class="dropdown-divider"></li>
                <li>
                    <a href="#" class="dropdown-link" onclick="userMenu.handleLogout(event)">
                        <i class="fa-solid fa-sign-out-alt"></i>
                        <span>Cerrar Sesión</span>
                    </a>
                </li>
            </ul>
        `;
        
        // Insertar el dropdown dentro de user-access
        this.userAccess.appendChild(this.dropdown);
    }

    toggleDropdown(e) {
        e.stopPropagation();
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    openDropdown() {
        this.dropdown.classList.add('active');
        this.userIcon.classList.add('active');
        
        // Mostrar overlay solo en mobile y tablet
        if (window.innerWidth <= 1024 && this.overlay) {
            this.overlay.classList.add('active');
        }
        
        this.isOpen = true;
        
        // Prevenir scroll en mobile
        if (window.innerWidth <= 767) {
            document.body.style.overflow = 'hidden';
        }
    }

    closeDropdown() {
        this.dropdown.classList.remove('active');
        this.userIcon.classList.remove('active');
        
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
        
        this.isOpen = false;
        
        // Restaurar scroll en mobile
        document.body.style.overflow = '';
    }

    closeDropdownOnOutsideClick(e) {
        // Cerrar si se hace click fuera del menú y del icono
        if (this.isOpen && 
            !this.userAccess.contains(e.target) && 
            !this.dropdown.contains(e.target) && 
            !this.userIcon.contains(e.target)) {
            this.closeDropdown();
        }
    }

    handleLogout(e) {
        e.preventDefault();
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            console.log('Cerrando sesión...');
            this.closeDropdown();
        }
    }
}

// Inicializar cuando el DOM esté listo
let userMenu;
document.addEventListener('DOMContentLoaded', () => {
    userMenu = new UserMenuDropdown();
    
    // Inicializar SistemaComentarios
    sistemaComentarios = new SistemaComentarios('comentarios-section');
    sistemaComentarios.inicializar();
});