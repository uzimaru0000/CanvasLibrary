'use strict'

let display;
let stage = [];
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
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
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
    for (var x = 0; x < 10; x++) {
        for (var y = 0; y < 20; y++) {
            var m = new Rect(minoSize, minoSize);
            m.color = stageColor;
            m.pos = display.getPos(x, y);
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
            var mino = new Mino();
            mino.pos = this.getPos(3, 0);
            mino.pos.x -= minoSize / 2 + 1;
            mino.pos.y -= minoSize / 2 + 1;
            for (var i = 0; i < minoType[index].length; i++) {
                for (var j = 0; j < minoType[index][i].length; j++) {
                    if (minoType[index][i][j] === 1) {
                        var p = new Rect(minoSize, minoSize);
                        p.color = minoColor[index];
                        p.pos = this.getPos(j, i);
                        mino.addChild(p);
                    } 
                }
            }
            this.addChild(mino);
        }
    });
}

class Mino extends Group {
    constructor() {
        super();
        this.move = 0;
        this.flag = true;

        this.addEventListener('update', function(e) {
            if (e !== 0 && e % 30 === 0) {
                this.pos.y += 2 + minoSize;
            }
        });

        this.addEventListener('ArrowRight-down', function(e) {
            if (this.flag) {
                this.pos.x += 2 + minoSize;
            }
        });
        this.addEventListener('ArrowLeft-down', function(e) {
            if (this.flag) {
                this.pos.x += -(2 + minoSize);
            }
        });
    }
}