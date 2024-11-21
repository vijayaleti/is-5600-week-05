const path = require('path')
const Products = require('./products')
const Orders = require('./orders')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25, tag } = req.query
  // Pass the limit and offset to the Products service
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}


/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct(req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }

  return res.json(product)
}

/**
 * Create a product
 * @param {object} req 
 * @param {object} res 
 */
async function createProduct (req, res, next) {
  const product = await Products.create(req.body)
  res.json(product)
}

async function editProduct (req, res, next) {
  const change = req.body
  const product = await Products.edit(req.params.id, change)
  res.json(product)
}


async function deleteProduct (req, res, next) {
  const response = await Products.destroy(req.params.id)
  res.json(response)
}

async function createOrder (req, res, next) {
  const order = await Orders.create(req.body)
  res.json(order)
}


async function listOrders (req, res, next) {
  const { offset = 0, limit = 25, productId, status } = req.query

  const orders = await Orders.list({ 
    offset: Number(offset), 
    limit: Number(limit),
    productId, 
    status 
  })

  res.json(orders)
}

async function editOrder(req, res, next) {
  const change = req.body;
  const order = await Orders.edit(req.params.id, change);
  res.json(order);
}

async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;

    console.log(`Attempting to delete order with ID: ${id}`);

    // Call the Orders service to delete the order
    const deletedOrder = await Orders.destroy(id);

    if (!deletedOrder) {
      console.log(`Order with ID ${id} not found.`);
      return res.status(404).json({ error: `Order with ID ${id} not found` });
    }

    console.log(`Order with ID ${id} deleted successfully.`);
    res.status(200).json({ message: `Order with ID ${id} deleted successfully` });
  } catch (error) {
    console.error(`Error occurred while deleting order with ID ${req.params.id}:`, error.message);
    res.status(500).json({ error: 'An error occurred while deleting the order' });
  }
}


module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
  listOrders,
  createOrder,
  editOrder,
  deleteOrder,
});
