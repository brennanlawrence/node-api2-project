const express = require("express");
const postsRoute = require("./posts/postsRouter");

const server = express();

server.use("/api/posts", postsRoute);

server.get("/", (req, res) => {
  res.status(200).json({ message: "Success, welcome to the app!" });
});

server.listen(5000, () => console.log("Server running on port 5000"));
