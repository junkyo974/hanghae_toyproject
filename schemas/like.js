const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
   postId: {
      type: String,
      required: true
   },
   userId: {
      type: String,
      required: true
   }
});

likeSchema.virtual("likeId").get(function () {
   return this._id.toHexString();
});

likeSchema.set("toJSON", {
   virtuals: true   
});

module.exports = mongoose.model("like", likeSchema);