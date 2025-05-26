const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100
  }
});

// Віртуальне поле для URL жанру
GenreSchema.virtual("url").get(function () {
  return `/catalog/genre/${this._id}`;
});

// Експортуємо модель
module.exports = mongoose.model("Genre", GenreSchema);