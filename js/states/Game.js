var TSM = TSM || {};

TSM.GameState = {
    init: function(){
        
        this.spaceBar = this.game.input.keyboard.addKey([Phaser.Keyboard.SPACEBAR]);
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 0;
        this.midScreenX = this.game.world.width * 0.5;
        this.midScreenY = this.game.world.height * 0.5;
        this.playerSpeed = this.randSpeed();
        this.maxSpeed = 500;
        this.minSpeed = 200;
        this.currentSpeed = 0;
        this.speedMod = 0.025;
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
        this.axe.inputEnabled = false;
        this.axe.events.onInputDown.add(this.swing, this);
        this.chopSound = this.game.add.sound('chop');
        
        //add slider and track
        this.track = this.game.add.sprite(this.game.world.width * 0.5, 25, 'sliderTrack');
        this.track.anchor.setTo(0.5);
        this.track.enableBody = true;
        this.track.immovable = true;
        this.player = this.game.add.sprite(this.track.left + 10, 25, 'slider');
        this.player.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.player);

        //this.player.body.velocity.x = 200;
        this.player.allowGravity = true;
        this.targetRange = this.game.add.sprite(this.game.world.width * 0.5, 25, 'targetRange');
        this.targetRange.anchor.setTo(0.5);
        this.targetRange.enableBody = true;
        this.targetRange.immovable = true;
        this.player.bringToTop();
        
        
        
        this.createHitButton();
        
        //randomize target position
        this.randomTargetPosition();
        this.player.body.velocity.x = this.playerSpeed;
        
        this.shortSide = 0;
        this.longSide = 0;
        this.leftSide = '';
        this.sideCheck();

    },
    update: function(){
        //if(this.game.input.activePointer.isDown){
        //    this.swing();
        //}

        var direction;
        
        
        
        if(this.player.body.velocity.x < 0){
            direction = -1;
        }else if(this.player.body.velocity.x > 0){
            direction = 1;
        }
        
        if((this.player.right >= this.track.right - 9 && direction == 1) || (this.player.left <= this.track.left + 9 && direction == -1)){
            this.player.body.velocity.x *= -1;
        }   

        
        // variable speed relative to distance from target
        
        
        
    },
    
    createHitButton: function(){
        //swing button
        this.hitButton = this.game.add.button(this.axe.x, this.axe.y, 'swing');
        this.hitButton.anchor.setTo(0.5);
        this.hitButton.events.onInputDown.add(function(){
            this.swing();
            this.hitButton.kill();
            this.createResetButton();
        },this);
    },
    
    createResetButton: function(){
        //reset button
        this.resetButton = this.game.add.button(this.axe.x, this.axe.y, 'reset');
        this.resetButton.anchor.setTo(0.5);
        this.resetButton.events.onInputDown.add(function(){
            var i = Math.random();
            this.playerSpeed = this.randSpeed();
            if(i<0.5){
                this.playerSpeed *= -1;
            }
            
            this.player.body.velocity.x = this.playerSpeed;
            this.resetButton.kill();
            this.createHitButton();
        },this);
    },
    
    hitCheck: function() {
      
      var distance = Math.abs(this.player.x - (this.targetRange.right - (this.targetRange.width * 0.5)));
      if(distance < 10){
          console.log('perfect');
      }else if(distance < 45){
          console.log('great');
      }else if(distance < 83){
          console.log('good');
      }
      console.log(distance);
    },
    
    randomTargetPosition: function(){
        this.targetRange.x = this.sliderPosition();
    },
    
    sideCheck: function(){
        if(this.track.width - this.targetRange.x - this.track.left > this.track.width * 0.5){
            this.longSide = this.track.width - this.targetRange.x - this.track.left;
            this.shortSide = this.track.width - this.longSide;
            this.leftSide = 'short';
            
        }else if(this.track.width - this.targetRange.x - this.track.left < this.track.width * 0.5){
            this.shortSide = this.track.width - this.targetRange.x - this.track.left;
            this.longSide = this.track.width - this.shortSide;
            this.leftSide = 'long';
        }
        //console.log(this.leftSide);
    },
    
    sliderPosition: function() {
        var min = Math.ceil(this.track.left + this.targetRange.width * 0.5);
        var max = Math.floor(this.track.right - this.targetRange.width * 0.5);
        return Math.floor(Math.random() * (max - min)) + min;
  
    },
    
    randSpeed: function(){
      var min = Math.ceil(200);
      var max = Math.floor(500);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    swing: function() {
        if(!this.uiBlocked){
            this.uiBlocked = true;
            this.hitCheck();
            this.player.body.velocity.x = 0;
            this.axe.inputEnabled = false;
            var windUp = this.game.add.tween(this.axe).to({ angle: 15}, 50, Phaser.Easing.Linear.None, true);
            windUp.onComplete.add(function(){
    
            var swingAction = this.game.add.tween(this.axe).to({ angle: -60}, 100, Phaser.Easing.Linear.None, true);
                swingAction.onComplete.add(function(){
                    this.chopSound.play();
                    
                    var resetPosition = this.game.add.tween(this.axe).to({ angle: 0}, 300, Phaser.Easing.Linear.None, true);
                    resetPosition.onComplete.add(function(){
                        this.axe.inputEnabled = false;
                        this.uiBlocked = false;
                    }, this);
                    
                },this);
            }, this);
        }
    }
    
};