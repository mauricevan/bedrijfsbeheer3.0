import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InventoryForm } from './InventoryForm';
import type { Category, Supplier } from '../types';

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', color: '#6366f1' },
  { id: '2', name: 'Office Supplies', color: '#10b981' },
];

const mockSuppliers: Supplier[] = [
  { id: '1', name: 'TechDistro BV', leadTimeDays: 2 },
  { id: '2', name: 'OfficeGiant', leadTimeDays: 5 },
];

describe('InventoryForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields including supplierSku and customSku', () => {
    render(
      <InventoryForm
        categories={mockCategories}
        suppliers={mockSuppliers}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/SKU \(Auto-generated\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/SKU \(Leverancier\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/SKU \(Aangepast\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/supplier/i)).toBeInTheDocument();
  });

  it('allows entering supplierSku and customSku values', async () => {
    const user = userEvent.setup();
    render(
      <InventoryForm
        categories={mockCategories}
        suppliers={mockSuppliers}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const supplierSkuInput = screen.getByLabelText(/SKU \(Leverancier\)/i);
    const customSkuInput = screen.getByLabelText(/SKU \(Aangepast\)/i);

    await user.type(supplierSkuInput, 'SUPPLIER-123');
    await user.type(customSkuInput, 'CUSTOM-456');

    expect(supplierSkuInput).toHaveValue('SUPPLIER-123');
    expect(customSkuInput).toHaveValue('CUSTOM-456');
  });

  it('submits form data including supplierSku and customSku', async () => {
    const user = userEvent.setup();
    render(
      <InventoryForm
        categories={mockCategories}
        suppliers={mockSuppliers}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Fill in required fields
    await user.type(screen.getByLabelText(/name/i), 'Test Product');
    await user.type(screen.getByLabelText(/SKU \(Auto-generated\)/i), 'TEST-001');
    await user.selectOptions(screen.getByLabelText(/category/i), '1');
    await user.type(screen.getByLabelText(/quantity/i), '10');
    await user.type(screen.getByLabelText(/purchase price/i), '25.00');
    await user.type(screen.getByLabelText(/sale price/i), '50.00');

    // Fill in optional SKU fields
    await user.type(screen.getByLabelText(/SKU \(Leverancier\)/i), 'SUPPLIER-123');
    await user.type(screen.getByLabelText(/SKU \(Aangepast\)/i), 'CUSTOM-456');

    // Submit form
    await user.click(screen.getByRole('button', { name: /save item/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData.supplierSku).toBe('SUPPLIER-123');
      expect(submittedData.customSku).toBe('CUSTOM-456');
    });
  });

  it('submits undefined for empty supplierSku and customSku fields', async () => {
    const user = userEvent.setup();
    render(
      <InventoryForm
        categories={mockCategories}
        suppliers={mockSuppliers}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Fill in required fields only
    await user.type(screen.getByLabelText(/name/i), 'Test Product');
    await user.type(screen.getByLabelText(/SKU \(Auto-generated\)/i), 'TEST-001');
    await user.selectOptions(screen.getByLabelText(/category/i), '1');
    await user.type(screen.getByLabelText(/quantity/i), '10');
    await user.type(screen.getByLabelText(/purchase price/i), '25.00');
    await user.type(screen.getByLabelText(/sale price/i), '50.00');

    // Submit form without filling optional SKU fields
    await user.click(screen.getByRole('button', { name: /save item/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData.supplierSku).toBeUndefined();
      expect(submittedData.customSku).toBeUndefined();
    });
  });

  it('pre-fills supplierSku and customSku when editing existing item', () => {
    const initialData = {
      id: '1',
      name: 'Existing Product',
      sku: 'EXIST-001',
      supplierSku: 'EXIST-SUPPLIER',
      customSku: 'EXIST-CUSTOM',
      categoryId: '1',
      quantity: 5,
      reorderLevel: 10,
      unit: 'stuks',
      purchasePrice: 20,
      salePrice: 40,
      vatRate: 21 as const,
      webshopSync: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    render(
      <InventoryForm
        initialData={initialData}
        categories={mockCategories}
        suppliers={mockSuppliers}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/SKU \(Leverancier\)/i)).toHaveValue('EXIST-SUPPLIER');
    expect(screen.getByLabelText(/SKU \(Aangepast\)/i)).toHaveValue('EXIST-CUSTOM');
  });
});

