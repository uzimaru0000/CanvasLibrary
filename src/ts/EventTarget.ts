export class EventTarget {
    private event: Object;

    constructor() {
        this.event = {};
    }

    addEventListener(target: string, func: Function) {
        if (this.event[target] === undefined) this.event[target] = [];
        this.event[target].push(func);
    }

    removeEventListener(target: string, func: Function) {
        if (this.event[target] === undefined) return;
        this.event[target].some((x: Function, index: number) => {
            if (x === func) this.event[target].splice(index, 1);
        });
    }

    on(target: string, func: Function) {
        this.addEventListener(target, func);
    }

    dispatchEvent(target: string, e: any) {
        if (this.event[target] === undefined) return;
        this.event[target].forEach((x: Function) => x.call(this, e));
    }
}