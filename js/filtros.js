// ===============================
// BUSCADOR Y FILTROS
// ===============================
function buscarProductos(texto) {
    estadoCatalogo.textoBusqueda = texto.trim();
    estadoCatalogo.paginaActual = 1;
    actualizarCatalogo();
}
// ===============================
// FILTROS DINÁMICOS
// ===============================
function inicializarFiltros() {
    const contenedor = document.getElementById("contenedorFiltros");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    const categorias = [
        "Todos",
        ...new Set(productos.map(producto => producto.categoria))
    ];
    categorias.forEach(categoria => {
        const boton = document.createElement("button");
        boton.className = "btn btn-outline-success m-1 btn-filtro";
        boton.textContent = categoria;
        boton.dataset.categoria = categoria;
        if (categoria === estadoCatalogo.categoria) {
            boton.classList.add("active");
        }
        boton.addEventListener("click", () => {
            estadoCatalogo.categoria = categoria;
            estadoCatalogo.paginaActual = 1;
            document
                .querySelectorAll(".btn-filtro")
                .forEach(btn => btn.classList.remove("active"));
            boton.classList.add("active");
            actualizarCatalogo();
        });
        contenedor.appendChild(boton);
    });
}