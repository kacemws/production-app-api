//middleware
const express = require("express");
const Joi = require("joi");
const router = express.Router();

const userModule = require("../logic/user");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    let vendors = await userModule.findVendors();

    const owner = req?.user?.id;

    if (vendors?.length == 0) {
      throw {
        statusCode: 204,
        body: "No vendors",
      };
    }
    // Send 200 - notes
    res.status(200).json({
      vendors,
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

router.post("/", async (req, res) => {
  try {
    // checking that the body's request is not empty
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      throw {
        statusCode: 400,
        body: "Empty request!",
      };
    }

    // checking that the body's request match the defined needed body
    const { error } = verifyUsersData(req.body);

    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    // checking to see if a user with the same email exists
    const data = req.body;

    let user = await userModule.find(data.email);

    if (user) {
      throw {
        statusCode: 400,
        body: "already exisits",
      };
    }
    data.username = data.email;
    // creating the user
    user = await userModule.create(data);

    res.status(201).json({
      message: "created successfuly",
      id: user["_id"],
    });
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({
        message: err.body,
      });
    }
  }
});

function verifyUsersData(data) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string(),
    state: Joi.string(),
    email: Joi.string().email().required(),
    role: Joi.string().required(),
    password: Joi.string().required(),
  });

  return schema.validate(data);
}

module.exports = router;
