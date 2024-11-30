/** @format */
const socket = io();
const form = document.getElementById("product-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        price: document.getElementById("price").value,
        status: document.getElementById("status").checked,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
    };
    socket.emit("newProduct", product);
    form.reset();
});

socket.on("updateProducts", (data) => {
    console.log("Datos recibidos del servidor:", data);
    if (!data || !Array.isArray(data.products)) {
        console.error(
            "Los productos recibidos no son un array o no están definidos"
        );
        return;
    }
    const products = data.products;
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
    products.forEach((product) => {
        const li = document.createElement("li");
        li.textContent = `${product.title} - ${product.description} - $${product.price}`;
        const button = document.createElement("button");
        button.textContent = "Eliminar";
        button.dataset.id = product._id;
        li.appendChild(button);
        productList.appendChild(li);
        button.addEventListener("click", function () {
            const productId = this.dataset.id;
            console.log("Eliminando producto con ID:", productId);
            socket.emit("deleteProduct", productId);
        });
    });

    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");
    if (prevButton) {
        if (data.hasPrevPage) {
            prevButton.disabled = false;
            prevButton.dataset.page = data.prevPage;
        } else {
            prevButton.disabled = true;
        }
    }
    if (nextButton) {
        if (data.hasNextPage) {
            nextButton.disabled = false;
            nextButton.dataset.page = data.nextPage;
        } else {
            nextButton.disabled = true;
        }
    }
});

document.getElementById("filter-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const category = document.getElementById("categoryFilter").value;
    console.log("Filtrando por categoría:", category);
    const availability = document.getElementById("availability").value;
    const sort = document.getElementById("sort").value;
    const query = {
        category: category || undefined,
        status: availability || undefined,
        sort: sort || undefined,
    };
    socket.emit("filterProducts", query);
});

document.getElementById("next-page").addEventListener("click", function () {
    const page = this.dataset.page;
    console.log("Siguiente página:", page);
    socket.emit("paginate", { page: page });
});

document.getElementById("prev-page").addEventListener("click", function () {
    const page = this.dataset.page;
    console.log("Página anterior:", page);
    socket.emit("paginate", { page: page });
});

socket.emit("paginate", { page: 1 });
