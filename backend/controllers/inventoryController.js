// Inventory controller
import prisma from '../config/database.js';

/**
 * List inventory items
 * GET /api/inventory
 */
export const listInventory = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, category, search, lowStock } = req.query;

    const where = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { productId: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (lowStock === 'true') {
      where.quantity = { lte: prisma.inventoryItem.fields.minStock };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [items, total] = await Promise.all([
      prisma.inventoryItem.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { name: 'asc' },
      }),
      prisma.inventoryItem.count({ where }),
    ]);

    res.json({
      data: items,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single inventory item
 * GET /api/inventory/:id
 */
export const getInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!item) {
      return res.status(404).json({ error: 'Product niet gevonden' });
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
};

/**
 * Create inventory item
 * POST /api/inventory
 */
export const createInventoryItem = async (req, res, next) => {
  try {
    const {
      productId,
      name,
      description,
      category,
      unit,
      purchasePrice,
      sellingPrice,
      quantity,
      minStock,
      location,
      supplier,
      notes,
    } = req.body;

    if (!productId || !name || !category) {
      return res.status(400).json({
        error: 'productId, naam en categorie zijn verplicht',
      });
    }

    const item = await prisma.inventoryItem.create({
      data: {
        productId,
        name,
        description,
        category,
        unit: unit || 'stuks',
        purchasePrice: purchasePrice || 0,
        sellingPrice: sellingPrice || 0,
        quantity: quantity || 0,
        minStock: minStock || 0,
        location,
        supplier,
        notes,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

/**
 * Update inventory item
 * PUT /api/inventory/:id
 */
export const updateInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Product niet gevonden' });
    }

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: req.body,
    });

    res.json(item);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete inventory item
 * DELETE /api/inventory/:id
 */
export const deleteInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Product niet gevonden' });
    }

    await prisma.inventoryItem.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
