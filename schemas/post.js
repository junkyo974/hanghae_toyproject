const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
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


PostSchema.virtual("postId").get(function () {
    return this._id.toHexString();
 });

PostSchema.set("toJSON", {
    virtuals: true   // JSON 형태로 가공할 때, postId를 출력시켜준다.
});

module.exports = mongoose.model("post", PostSchema);