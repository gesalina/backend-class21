import { Router} from "express";
import ProductManager from "../../controllers/dao/ProductManager.js";
import {isUserAuthenticate} from '../../../utils.js'

const router = Router();
const product = new ProductManager();

/*
 * This router allows to show the products in the main view
 */

router.get("/", async (request, response) => {
  response.redirect('/session/login');
});

/**
 * This router allows to render the products on realtime
 * have a form and a delete button working with websocket
 */
router.get("/realtimeproducts", isUserAuthenticate, async (request, response) => {
  const products = await product.getProducts(request);
  response.render("realTimeProducts", {
    view_name: "Productos en tiempo real",
    products: products.docs,
  });
});

/**
 *  This router render the chat, that work with websocket
 */
router.get("/chat", async (request, response) => {
  response.render("chat");
});

/**
 * This router render the products view with the user information
 */
router.get("/products", isUserAuthenticate, async (request, response) => {
  const products = await product.getProducts(request);
    return response.render("products", {
      plugins: "?plugins=aspect-ratio",
      view_name: "Products View",
      showCart: true,
      username: request.user.first_name,
      role: request.user.role,
      products: products.docs,
      prevLink: products.hasPrevPage
        ? `http://localhost:8080?page=${products.prevPage}&limit=${products.limit}`
        : null,
      nextLink: products.hasNextPage
        ? `http://localhost:8080?page=${products.nextPage}&limit=${products.limit}`
        : null,
    });
});

export default router;
