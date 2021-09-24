const Joi = require('joi')

//login validation
const loginValidation = (data) => {
    const schema = Joi.object({
        login: Joi.string().min(3).required(),
        password: Joi.string().min(3).required()
    });
    //Validate login
    return schema.validate(data)
}

module.exports.loginValidation = loginValidation