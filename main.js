'use strict'

let APP = {};

window.onload = () => {
    APP.display = new Display('canvas');
    APP.display.on('init', function() {
        let a = new Rect(100, 100);
        a.z_index = 1;
        a.color = Color.random().toString();
        a.pos = new Vector(100, 100);
        a.on('update', function(e) {
            this.rotate(10);
            this.scale = Vector.one.mul(Math.sin(e / 10));
        });
        a.on('mousemove', function(e) {
            if (e.clicked) this.pos = e.localPos.clone();
            this.withIn(b, 50, () => {
                this.color = Color.random().toString();
            });
        });
        this.addChild(a);
        let b = new Circle(50);
        b.color = Color.random().toString();
        b.pos = new Vector(300, 300);
        this.addChild(b);
    });
}