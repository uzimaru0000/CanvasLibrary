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
        return new Vector(1 + (2 + minoSize) * x, 1 + (2 + minoSize) * y);
    };
    // for (var x = 0; x < 10; x++) {
    //     for (var y = 0; y < 20; y++) {
    //         var m = new Rect(minoSize, minoSize);
    //         m.color = stageColor;
    //         m.pos = display.getPos(x, y);
    //         display.addChild(m);
    //     }
    // }

    var g = new Group();
    var r = new Rect(10, 10);
    var r2 = new Rect(100, 100);
    r2.pos = new Vector(100, 0);
    g.pos = new Vector(100, 100);
    g.addChild(r);
    r.addChild(r2);
    display.addChild(g);

    display.isDrop = true;
    display.dropList = [0, 1, 2, 3, 4, 5, 6];

    display.addEventListener('update', () => {
        // ミノの生成
        if (display.isDrop) {
            display.isDrop = false;
            var index = display.dropList.splice(parseInt(Math.random() * display.dropList.length), 1);
        }

        // ミノの落下
        
    });
}

class Mino {
    constructor(type) {
        this.mino = type;
    }
}