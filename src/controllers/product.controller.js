import { _productService } from "../repositories/index.repository.js";
import { generateProduct } from "../utils/fakerUtil.js";
import CustomError from "../services/errors/customError.js";
import { generateConsultErrorInfo } from "../services/errors/info.js";

/* Create */
export const addProduct = async (req, res) => {
  let nError = 500;
  try {
    const product = req.body;
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      typeof product.price !== "number" ||
      !product.stock ||
      typeof product.stock !== "number" ||
      !product.code ||
      !product.category
    ) {
      nError = 400;
      CustomError.createError({
        name: "Missing data",
        cause: generateProductErrorInfo(product, req.session.user),
        message: "Error adding product",
        code: ErrorCodes.INVALID_PARAM,
      });
    }
    const newProduct = await _productService.addProduct(req.body);
    if (!newProduct?.data) {
      nError = 404;
      CustomError.createError({
        name: "Product not created",
        cause: generateNoProductErrorInfo(newProduct),
        message: "Error creating product",
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(nError).send({
      status: "error",
      message: "Error creating product",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
/* Read */
export const getProducts = async (req, res) => {
  let nError = 500;
  try {
    const products = await _productService.getProducts(
      req.query.limit,
      req.query.page,
      req.query.sort,
      req.query.query
    );
    if (!products?.data) {
      nError = 404;
      CustomError.createError({
        name: "Products not found",
        cause: generateNoProductsErrorInfo(products),
        message: "Error retrieving products",
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(nError).send({
      status: "error",
      message: "Error retrieving products",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
export const getProductById = async (req, res) => {
  let nError = 500;
  try {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid) || pid < 0) {
      nError = 400;
      CustomError.createError({
        name: "Invalid Params",
        cause: generateConsultErrorInfo(req.params.pid),
        message: "Error to get product by ID",
        code: ErrorCodes.INVALID_TYPES_ERROR,
      });
    }
    const product = await _productService.getProductById(pid);
    if (!product?.data) {
      nError = 404;
      CustomError.createError({
        name: "Product not found",
        cause: generateNoProductErrorInfo(product),
        message: "Error to get product",
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(nError).send({
      status: "error",
      message: "Error retrieving product",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
export const getMockedProducts = async (req, res) => {
  let nError = 500;
  try {
    const products = [];
    const numberOfProducts = req.query.limit || 100;
    for (let i = 0; i < numberOfProducts; i++) {
      products.push(generateProduct());
    }
    res.status(200).send({
      status: "success",
      payload: { data: products },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error retrieving products",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
/* Update */
export const updateProduct = async (req, res) => {
  let nError = 500;
  try {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid) || pid < 0) {
      nError = 400;
      CustomError.createError({
        name: "Invalid Params",
        cause: generateConsultErrorInfo(req.params.pid),
        message: "Error to get product by ID",
        code: ErrorCodes.INVALID_TYPES_ERROR,
      });
    }
    const product = req.body;
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      typeof product.price !== "number" ||
      !product.stock ||
      typeof product.stock !== "number" ||
      !product.code ||
      !product.category
    ) {
      nError = 400;
      CustomError.createError({
        name: "Missing data",
        cause: generateProductErrorInfo(product),
        message: "Error updating product",
        code: ErrorCodes.INVALID_PARAM,
      });
    }
    const updatedProduct = await _productService.updateProduct(
      pid,
      product,
      req.session.user
    );
    if (!updatedProduct?.data) {
      nError = 404;
      CustomError.createError({
        name: "Product not found",
        cause: generateNoProductErrorInfo(updatedProduct),
        message: "Error updating product",
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(nError).send({
      status: "error",
      message: "Error updating product",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
/* Delete */
export const deleteProduct = async (req, res) => {
  let nError = 500;
  try {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid) || pid < 0) {
      nError = 400;
      CustomError.createError({
        name: "Invalid Params",
        cause: generateConsultErrorInfo(req.params.pid),
        message: "Error to get product by ID",
        code: ErrorCodes.INVALID_TYPES_ERROR,
      });
    }
    const product = await _productService.deleteProduct(pid, req.session.user);
    if (!product?.data) {
      nError = 404;
      CustomError.createError({
        name: "Product not found",
        cause: generateNoProductErrorInfo(product),
        message: "Error deleting product",
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(nError).send({
      status: "error",
      message: "Error deleting product",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
