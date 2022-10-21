const { Router } = require("express");
const tagsRoutes = Router();
const TagsController = require("../controllers/tagsController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");


const tagsController = new TagsController();

tagsRoutes.get("/", ensureAuthenticated, tagsController.index);

module.exports = tagsRoutes;