import Stats from 'stats.js';


export default class FpsCounter {
  stats: Stats;
  constructor(container: HTMLElement) {
    this.stats = new Stats();
    container.append(this.stats.dom);

    // Disable by default
    this.disable();
  }

  enable() {
    this.stats.showPanel(0);
  }

  disable() {
    this.stats.showPanel(-1);
  }
}
