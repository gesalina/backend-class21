import { Router } from "express";
import UserModel from "../../models/user.model.js";
import { isValidPassword } from "../../../utils.js";
import passport from "passport";

const router = Router();

/**
 * This route get the login form
 */
router.get("/login", (request, response) => {
  response.render("sessions/login", {
    view_name: "Login | Tenda",
  });
});

/**
 * API for register a new user
 */
router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/session/failRegister",
  }),
  async (request, response) => {
    response.redirect("/session/login");
  }
);

/**
 * Failed route
 */
router.get("/failRegister", (request, response) => {
  response.send({ error: "Failed" });
});

/**
 * This route get the register form
 */

router.get("/register", (request, response) => {
  response.render("sessions/register", {
    view_name: "Register | Tenda",
  });
});
/**
 * API for login, this auth the user
 */
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/session/failLogin",
  }),
  async (request, response) => {
    response.redirect("/products");
  }
);

/**
 * Login failed route
 */
router.get("/failLogin", (request, response) => {
  response.send({ error: "Failed to authenticate" });
});

/**
 * API to destroy the sessions
 */
router.post("/logout", (request, response) => {
  request.session.destroy((err) => {
    if (err)
      return response.json({ status: "error", message: "Ocurrio un error" });
    return response.redirect("/session/login");
  });
});

/**
 * API to login with github, redirect to the passport github middleware to get 
 * the users rights and data
 */
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (request, response) => {}
);

/**
 * API to complete the login, after the auth the user in the github passport middleware
 * this redirect you to the view
 */
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/session/login" }),
  async (request, response) => {
    response.redirect("/products");
  }
);

export default router;
