'use strict'

let APP = {};

window.onload = () => {
    APP.display = new Display('canvas');
    APP.display.preload(['./Images/hog.jpg']);
    APP.display.on('init', function() {
        var g = new Group();
        g.pos = new Vector(this.width / 2, this.height / 2);
        var s = new Rect(200, 200);
        s.color = Color.random().toString();
        s.on('mousemove', function(e) {
            if(e.clicked) this.pos = e.localPos.clone();
        });
        var s1 = new Rect(100, 100);
        s1.color = Color.random(0.5).toString();
        s1.on('mousemove', function(e) {
            if(e.clicked) this.pos = e.localPos.clone();
        });
        g.addChild(s);
        g.addChild(s1);
        this.addChild(g);
    });
}