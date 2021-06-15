//middleware
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const auth = require("../middleware/auth");

//utils
const productionModule = require("../logic/production");

router.get("/", auth, async (req, res) => {
  try {
    let productions = await productionModule.get();

    const owner = req?.user?.id;

    if (productions?.length == 0) {
      throw {
        statusCode: 204,
        body: "No productions",
      };
    }
    // Send 200 - notes
    res.status(200).json({
      productions,
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
        body: "Empty production !",
      };
    }

    const owner = req?.user?.id;

    const { error } = verifyProduction(req.body);
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { product, state, start, duration, quantity } = req.body;

    const production = await productionModule.create({
      product,
      state,
      start,
      duration,
      quantity,
    });

    res.status(201).json({
      message: "created successfuly",
      id: production["_id"],
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
        body: "Empty production!",
      };
    }

    const owner = req?.user?.id;

    const id = req?.params?.id;

    const { error } = verifyExistingProduction({ ...req.body, id });
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { product, state, start, duration } = req.body;

    const production = await productionModule.find(id);

    if (!production) {
      throw {
        statusCode: 400,
        body: "production not found",
      };
    }

    await productionModule.update(id, {
      product,
      state,
      start,
      duration,
    });

    res.status(200).json({
      message: "updated successfuly",
      id: production["_id"],
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

    const production = await productionModule.find(id);

    if (!production) {
      throw {
        statusCode: 400,
        body: "production not found",
      };
    }

    await productionModule.delete(id);

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

function verifyProduction(data) {
  const schema = Joi.object({
    product: Joi.string().required(),
    state: Joi.number(),
    start: Joi.date(),
    duration: Joi.number().required(),
    quantity: Joi.number().required,
  });

  return schema.validate(data);
}
function verifyExistingProduction(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
    product: Joi.string().required(),
    state: Joi.number(),
    start: Joi.date(),
    duration: Joi.number().required(),
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
