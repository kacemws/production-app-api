//middleware
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const auth = require("../middleware/auth");

//utils
const supplyModule = require("../logic/supply");

router.get("/", auth, async (req, res) => {
  try {
    let supplies = await supplyModule.get();

    const owner = req?.user?.id;

    if (supplies?.length == 0) {
      throw {
        statusCode: 204,
        body: "No supplies",
      };
    }
    // Send 200 - notes
    res.status(200).json({
      supplies,
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
        body: "Empty supply!",
      };
    }

    const owner = req?.user?.id;

    const { error } = verifySupply(req.body);
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { request } = req.body;

    const supply = await supplyModule.create({
      request,
    });

    res.status(201).json({
      message: "created successfuly",
      id: supply["_id"],
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
        body: "Empty supply!",
      };
    }

    const owner = req?.user?.id;

    const id = req?.params?.id;

    const { error } = verifyExistingSupply({ ...req.body, id });
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { request } = req.body;

    const supply = await supplyModule.find(id);

    if (!supply) {
      throw {
        statusCode: 400,
        body: "supply not found",
      };
    }

    await supplyModule.update(id, {
      request,
    });

    res.status(200).json({
      message: "updated successfuly",
      id: supply["_id"],
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

    const supply = await supplyModule.find(id);

    if (!supply) {
      throw {
        statusCode: 400,
        body: "supply not found",
      };
    }

    await supplyModule.delete(id);

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

function verifySupply(data) {
  const schema = Joi.object({
    request: Joi.string().required(),
  });

  return schema.validate(data);
}
function verifyExistingSupply(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
    request: Joi.string().required(),
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
