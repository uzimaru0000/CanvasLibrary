'use strict'

let display;
let stage = new Array(10).fill(new Array(20).fill(false));
const minoSize = 30;
const stageColor = '#bdc3c7';
const minoColor = [
    "#f1c40f",
    "#e67e22",
    "#2980b9",
    "#2ecc71",
    "#e74c3c",
    "#3498db",
    "#9b59b6"
];
const minoType = [
    [
        [0, 1, 1],
        [0, 1, 1]
    ],
    [
        [0, 0, 1],
        [1, 1, 1]
    ],
    [
        [1, 0, 0],
        [1, 1, 1]
    ],
    [
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [1],
        [1],
        [1],
        [1]
    ],
    [
        [0, 1, 0],
        [1, 1, 1]
    ]
];

window.onload = () => {
    display = new Display('canvas');
    display.getPos = (x, y) => {
        return new Vector(1 + (2 + minoSize) * x + minoSize / 2, 1 + (2 + minoSize) * y + minoSize / 2);
    };
    display.stage = new Array(10).fill([]);
    for (var x = 0; x < 10; x++) {
        for (var y = 0; y < 20; y++) {
            var m = new Rect(minoSize, minoSize);
            m.color = stageColor;
            m.pos = display.getPos(x, y);
            display.stage[x][y] = m;
            display.addChild(m);
        }
    }

    display.isDrop = true;
    display.dropList = [0, 1, 2, 3, 4, 5, 6];

    display.addEventListener('update', function(e) {
        // ミノの生成
        if (this.isDrop) {
            this.isDrop = false;
            var index = this.dropList.splice(parseInt(Math.random() * this.dropList.length), 1);
            var mino = new Mino(3, 0);
            mino.pos = this.getPos(3, 0);
            mino.pos.x -= minoSize / 2 + 1;
            mino.pos.y -= minoSize / 2 + 1;
            mino.type = minoType[index];
            mino.color = minoColor[index];
            minoType[index].forEach((x, i) => x.forEach((y, j) => {
                if (y === 1) {
                    var p = new Rect(minoSize, minoSize);
                    p.color = minoColor[index];
                    p.pos = this.getPos(j, i);
                    mino.addChild(p);
                }
            }));
            this.addChild(mino);
        }

        if (this.dropList.length === 0) display.dropList = [0, 1, 2, 3, 4, 5, 6];
    });
}

class Mino extends Group {
    constructor(x, y) {
        super();
        this.flag = true;
        this.index = new Vector(x, y);
        this.type = [];
        this.color;

        this.addEventListener('update', function(e) {
            if (e !== 0 && e % 15 === 0) {
                var flag = !this.type.some((i, y) => i.some((j, x) => stage[this.index.x + x][this.index.y + y + 1]));
                if (flag && this.index.y !== 20 - this.type.length) {
                    this.pos.y += 2 + minoSize;
                    this.index.y++;
                } else {
                    this.type.forEach((i, y) => i.forEach((j, x) => {
                        stage[this.index.x + x][this.index.y + y] = true;
                        display.stage[this.index.x + x][this.index.y + y].color = this.color;
                    }));
                    display.isDrop = true;
                    this.parent.removeChild(this);
                }
            }
        });

        this.addEventListener('ArrowRight-down', function(e) {
            if (this.flag) {
                if (this.index.x === (10 - this.type[0].length)) return;
                this.pos.x += 2 + minoSize;
                this.index.x++;
            }
        });
        this.addEventListener('ArrowLeft-down', function(e) {
            if (this.flag) {
                if (this.index.x === 0) return;
                this.pos.x -= 2 + minoSize;
                this.index.x--;
            }
        });
    }
}