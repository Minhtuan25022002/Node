const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const ErrorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require('./models/products');
const User = require('./models/user');

const port = 3000;

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoute = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoute);

app.use(ErrorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

//force ở đây để mỗi lần start thì drop các bảng trong db
sequelize
  .sync({ force: true })
  .then((result) => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
