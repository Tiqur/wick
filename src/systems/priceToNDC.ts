export default function priceToCoordinates(price: number, oldMin: number, oldMax: number, delta: number): number {
  return ((price - oldMin) * delta * 2) / (oldMax - oldMin) - delta;
}
