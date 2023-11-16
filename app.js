const express = require("express");
const app = express();
const PORT = 3000;
const routes = require("./routes");
const exphbs = require("express-handlebars");
const path = require("path");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

app.listen(PORT, () => {
  console.log(`express is listening on PORT ${PORT}`);
});
