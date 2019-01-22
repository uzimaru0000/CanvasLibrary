export class Event {
    public type: string;

    constructor(e) {
        this.type = e.type;
    }

    clone() {
        return Object.assign({}, this);
    }
}

export class MouseEvent extends Event {
    public globalPos: Vector;
    public localPos: Vector;
    public clicked: boolean;

    constructor(e: MouseEventInit) {
        super(e);
        this.globalPos = new Vector(e.clientX, e.clientY);
        this.localPos = new Vector(e.clientX, e.clientY);
        this.clicked = (e.buttons === 1);
    }
}