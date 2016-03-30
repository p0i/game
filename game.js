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

var jump;

var cursors;

var poi;
var swing;

function create() {
    cursors = game.input.keyboard.createCursorKeys();
    cursors.up.onDown.add(jump.do.bind(jump));
    cursors.down.onDown.add(down);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    poi = game.add.sprite(0, 0, 'poi');

    game.physics.arcade.enable(poi);

    poi.body.gravity.y = 1685;
    poi.body.collideWorldBounds = true;

    poi.anchor.setTo(0.5, 0.5);
    poi.rotation = Math.PI * 0.1;
    swing = game.add.tween(poi)
        .to({ rotation: Math.PI * -0.1 }, 500, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
}

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
    if (isOnGround()) jump.reset();
}

jump = {
    MAX_JUMP: 2,
    count: 0,
    startRotation: function() {
        swing.pause();
        poi.body.angularVelocity = 10000;
        poi.body.velocity.y = -1000;        
    },
    stopRotation: function() {
        poi.body.angularVelocity = 0;
        swing.resume();    
    },
    do: function() {
        if (this.count >= this.MAX_JUMP) return;

        poi.body.velocity.y = -1000;
        
        if (this.count !== 0) this.startRotation();

        ++this.count;            
    },
    reset() {
        if (this.count !== 0) {
            this.count = 0;
            poi.body.velocity.y = 0;
            this.stopRotation();
        }
    }
};

function down() {
    var MIN_SPEED = 800;
    if (!isOnGround() && poi.body.velocity.y < MIN_SPEED) {
        jump.stopRotation();
        poi.body.velocity.y = MIN_SPEED;
    }
}

function isOnGround() {
    return poi.body.y == game.world.height - poi.body.height;
}
