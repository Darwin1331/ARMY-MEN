// ===============================
// CATALOGO DINÁMICO
// ===============================
let productos = [];
// ===============================
// ESTADO DEL CATÁLOGO
// ===============================
let productosFiltrados = [];
const estadoCatalogo = {
    paginaActual: 1,
    productosPorPagina: 12,
    categoria: "Todos",
    textoBusqueda: "",
    ordenarPor: "nombre"
};

// Contenedor donde se dibujarán las tarjetas
const contenedor = document.getElementById("contenedor-productos");
// ===============================
// CARGAR PRODUCTOS
// ===============================
async function cargarProductos() {
    try {
        const respuesta = await fetch("data/productos.json");
        productos = await respuesta.json();
        actualizarCatalogo();
    } catch (error) {

        console.error("Error cargando productos:", error);
    }
}
// ===============================
// MOSTRAR PRODUCTOS
// ===============================
function mostrarProductos(listaProductos) {
    contenedor.innerHTML = "";
    listaProductos.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "col-xl-3 col-lg-4 col-md-6";
        tarjeta.innerHTML = `
            <div class="card producto-card h-100 shadow-sm">
                <img
                    src="${producto.imagen}"
                    class="card-img-top"
                    alt="${producto.nombre}"
                    loading="lazy"
                >
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-success mb-2">
                        ${producto.categoria}
                    </span>
                    <h5 class="card-title">
                        ${producto.nombre}
                    </h5>
                    <p class="card-text">
                        ${producto.descripcion}
                    </p>
                    <div class="mt-auto">
                        <button
                            class="btn btn-primary w-100 btn-detalles"
                            data-id="${producto.id}"
                        >
                            Ver detalles
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}
// ===============================
// ACTUALIZAR CATÁLOGO
// ===============================
function actualizarCatalogo() {
    let resultado = [...productos];
    // ===================
    // FILTRO POR CATEGORÍA
    // ===================
    if (estadoCatalogo.categoria !== "Todos") {
        resultado = resultado.filter(producto =>
            producto.categoria === estadoCatalogo.categoria
        );
    }
    // ===================
    // BUSCADOR
    // ===================
    if (estadoCatalogo.textoBusqueda.trim() !== "") {
        const texto = estadoCatalogo.textoBusqueda.toLowerCase().trim();
        resultado = resultado.filter(producto =>
            producto.nombre.toLowerCase().includes(texto) ||
            producto.descripcion.toLowerCase().includes(texto) ||
            producto.categoria.toLowerCase().includes(texto)
);
    }
    // ===================
    // ORDENAMIENTO
    // ===================
    resultado = ordenarProductos(resultado);
    // ===================
    // GUARDAR RESULTADO
    // ===================
    productosFiltrados = resultado;
    // ===================
    // PAGINACIÓN
    // ===================
    const contador = document.getElementById("contadorProductos");
        if (contador) {
            contador.textContent =
                `Mostrando ${productosFiltrados.length} productos`;
        }
    mostrarPagina();
}

// ===============================
// INICIAR
// ===============================
async function iniciarCatalogo(){

    await cargarProductos();

    inicializarFiltros();

}

function ordenarProductos(lista) {
    switch (estadoCatalogo.ordenarPor) {
        case "nombre":
            return lista.sort((a, b) =>
                a.nombre.localeCompare(b.nombre)
            );
        case "nombre-desc":
            return lista.sort((a, b) =>
                b.nombre.localeCompare(a.nombre)
            );
        default:
            return lista;
    }
}
iniciarCatalogo();