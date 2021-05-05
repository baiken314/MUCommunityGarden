const Post = require("../models/Post");
const User = require("../models/User");

const router = require("express").Router();

router.route("/").get(async (req, res) => {
    console.log("GET post");
    res.json(await Post.find()
        .populate("user", "name")
        .populate("comments")
    );
});

/**
 * req.body.user: User._id
 * req.body.title: String
 * req.body.type: String  // "post", "annoucement", "automated"
 * req.body.tags: [String]
 * req.body.content: String
 * req.body.garden: Garden._id  // reference a Garden with the Post
 * req.body.parent: Post._id  // use this to comment
 */
router.route("/create").post(async (req, res) => {
    console.log("POST post/create");
    let user = await User.findOne({ _id: req.body.user });
    let post = await new Post({
        title: req.body.title,
        type: req.body.type,
        tags: req.body.tags,
        content: req.body.content,
        parent: req.body.parent,
        garden: req.body.garden,
        user: user._id,
        date: new Date()
    }).save();

    console.log(`User ${user._id} created a post`);
    res.json({ post: post });
});

/**
 * req.body.user: User._id
 * req.body.post: Post._id
 * req.body.title: String
 * req.body.tags: [String]
 * req.body.content: String
 * req.body.garden
 */
router.route("/update").post(async (req, res) => {
    console.log("POST post/update");
    let user = await User.findOne({ _id: req.body.user });
    let post = await Post.findOne({ _id: req.body.post });

    // check if user owns post
    if (!post.user.equals(user._id) && user.type != "admin") {
        res.json({ message: "ERROR - user cannot perform this function" });
        return;
    }

    await post.updateOne({
        title: req.body.title,
        tags: req.body.tags,
        content: req.body.content,
        garden: req.body.garden,
        date: new Date()
    });

    console.log(`User ${user._id} updated a post ${post._id}`);
    res.json(post);
});

/**
 * req.body.user: User._id
 * req.body.posts: [Post._id]
 */
router.route("/delete").post(async (req, res) => {
    console.log("POST post/delete");

    let user = await User.findOne({ _id: req.body.user });

    let canDelete = true;
    for (postId of req.body.posts) {
        let post = await Post.findOne({ _id: postId });
        if (!post.user.equals(user._id)) {
            canDelete = user.type == "admin";
            break;
        }
    }

    if (canDelete) {
        for (postId of req.body.posts) {
            let post = await Post.findOne({ _id: postId });
            await post.delete();
            console.log(`User ${user._id} has deleted posts ${req.body.posts}`);
            res.json({ message: "SUCCESS - posts have been deleted" });
            return;
        }
    }
    else {
        res.json({ message: "ERROR - user cannot perform this function" });
    }
});

/**
 * req.body.user: User._id
 * req.body.post: Post._id
 */
router.route("/like").post(async (req, res) => {
    console.log("POST post/toggle-like");

    let post = await Post.findOne({ _id: req.body.post });

    let userCannotLike = post.likedBy.some((user) => {
        return user.equals(req.body.user);
    });

    if (userCannotLike) {
        res.json({ message: "ERROR - user already liked this post" });
        return;
    }

    post.likedBy.push(req.body.user);

    console.log(`User ${req.body.user} liked post ${post._id}`);
    await post.save();
});

module.exports = router;