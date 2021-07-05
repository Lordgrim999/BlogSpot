/*  eslint linebreak-style: ["error", "windows"]    */
const mongoose = require('mongoose');
const slugify = require('slugify');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const marked = require('marked');

const DOMPurify = createDOMPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  markdown: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    unique: true,
    require: true,
  },
  sanitizedHtml: {
    type: String,
    require: true,
  },
});

articleSchema.pre('validate', function sluging(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.markdown) {
    this.sanitizedHtml = DOMPurify.sanitize(marked(this.markdown));
  }
  next();
});
module.exports = mongoose.model('Article', articleSchema);
