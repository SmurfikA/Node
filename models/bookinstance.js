const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, // посилання на пов'язану книгу
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: { type: Date, default: Date.now },
});

// Віртуальне поле для URL екземпляра книги
BookInstanceSchema.virtual("url").get(function () {
  // Ми не використовуємо стрілочну функцію, оскільки нам знадобиться об'єкт this
  return `/catalog/bookinstance/${this._id}`;
});

BookInstanceSchema.virtual("due_back_formatted").get(function () {
  return this.due_back
    ? DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED)
    : "";
});

// Експортуємо модель
module.exports = mongoose.model("BookInstance", BookInstanceSchema);