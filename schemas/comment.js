const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
   postId: {
      type: String,
      required: true
   },
   userId: {
      type: String,
      required: true
   },
   nickname: {
      type: String,
      required: true
   },
   comment: {
      type: String,
      required: true
   },
   createdAt: {
      type: Date,
      required: true,
      default: Date.now
   },
   updatedAt: {
      type: Date
   }
});

commentSchema.virtual("commentId").get(function () {
   return this._id.toHexString();
});

commentSchema.set("toJSON", {
   virtuals: true   // JSON 형태로 가공할 때, postId를 출력시켜준다.
});

module.exports = mongoose.model("comment", commentSchema);