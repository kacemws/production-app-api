//middleware
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const auth = require("../middleware/auth");

//utils
const productModule = require("../logic/product");

router.get("/", auth, async (req, res) => {
  try {
    let products = await productModule.get();

    const owner = req?.user?.id;

    if (products?.length == 0) {
      throw {
        statusCode: 204,
        body: "No products",
      };
    }
    // Send 200 - notes
    res.status(200).json({
      products,
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
        body: "Empty product!",
      };
    }

    const owner = req?.user?.id;

    const { error } = verifyProduct(req.body);
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { code, designation, price, mesureUnit, disponibility } = req.body;

    const product = await productModule.create({
      code,
      designation,
      price,
      mesureUnit,
      disponibility,
    });

    res.status(201).json({
      message: "created successfuly",
      id: product["_id"],
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
        body: "Empty product!",
      };
    }

    const owner = req?.user?.id;

    const id = req?.params?.id;

    const { error } = verifyExistingProduct({ ...req.body, id });
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { code, designation, price, mesureUnit, disponibility } = req.body;

    const product = await productModule.find(id);

    if (!product) {
      throw {
        statusCode: 400,
        body: "product not found",
      };
    }

    await productModule.update(id, {
      code,
      designation,
      price,
      mesureUnit,
      disponibility,
    });

    res.status(200).json({
      message: "updated successfuly",
      id: product["_id"],
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

    const product = await productModule.find(id);

    if (!product) {
      throw {
        statusCode: 400,
        body: "product not found",
      };
    }

    await productModule.delete(id);

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

function verifyProduct(data) {
  const schema = Joi.object({
    code: Joi.string().required(),
    designation: Joi.string().required(),
    price: Joi.number(),
    mesureUnit: Joi.string().required(),
    disponibility: Joi.bool(),
  });

  return schema.validate(data);
}
function verifyExistingProduct(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
    code: Joi.string().required(),
    designation: Joi.string().required(),
    price: Joi.number(),
    mesureUnit: Joi.string().required(),
    disponibility: Joi.bool(),
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
