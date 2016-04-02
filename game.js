'use strict';

var game = new Phaser.Game('100', '100', Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update
}, true);

function preload() {
    game.load.audio('party', 'party.mp3');

    game.load.image('poi', 'poi.gif');
    game.load.image('snail', 'snail.gif');

    game.load.image('party', 'party.jpg');   
}

var jump;
var party;

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

    party.init();
}

function update() {
    if (!cursors.left.isDown && !cursors.right.isDown) {
        poi.body.velocity.x = 0;    
    }
    if (cursors.left.isDown) {
        poi.body.velocity.x = -500;
    }
    if (cursors.right.isDown) {
        poi.body.velocity.x = 500;
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
    return poi.body.bottom === game.world.height;
}

party = {
    DURATION: 1000,
    started: false,
    init: function() {
        this.image = game.add.sprite(game.width / 2, game.height / 2, 'party');
        this.image.anchor.set(0.5);
        this.image.visible = false;

        this.fadeIn = game.add.tween(this.image)
            .to({ alpha: 1 }, 200);

        this.sound = game.add.sound('party');
        this.sound.onStop.add(function() {
            this.image.visible = false;
            game.physics.arcade.isPaused = false;
            this.started = false;
        }, this);

        game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(this.start, this);
    },
    start: function() {
        if (this.started) return;

        this.started = true;

        game.physics.arcade.isPaused = true;

        var texture = this.image.texture;
        var scale = Math.max(
                game.width / texture.width,
                game.height / texture.height);
        this.image.scale.set(scale);
        this.image.bringToTop();
        this.image.alpha = 0;
        this.fadeIn.start();
        this.image.visible = true;

        this.sound.play();
    }
}
