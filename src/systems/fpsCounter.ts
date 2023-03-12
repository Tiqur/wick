import Stats from 'stats.js';


export default class FpsCounter {
  private stats: Stats;
  constructor(container: HTMLElement) {
    this.stats = new Stats();
    container.append(this.stats.dom);

    // Disable by default
    this.disable();
  }

  getStats() {
    return this.stats;
  }

  enable() {
    this.stats.showPanel(0);
  }

  disable() {
    this.stats.showPanel(-1);
  }
}
