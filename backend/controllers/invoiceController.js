// Invoice controller
import prisma from '../config/database.js';

/**
 * List all invoices with pagination
 * GET /api/invoices
 */
export const listInvoices = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, customerId } = req.query;

    // Build where clause
    const where = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    // Non-admin can only see their own invoices
    if (!req.user.isAdmin) {
      where.userId = req.user.id;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Query
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          customer: true,
          items: true,
          workOrder: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invoice.count({ where }),
    ]);

    res.json({
      data: invoices,
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
 * Get single invoice
 * GET /api/invoices/:id
 */
export const getInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
        workOrder: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Factuur niet gevonden' });
    }

    // Check ownership
    if (!req.user.isAdmin && invoice.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Je hebt geen toegang tot deze factuur',
      });
    }

    res.json(invoice);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new invoice
 * POST /api/invoices
 */
export const createInvoice = async (req, res, next) => {
  try {
    const { customerId, workOrderId, items, notes, dueDate } = req.body;

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

    // Calculate due date if not provided (default: 30 days)
    const calculatedDueDate = dueDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        id: `FACT${Date.now()}`,
        customerId,
        userId: req.user.id,
        workOrderId: workOrderId || null,
        status: 'draft',
        subtotal,
        vatRate,
        vatAmount,
        total,
        amountPaid: 0,
        dueDate: calculatedDueDate,
        notes,
        items: {
          create: items.map((item) => ({
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

    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

/**
 * Update invoice
 * PUT /api/invoices/:id
 */
export const updateInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, amountPaid, paidDate, paymentMethod, notes, items } = req.body;

    // Check exists & ownership
    const existing = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Factuur niet gevonden' });
    }

    if (!req.user.isAdmin && existing.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Je hebt geen toegang tot deze factuur',
      });
    }

    // Prepare update data
    const updateData = {};
    if (status) updateData.status = status;
    if (amountPaid !== undefined) updateData.amountPaid = amountPaid;
    if (paidDate !== undefined) updateData.paidDate = paidDate;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (notes !== undefined) updateData.notes = notes;

    // Auto-update status based on payment
    if (amountPaid !== undefined && amountPaid >= existing.total) {
      updateData.status = 'paid';
      if (!paidDate) {
        updateData.paidDate = new Date().toISOString().split('T')[0];
      }
    }

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
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId: id },
      });

      updateData.items = {
        create: items.map((item) => ({
          name: item.name,
          description: item.description || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        })),
      };
    }

    // Update
    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        customer: true,
      },
    });

    res.json(invoice);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete invoice
 * DELETE /api/invoices/:id
 */
export const deleteInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check exists & ownership
    const existing = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Factuur niet gevonden' });
    }

    if (!req.user.isAdmin && existing.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Je hebt geen toegang tot deze factuur',
      });
    }

    // Delete (cascade delete items)
    await prisma.invoice.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Mark invoice as paid
 * POST /api/invoices/:id/pay
 */
export const markAsPaid = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amountPaid, paymentMethod, paidDate } = req.body;

    const existing = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Factuur niet gevonden' });
    }

    if (!req.user.isAdmin && existing.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Je hebt geen toegang tot deze factuur',
      });
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: 'paid',
        amountPaid: amountPaid || existing.total,
        paidDate: paidDate || new Date().toISOString().split('T')[0],
        paymentMethod: paymentMethod || 'bank_transfer',
      },
      include: {
        items: true,
        customer: true,
      },
    });

    res.json(invoice);
  } catch (error) {
    next(error);
  }
};
