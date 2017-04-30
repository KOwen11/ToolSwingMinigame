var TSM = TSM || {};

TSM.GameState = {
    init: function(){
        
        this.spaceBar = this.game.input.keyboard.addKey([Phaser.Keyboard.SPACEBAR]);
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 0;
        this.midScreenX = this.game.world.width * 0.5;
        this.midScreenY = this.game.world.height * 0.5;
        this.maxSpeed = 600;
        this.minSpeed = 200;
        this.maxNegSpeed = -600;
        this.minNegSpeed = -200;

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

        this.player.allowGravity = true;
        this.targetRange = this.game.add.sprite(this.game.world.width * 0.5, 25, 'targetRange');
        this.targetRange.anchor.setTo(0.5);
        this.targetRange.enableBody = true;
        this.targetRange.immovable = true;
        this.player.bringToTop();
        this.mousePositionX = this.game.input.activePointer.x;
        
        this.createHitButton();
        
        //randomize target position
        
        



    },
    update: function(){

        var direction;
        
        if(this.player.body.velocity.x < 0){
            direction = 'left';
        }else if(this.player.body.velocity.x > 0){
            direction = 'right';
        }
        
        if((this.player.right >= this.track.right - 9 && direction == 'right') || (this.player.left <= this.track.left + 9 && direction == 'left')){
            this.player.body.velocity.x *= -1;
        }   
        
        // variable speed relative to distance from target
        if(this.player.x < this.targetRange.x && direction == 'right'){
            //on the left moving towards target
            this.player.body.velocity.x += (this.maxSpeed - this.player.body.velocity.x) * ((this.rightSide/this.track.width)/5);
        }
        if(this.player.x < this.targetRange.x && direction == 'left'){
            //left moving away from target
            this.player.body.velocity.x -= (this.player.body.velocity.x - this.minNegSpeed) * ((this.rightSide/this.track.width)/20);
        }
        if(this.player.x > this.targetRange.x && direction == 'right'){
            //right moving away from target
            this.player.body.velocity.x -= (this.player.body.velocity.x - this.minSpeed) * ((this.rightSide/this.track.width)/20);
        }
        if(this.player.x > this.targetRange.x && direction == 'left'){
            //right moving towards target
            this.player.body.velocity.x += (this.maxNegSpeed - this.player.body.velocity.x) * ((this.rightSide/this.track.width)/5);
        }
              
        
    },
    
    createHitButton: function(){
        //swing button
        this.hitButton = this.game.add.button(this.axe.x, this.axe.y, 'swing');
        this.hitButton.anchor.setTo(0.5);
        this.player.body.velocity.x = this.minSpeed;
        this.randomTargetPosition();
        
        this.hitButton.events.onInputDown.add(function(){
            this.swing();
            this.hitButton.kill();
            this.createResetButton();
            this.killSpeed();
        },this);
        
    },
    
    createResetButton: function(){
        //reset button
        this.resetButton = this.game.add.button(this.axe.x, this.axe.y, 'reset');
        this.resetButton.anchor.setTo(0.5);
        this.resetButton.events.onInputDown.add(function(){
            
            
            this.player.x = this.track.left + 10;
            
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
      console.log(distance + ' from target');
    },
    
    randomTargetPosition: function(){
        this.targetRange.x = this.sliderPosition();
        
        this.sideCheck();
    },
    
    sideCheck: function(){
        this.leftSide = this.targetRange.x - this.track.left;
        this.rightSide = this.track.right - this.targetRange.x;
        
        console.log('target center: ' + (this.targetRange.x));
        console.log('track center: ' + (this.track.x));
    },
    
    sliderPosition: function() {
        var min = Math.ceil(this.track.left + this.targetRange.width * 0.5);
        var max = Math.floor(this.track.right - this.targetRange.width * 0.5);
        return Math.floor(Math.random() * (max - min)) + min;
  
    },

    killSpeed: function(){
        this.player.body.velocity.x = 0;
    },
    
    swing: function() {
        if(!this.uiBlocked){
            this.uiBlocked = true;
            this.hitCheck();
            
            console.log('Player position: ' + this.player.x);
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