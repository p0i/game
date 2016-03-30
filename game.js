'use strict';

var game = new Phaser.Game('100', '100', Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update
}, true);

function preload() {
    game.load.image('poi', 'poi.gif');
    game.load.image('snail', 'snail.gif');
}

var cursors;

var poi;
var rotation;

function create() {
    cursors = game.input.keyboard.createCursorKeys();
    cursors.up.onDown.add(jump);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    poi = game.add.sprite(0, 0, 'poi');

    game.physics.arcade.enable(poi);

    poi.body.gravity.y = 1685;
    poi.body.collideWorldBounds = true;

    poi.anchor.setTo(0.5, 0.5);
    poi.rotation = Math.PI * 0.1;
    rotation = game.add.tween(poi)
        .to({ rotation: Math.PI * -0.1 }, 500, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
}

var jumpCount;
function update() {
    if (!cursors.left.isDown && !cursors.right.isDown) {
        poi.body.velocity.x = 0;    
    }
    if (cursors.left.isDown) {
        poi.body.velocity.x = -200;
    }
    if (cursors.right.isDown) {
        poi.body.velocity.x = 200;
    }

    /* 在地上 */
    if (poi.body.y == game.world.height - poi.body.height) {
        jumpCount = 0;
        poi.body.angularVelocity = 0;
        rotation.resume();
    }
}

function jump() {
    var MAX_JUMP = 2;

    if (jumpCount >= MAX_JUMP) return;

    poi.body.velocity.y = -1000;
    
    /* 多段跳 */
    if (jumpCount !== 0) {
        rotation.pause();
        poi.body.angularVelocity = 10000;
        poi.body.velocity.y = -1000;
    
    }

    ++jumpCount;
}
