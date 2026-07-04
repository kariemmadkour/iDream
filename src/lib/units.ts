export interface UnitCategory {
  id: string
  label: string
  units: { id: string; label: string }[]
  convert: (value: number, from: string, to: string) => number
}

function factorCategory(id: string, label: string, factors: Record<string, number>): UnitCategory {
  return {
    id,
    label,
    units: Object.keys(factors).map((id) => ({ id, label: id })),
    convert: (value, from, to) => (value * factors[from]) / factors[to],
  }
}

const length = factorCategory('length', 'Length', {
  mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
})

const mass = factorCategory('mass', 'Weight / Mass', {
  mg: 0.000001, g: 0.001, kg: 1, t: 1000, oz: 0.0283495, lb: 0.453592, st: 6.35029,
})

const volume = factorCategory('volume', 'Volume', {
  ml: 0.001, l: 1, 'm³': 1000, tsp: 0.00492892, tbsp: 0.0147868, cup: 0.24, pt: 0.473176, qt: 0.946353, gal: 3.78541,
})

const area = factorCategory('area', 'Area', {
  'mm²': 0.000001, 'cm²': 0.0001, 'm²': 1, ha: 10000, 'km²': 1000000, 'ft²': 0.092903, 'yd²': 0.836127, acre: 4046.86,
})

const speed = factorCategory('speed', 'Speed', {
  'm/s': 1, 'km/h': 0.277778, mph: 0.44704, knot: 0.514444, 'ft/s': 0.3048,
})

const data = factorCategory('data', 'Data', {
  bit: 0.125, B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4,
})

const time = factorCategory('time', 'Time', {
  ms: 0.001, s: 1, min: 60, hr: 3600, day: 86400, week: 604800,
})

const temperature: UnitCategory = {
  id: 'temperature',
  label: 'Temperature',
  units: [{ id: 'C', label: 'Celsius' }, { id: 'F', label: 'Fahrenheit' }, { id: 'K', label: 'Kelvin' }],
  convert: (value, from, to) => {
    let celsius = value
    if (from === 'F') celsius = (value - 32) * (5 / 9)
    if (from === 'K') celsius = value - 273.15
    if (to === 'C') return celsius
    if (to === 'F') return celsius * (9 / 5) + 32
    return celsius + 273.15
  },
}

export const UNIT_CATEGORIES: UnitCategory[] = [length, mass, volume, area, speed, data, time, temperature]
