import { _productService } from "../repositories/index.repository.js";

/* Create */
export const addProduct = async (req, res) => {
  try {
    const product = await _productService.addProduct(req.body);
    if (!product?.data)
      return res.status(400).send({
        status: "error",
        message: "Error creating product",
        error: product?.error || product,
      });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error creating product",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
/* Read */
export const getProducts = async (req, res) => {
  try {
    const products = await _productService.getProducts(
      req.query.limit,
      req.query.page,
      req.query.sort,
      req.query.query
    );
    if (!products?.data)
      return res.status(404).send({
        status: "error",
        message: "Products not found",
        error: products?.error || products,
      });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error retrieving products",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
export const getProductById = async (req, res) => {
  try {
    const product = await _productService.getProductById(req.params.pid);
    if (!product?.data)
      return res.status(404).send({
        status: "error",
        message: "Product not found",
        error: product?.error || product,
      });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error retrieving product",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
/* Update */
export const updateProduct = async (req, res) => {
  try {
    const product = await _productService.updateProduct(
      req.params.pid,
      req.body
    );
    if (!product?.data)
      return res.status(400).send({
        status: "error",
        message: "Error updating product",
        error: product?.error || product,
      });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error updating product",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
/* Delete */
export const deleteProduct = async (req, res) => {
  try {
    const product = await _productService.deleteProduct(req.params.pid);
    if (!product?.data)
      return res.status(400).send({
        status: "error",
        message: "Error deleting product",
        error: product?.error || product,
      });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error deleting product",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
