var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    title: String,
    link: String,
    author: String,
    image: String,
    upvotes: {type: Number, default: 0},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

ItemSchema.methods.upvote = function (cb) {
    this.upvotes += 1;
    this.save(cb);
};

ItemSchema.methods.downvote = function (cb) {
    this.upvotes -= 1;
    this.save(cb);
};

mongoose.model('Item', ItemSchema);