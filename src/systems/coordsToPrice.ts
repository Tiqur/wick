export default function coordinatesToPrice(y: number, oldMin: number, oldMax: number, delta: number): number {
  return (y * (oldMax - oldMin)) / (delta * 2) + (oldMin + oldMax) / 2;
}
