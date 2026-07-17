import type { GroupedResult, User } from './types.js';

interface Accumulator {
  male: number;
  female: number;
  minAge: number;
  maxAge: number;
  hair: Map<string, number>;
  addressUser: Map<string, string>;
  addressCities: Map<string, string>;
}

export function groupByDepartment(users: User[]): GroupedResult {
  const groups = new Map<string, Accumulator>();

  for (const user of users) {
    const department = user.company.department;
    let acc = groups.get(department);
    if (!acc) {
      acc = {
        male: 0,
        female: 0,
        minAge: user.age,
        maxAge: user.age,
        hair: new Map(),
        addressUser: new Map(),
        addressCities: new Map(),
      };
      groups.set(department, acc);
    }

    if (user.gender === 'male') acc.male++;
    else if (user.gender === 'female') acc.female++;

    if (user.age < acc.minAge) acc.minAge = user.age;
    if (user.age > acc.maxAge) acc.maxAge = user.age;

    acc.hair.set(user.hair.color, (acc.hair.get(user.hair.color) ?? 0) + 1);
    acc.addressUser.set(`${user.firstName}${user.lastName}`, user.address.postalCode);
    acc.addressCities.set(`${user.firstName}${user.lastName}`, user.address.city);
  }

  const result: GroupedResult = {};
  for (const [department, acc] of groups) {
    const hair: Record<string, number> = {};
    for (const [color, count] of acc.hair) hair[color] = count;

    const addressUser: Record<string, string> = {};
    for (const [name, postalCode] of acc.addressUser) addressUser[name] = postalCode;

    const addressCities: Record<string, string> = {};
    for (const [name, city] of acc.addressCities) addressCities[name] = city;

    result[department] = {
      male: acc.male,
      female: acc.female,
      ageRange: `${acc.minAge}-${acc.maxAge}`,
      hair,
      addressUser,
      addressCities,
    };
  }

  return result;
}
