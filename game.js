'use strict';

var game = new Phaser.Game('100', '100', Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update
}, true);


var poi;

function preload() {
    game.load.image('poi', 'poi.gif');
    game.load.image('snail', 'snail.gif');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    poi = game.add.sprite(0, 0, 'poi');

    game.physics.arcade.enable(poi);

    poi.body.gravity.y = 1685;
    poi.body.collideWorldBounds = true;

    poi.anchor.setTo(0.5, 0.5);
    poi.rotation = Math.PI * 0.1;
    game.add.tween(poi)
        .to({ rotation: Math.PI * -0.1 }, 500, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);

}

var cursors;

function update() {
    cursors = cursors || game.input.keyboard.createCursorKeys();
    if (!cursors.left.isDown && !cursors.right.isDown) {
        poi.body.velocity.x = 0;    
    }
    if (cursors.left.isDown) {
        poi.body.velocity.x = -200;
    }
    if (cursors.right.isDown) {
        poi.body.velocity.x = 200;
    }
    if (cursors.up.isDown &&
        poi.body.y == game.world.height - poi.body.height) {
        poi.body.velocity.y = -1000;
    }
}
