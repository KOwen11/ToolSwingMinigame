var TSM = TSM || {};

TSM.PreloadState = {
    preload: function(){
        this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
        
        //this.load.spritesheet('sledge', 'assets/images/sledge.png');
        //this.load.spritesheet('pickaxe', 'assets/images/pickaxe.png');
        this.load.image('axe', 'assets/images/axe.png');
        this.load.image('log', 'assets/images/log.png');
        this.load.image('slider', 'assets/images/slider.png');
        this.load.image('sliderTrack', 'assets/images/sliderTrack.png');
        this.load.image('targetRange', 'assets/images/targetRange.png');
        this.load.image('background', 'assets/images/background.png');
        this.load.image('swing', 'assets/images/swingButton.png');
        this.load.image('reset', 'assets/images/resetButton.png');
        this.load.audio('chop', ['assets/audio/chop.mp3', 'assets/audio/chop.ogg']);
    },
    create: function(){
        this.state.start('Game');
    }
};