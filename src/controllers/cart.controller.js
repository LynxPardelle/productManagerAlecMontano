import { _cartService } from "../repositories/index.repository.js";

/* Create */
export const addCart = async (req, res) => {
  try {
    const cart = await _cartService.addCart(req.body);
    if (!cart?.data)
      return res.status(400).send({
        status: "error",
        message: "Error creating cart",
        error: cart?.error || cart,
      });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error creating cart",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
export const addProductToCart = async (req, res) => {
  try {
    const cart = await _cartService.addProductToCart(
      req.params.cid,
      req.params.pid,
      req.session.user._id
    );
    if (!cart?.data)
      return res.status(400).send({
        status: "error",
        message: "Error adding product to cart",
        error: cart?.error || cart,
      });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error adding product to cart",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
/* Read */
export const getCartById = async (req, res) => {
  try {
    const cart = await _cartService.getCartById(req.params.cid);
    if (!cart?.data)
      return res.status(404).send({
        status: "error",
        message: "Cart not found",
        error: cart?.error || cart,
      });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error retrieving cart",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
/* Update */
export const updateCart = async (req, res) => {
  try {
    const cart = await _cartService.updateCart(req.params.cid, req.body);
    if (!cart?.data)
      return res.status(400).send({
        status: "error",
        message: "Error updating cart",
        error: cart?.error || cart,
      });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error updating cart",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
export const updateProductFromCart = async (req, res) => {
  try {
    const cart = await _cartService.updateProductFromCart(
      req.params.cid,
      req.params.pid,
      req.body
    );
    if (!cart?.data)
      return res.status(400).send({
        status: "error",
        message: "Error updating product from cart",
        error: cart?.error || cart,
      });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error updating product from cart",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
export const purchaseCart = async (req, res) => {
  try {
    const purchase = await _cartService.purchaseCart(
      req.params.cid,
      req.session.user.email
    );
    if (!purchase?.data?.ticket)
      return res.status(400).send({
        status: "error",
        message: "Error purchasing cart",
        error: purchase?.error || purchase,
      });
    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error purchasing cart",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
/* Delete */
export const deleteProductFromCart = async (req, res) => {
  try {
    const cart = await _cartService.deleteProductFromCart(
      req.params.cid,
      req.params.pid
    );
    if (!cart?.data)
      return res.status(400).send({
        status: "error",
        message: "Error deleting product from cart",
        error: cart?.error || cart,
      });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error deleting product from cart",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
