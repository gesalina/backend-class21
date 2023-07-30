import productRouter from "../src/api/routers/products/product.router.js";
import cartRouter from "../src/api/routers/carts/cart.router.js";
import viewRouter from "../src/api/routers/main/view.router.js";
import chatRouter from "../src/api/routers/chat/chat.router.js";
import sessionRouter from "../src/api/routers/login/session.router.js";

/**
 * Run the socket and the app
 */
const run = (io, app) => {
  app.use((request, response, next) => {
    request.io = io;
    next();
  });

  /**
   * API routes
   */

  app.use("/api/products", productRouter);
  app.use("/api/carts", cartRouter);
  app.use("/api/chat", chatRouter);
  app.use("/session", sessionRouter);

  /**
   * Main view route
   */
  app.use("/", viewRouter);

  /**
   * Socket IO initilization
   */

  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("productList", (data) => {
      io.emit("updateProducts", data);
    });
    socket.on("messages", (data) => {
      io.emit("logs", data);
    });
  });
};

export default run;
