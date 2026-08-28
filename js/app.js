let carrito = [];
let productos = [];

const contenedorProductos = document.querySelector("#contenedorProductos");

fetch("./data/productos.json")
    .then((response) => response.json())
    .then((data) => {
        productos = data;
        mostrarProductos(productos);
    })
    .catch(() => {
        Swal.fire({
            title: "Error",
            text: "No se pudieron cargar los productos.",
            icon: "error"
        });
    });


function mostrarProductos(lista) {

    contenedorProductos.innerHTML = "";

    lista.forEach((producto) => {

        const tarjeta = document.createElement("article");

        tarjeta.classList.add("TarjetaProductos");

        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">

            <div class="InfoProducto">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>

                <div class="PieTarjeta">
                    <span class="precio">$${producto.precio}</span>

                    <button class="BotonAgregar" data-id="${producto.id}">
                        Agregar al carrito 🛒
                    </button>
                </div>
            </div>
        `;

        contenedorProductos.appendChild(tarjeta);
    });
}


const botonTodos = document.querySelector("#filtroTodos");
const botonCafes = document.querySelector("#filtroCafes");
const botonBfrias = document.querySelector("#filtroFrias");
const botonPanaderia = document.querySelector("#filtroPanaderia");
const botonDulces = document.querySelector("#filtroDulces");


botonTodos.addEventListener("click", () => {
    mostrarProductos(productos);
});


botonCafes.addEventListener("click", () => {

    const cafes = productos.filter((producto) => {
        return producto.categoria === "Cafés";
    });

    mostrarProductos(cafes);
});


botonBfrias.addEventListener("click", () => {

    const bebidasFrias = productos.filter((producto) => {
        return producto.categoria === "Bebidas frias";
    });

    mostrarProductos(bebidasFrias);
});


botonPanaderia.addEventListener("click", () => {

    const panaderia = productos.filter((producto) => {
        return producto.categoria === "Panaderia";
    });

    mostrarProductos(panaderia);
});


botonDulces.addEventListener("click", () => {

    const dulces = productos.filter((producto) => {
        return producto.categoria === "Dulces";
    });

    mostrarProductos(dulces);
});


const listaCarrito = document.querySelector("#listaCarritoVacia");
const montoTotal = document.querySelector(".montoTotal");


contenedorProductos.addEventListener("click", (evento) => {

    if (evento.target.classList.contains("BotonAgregar")) {

        const id = evento.target.dataset.id;

        const productoElegido = productos.find((producto) => {
            return producto.id == id;
        });

        const productoEnCarrito = carrito.find((producto) => {
            return producto.id == id;
        });

        if (productoEnCarrito) {

            productoEnCarrito.cantidad++;

        } else {

            carrito.push({
                ...productoElegido,
                cantidad: 1
            });
        }

        mostrarCarrito();
    }
});


function mostrarCarrito() {

    listaCarrito.innerHTML = "";

    carrito.forEach((producto) => {

        const item = document.createElement("div");

        item.innerHTML = `
            <div class="itemCarrito">

                <p class="nombreCarrito">
                    ${producto.nombre}
                </p>

                <div class="controlesCantidad">

                    <button class="botonRestar" data-id="${producto.id}">
                        −
                    </button>

                    <span class="cantidadProducto">
                        ${producto.cantidad}
                    </span>

                    <button class="botonSumar" data-id="${producto.id}">
                        +
                    </button>

                </div>

                <span class="precioCarrito">
                    $${producto.precio * producto.cantidad}
                </span>

            </div>
        `;

        listaCarrito.appendChild(item);
    });


    const total = carrito.reduce((acumulador, producto) => {
        return acumulador + producto.precio * producto.cantidad;
    }, 0);


    if (carrito.length === 0) {

        listaCarrito.innerHTML = `
            <p>Aún no has agregado productos.</p>
        `;
    }

    montoTotal.textContent = `$ ${total}`;
}


listaCarrito.addEventListener("click", (evento) => {

    const id = evento.target.dataset.id;

    if (evento.target.classList.contains("botonSumar")) {

        const productoEnCarrito = carrito.find((producto) => {
            return producto.id == id;
        });

        productoEnCarrito.cantidad++;

        mostrarCarrito();
    }
});


listaCarrito.addEventListener("click", (evento) => {

    const id = evento.target.dataset.id;

    if (evento.target.classList.contains("botonRestar")) {

        const productoEnCarrito = carrito.find((producto) => {
            return producto.id == id;
        });

        if (productoEnCarrito.cantidad > 1) {

            productoEnCarrito.cantidad--;

        } else {

            carrito = carrito.filter((producto) => {
                return producto.id != id;
            });
        }

        mostrarCarrito();
    }
});


const botonVaciar = document.querySelector(".botonVaciar");


botonVaciar.addEventListener("click", () => {

    if (carrito.length === 0) {

        Swal.fire({
            title: "El carrito ya está vacío",
            confirmButtonText: "Volver al menú",
            icon: "info"
        });

        return;
    }


    Swal.fire({
        title: "¿Vaciar carrito?",
        text: "Se eliminarán todos los productos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar"
    }).then((resultado) => {

        if (resultado.isConfirmed) {

            carrito = [];

            mostrarCarrito();

            Swal.fire({
                title: "Carrito vacío",
                text: "Se eliminaron todos los productos.",
                icon: "success"
            });
        }
    });
});


const botonFinalizar = document.querySelector(".botonFinalizar");


botonFinalizar.addEventListener("click", () => {

    if (carrito.length === 0) {

        Swal.fire({
            title: "Carrito vacío",
            text: "Agregá productos antes de finalizar la compra.",
            confirmButtonText: "Volver al menú",
            icon: "info"
        });

        return;
    }


    const carritoTotal = carrito.reduce((acumulador, producto) => {
        return acumulador + producto.precio * producto.cantidad;
    }, 0);


    Swal.fire({
        title: "¿Estás seguro de finalizar tu pedido?",
        text: `Total a pagar: $${carritoTotal}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Finalizar compra",
        cancelButtonText: "Volver al menú"
    }).then((resultado) => {

        if (resultado.isConfirmed) {

            carrito = [];

            mostrarCarrito();

            Swal.fire({
                title: "¡Compra realizada!",
                text: "Gracias por comprar en Moka's ☕",
                icon: "success"
            });
        }
    });
});