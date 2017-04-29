var TSM = TSM || {};

TSM.game = new Phaser.Game(720, 480, Phaser.AUTO);

TSM.game.state.add('Preload', TSM.PreloadState);
TSM.game.state.add('Game', TSM.GameState);

TSM.game.state.start('Preload');