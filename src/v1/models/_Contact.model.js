const { Schema, model } = require("mongoose");
const validator = require("validator");
const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name can not be empty"],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Invalid email"],
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
  },
});

module.exports = model("contacts", contactSchema);
