const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const ErrorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require('./models/products');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const port = 3000;

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoute = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1).then(user => {
    req.user = user; 
    next();
  }).catch(err => {
    console.log(err);
  })
})

app.use("/admin", adminRoutes);
app.use(shopRoute);

app.use(ErrorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

//force ở đây để mỗi lần start thì drop các bảng trong db
sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1)
  })
  .then(user => {
    if(!user) {
      User.create({ name: 'Tuan', email: "ntmt2502@gmail.com" })
    }
    return user;
  })
  .then(user => {
    return user.createCart();
  })
  .then(user => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
