const { Router } = require("express");
const userRoutes = Router();
const UsersController = require("../controllers/usersController");
const UserAvatarController = require("../controllers/userAvatarController");

const ensureAuthenticated = require("../middleware/ensureAuthenticated");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig.MULTER);

userRoutes.post("/", usersController.create);

userRoutes.put("/", ensureAuthenticated, usersController.update);

userRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update)

module.exports = userRoutes;