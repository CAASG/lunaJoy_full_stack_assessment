/**
 * @module ParameterSelector.test
 * @description Tests for ParameterSelector component. Verifies toggle
 * behavior and the 3-parameter limit.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ParameterSelector } from '../../../components/charts/ParameterSelector';
import type { ChartParameter } from '../../../types';

describe('ParameterSelector', () => {
  const defaultSelected: ChartParameter[] = ['moodRating', 'anxietyLevel'];
  const mockOnChange = vi.fn();

  it('renders all 7 parameter buttons', () => {
    render(<ParameterSelector selected={defaultSelected} onChange={mockOnChange} />);

    expect(screen.getByText('Mood')).toBeInTheDocument();
    expect(screen.getByText('Anxiety')).toBeInTheDocument();
    expect(screen.getByText('Sleep Hours')).toBeInTheDocument();
    expect(screen.getByText('Sleep Quality')).toBeInTheDocument();
    expect(screen.getByText('Activity (min)')).toBeInTheDocument();
    expect(screen.getByText('Social')).toBeInTheDocument();
    expect(screen.getByText('Stress')).toBeInTheDocument();
  });

  it('calls onChange when toggling a parameter on', () => {
    render(<ParameterSelector selected={defaultSelected} onChange={mockOnChange} />);

    fireEvent.click(screen.getByText('Stress'));
    expect(mockOnChange).toHaveBeenCalledWith(['moodRating', 'anxietyLevel', 'stressLevel']);
  });

  it('calls onChange when toggling a parameter off', () => {
    render(<ParameterSelector selected={defaultSelected} onChange={mockOnChange} />);

    fireEvent.click(screen.getByText('Mood'));
    expect(mockOnChange).toHaveBeenCalledWith(['anxietyLevel']);
  });

  it('shows the count of selected parameters', () => {
    render(<ParameterSelector selected={defaultSelected} onChange={mockOnChange} />);
    expect(screen.getByText(/2\/3/)).toBeInTheDocument();
  });

  it('disables unselected params when 3 are already selected', () => {
    const threeSelected: ChartParameter[] = ['moodRating', 'anxietyLevel', 'stressLevel'];
    render(<ParameterSelector selected={threeSelected} onChange={mockOnChange} />);

    const socialButton = screen.getByText('Social').closest('button');
    expect(socialButton).toBeDisabled();
  });
});
