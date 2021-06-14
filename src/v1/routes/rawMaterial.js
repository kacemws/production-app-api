//middleware
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const auth = require("../middleware/auth");

//utils
const materialModule = require("../logic/rawMaterial");

router.get("/", auth, async (req, res) => {
  try {
    let materials = await materialModule.get();

    const owner = req?.user?.id;

    if (materials?.length == 0) {
      throw {
        statusCode: 204,
        body: "No materials",
      };
    }
    // Send 200 - notes
    res.status(200).json({
      materials,
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
        body: "Empty material!",
      };
    }

    const owner = req?.user?.id;

    const { error } = verifyMaterial(req.body);
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { designation, quantity, disponibility } = req.body;

    const material = await materialModule.create({
      designation,
      quantity,
      disponibility,
    });

    res.status(201).json({
      message: "created successfuly",
      id: material["_id"],
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
        body: "Empty material!",
      };
    }

    const owner = req?.user?.id;

    const id = req?.params?.id;

    const { error } = verifyExistingMaterial({ ...req.body, id });
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { designation, quantity, disponibility } = req.body;

    const material = await materialModule.find(id);

    if (!material) {
      throw {
        statusCode: 400,
        body: "material not found",
      };
    }

    await materialModule.update(id, {
      designation,
      quantity,
      disponibility,
    });

    res.status(200).json({
      message: "updated successfuly",
      id: material["_id"],
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

    const material = await materialModule.find(id);

    if (!material) {
      throw {
        statusCode: 400,
        body: "Material not found",
      };
    }

    await materialModule.delete(id);

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

function verifyMaterial(data) {
  const schema = Joi.object({
    designation: Joi.string().required(),
    quantity: Joi.number().required(),
    disponibility: Joi.bool(),
  });

  return schema.validate(data);
}
function verifyExistingMaterial(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
    designation: Joi.string().required(),
    quantity: Joi.number().required(),
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
