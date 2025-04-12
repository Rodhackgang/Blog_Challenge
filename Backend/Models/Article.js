const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  image: { type: String },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  authorDescription: { type: String, required: true },
  reported: { type: Boolean, default: false },
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
