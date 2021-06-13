//middleware
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const auth = require("../middleware/auth");

//utils
const supplyRequestModule = require("../logic/supplyRequest");

router.get("/", auth, async (req, res) => {
  try {
    let requests = await supplyRequestModule.get();

    const owner = req?.user?.id;

    if (requests?.length == 0) {
      throw {
        statusCode: 204,
        body: "No supply requests",
      };
    }
    // Send 200 - notes
    res.status(200).json({
      requests,
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
        body: "Empty request!",
      };
    }

    const owner = req?.user?.id;

    const { error } = verifyRequest(req.body);
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { quantity, rawMaterial, vendor, price } = req.body;

    const request = await supplyRequestModule.create({
      quantity,
      rawMaterial,
      vendor,
      price,
    });

    res.status(201).json({
      message: "created successfuly",
      id: request["_id"],
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
        body: "Empty request!",
      };
    }

    const owner = req?.user?.id;

    const id = req?.params?.id;

    const { error } = verifyExistingRequest({ ...req.body, id });
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { quantity, rawMaterial, vendor, price } = req.body;

    const request = await supplyRequestModule.find(id);

    if (!request) {
      throw {
        statusCode: 400,
        body: "request not found",
      };
    }

    await supplyRequestModule.update(id, {
      quantity,
      rawMaterial,
      vendor,
      price,
    });

    res.status(200).json({
      message: "updated successfuly",
      id: request["_id"],
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

    const request = await supplyRequestModule.find(id);

    if (!request) {
      throw {
        statusCode: 400,
        body: "request not found",
      };
    }

    await supplyRequestModule.delete(id);

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

function verifyRequest(data) {
  const schema = Joi.object({
    quantity: Joi.number().required(),
    rawMaterial: Joi.string().required(),
    vendor: Joi.string().required(),
    price: Joi.number().required(),
  });

  return schema.validate(data);
}
function verifyExistingRequest(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
    quantity: Joi.number().required(),
    rawMaterial: Joi.string().required(),
    vendor: Joi.string().required(),
    price: Joi.number().required(),
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
