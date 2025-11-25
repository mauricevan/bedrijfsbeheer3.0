import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct label', () => {
    render(<Button onClick={() => {}}>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    await userEvent.click(screen.getByText('Click'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click</Button>);

    await userEvent.click(screen.getByText('Click'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies correct variant class', () => {
    const { rerender } = render(
      <Button onClick={() => {}} variant="primary">Test</Button>
    );
    expect(screen.getByRole('button')).toHaveClass('bg-indigo-600');

    rerender(<Button onClick={() => {}} variant="secondary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-violet-600');
  });
});

