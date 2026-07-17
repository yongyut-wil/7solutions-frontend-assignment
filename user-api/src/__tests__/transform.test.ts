import { describe, it, expect } from 'vitest';
import { groupByDepartment } from '../transform.js';
import type { User } from '../types.js';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    firstName: 'Terry',
    lastName: 'Medhurst',
    gender: 'male',
    age: 50,
    hair: { color: 'Black' },
    address: { postalCode: '00001', city: 'New York' },
    company: { department: 'Engineering' },
    ...overrides,
  };
}

describe('groupByDepartment', () => {
  it('summarizes a single department', () => {
    const users = [makeUser()];
    const result = groupByDepartment(users);
    expect(result.Engineering).toEqual({
      male: 1,
      female: 0,
      ageRange: '50-50',
      hair: { Black: 1 },
      addressUser: { TerryMedhurst: '00001' },
      addressCities: { TerryMedhurst: 'New York' },
    });
  });

  it('groups multiple departments', () => {
    const users = [
      makeUser({
        firstName: 'A',
        lastName: 'B',
        gender: 'female',
        age: 30,
        company: { department: 'Sales' },
      }),
      makeUser({
        firstName: 'C',
        lastName: 'D',
        gender: 'male',
        age: 40,
        company: { department: 'Sales' },
      }),
    ];
    const result = groupByDepartment(users);
    expect(Object.keys(result).sort()).toEqual(['Sales']);
    expect(result.Sales.male).toBe(1);
    expect(result.Sales.female).toBe(1);
    expect(result.Sales.ageRange).toBe('30-40');
  });

  it('counts hair colors and names with duplicate keys', () => {
    const users = [
      makeUser({ hair: { color: 'Black' } }),
      makeUser({ hair: { color: 'Black' } }),
      makeUser({ hair: { color: 'Blond' } }),
    ];
    const result = groupByDepartment(users);
    expect(result.Engineering.hair).toEqual({ Black: 2, Blond: 1 });
  });
});
