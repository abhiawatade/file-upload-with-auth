const express = require("express");
const app = express();
const port = 3001;

// middleware
app.use(express.json);
app.use(express.urlencoded({ extended: false }));
app.use(express.static("Content"));

app.listen(port, () => {
  console.log("server listening on port");
});
