export class EventTarget<T> {
  private event: { [key: string]: Array<(e: T) => void> };

  constructor() {
    this.event = {};
  }

  addEventListener(target: string, func: (e: T) => void) {
    if (this.event[target] === undefined) this.event[target] = [];
    this.event[target].push(func);
  }

  removeEventListener(target: string, func: (e: T) => void) {
    if (this.event[target] === undefined) return;
    this.event[target].filter(x => x !== func);
  }

  on(target: string, func: (e: T) => void) {
    this.addEventListener(target, func);
  }

  dispatchEvent(target: string, e: T) {
    if (this.event[target] === undefined) return;
    this.event[target].forEach((x: (e: T) => void) => x.call(this, e));
  }
}
