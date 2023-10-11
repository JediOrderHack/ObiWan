import express from "express";

// Controllers
import * as userController from "../controllers/user_controller.js";

// Middlewares
import authUserController from "../middlewares/auth_user_controller.js";
import userExistsController from "../middlewares/user_exists_controller.js";

const router = express.Router();

// POST /users/
router.post("/", userController.createUser);

// POST /users/validate/codigo de registro
router.post("/validate/:regCode", userController.validateUser);

// POST /users/login
router.post("/login", userController.loginUser);

// GET /users/
router.get(
  "/",
  authUserController,
  userExistsController,
  userController.allUsers
);

// GET /users/1
router.get("/:userId", userController.getUser);

// PUT /users/avatar
router.put(
  "/avatar",
  authUserController,
  userExistsController,
  userController.editUserAvatar
);

// PUT /users/recover-password
router.put("/recover-password", userController.sendRecoverPass);

// PUT /users/reset-password
router.put("/reset-password", userController.editUserPass);

export default router;
