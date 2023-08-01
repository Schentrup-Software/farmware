
export function convertDaysToUnits(numDays: number, units: string) {
  switch (units) {
    case 'days':
      return numDays;
    case 'weeks':
      return numDays / 7;
    case 'months':
      return numDays / 30;
    case 'years':
      return numDays / 365;
  }
}

export function convertToDays(age: number, units: string) {
  switch (units) {
    case 'days':
      return age;
    case 'weeks':
      return age * 7;
    case 'months':
      return age * 30;
    case 'years':
      return age * 365;
  }
}

export function convertPoundsToUnits(numPounds: number, units: string) {
switch (units) {
    case 'pounds':
      return numPounds;
    case 'kilograms':
      return numPounds / 2.205;
  }
}

export function convertToPounds(weight: number, units: string) {
  switch (units) {
    case 'pounds':
      return weight;
    case 'kilograms':
      return weight * 2.205;
  }
}
