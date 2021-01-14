const express = require("express");
const postsRoute = require("./posts/postsRouter");

const server = express();
const port = process.env.PORT || 5000;

server.use("/api/posts", postsRoute);


server.get("/", (req, res) => {
  res.status(200).json({ message: "Success, welcome to the app!" });
});

server.listen(port, () => console.log(`Server running on port: ${port}`));
