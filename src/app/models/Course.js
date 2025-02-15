const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const slugify = require("slugify");
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Course = new Schema(
  {
    name: { type: String, require: true },
    description: { type: String },
    image: { type: String },
    videoId: { type: String, require: true },
    level: { type: String },
    slug: { type: String, slug: "name", unique: true },
  },
  {
    timestamps: true,
  }
);

// Middleware tự động tạo slug nếu trùng
Course.pre("save", async function (next) {
  if (this.isModified("name") || this.isNew) {
    let newSlug = slugify(this.name, { lower: true, strict: true });
    let count = 0;

    while (await mongoose.model("Course").exists({ slug: newSlug })) {
      count++;
      newSlug = `${slugify(this.name, { lower: true, strict: true })}-${count}`;
    }

    this.slug = newSlug;
  }
  next();
});

// Add plugin
mongoose.plugin(slug)
Course.plugin(mongooseDelete, {
  deletedAt : true,
  overrideMethods: 'all',
});

module.exports = mongoose.model("Course", Course);
