// ===============================
// PAGINACIÓN
// ===============================

function mostrarPagina(hacerScroll = false) {
    const totalPaginas = Math.ceil(
        productosFiltrados.length / estadoCatalogo.productosPorPagina
    );
    if (estadoCatalogo.paginaActual > totalPaginas) {
        estadoCatalogo.paginaActual = 1;
    }
    const inicio = (estadoCatalogo.paginaActual - 1) * estadoCatalogo.productosPorPagina;
    const fin = inicio + estadoCatalogo.productosPorPagina;
    const pagina = productosFiltrados.slice(inicio, fin);
    mostrarProductos(pagina);
    crearBotonesPaginacion();
    if (hacerScroll) {
        window.scrollTo({
            top: document.getElementById("catalogo").offsetTop - 90,
            behavior: "smooth"
        });
    }
}

function crearBotonesPaginacion() {
    const contenedor = document.getElementById("paginacion");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    const totalPaginas = Math.ceil(
        productosFiltrados.length /
        estadoCatalogo.productosPorPagina
    );
    // -------------------------
    // BOTÓN ANTERIOR
    // -------------------------
    const anterior = document.createElement("button");
    anterior.className = "btn btn-outline-success me-2";
    anterior.innerHTML = "&laquo;";
    anterior.disabled = estadoCatalogo.paginaActual === 1;
    anterior.onclick = () => {
        estadoCatalogo.paginaActual--;
        mostrarPagina(true);
        irAlCatalogo();
    };
    contenedor.appendChild(anterior);
    // -------------------------
    // BOTONES NUMÉRICOS
    // -------------------------
    for (let i = 1; i <= totalPaginas; i++) {
        const boton = document.createElement("button");
        boton.className = "btn btn-outline-success mx-1";
        if (i === estadoCatalogo.paginaActual) {
            boton.classList.add("active");
        }
        boton.textContent = i;
        boton.onclick = () => {
            estadoCatalogo.paginaActual = i;
            mostrarPagina(true);
            irAlCatalogo();
        };
        contenedor.appendChild(boton);
    }
    // -------------------------
    // BOTÓN SIGUIENTE
    // -------------------------
    const siguiente = document.createElement("button");
    siguiente.className = "btn btn-outline-success ms-2";
    siguiente.innerHTML = "&raquo;";
    siguiente.disabled =
        estadoCatalogo.paginaActual === totalPaginas;
    siguiente.onclick = () => {
        estadoCatalogo.paginaActual++;
        mostrarPagina(true);
        irAlCatalogo();
    };
    contenedor.appendChild(siguiente);
}
function irAlCatalogo() {
    const catalogo = document.getElementById("catalogo");

    window.scrollTo({
        top: catalogo.offsetTop - 90,
        behavior: "smooth"
    });
}