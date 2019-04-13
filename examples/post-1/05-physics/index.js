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

      // An lone image is the way to do... not the above
      this.load.image("fridge", "../assets/images/fridge.png");
      this.load.image("redApple", "../assets/images/redApple.png");
      this.load.image("greenApple", "../assets/images/greenApple.png");
      this.load.image("kitchenTable", "../assets/images/kitchenTable.png");
      this.load.image("microwave", "../assets/images/microwave.png");

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

          fridge = this.physics.add
            .sprite(spawnPoint.x - 100, spawnPoint.y - 200, "fridge")
            .setSize(30, 40)
            .setOffset(0, 24)
            .setImmovable(true);
          redApple = this.physics.add
            .sprite(spawnPoint.x - 80, spawnPoint.y - 120, "redApple")
            .setSize(30, 40)
            .setOffset(0, 24)
            .setImmovable(true);
          greenApple = this.physics.add
            .sprite(spawnPoint.x + 120, spawnPoint.y - 120, "greenApple")
            .setSize(30, 40)
            .setOffset(0, 24)
            .setImmovable(true);
          this.physics.add.collider(redApple, player, () => {
            player.targetX = player.targetY = null; // avoid sound buzzing when continually ramming the target
            redApple.disableBody(true, false);
            redAudio.play();
          });
          this.physics.add.collider(greenApple, player, () => {
            player.targetX = player.targetY = null;
            greenApple.disableBody(true, false);
            greenAudio.play();
          });

          kitchenTable = this.physics.add
            .sprite(spawnPoint.x, spawnPoint.y - 200, "kitchenTable")
            .setSize(30, 40)
            .setOffset(0, 24)
            .setImmovable(true)
            .setVisible(false); // todo :)
          microwave = this.physics.add
            .sprite(spawnPoint.x + 100, spawnPoint.y - 200, "microwave")
            .setSize(30, 40)
            .setOffset(0, 24)
            .setImmovable(true);

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
let graphics, dialogText, clearButton;
let redAudio, greenAudio;
let npc, npc2, npc3, fridge, redApple, greenApple, kitchenTable, microwave;
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

  this.load.audio('redapple',
    '../assets/audio/redapple.m4a'
  );
  this.load.audio('greenapple',
    '../assets/audio/greenapple.m4a'
  );
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

  var rect = new Phaser.Geom.Rectangle(100, 100, 700, 400);
  graphics = this.add.graphics({ fillStyle: { color: 0x888888 } });
  graphics.fillRectShape(rect);
  graphics.setInteractive(rect, () => { console.log('dialog mouseover'); });
  graphics.setScrollFactor(0)
    .setDepth(30);
  graphics.setVisible(false);

  dialogText = this.add
    .text(200, 200, 'Hello! Here is a dialog popup. You are in the cellar. Obvious exits are north, south, and dennis.', {
      font: "18px monospace",
      fill: "#000000",
      padding: { x: 20, y: 10 },
      backgroundColor: "#ffffff",
      wordWrap: {
        width: 300
      }
    });
  dialogText
    .setScrollFactor(0)
    .setDepth(30)
    .setVisible(false);

  clearButton = this.add
    .text(300, 400, 'Press button to clear dialog / take action!', {
      font: '18px monospace',
      fill: 'white',
      padding: { x: 10, y: 10 },
      backgroundColor: 'green',
      wordWrap: {
        width: 200
      }
    });
  clearButton
    .setScrollFactor(0)
    .setDepth(30)
    .setVisible(false);

		if (this.sound.context.state === 'suspended') {
			this.sound.context.resume();
		}

  redAudio = this.sound.add('redapple');
  greenAudio = this.sound.add('greenapple');

  npc = this.physics.add
    .sprite(spawnPoint.x - 100, spawnPoint.y - 250, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24)
    .setImmovable(true);

  npc2 = this.physics.add
    .sprite(spawnPoint.x - 120, spawnPoint.y + 30, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24)
    .setImmovable(true);

  npc3 = this.physics.add
    .sprite(spawnPoint.x + 120, spawnPoint.y + 30, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24)
    .setImmovable(true);

  this.physics.add.collider(npc, worldLayer);
  this.physics.add.collider(npc, player, () => {
    dialogText.setVisible(true); clearButton.setVisible(true); graphics.setVisible(true);
  });

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

  // Debug graphics
  this.input.keyboard.once("keydown_D", event => {
    // Turn on physics debugging to show player's hitbox
    this.physics.world.createDebugGraphic();

    // Create worldLayer collision graphic above the player, but below the help text
    const graphics = this.add
      .graphics()
      .setAlpha(0.75)
      .setDepth(20);
    worldLayer.renderDebug(graphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
  });

  this.input.on('pointerdown', function(pointer){
    const x = pointer.x;
    const y = pointer.y;
    if (graphics.visible) {
      if (x > 300 && y > 400 && x < 450 && y < 500) {
        graphics.setVisible(false);
        dialogText.setVisible(false);
        clearButton.setVisible(false);
        player.targetX = player.targetY = null;
      }
      return;
    }

    player.targetX = pointer.x + this.cameras.main.worldView.x;
    player.targetY = pointer.y + this.cameras.main.worldView.y;
  });
}

function update(time, delta) {
  const speed = 175;
  const prevVelocity = player.body.velocity.clone();

  // Stop any previous movement from the last frame
  player.body.setVelocity(0);

  if (graphics.visible) {
    return;
  }
  if (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown) {
    player.targetX = null;
    player.targetY = null;
  }
  const epsilon = 5;
  if (player.targetX !== null && Math.abs(player.targetX - player.body.position.x) < epsilon) {
    player.targetX = null;
  }
  if (player.targetY !== null && Math.abs(player.targetY - player.body.position.y) < epsilon) {
    player.targetY = null;
  }

  let walkLeft = false, walkRight = false, walkDown = false, walkUp = false;

  if (inSchool && player.body.x > 195 && player.body.x < 230 && player.body.y > 1200 && player.body.y < 1230) {
    game.scene.switch('school', 'first');
  }

  // Horizontal movement
  if (cursors.left.isDown || (player.targetX !== null && player.targetX < player.body.position.x)) {
    player.body.setVelocityX(-speed);
    walkLeft = true;
  } else if (cursors.right.isDown || (player.targetX !== null && player.targetX > player.body.position.x)) {
    player.body.setVelocityX(speed);
    walkRight = true;
  }

  // Vertical movement
  if (cursors.up.isDown || (player.targetY !== null && player.targetY < player.body.position.y)) {
    player.body.setVelocityY(-speed);
    walkUp = true;
  } else if (cursors.down.isDown || (player.targetY !== null && player.targetY > player.body.position.y)) {
    player.body.setVelocityY(speed);
    walkDown = true;
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (walkLeft) {
    player.anims.play("misa-left-walk", true);
  } else if (walkRight) {
    player.anims.play("misa-right-walk", true);
  } else if (walkUp) {
    player.anims.play("misa-back-walk", true);
  } else if (walkDown) {
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
