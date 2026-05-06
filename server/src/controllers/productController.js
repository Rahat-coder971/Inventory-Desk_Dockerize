import Product from '../models/Product.js';

function buildProductQuery({ search, status }) {
  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search) {
    const regex = new RegExp(search.trim(), 'i');
    query.$or = [{ name: regex }, { sku: regex }, { category: regex }];
  }

  return query;
}

export async function listProducts(req, res, next) {
  try {
    const query = buildProductQuery(req.query);
    const products = await Product.find(query).sort({ updatedAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ message: 'Product deleted', id: product.id });
  } catch (error) {
    return next(error);
  }
}
