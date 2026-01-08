import * as ProductService from "../service/product.service.js";

export const createProduct = async (req, res) => {
  const productId = await ProductService.createProduct({
    sellerId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    message: "Product created successfully",
    productId
  });
};

export const getProductById = async (req, res) => {
  const product = await ProductService.getProductById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};

export const getAllProducts = async (req, res) => {
  const products = await ProductService.getAllProducts(req.query);
  res.json(products);
};

export const getMyProducts = async (req, res) => {
  const products = await ProductService.getProductsBySeller(req.user.id);
  res.json(products);
};

export const updateProduct = async (req, res) => {
  await ProductService.updateProduct(
    req.params.id,
    req.user.id,
    req.body
  );

  res.json({ message: "Product updated successfully" });
};

export const deleteProduct = async (req, res) => {
  await ProductService.softDeleteProduct(
    req.params.id,
    req.user.id
  );

  res.json({ message: "Product removed successfully" });
};

export const disableProduct = async (req, res) => {
  await ProductService.adminDisableProduct(req.params.id);

  res.json({ message: "Product disabled by admin" });
};
