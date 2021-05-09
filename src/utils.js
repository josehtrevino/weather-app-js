export function convertToCelsius(kelvin) {
  const celsius = Math.round(kelvin - 273.15);
  return celsius;
}
