/**
 * @module MoodStep.test
 * @description Tests for the MoodStep component. Verifies emoji rendering
 * and that clicking an emoji calls setValue with the correct value.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MoodStep } from '../../../components/log-form/MoodStep';

describe('MoodStep', () => {
  const mockSetValue = vi.fn();
  const mockWatch = vi.fn().mockReturnValue(3);

  it('renders all 5 emoji options', () => {
    render(<MoodStep setValue={mockSetValue} watch={mockWatch} />);

    expect(screen.getByLabelText('Very Sad')).toBeInTheDocument();
    expect(screen.getByLabelText('Sad')).toBeInTheDocument();
    expect(screen.getByLabelText('Neutral')).toBeInTheDocument();
    expect(screen.getByLabelText('Happy')).toBeInTheDocument();
    expect(screen.getByLabelText('Very Happy')).toBeInTheDocument();
  });

  it('renders the heading question', () => {
    render(<MoodStep setValue={mockSetValue} watch={mockWatch} />);
    expect(screen.getByText('How are you feeling today?')).toBeInTheDocument();
  });

  it('calls setValue when an emoji is clicked', () => {
    render(<MoodStep setValue={mockSetValue} watch={mockWatch} />);

    fireEvent.click(screen.getByLabelText('Very Happy'));
    expect(mockSetValue).toHaveBeenCalledWith('moodRating', 5, { shouldValidate: true });
  });

  it('calls setValue with correct value for Sad emoji', () => {
    render(<MoodStep setValue={mockSetValue} watch={mockWatch} />);

    fireEvent.click(screen.getByLabelText('Sad'));
    expect(mockSetValue).toHaveBeenCalledWith('moodRating', 2, { shouldValidate: true });
  });
});
