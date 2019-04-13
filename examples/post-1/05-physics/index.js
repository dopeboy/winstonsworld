/**
 * Author: Michael Hadley, mikewesthad.com
 * Asset Credits:
 *  - Tuxemon, https://github.com/Tuxemon/Tuxemon
 */

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: {
    key: "first",
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

/* #################################################### SCHOOL SCENE ########################################### */
var schoolScene = {
    preload: function() {
      this.load.image("tiles", "../assets/tilesets/tuxmon-sample-32px-extruded.png");
      this.load.tilemapTiledJSON("map2", "../assets/tilemaps/school.json");

      // An atlas is a way to pack multiple images together into one texture. I'm using it to load all
      // the player animations (walking left, walking right, etc.) in one image. For more info see:
      //  https://labs.phaser.io/view.html?src=src/animation/texture%20atlas%20animation.js
      // If you don't use an atlas, you can do the same thing with a spritesheet, see:
      //  https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
      this.load.atlas("atlas", "../assets/atlas/atlas.png", "../assets/atlas/atlas.json");
      this.load.audio('welcome', '../assets/audio/welcome.m4a')

    },
    create: function() {
            let x = this.sound.add('welcome', 0.5, true, true)
            x.play();
          const map = this.make.tilemap({ key: "map2" });
            let inSchool = false;

          // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
          // Phaser's cache (i.e. the name you used in preload)
          const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

          // Parameters: layer name (or index) from Tiled, tileset, x, y
          const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
          const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
          const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

          worldLayer.setCollisionByProperty({ collides: true });

          // By default, everything gets depth sorted on the screen in the order we created things. Here, we
          // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
          // Higher depths will sit on top of lower depth objects.
          aboveLayer.setDepth(10);

          // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
          // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
          const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

          // Create a sprite with physics enabled via the physics system. The image used for the sprite has
          // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
          player = this.physics.add
            .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
            .setSize(30, 40)
            .setOffset(0, 24);

          // Watch the player and worldLayer for collisions, for the duration of the scene:
          //this.physics.add.collider(player, worldLayer, boo);

          // Create the player's walking animations from the texture atlas. These are stored in the global
          // animation manager so any sprite can access them.
          const anims = this.anims;
          anims.create({
            key: "misa-left-walk",
            frames: anims.generateFrameNames("atlas", {
              prefix: "misa-left-walk.",
              start: 0,
              end: 3,
              zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
          });
          anims.create({
            key: "misa-right-walk",
            frames: anims.generateFrameNames("atlas", {
              prefix: "misa-right-walk.",
              start: 0,
              end: 3,
              zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
          });
          anims.create({
            key: "misa-front-walk",
            frames: anims.generateFrameNames("atlas", {
              prefix: "misa-front-walk.",
              start: 0,
              end: 3,
              zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
          });
          anims.create({
            key: "misa-back-walk",
            frames: anims.generateFrameNames("atlas", {
              prefix: "misa-back-walk.",
              start: 0,
              end: 3,
              zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
          });

          const camera = this.cameras.main;
          camera.startFollow(player, false, 1, 1, 0, 150);
          camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

          cursors = this.input.keyboard.createCursorKeys();
    },
    update: function() {
    }
};
/* #################################################### END SCHOOL SCENE ########################################### */

game.scene.add('school', schoolScene)

let cursors;
let player;
let showDebug = false;
let inSchool = false;

function preload() {
  this.load.image("tiles", "../assets/tilesets/tuxmon-sample-32px-extruded.png");
  this.load.tilemapTiledJSON("map", "../assets/tilemaps/tuxemon-town.json");

  // An atlas is a way to pack multiple images together into one texture. I'm using it to load all
  // the player animations (walking left, walking right, etc.) in one image. For more info see:
  //  https://labs.phaser.io/view.html?src=src/animation/texture%20atlas%20animation.js
  // If you don't use an atlas, you can do the same thing with a spritesheet, see:
  //  https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
  this.load.atlas("atlas", "../assets/atlas/atlas.png", "../assets/atlas/atlas.json");
}

function create() {
  const map = this.make.tilemap({ key: "map" });

  // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
  // Phaser's cache (i.e. the name you used in preload)
  const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
  const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
  const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

  worldLayer.setCollisionByProperty({ collides: true });

  // By default, everything gets depth sorted on the screen in the order we created things. Here, we
  // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
  // Higher depths will sit on top of lower depth objects.
  aboveLayer.setDepth(10);

  // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
  // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
  const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

  // Create a sprite with physics enabled via the physics system. The image used for the sprite has
  // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.

    if (inSchool) {
        inSchool = false

      player = this.physics.add
        .sprite(170, 900, "atlas", "misa-front")
        .setSize(30, 40)
        .setOffset(0, 24);
        }

    else {
  player = this.physics.add
    .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24);
    }

    function boo(x, y) {
        if (y.pixelX  >= 400 && y.pixelX <= 500 && y.pixelY == 800) {
            alert('this is a house');
        }

        else if (y.pixelX  >= 60 && y.pixelX <= 320 && y.pixelY == 800 && !inSchool) {
            inSchool = true
            game.scene.start('school');
        }
    }

  // Watch the player and worldLayer for collisions, for the duration of the scene:
  this.physics.add.collider(player, worldLayer, boo);

  // Create the player's walking animations from the texture atlas. These are stored in the global
  // animation manager so any sprite can access them.
  const anims = this.anims;
  anims.create({
    key: "misa-left-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-left-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-right-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-right-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-front-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-front-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-back-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-back-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  const camera = this.cameras.main;
  camera.startFollow(player, false, 1, 1, 0, 150);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta) {
  const speed = 175;
  const prevVelocity = player.body.velocity.clone();

  // Stop any previous movement from the last frame
  player.body.setVelocity(0);

    if (inSchool && player.body.x > 195 && player.body.x < 230 && player.body.y > 1200 && player.body.y < 1230) {
        game.scene.switch('school', 'first');
    }

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
    player.anims.play("misa-left-walk", true);
  } else if (cursors.right.isDown) {
    player.anims.play("misa-right-walk", true);
  } else if (cursors.up.isDown) {
    player.anims.play("misa-back-walk", true);
  } else if (cursors.down.isDown) {
    player.anims.play("misa-front-walk", true);
  } else {
    player.anims.stop();

    // If we were moving, pick and idle frame to use
    if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
    else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
    else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
    else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
  }
}
