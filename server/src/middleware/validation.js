import ValidationError from "../utils/errorHandler.js";

const validate = (schema, options = {}) => {
  return (req, res, next) => {
    const source = options.source || "body";
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      ...options,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      throw new ValidationError("Validation failed", details);
    }

    req[source] = value;
    next();
  };
};

export default { validate };
