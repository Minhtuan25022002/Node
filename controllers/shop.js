const Product = require("../models/products");
const Cart = require("../models/cart");

exports.getProducts = async (req, res, next) => {
  Product.findAll()
    .then((product) => {
      res.render("shop/products-list", {
        prods: product,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({where: { id: prodId }}).then(products => {
  //   res.render("shop/product-detail", {
  //     product: products[0],
  //     pageTitle: products[0].title,
  //     path: "/products",
  //   });
  // }).catch(err => {
  //   console.log(err);
  // })
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((product) => {
      res.render("shop/index", {
        prods: product,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  const cart = Cart.getCart();
  const products = Product.fetchAll();
  const cartProducts = [];
  for (product of products) {
    const cartProductData = cart.products.find(
      (prod) => prod.id === product.id
    );
    if (cartProductData) {
      cartProducts.push({ productData: product, qty: cartProductData.qty });
    }
  }
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
    products: cartProducts,
  });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const product = await Product.findById(prodId);
  await Cart.addProduct(prodId, product.price);
  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const product = await Product.findById(prodId);
  Cart.postDeleteProduct(prodId, product.price);
  res.redirect("/cart");
};
