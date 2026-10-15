'use strict';

import { describe, it, expect } from 'vitest';
import {
  calculateBalance,
  calculateIncome,
  calculatePayments,
  calculateInterest,
  canRequestLoan,
  validateNationalId,
  calculateAge,
} from '../src/domain/calculations.js';

describe('calculateBalance', () => {
  it('returns sum of all movements', () => {
    expect(calculateBalance([100, -50, 200])).toBe(250);
  });
  it('returns 0 for empty array', () => {
    expect(calculateBalance([])).toBe(0);
  });
});

describe('calculateIncome', () => {
  it('returns sum of deposits only', () => {
    expect(calculateIncome([100, -50, 200, -30])).toBe(300);
  });
  it('returns 0 when no deposits', () => {
    expect(calculateIncome([-50, -30])).toBe(0);
  });
});

describe('calculatePayments', () => {
  it('returns sum of withdrawals as positive', () => {
    expect(calculatePayments([100, -50, 200, -30])).toBe(80);
  });
});

describe('calculateInterest', () => {
  it('calculates interest on deposits', () => {
    expect(calculateInterest([100, 200], 1.2)).toBeCloseTo(3.6, 2);
  });
});

describe('canRequestLoan', () => {
  it('returns true if a deposit >= 10% of amount', () => {
    expect(canRequestLoan([100, 50], 500)).toBe(true);
  });
  it('returns false if no deposit >= 10% of amount', () => {
    expect(canRequestLoan([10, 20], 500)).toBe(false);
  });
});

describe('validateNationalId', () => {
  it('returns true for 14-digit string', () => {
    expect(validateNationalId('12345678901234')).toBe(true);
  });
  it('returns false for non-14-digit', () => {
    expect(validateNationalId('12345')).toBe(false);
    expect(validateNationalId('abcdefghijklmn')).toBe(false);
  });
});

describe('calculateAge', () => {
  it('calculates age correctly', () => {
    const birthDate = '2000-01-01';
    const expected = new Date().getFullYear() - 2000;
    expect(calculateAge(birthDate)).toBeGreaterThanOrEqual(expected - 1);
  });
});
