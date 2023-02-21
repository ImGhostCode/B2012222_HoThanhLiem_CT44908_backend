const express = require("express");
const router = express.Router();
const { contactController } = require("../controllers/index.controller");

router
  .route("/")
  .post(contactController.create)
  .get(contactController.findAll)
  .delete(contactController.deleteAll);

router.route("/favorite").get(contactController.findAllFavorite);

router
  .route("/:id")
  .get(contactController.findOne)
  .put(contactController.update)
  .delete(contactController.delete);
module.exports = router;
