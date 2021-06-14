//middleware
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const auth = require("../middleware/auth");

//utils
const saleModule = require("../logic/sale");

router.get("/", auth, async (req, res) => {
  try {
    let sales = await saleModule.get();

    const owner = req?.user?.id;

    if (sales?.length == 0) {
      throw {
        statusCode: 204,
        body: "No sales",
      };
    }
    // Send 200 - notes
    res.status(200).json({
      sales,
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
        body: "Empty sale!",
      };
    }

    const owner = req?.user?.id;

    const { error } = verifySale(req.body);
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { cart, confirmed, saleDate } = req.body;

    const sale = await saleModule.create({
      cart,
      confirmed,
      saleDate,
    });

    res.status(201).json({
      message: "created successfuly",
      id: sale["_id"],
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
        body: "Empty sale!",
      };
    }

    const owner = req?.user?.id;

    const id = req?.params?.id;

    const { error } = verifyExistingSale({ ...req.body, id });
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { cart, confirmed, saleDate } = req.body;

    const sale = await saleModule.find(id);

    if (!sale) {
      throw {
        statusCode: 400,
        body: "sale not found",
      };
    }

    await saleModule.update(id, {
      cart,
      confirmed,
      saleDate,
    });

    res.status(200).json({
      message: "updated successfuly",
      id: sale["_id"],
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

    const sale = await saleModule.find(id);

    if (!sale) {
      throw {
        statusCode: 400,
        body: "sale not found",
      };
    }

    await saleModule.delete(id);

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

function verifySale(data) {
  const schema = Joi.object({
    cart: Joi.string().required(),
    confirmed: Joi.bool(),
    saleDate: Joi.date().required(),
  });

  return schema.validate(data);
}
function verifyExistingSale(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
    cart: Joi.string().required(),
    confirmed: Joi.bool(),
    saleDate: Joi.date().required(),
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
