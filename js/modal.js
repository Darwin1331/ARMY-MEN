// ===============================
// MODAL DE PRODUCTOS
// ===============================
document.addEventListener("click", function (e) {
    if (!e.target.classList.contains("btn-detalles")) return;
    const id = Number(e.target.dataset.id);
    const producto = productosFiltrados.find(p => p.id === id) || productos.find(p => p.id === id);
    if (!producto) return;
    document.getElementById("modalTitulo").textContent = producto.nombre;
    document.getElementById("modalImagen").src = producto.imagen;
    document.getElementById("modalImagen").alt = producto.nombre;
    document.getElementById("modalDescripcion").textContent = producto.descripcion;
    document.getElementById("modalCategoria").textContent = producto.categoria;
    const lista = document.getElementById("modalCaracteristicas");
    lista.innerHTML = "";
    if (producto.caracteristicas &&
        producto.caracteristicas.length > 0) {
        producto.caracteristicas.forEach(item => {
            lista.innerHTML += `<li>${item}</li>`;

        });
    } else {
        lista.innerHTML =
            "<li>Sin características registradas.</li>";

    }
    const modal = new bootstrap.Modal(document.getElementById("productoModal"));
    modal.show();
    //NUMERO CELULAR
    const btnWhatsApp = document.getElementById("btnWhatsAppProducto");
    const mensaje = `Hola
    Vi su catálogo web y estoy interesado en el siguiente producto:

    ${producto.nombre}
    
    ¿Podrían indicarme si está disponible y brindarme más información?
    Muchas gracias.`;
    btnWhatsApp.href =`https://wa.me/59178751669?text=${encodeURIComponent(mensaje)}`;

    modalImagen.onclick = function(){
        document.getElementById("imagenGrande").src = producto.imagen;
        new bootstrap.Modal(
            document.getElementById("imagenModal")
        ).show();
    };
});