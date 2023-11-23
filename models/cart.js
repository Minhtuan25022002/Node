const fs = require("fs/promises");
const path = require("path");

const rootDir = require("../util/path");

module.exports = class Cart {
  static PATH = path.join(rootDir, "data", "cart.json");

  static async addProduct(id, productPrice) {
    try {
      let cart = { products: [], totalPrice: 0 };

      // Kiểm tra sự tồn tại của file cart.json
      try {
        await fs.access(Cart.PATH);
      } catch (err) {
        // Nếu file không tồn tại, tạo mới nó với nội dung trống
        await fs.writeFile(Cart.PATH, JSON.stringify(cart), "utf-8");
      }

      // Đọc dữ liệu từ file
      const data = await fs.readFile(Cart.PATH, "utf-8");
      cart = JSON.parse(data);

      // Thực hiện các bước thêm sản phẩm vào giỏ hàng
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      // Ghi lại giỏ hàng đã cập nhật vào file
      await fs.writeFile(Cart.PATH, JSON.stringify(cart), "utf-8");
    } catch (error) {
      console.log("Error in addProduct:", error);
    }
  }

  static async postDeleteProduct(id, productPrice) {
    try {
      let data = await fs.readFile(Cart.PATH);
      const carts = JSON.parse(data);
      const updatedCart = { ...carts };
      const product = updatedCart.products.find(
        prod => prod.id === id
      );
      if(!product) {
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        prod => prod.id !== id
      );
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
      await fs.writeFile(Cart.PATH, JSON.stringify(updatedCart), "utf-8"); 
    } catch (error) {
      console.log(error);
    }

  }

  static async getCart() {
    try {
      let data = await fs.readFile(Cart.PATH);
      const carts = JSON.parse(data);
      return carts;
    } catch (error) {
      return null;
    }
  }
};
