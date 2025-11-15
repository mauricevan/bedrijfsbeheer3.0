// Employee controller
import prisma from '../config/database.js';

/**
 * List all employees
 * GET /api/employees
 */
export const listEmployees = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, status, role, department, search } = req.query;

    // Build where clause
    const where = {};
    if (status) where.status = status;
    if (role) where.role = role;
    if (department) where.department = department;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { lastName: 'asc' },
      }),
      prisma.employee.count({ where }),
    ]);

    res.json({
      data: employees,
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
 * Get single employee
 * GET /api/employees/:id
 */
export const getEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Medewerker niet gevonden' });
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
};

/**
 * Create employee
 * POST /api/employees
 */
export const createEmployee = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      postalCode,
      role,
      department,
      hourlyRate,
      hireDate,
      status,
      notes,
    } = req.body;

    // Validate
    if (!firstName || !lastName || !email || !role || !hireDate) {
      return res.status(400).json({
        error: 'Voornaam, achternaam, email, rol en indienstdatum zijn verplicht',
      });
    }

    // Only admin can create employees
    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: 'Alleen admins kunnen medewerkers aanmaken',
      });
    }

    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        postalCode,
        role,
        department,
        hourlyRate: hourlyRate || null,
        hireDate,
        status: status || 'active',
        notes,
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

/**
 * Update employee
 * PUT /api/employees/:id
 */
export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Only admin can update employees
    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: 'Alleen admins kunnen medewerkers bewerken',
      });
    }

    const existing = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Medewerker niet gevonden' });
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: req.body,
    });

    res.json(employee);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete employee
 * DELETE /api/employees/:id
 */
export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Only admin can delete employees
    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: 'Alleen admins kunnen medewerkers verwijderen',
      });
    }

    const existing = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Medewerker niet gevonden' });
    }

    await prisma.employee.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Terminate employee
 * POST /api/employees/:id/terminate
 */
export const terminateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { terminationDate } = req.body;

    // Only admin can terminate employees
    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: 'Alleen admins kunnen medewerkers uit dienst nemen',
      });
    }

    const existing = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Medewerker niet gevonden' });
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        status: 'inactive',
        terminationDate: terminationDate || new Date().toISOString().split('T')[0],
      },
    });

    res.json(employee);
  } catch (error) {
    next(error);
  }
};
