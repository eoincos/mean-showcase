var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    body: String,
    author: String,
    upvotes: {type: Number, default: 0},
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'}
});

CommentSchema.methods.upvote = function (cb) {
    this.upvotes += 1;
    this.save(cb);
};

CommentSchema.methods.downvote = function (cb) {
    this.upvotes -= 1;
    this.save(cb);
};

mongoose.model('Comment', CommentSchema);