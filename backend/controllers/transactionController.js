// Transaction controller
import prisma from '../config/database.js';

/**
 * List all transactions
 * GET /api/transactions
 */
export const listTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, type, category, startDate, endDate, search } = req.query;

    // Build where clause
    const where = {};
    if (type) where.type = type;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { description: { contains: search } },
        { notes: { contains: search } },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { date: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ]);

    // Calculate totals
    const totals = await prisma.transaction.groupBy({
      by: ['type'],
      where,
      _sum: {
        amount: true,
      },
    });

    const income = totals.find(t => t.type === 'income')?._sum.amount || 0;
    const expense = totals.find(t => t.type === 'expense')?._sum.amount || 0;

    res.json({
      data: transactions,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
      summary: {
        income,
        expense,
        balance: income - expense,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single transaction
 * GET /api/transactions/:id
 */
export const getTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transactie niet gevonden' });
    }

    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

/**
 * Create transaction
 * POST /api/transactions
 */
export const createTransaction = async (req, res, next) => {
  try {
    const {
      date,
      type,
      category,
      description,
      amount,
      invoiceId,
      paymentMethod,
      notes,
    } = req.body;

    // Validate
    if (!date || !type || !category || !description || !amount) {
      return res.status(400).json({
        error: 'Datum, type, categorie, beschrijving en bedrag zijn verplicht',
      });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({
        error: 'Type moet income of expense zijn',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        error: 'Bedrag moet groter dan 0 zijn',
      });
    }

    // Only admin can create transactions
    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: 'Alleen admins kunnen transacties aanmaken',
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        date,
        type,
        category,
        description,
        amount,
        invoiceId,
        paymentMethod,
        notes,
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

/**
 * Update transaction
 * PUT /api/transactions/:id
 */
export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Only admin can update transactions
    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: 'Alleen admins kunnen transacties bewerken',
      });
    }

    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Transactie niet gevonden' });
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: req.body,
    });

    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete transaction
 * DELETE /api/transactions/:id
 */
export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Only admin can delete transactions
    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: 'Alleen admins kunnen transacties verwijderen',
      });
    }

    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Transactie niet gevonden' });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Get transaction summary/statistics
 * GET /api/transactions/summary
 */
export const getTransactionSummary = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'category' } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    // Total by type
    const byType = await prisma.transaction.groupBy({
      by: ['type'],
      where,
      _sum: {
        amount: true,
      },
      _count: true,
    });

    // By category
    const byCategory = await prisma.transaction.groupBy({
      by: ['type', 'category'],
      where,
      _sum: {
        amount: true,
      },
      _count: true,
    });

    const income = byType.find(t => t.type === 'income')?._sum.amount || 0;
    const expense = byType.find(t => t.type === 'expense')?._sum.amount || 0;

    res.json({
      totals: {
        income,
        expense,
        balance: income - expense,
      },
      byType,
      byCategory,
    });
  } catch (error) {
    next(error);
  }
};
