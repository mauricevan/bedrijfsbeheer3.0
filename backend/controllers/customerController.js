// Customer controller
import prisma from '../config/database.js';

/**
 * List all customers
 * GET /api/customers
 */
export const listCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, status, search } = req.query;

    // Build where clause
    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { name: 'asc' },
      }),
      prisma.customer.count({ where }),
    ]);

    res.json({
      data: customers,
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
 * Get single customer
 * GET /api/customers/:id
 */
export const getCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        quotes: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        invoices: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        workOrders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Klant niet gevonden' });
    }

    res.json(customer);
  } catch (error) {
    next(error);
  }
};

/**
 * Create customer
 * POST /api/customers
 */
export const createCustomer = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      kvkNumber,
      vatNumber,
      status,
      source,
      notes,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Naam is verplicht' });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        city,
        postalCode,
        country: country || 'Nederland',
        kvkNumber,
        vatNumber,
        status: status || 'active',
        source,
        notes,
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

/**
 * Update customer
 * PUT /api/customers/:id
 */
export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Klant niet gevonden' });
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: req.body,
    });

    res.json(customer);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete customer
 * DELETE /api/customers/:id
 */
export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Klant niet gevonden' });
    }

    await prisma.customer.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
