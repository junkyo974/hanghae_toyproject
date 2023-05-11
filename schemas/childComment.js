const mongoose = require('mongoose');

const childCommentSchema = new mongoose.Schema({
    commentId: {
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
    childComment: {
        type: String,
        required: true, // 이 필드가 반드시 있어야 함
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

childCommentSchema.virtual("childCommentId").get(function () {
    return this._id.toHexString();
});

childCommentSchema.set("toJSON", {
    virtuals: true   // JSON 형태로 가공할 때, postId를 출력시켜준다.
});

module.exports = mongoose.model("childComment", childCommentSchema);