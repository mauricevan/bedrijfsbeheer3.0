// Validation middleware using Joi
import Joi from 'joi';

/**
 * Generic validation middleware factory
 * @param {Joi.Schema} schema - Joi schema to validate against
 * @param {string} source - Where to get data from ('body', 'query', 'params')
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      return res.status(400).json({
        error: 'Validatie mislukt',
        details: error.details.map((d) => ({
          field: d.path.join('.'),
          message: d.message,
        })),
      });
    }

    // Replace with validated data
    req[source] = value;
    next();
  };
};

// ============================================
// Authentication Schemas
// ============================================

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Ongeldig email adres',
    'any.required': 'Email is verplicht',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Wachtwoord moet minimaal 8 tekens zijn',
    'any.required': 'Wachtwoord is verplicht',
  }),
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Naam moet minimaal 2 tekens zijn',
    'any.required': 'Naam is verplicht',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// ============================================
// Quote Schemas
// ============================================

export const createQuoteSchema = Joi.object({
  customerId: Joi.string().uuid().required(),
  items: Joi.array()
    .items(
      Joi.object({
        inventoryItemId: Joi.string().uuid().allow(null),
        name: Joi.string().max(200).required(),
        description: Joi.string().max(500).allow(''),
        quantity: Joi.number().min(1).required(),
        unitPrice: Joi.number().min(0).required(),
      })
    )
    .min(1)
    .required(),
  notes: Joi.string().max(5000).allow(''),
  validUntil: Joi.string().allow(null),
});

export const updateQuoteSchema = Joi.object({
  status: Joi.string().valid('draft', 'sent', 'approved', 'rejected'),
  items: Joi.array()
    .items(
      Joi.object({
        inventoryItemId: Joi.string().uuid().allow(null),
        name: Joi.string().max(200).required(),
        description: Joi.string().max(500).allow(''),
        quantity: Joi.number().min(1).required(),
        unitPrice: Joi.number().min(0).required(),
      })
    )
    .min(1),
  notes: Joi.string().max(5000).allow(''),
  validUntil: Joi.string().allow(null),
});

// ============================================
// Customer Schemas
// ============================================

export const createCustomerSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  email: Joi.string().email().allow(null, ''),
  phone: Joi.string().max(50).allow(null, ''),
  address: Joi.string().max(200).allow(null, ''),
  city: Joi.string().max(100).allow(null, ''),
  postalCode: Joi.string().max(20).allow(null, ''),
  country: Joi.string().max(100).allow(null, ''),
  kvkNumber: Joi.string().max(50).allow(null, ''),
  vatNumber: Joi.string().max(50).allow(null, ''),
  status: Joi.string().valid('active', 'inactive', 'lead'),
  source: Joi.string().max(100).allow(null, ''),
  notes: Joi.string().max(5000).allow(null, ''),
});

export const updateCustomerSchema = Joi.object({
  name: Joi.string().min(2).max(200),
  email: Joi.string().email().allow(null, ''),
  phone: Joi.string().max(50).allow(null, ''),
  address: Joi.string().max(200).allow(null, ''),
  city: Joi.string().max(100).allow(null, ''),
  postalCode: Joi.string().max(20).allow(null, ''),
  country: Joi.string().max(100).allow(null, ''),
  kvkNumber: Joi.string().max(50).allow(null, ''),
  vatNumber: Joi.string().max(50).allow(null, ''),
  status: Joi.string().valid('active', 'inactive', 'lead'),
  source: Joi.string().max(100).allow(null, ''),
  notes: Joi.string().max(5000).allow(null, ''),
});

// ============================================
// Invoice Schemas
// ============================================

export const createInvoiceSchema = Joi.object({
  customerId: Joi.string().uuid().required(),
  workOrderId: Joi.string().allow(null),
  items: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(200).required(),
        description: Joi.string().max(500).allow(''),
        quantity: Joi.number().min(1).required(),
        unitPrice: Joi.number().min(0).required(),
      })
    )
    .min(1)
    .required(),
  notes: Joi.string().max(5000).allow(''),
  dueDate: Joi.string().allow(null),
});

export const updateInvoiceSchema = Joi.object({
  status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled'),
  amountPaid: Joi.number().min(0),
  paidDate: Joi.string().allow(null),
  paymentMethod: Joi.string().max(50).allow(null),
  notes: Joi.string().max(5000).allow(''),
  items: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(200).required(),
        description: Joi.string().max(500).allow(''),
        quantity: Joi.number().min(1).required(),
        unitPrice: Joi.number().min(0).required(),
      })
    )
    .min(1),
});

// ============================================
// WorkOrder Schemas
// ============================================

export const createWorkOrderSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(5000).allow(''),
  customerId: Joi.string().uuid().required(),
  assignedTo: Joi.string().uuid(),
  quoteId: Joi.string().allow(null),
  priority: Joi.string().valid('low', 'normal', 'high', 'urgent'),
  estimatedHours: Joi.number().min(0).allow(null),
  materials: Joi.array()
    .items(
      Joi.object({
        inventoryItemId: Joi.string().uuid().required(),
        quantity: Joi.number().min(1).required(),
        unitPrice: Joi.number().min(0).required(),
      })
    )
    .allow(null),
});

export const updateWorkOrderSchema = Joi.object({
  status: Joi.string().valid('todo', 'in_progress', 'completed', 'cancelled'),
  priority: Joi.string().valid('low', 'normal', 'high', 'urgent'),
  actualHours: Joi.number().min(0).allow(null),
  description: Joi.string().max(5000).allow(''),
  materials: Joi.array()
    .items(
      Joi.object({
        inventoryItemId: Joi.string().uuid().required(),
        quantity: Joi.number().min(1).required(),
        unitPrice: Joi.number().min(0).required(),
      })
    )
    .allow(null),
});

// ============================================
// Inventory Schemas
// ============================================

export const createInventorySchema = Joi.object({
  productId: Joi.string().max(50).required(),
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(5000).allow(''),
  category: Joi.string().max(100).required(),
  unit: Joi.string().max(20),
  purchasePrice: Joi.number().min(0).required(),
  sellingPrice: Joi.number().min(0).required(),
  quantity: Joi.number().min(0),
  minStock: Joi.number().min(0),
  location: Joi.string().max(100).allow(null, ''),
  supplier: Joi.string().max(200).allow(null, ''),
  notes: Joi.string().max(5000).allow(null, ''),
});

export const updateInventorySchema = Joi.object({
  productId: Joi.string().max(50),
  name: Joi.string().min(2).max(200),
  description: Joi.string().max(5000).allow(''),
  category: Joi.string().max(100),
  unit: Joi.string().max(20),
  purchasePrice: Joi.number().min(0),
  sellingPrice: Joi.number().min(0),
  quantity: Joi.number().min(0),
  minStock: Joi.number().min(0),
  location: Joi.string().max(100).allow(null, ''),
  supplier: Joi.string().max(200).allow(null, ''),
  notes: Joi.string().max(5000).allow(null, ''),
});

// ============================================
// Employee Schemas
// ============================================

export const createEmployeeSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(50).allow(null, ''),
  address: Joi.string().max(200).allow(null, ''),
  city: Joi.string().max(100).allow(null, ''),
  postalCode: Joi.string().max(20).allow(null, ''),
  role: Joi.string().max(100).required(),
  department: Joi.string().max(100).allow(null, ''),
  hourlyRate: Joi.number().min(0).allow(null),
  hireDate: Joi.string().required(),
  status: Joi.string().valid('active', 'inactive', 'on_leave'),
  notes: Joi.string().max(5000).allow(null, ''),
});

export const updateEmployeeSchema = Joi.object({
  firstName: Joi.string().min(2).max(100),
  lastName: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  phone: Joi.string().max(50).allow(null, ''),
  address: Joi.string().max(200).allow(null, ''),
  city: Joi.string().max(100).allow(null, ''),
  postalCode: Joi.string().max(20).allow(null, ''),
  role: Joi.string().max(100),
  department: Joi.string().max(100).allow(null, ''),
  hourlyRate: Joi.number().min(0).allow(null),
  hireDate: Joi.string(),
  terminationDate: Joi.string().allow(null),
  status: Joi.string().valid('active', 'inactive', 'on_leave'),
  notes: Joi.string().max(5000).allow(null, ''),
});

// ============================================
// Transaction Schemas
// ============================================

export const createTransactionSchema = Joi.object({
  date: Joi.string().required(),
  type: Joi.string().valid('income', 'expense').required(),
  category: Joi.string().max(100).required(),
  description: Joi.string().min(3).max(500).required(),
  amount: Joi.number().min(0.01).required(),
  invoiceId: Joi.string().uuid().allow(null),
  paymentMethod: Joi.string().max(50).allow(null, ''),
  notes: Joi.string().max(5000).allow(null, ''),
});

export const updateTransactionSchema = Joi.object({
  date: Joi.string(),
  type: Joi.string().valid('income', 'expense'),
  category: Joi.string().max(100),
  description: Joi.string().min(3).max(500),
  amount: Joi.number().min(0.01),
  invoiceId: Joi.string().uuid().allow(null),
  paymentMethod: Joi.string().max(50).allow(null, ''),
  notes: Joi.string().max(5000).allow(null, ''),
});
