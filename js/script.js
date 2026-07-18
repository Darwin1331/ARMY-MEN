document.addEventListener('DOMContentLoaded', function () {
    /* ==================================================================
       1. UTILIDADES
    ================================================================== */
    // Respeta la preferencia de "reducir movimiento" del sistema operativo
    var prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* ==================================================================
       2. NAVBAR: cambia de apariencia al hacer scroll
       (de transparente/traslúcida a sólida, con menor altura)
    ================================================================== */
    var navbar = document.getElementById('navbarPrincipal');
    function actualizarEstadoNavbar() {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.classList.add('navbar-solida');
        } else {
            navbar.classList.remove('navbar-solida');
        }
    }
    actualizarEstadoNavbar(); // estado inicial (por si la página carga ya desplazada)
    window.addEventListener('scroll', actualizarEstadoNavbar, { passive: true });
    /* ==================================================================
       3. ANIMACIÓN DE APARICIÓN AL HACER SCROLL
       Todos los elementos con la clase .reveal empiezan invisibles
       (definido en CSS) y reciben .reveal-visible cuando entran en pantalla.
    ================================================================== */
    var elementosRevelables = document.querySelectorAll('.reveal');
    if (prefiereMenosMovimiento) {
        // Si el usuario prefiere menos movimiento, se muestran todos de inmediato
        elementosRevelables.forEach(function (el) {
            el.classList.add('reveal-visible');
        });
    } else if ('IntersectionObserver' in window) {
        var observadorRevelado = new IntersectionObserver(function (entradas, observador) {
            entradas.forEach(function (entrada, indice) {
                if (entrada.isIntersecting) {
                    // Pequeño desfase escalonado para que las tarjetas de una misma
                    // fila no aparezcan todas exactamente al mismo tiempo.
                    var retraso = (indice % 3) * 90;
                    setTimeout(function () {
                        entrada.target.classList.add('reveal-visible');
                    }, retraso);
                    observador.unobserve(entrada.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });
        elementosRevelables.forEach(function (el) {
            observadorRevelado.observe(el);
        });
    } else {
        // Navegadores muy antiguos sin soporte de IntersectionObserver
        elementosRevelables.forEach(function (el) {
            el.classList.add('reveal-visible');
        });
    }
    /* ==================================================================
       4. CONTADOR ANIMADO DE ESTADÍSTICAS
       Anima los números de "+200 productos", "+10 años", "+500 clientes"
       desde 0 hasta su valor objetivo cuando la sección entra en pantalla.
    ================================================================== */
    var contadores = document.querySelectorAll('[data-contador]');
    function animarContador(elemento) {
        var objetivo = parseInt(elemento.getAttribute('data-objetivo'), 10) || 0;
        if (prefiereMenosMovimiento) {
            elemento.textContent = objetivo;
            return;
        }
        var duracionMs = 1400;
        var inicio = null;
        function paso(marcaTiempo) {
            if (inicio === null) inicio = marcaTiempo;
            var progreso = Math.min((marcaTiempo - inicio) / duracionMs, 1);
            // easeOutQuad: desacelera suavemente hacia el final
            var progresoSuavizado = 1 - (1 - progreso) * (1 - progreso);
            elemento.textContent = Math.floor(progresoSuavizado * objetivo);

            if (progreso < 1) {
                window.requestAnimationFrame(paso);
            } else {
                elemento.textContent = objetivo; // asegura el valor exacto al finalizar
            }
        }
        window.requestAnimationFrame(paso);
    }
    if (contadores.length > 0) {
        if ('IntersectionObserver' in window) {
            var observadorContadores = new IntersectionObserver(function (entradas, observador) {
                entradas.forEach(function (entrada) {
                    if (entrada.isIntersecting) {
                        animarContador(entrada.target);
                        observador.unobserve(entrada.target);
                    }
                });
            }, { threshold: 0.5 });
            contadores.forEach(function (contador) {
                observadorContadores.observe(contador);
            });
        } else {
            contadores.forEach(animarContador);
        }
    }
    /* ==================================================================
       6. MODAL DE DETALLE DE PRODUCTO
       Cada botón "Ver detalles" trae la información del producto en
       atributos data-*. Al abrir el modal, se copia esa información
       dentro de los elementos del modal compartido (#modalProducto).
    ================================================================== */
    var modalProducto = document.getElementById('modalProducto');
    if (modalProducto) {
        modalProducto.addEventListener('show.bs.modal', function (evento) {
            var botonOrigen = evento.relatedTarget;
            if (!botonOrigen) return;
            var nombre = botonOrigen.getAttribute('data-nombre') || '';
            var categoria = botonOrigen.getAttribute('data-categoria') || '';
            var descripcion = botonOrigen.getAttribute('data-descripcion') || '';
            var imagen = botonOrigen.getAttribute('data-imagen') || '';
            var caracteristicasTexto = botonOrigen.getAttribute('data-caracteristicas') || '';
            var disponibilidad = botonOrigen.getAttribute('data-disponible') || 'Disponible';
            // Título y textos principales
            modalProducto.querySelector('#modalProductoTitulo').textContent = nombre;
            modalProducto.querySelector('#modalProductoCategoria').textContent = categoria;
            modalProducto.querySelector('#modalProductoDescripcion').textContent = descripcion;
            // Imagen (con texto alternativo descriptivo para accesibilidad)
            var imgModal = modalProducto.querySelector('#modalProductoImagen');
            imgModal.src = imagen;
            imgModal.alt = nombre;
            // Lista de características (separadas por "|" en el atributo data-caracteristicas)
            var listaCaracteristicas = modalProducto.querySelector('#modalProductoCaracteristicas');
            listaCaracteristicas.innerHTML = '';
            caracteristicasTexto.split('|').forEach(function (item) {
                var textoLimpio = item.trim();
                if (textoLimpio === '') return;
                var li = document.createElement('li');
                li.innerHTML = '<i class="bi bi-check2-circle"></i>' + textoLimpio;
                listaCaracteristicas.appendChild(li);
            });
            // Estado de disponibilidad (con el mismo estilo de "punto" que en las tarjetas)
            var elementoDisponible = modalProducto.querySelector('#modalProductoDisponible');
            elementoDisponible.innerHTML = '<span class="punto-estado" aria-hidden="true"></span>' + disponibilidad;
            elementoDisponible.classList.toggle('estado-pocas', /últimas/i.test(disponibilidad));
        });
    }
    /* ==================================================================
       7. BOTÓN "VOLVER ARRIBA"
       Aparece solo después de bajar cierta distancia, y sube suavemente
       al inicio de la página al hacer clic.
    ================================================================== */
    var botonVolverArriba = document.getElementById('botonVolverArriba');
    function actualizarVisibilidadBotonSubir() {
        if (!botonVolverArriba) return;
        if (window.scrollY > 480) {
            botonVolverArriba.classList.add('visible');
        } else {
            botonVolverArriba.classList.remove('visible');
        }
    }
    actualizarVisibilidadBotonSubir();
    window.addEventListener('scroll', actualizarVisibilidadBotonSubir, { passive: true });
    if (botonVolverArriba) {
        botonVolverArriba.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: prefiereMenosMovimiento ? 'auto' : 'smooth'
            });
        });
    }
    /* ==================================================================
       8. AÑO ACTUAL EN EL FOOTER
       Evita tener que actualizar manualmente el copyright cada año.
    ================================================================== */
    var spanAnio = document.getElementById('anioActual');
    if (spanAnio) {
        spanAnio.textContent = new Date().getFullYear();
    }
    // ===============================
    // BUSCADOR
    // ===============================
    const buscador = document.getElementById("buscador");
    if (buscador) {
        buscador.addEventListener("input", function () {
            buscarProductos(this.value);
        });
    }
    document.addEventListener("keydown", function(e){
    if(e.key==="/"){
        e.preventDefault();
        buscador.focus();
    }
    });
    // ===============================
    // ORDENAR PRODUCTOS
    // ===============================
    const ordenar = document.getElementById("ordenar");
    if (ordenar) {
        ordenar.addEventListener("change", function () {
            estadoCatalogo.ordenarPor = this.value;
            actualizarCatalogo();
        });
    }
});
