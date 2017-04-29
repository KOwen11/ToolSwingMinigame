var TSM = TSM || {};

TSM.GameState = {
    init: function(){
        this.game.physics.arcade.gravity.y = 1000;
        
        this.spaceBar = this.game.input.keyboard.addKey([Phaser.Keyboard.SPACEBAR]);
        
        this.midScreenX = this.game.world.width * 0.5;
        this.midScreenY = this.game.world.height * 0.5;
    },
    create: function(){
        //add a log
        this.game.add.image(0, 0, 'background');
        this.newLog = this.game.add.sprite(this.game.world.width * 0.45, this.midScreenY + 100, 'log');
        this.newLog.anchor.setTo(0.5);
        this.newLog.scale.setTo(0.75, 0.75);
        
        //add an axe
        this.axe = this.game.add.sprite(this.newLog.x + 300, this.game.world.height * 0.85, 'axe');
        this.axe.anchor.setTo(0.5, 0.9);
        this.axe.scale.setTo(0.8, 0.8);
        this.axe.inputEnabled = true;
        this.axe.events.onInputDown.add(this.swing, this);
        this.chopSound = this.game.add.sound('chop');
        
        //add slider and track
        this.track = this.game.add.sprite(this.game.world.width * 0.5, 25, 'sliderTrack');
        this.track.anchor.setTo(0.5);
        this.player = this.game.add.sprite(this.track.left + 8, 25, 'slider');
        this.player.anchor.setTo(0.5);
        this.targetRange = this.game.add.sprite(this.game.world.width * 0.5, 25, 'targetRange');
        this.targetRange.anchor.setTo(0.5);
        
        
    },
    update: function(){
        //if(this.game.input.activePointer.isDown){
        //    this.swing();
        //}
    },
    
    sliderPosition: function() {
        var min = Math.ceil(this.sliderTrack.left + 3);
        var max = Math.floor(this.sliderTrack.right - 3);
        return Math.floor(Math.random() * (max - min)) + min;
  
    },
    
    swing: function() {
        this.uiBlocked = true;
        var windUp = this.game.add.tween(this.axe).to({ angle: 15}, 100, Phaser.Easing.Linear.None, true);
        windUp.onComplete.add(function(){
        var swingAction = this.game.add.tween(this.axe).to({ angle: -60}, 100, Phaser.Easing.Linear.None, true);
            swingAction.onComplete.add(function(){
                this.chopSound.play();
                var resetPosition = this.game.add.tween(this.axe).to({ angle: 0}, 300, Phaser.Easing.Linear.None, true);
                this.uiBlocked = false;
                
            },this);
        }, this);
    }
    
};