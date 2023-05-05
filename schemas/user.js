const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   nickname: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true
   }
});


UserSchema.virtual("userId").get(function () {
   return this._id.toHexString();
});

UserSchema.set("toJSON", {
   virtuals: true   // JSON 형태로 가공할 때, userId를 출력시켜준다.
});


module.exports = mongoose.model("User", UserSchema);