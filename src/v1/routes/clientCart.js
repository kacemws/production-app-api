//middleware
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const auth = require("../middleware/auth");

//utils
const cartModule = require("../logic/clientCart");

router.get("/", auth, async (req, res) => {
  try {
    let carts = await cartModule.get();

    const owner = req?.user?.id;

    if (carts?.length == 0) {
      throw {
        statusCode: 204,
        body: "No carts",
      };
    }
    // Send 200 - notes
    res.status(200).json({
      carts,
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

router.post("/", auth, async (req, res) => {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      throw {
        statusCode: 400,
        body: "Empty cart!",
      };
    }

    const owner = req?.user?.id;

    const { error } = verifyCart(req.body);
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { product, quantity, client, price } = req.body;

    const cart = await cartModule.create({
      product,
      quantity,
      client,
      price,
    });

    res.status(201).json({
      message: "created successfuly",
      id: cart["_id"],
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

router.put("/:id", auth, async (req, res) => {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      throw {
        statusCode: 400,
        body: "Empty cart!",
      };
    }

    const owner = req?.user?.id;

    const id = req?.params?.id;

    const { error } = verifyExistingCart({ ...req.body, id });
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { product, quantity, client, price, status } = req.body;

    const cart = await cartModule.find(id);

    if (!cart) {
      throw {
        statusCode: 400,
        body: "cart not found",
      };
    }

    await cartModule.update(id, {
      product,
      quantity,
      client,
      price,
      status,
    });

    res.status(200).json({
      message: "updated successfuly",
      id: cart["_id"],
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

router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req?.params?.id;
    const owner = req?.user?.id;
    const { error } = verifyId({
      id,
    });
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const cart = await cartModule.find(id);

    if (!cart) {
      throw {
        statusCode: 400,
        body: "cart not found",
      };
    }

    await cartModule.delete(id);

    res.status(200).json({
      message: "deleted successfuly",
      id,
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

function verifyCart(data) {
  const schema = Joi.object({
    product: Joi.string().required(),
    quantity: Joi.number().required(),
    client: Joi.string().required(),
    price: Joi.number().required(),
  });

  return schema.validate(data);
}
function verifyExistingCart(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
    product: Joi.string().required(),
    quantity: Joi.number().required(),
    client: Joi.string().required(),
    price: Joi.number().required(),
    status: Joi.string().required(),
  });

  return schema.validate(data);
}

function verifyId(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
  });

  return schema.validate(data);
}

module.exports = router;
