const express = require("express");

const Post = require("../data/db");
const router = express.Router();

router.use(express.json());

//POST

router.post("/", (req, res) => {
  const post = req.body;
  if (!post["title"] || !post["contents"]) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    Post.insert(post)
      .then((postId) => {
        res.status(201).json(postId);
      })
      .catch((err) => {
        res.status(500).json({
          error: "There was an error while saving the post to the database",
        });
      });
  }
});

router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const comment = req.body;
  const post = Post.findById(id);

  if (!comment["text"]) {
    res.status(400).json({
      errorMessage: "Please provide text for the comment.",
    });
  } else if (!post) {
    res.status(404).json({
      message: "The post with the specified ID does not exist.",
    });
  } else {
    Post.insertComment(comment)
      .then((postId) => {
        res.status(201).json(comment);
      })
      .catch((err) => {
        res.status(500).json({
          error: "There was an error while saving the comment to the database",
        });
      });
  }
});

//GET

router.get("/", (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Post.findById(id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: `The post with id: ${id} does not exist` });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: `The post with id: ${id} could not be retrieved.` });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  const post = Post.findById(id);

  Post.findPostComments(id)
    .then((comments) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(comments);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: `The post with id: ${id} could not be retrieved.` });
    });
});

//DELETE

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const post = Post.findById(id);

  if (!post) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  } else {
    Post.remove(id)
      .then((postId) => {
        res.status(200).json({
          message: `The post with id: ${id} was successfully deleted.`,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "The post could not be removed" });
      });
  }
});

//PUT

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const post = Post.findById(id);
  const updatedPost = req.body;

  if (!post) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  } else if (!updatedPost["title"] || !updatedPost["contents"]) {
    res
      .status(400)
      .json({
        errorMessage: "Please provide title and contents for the post.",
      });
  } else {
    Post.update(id, updatedPost)
      .then((success) => {
        res.status(200).json(updatedPost);
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({ error: "The post information could not be updated" });
      });
  }
});

module.exports = router;
