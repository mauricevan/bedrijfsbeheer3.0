// Quote controller
import prisma from '../config/database.js';

/**
 * List all quotes with pagination
 * GET /api/quotes
 */
export const listQuotes = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, customerId } = req.query;

    // Build where clause
    const where = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    // Non-admin can only see their own quotes
    if (!req.user.isAdmin) {
      where.userId = req.user.id;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Query
    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          customer: true,
          items: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.quote.count({ where }),
    ]);

    res.json({
      data: quotes,
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
 * Get single quote
 * GET /api/quotes/:id
 */
export const getQuote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!quote) {
      return res.status(404).json({ error: 'Offerte niet gevonden' });
    }

    // Check ownership
    if (!req.user.isAdmin && quote.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Je hebt geen toegang tot deze offerte',
      });
    }

    res.json(quote);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new quote
 * POST /api/quotes
 */
export const createQuote = async (req, res, next) => {
  try {
    const { customerId, items, notes, validUntil } = req.body;

    // Validate
    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({
        error: 'customerId en items zijn verplicht',
      });
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const vatRate = 21; // NL BTW
    const vatAmount = subtotal * (vatRate / 100);
    const total = subtotal + vatAmount;

    // Create quote with items
    const quote = await prisma.quote.create({
      data: {
        id: `OFF${Date.now()}`,
        customerId,
        userId: req.user.id,
        status: 'draft',
        subtotal,
        vatRate,
        vatAmount,
        total,
        notes,
        validUntil,
        items: {
          create: items.map((item) => ({
            inventoryItemId: item.inventoryItemId || null,
            name: item.name,
            description: item.description || '',
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        items: true,
        customer: true,
      },
    });

    res.status(201).json(quote);
  } catch (error) {
    next(error);
  }
};

/**
 * Update quote
 * PUT /api/quotes/:id
 */
export const updateQuote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, validUntil, items } = req.body;

    // Check exists & ownership
    const existing = await prisma.quote.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Offerte niet gevonden' });
    }

    if (!req.user.isAdmin && existing.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Je hebt geen toegang tot deze offerte',
      });
    }

    // Prepare update data
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (validUntil !== undefined) updateData.validUntil = validUntil;

    // If items are updated, recalculate totals
    if (items && items.length > 0) {
      const subtotal = items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
      const vatRate = 21;
      const vatAmount = subtotal * (vatRate / 100);
      const total = subtotal + vatAmount;

      updateData.subtotal = subtotal;
      updateData.vatAmount = vatAmount;
      updateData.total = total;

      // Delete old items and create new ones
      await prisma.quoteItem.deleteMany({
        where: { quoteId: id },
      });

      updateData.items = {
        create: items.map((item) => ({
          inventoryItemId: item.inventoryItemId || null,
          name: item.name,
          description: item.description || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        })),
      };
    }

    // Update
    const quote = await prisma.quote.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        customer: true,
      },
    });

    res.json(quote);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete quote
 * DELETE /api/quotes/:id
 */
export const deleteQuote = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check exists & ownership
    const existing = await prisma.quote.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Offerte niet gevonden' });
    }

    if (!req.user.isAdmin && existing.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Je hebt geen toegang tot deze offerte',
      });
    }

    // Delete (cascade delete items)
    await prisma.quote.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
