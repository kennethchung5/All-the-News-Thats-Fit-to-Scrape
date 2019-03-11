const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({  
  headline: {
    type: String,
    required: true, 
    unique: true
  },
  author: {
    type: String
    // required: true
  },
  summary: {
    type: String
    // required: true
  },  
  url: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
