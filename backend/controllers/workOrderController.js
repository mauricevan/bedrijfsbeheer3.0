// WorkOrder controller
import prisma from '../config/database.js';

/**
 * List all work orders with pagination
 * GET /api/work-orders
 */
export const listWorkOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, priority, assignedTo, customerId } = req.query;

    // Build where clause
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;
    if (customerId) where.customerId = customerId;

    // Non-admin can only see work orders assigned to them
    if (!req.user.isAdmin) {
      where.assignedTo = req.user.id;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Query
    const [workOrders, total] = await Promise.all([
      prisma.workOrder.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          customer: true,
          user: {
            select: { id: true, name: true, email: true },
          },
          quote: true,
          invoice: true,
          materials: {
            include: {
              inventoryItem: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.workOrder.count({ where }),
    ]);

    res.json({
      data: workOrders,
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
 * Get single work order
 * GET /api/work-orders/:id
 */
export const getWorkOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        customer: true,
        user: {
          select: { id: true, name: true, email: true },
        },
        quote: true,
        invoice: true,
        materials: {
          include: {
            inventoryItem: true,
          },
        },
      },
    });

    if (!workOrder) {
      return res.status(404).json({ error: 'Werkbon niet gevonden' });
    }

    // Check access
    if (!req.user.isAdmin && workOrder.assignedTo !== req.user.id) {
      return res.status(403).json({
        error: 'Je hebt geen toegang tot deze werkbon',
      });
    }

    res.json(workOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new work order
 * POST /api/work-orders
 */
export const createWorkOrder = async (req, res, next) => {
  try {
    const {
      title,
      description,
      customerId,
      quoteId,
      priority,
      estimatedHours,
      materials,
    } = req.body;

    // Validate
    if (!title || !customerId) {
      return res.status(400).json({
        error: 'Titel en customerId zijn verplicht',
      });
    }

    // Determine who to assign to (admin can assign, user gets self-assigned)
    const assignedTo = req.body.assignedTo || req.user.id;

    // Only admin can assign to others
    if (!req.user.isAdmin && assignedTo !== req.user.id) {
      return res.status(403).json({
        error: 'Je kunt alleen werkbonnen aan jezelf toewijzen',
      });
    }

    // Create work order with materials
    const workOrder = await prisma.workOrder.create({
      data: {
        id: `WB${Date.now()}`,
        title,
        description,
        customerId,
        assignedTo,
        assignedBy: req.user.id,
        quoteId: quoteId || null,
        status: 'todo',
        priority: priority || 'normal',
        estimatedHours: estimatedHours || null,
        materials: materials && materials.length > 0 ? {
          create: materials.map((material) => ({
            inventoryItemId: material.inventoryItemId,
            quantity: material.quantity,
            unitPrice: material.unitPrice,
          })),
        } : undefined,
      },
      include: {
        customer: true,
        user: {
          select: { id: true, name: true, email: true },
        },
        materials: {
          include: {
            inventoryItem: true,
          },
        },
      },
    });

    res.status(201).json(workOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Update work order
 * PUT /api/work-orders/:id
 */
export const updateWorkOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, priority, actualHours, description, materials } = req.body;

    // Check exists & access
    const existing = await prisma.workOrder.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Werkbon niet gevonden' });
    }

    if (!req.user.isAdmin && existing.assignedTo !== req.user.id) {
      return res.status(403).json({
        error: 'Je hebt geen toegang tot deze werkbon',
      });
    }

    // Prepare update data
    const updateData = {};
    if (status) {
      updateData.status = status;

      // Auto-set timestamps based on status
      if (status === 'in_progress' && !existing.startedAt) {
        updateData.startedAt = new Date();
      }
      if (status === 'completed' && !existing.completedAt) {
        updateData.completedAt = new Date();
      }
    }
    if (priority) updateData.priority = priority;
    if (actualHours !== undefined) updateData.actualHours = actualHours;
    if (description !== undefined) updateData.description = description;

    // Update materials if provided
    if (materials && materials.length > 0) {
      // Delete old materials and create new ones
      await prisma.workOrderMaterial.deleteMany({
        where: { workOrderId: id },
      });

      updateData.materials = {
        create: materials.map((material) => ({
          inventoryItemId: material.inventoryItemId,
          quantity: material.quantity,
          unitPrice: material.unitPrice,
        })),
      };
    }

    // Update
    const workOrder = await prisma.workOrder.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        user: {
          select: { id: true, name: true, email: true },
        },
        materials: {
          include: {
            inventoryItem: true,
          },
        },
      },
    });

    res.json(workOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete work order
 * DELETE /api/work-orders/:id
 */
export const deleteWorkOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check exists & access (only admin can delete)
    const existing = await prisma.workOrder.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Werkbon niet gevonden' });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: 'Alleen admins kunnen werkbonnen verwijderen',
      });
    }

    // Delete (cascade delete materials)
    await prisma.workOrder.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Start work order
 * POST /api/work-orders/:id/start
 */
export const startWorkOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.workOrder.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Werkbon niet gevonden' });
    }

    if (!req.user.isAdmin && existing.assignedTo !== req.user.id) {
      return res.status(403).json({
        error: 'Je hebt geen toegang tot deze werkbon',
      });
    }

    const workOrder = await prisma.workOrder.update({
      where: { id },
      data: {
        status: 'in_progress',
        startedAt: new Date(),
      },
      include: {
        customer: true,
        materials: {
          include: {
            inventoryItem: true,
          },
        },
      },
    });

    res.json(workOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Complete work order
 * POST /api/work-orders/:id/complete
 */
export const completeWorkOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { actualHours } = req.body;

    const existing = await prisma.workOrder.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Werkbon niet gevonden' });
    }

    if (!req.user.isAdmin && existing.assignedTo !== req.user.id) {
      return res.status(403).json({
        error: 'Je hebt geen toegang tot deze werkbon',
      });
    }

    const workOrder = await prisma.workOrder.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        actualHours: actualHours || existing.actualHours,
      },
      include: {
        customer: true,
        materials: {
          include: {
            inventoryItem: true,
          },
        },
      },
    });

    res.json(workOrder);
  } catch (error) {
    next(error);
  }
};
