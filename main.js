'use strict'

let APP = {};

window.onload = () => {
    APP.display = new Display('canvas');
    APP.display.preload(['./Images/hog.jpg']);
    let textures = [];
    for (var i = 0; i < 10; i++) {
        let r = new Rect(1, 1);
        r.color = Color.random().toString();
        textures[i] = new Texture();
        textures[i].image = r._canvas;
    }
    APP.display.on('init', function() {
        let a = new AnimationSprite(200, 200);
        a.textures = textures;
        a.rate = 1;
        this.addChild(a);
    });
}