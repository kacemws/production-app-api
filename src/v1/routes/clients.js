//middleware
const express = require("express");
const Joi = require("joi");
const router = express.Router();

const userModule = require("../logic/user");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    let clients = await userModule.findClients();

    const owner = req?.user?.id;

    if (clients?.length == 0) {
      throw {
        statusCode: 204,
        body: "No clients",
      };
    }
    // Send 200 - notes
    res.status(200).json({
      clients,
    });
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({
        message: err.body,
      });
    }
  }
});

module.exports = router;
