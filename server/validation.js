const Joi = require("joi");

//login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    login: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
  });
  //Validate login
  return schema.validate(data);
};

const todoValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string()
      .max(255)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case "string.empty":
              err.message = "Заголовок обязателен";
              break;
            case "string.max":
                err.message = "Длина заголовка ограничена 255 символами";
                break;
            default:
              err.message = "Неверный заголовок";
              break;
          }
        });
        return errors;
      }),
    due_date: Joi.date()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            default:
              err.message = "Неверная дата";
              break;
          }
        });
        return errors;
      }),
    description: Joi.string().allow(''),
  });

  return schema.validate(data);
};

module.exports = { loginValidation, todoValidation };