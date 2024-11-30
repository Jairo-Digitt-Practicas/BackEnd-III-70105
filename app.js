/** @format */
const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/database/database.js");
const sessionRouter = require("./src/routes/sessionRoutes");
const { create } = require("express-handlebars");
const productsRouter = require("./src/routes/products.router.js");
const cartsRouter = require("./src/routes/carts.router.js");
const viewsRouter = require("./src/routes/views.router.js");
const mocksRouter = require("./src/routes/mocks.router.js");
const {
    getAllProducts,
    createProduct,
    deleteProduct,
    updateProduct,
} = require("./src/controllers/ProductController.js");
const { Server } = require("socket.io");
const path = require("path");
const http = require("http");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
require("./src/config/passport.js");
app.use(passport.initialize());
app.use("/api/mocks", mocksRouter);

connectDB();
app.use("/api/sessions", sessionRouter);
app.use(express.json());
const hbs = create({
    extname: ".handlebars",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});

app.engine(".handlebars", hbs.engine);
app.set("view engine", ".handlebars");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

function authorize(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Acceso denegado" });
        }
        next();
    };
}

app.post(
    "/products",
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    async (req, res) => {
        const { title, description, code, price, status, stock, category } =
            req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res
                .status(400)
                .json({ error: "Datos del producto incompletos" });
        }
        try {
            const newProduct = await createProduct({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
            });
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: "Error al crear producto" });
        }
    }
);

app.put(
    "/products/:id",
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    async (req, res) => {
        try {
            const updatedProduct = await updateProduct(req.params.id, req.body);
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar producto" });
        }
    }
);

app.delete(
    "/products/:id",
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    async (req, res) => {
        try {
            await deleteProduct(req.params.id);
            res.status(204).json({ message: "Producto eliminado" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar producto" });
        }
    }
);

app.post("/cart/:id/products", authorize("user"), async (req, res) => {
    try {
        const updatedCart = await addProductToCart(req.params.id, req.body);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar producto al carrito" });
    }
});

app.get("/products", async (req, res) => {
    try {
        const products = await getAllProducts();
        res.render("index", { title: "Products", products });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

app.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await getAllProducts();
        res.render("index", { title: "Products", products });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

app.post("/realtimeproducts", async (req, res) => {
    const { title, description, code, price, status, stock, category } =
        req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res
            .status(400)
            .json({ error: "Datos del producto incompletos" });
    }
    try {
        const newProduct = await createProduct({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: "Error al crear producto" });
    }
});

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("filterProducts", async (query) => {
        try {
            let filter = {};
            if (query.category) {
                filter.category = new RegExp(query.category, "i");
            }
            if (query.status) {
                filter.status = query.status === "true";
            }
            const options = {
                limit: 10,
                page: 1,
                sort: query.sort
                    ? { price: query.sort === "asc" ? 1 : -1 }
                    : {},
            };
            const products = await getAllProducts(filter, options);
            socket.emit("updateProducts", { products: products.docs });
        } catch (error) {
            console.error("Error al filtrar productos:", error.message);
            socket.emit("error", "Error al filtrar productos");
        }
    });

    socket.on("paginate", async ({ page }) => {
        try {
            const options = {
                limit: 10,
                page: page || 1,
                sort: { createdAt: -1 },
            };
            const products = await getAllProducts({}, options);
            socket.emit("updateProducts", {
                products: products.docs,
                currentPage: page,
                hasNextPage: products.hasNextPage,
                hasPrevPage: products.hasPrevPage,
                nextPage: products.nextPage,
                prevPage: products.prevPage,
            });
        } catch (error) {
            console.error("Error al paginar productos:", error.message);
            socket.emit("error", "Error al paginar productos");
        }
    });

    socket.on("newProduct", async (productData) => {
        try {
            const newProduct = await createProduct(productData);
            const options = {
                limit: 10,
                page: 1,
                sort: { createdAt: -1 },
            };
            const updatedProducts = await getAllProducts({}, options);
            socket.emit("updateProducts", {
                products: updatedProducts.docs,
                currentPage: 1,
            });
        } catch (error) {
            socket.emit("error", "Error al agregar nuevo producto");
        }
    });

    socket.on("deleteProduct", async (productId) => {
        try {
            await deleteProduct(productId);
            const options = {
                limit: 10,
                page: 1,
                sort: { createdAt: -1 },
            };
            const updatedProducts = await getAllProducts({}, options);
            socket.emit("updateProducts", {
                products: updatedProducts.docs,
                currentPage: 1,
            });
        } catch (error) {
            socket.emit("error", "Error al eliminar producto");
        }
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
