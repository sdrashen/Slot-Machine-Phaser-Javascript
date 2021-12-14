const StateMain = {
    preload: function() {
        game.load.image('bars', 'images/strip.png')
        game.load.image('btnSpin', 'images/btnSpin.png')
    },
    create: function() {
        this.barGroup = game.add.group()
        this.graphics = game.add.graphics()

        //
        //add 3 bars
        //
        for (const i = 0; i < 3; i++) {
            const bar = game.add.sprite(i * 100, 0, 'bars')
            this.barGroup.add(bar)
        }
        //center the bar group horizontally
        this.barGroup.x = game.width / 2 - this.barGroup.width / 2
            //place the group 50 pixels up from the center
            //because 50 is half the height of the each cell
        this.barGroup.y = game.height / 2 - 50
            //
            //draw graphics to use as a mask
            //
        this.graphics.beginFill(0xff0000)
        this.graphics.drawRect(0, 0, 300, 100)
        this.graphics.endFill()
            //subtract 150 from center
            //because the cells are 100 px each
            //and there are 3 of them
            //150 is half the width
        this.graphics.x = game.width / 2 - 150
        this.graphics.y = this.barGroup.y
        this.barGroup.mask = this.graphics
            //
            //set initial values
            //
        this.setBar(0, 3)
        this.setBar(1, 6)
        this.setBar(2, 2)
            //
            //add spin button
            //
        this.btnSpin = game.add.sprite(
            game.width / 2,
            game.height * 0.75,
            'btnSpin'
        )
        this.btnSpin.anchor.set(0.5, 0.5)
        this.btnSpin.inputEnabled = true
        this.btnSpin.events.onInputDown.add(this.startSpin, this)
    },
    startSpin() {
        console.log('startSpin')

        this.spinCount = 3

        this.btnSpin.visible = false
        const s1 = game.rnd.integerInRange(1, 6)
        const s2 = game.rnd.integerInRange(1, 6)
        const s3 = game.rnd.integerInRange(1, 6)
            //set which frame to stop on
            //first value is which bar
            //second value is number to stop on
            //
            //
        this.setStop(0, s1)
        this.setStop(1, s2)
        this.setStop(2, s3)
            //
            //set a timer to spin the wheels
            //
        this.spinTimer = game.time.events.loop(
            Phaser.Timer.SECOND / 1000,
            this.spin,
            this
        )
    },
    setStop: function(i, stopPoint) {
        const bar = this.barGroup.getChildAt(i)
        bar.stopPoint = stopPoint
        bar.active = true
        bar.spins = game.rnd.integerInRange(3, 10)
    },
    setBar: function(i, pos) {
        const bar = this.barGroup.getChildAt(i)
        bar.y = -(pos - 1) * 100
    },
    //loop through the bar group
    //and move each bar up by the number of spins it
    //has left by 2
    spin: function() {
        this.barGroup.forEach(
            function(bar) {
                if (bar.active == true) {
                    bar.y -= bar.spins * 2
                        //if the bar is at the end of a spin
                        //which is when the y position
                        //is less than the negative height of the bar
                        //
                    if (bar.y < -600) {
                        bar.y = 0
                            //then subtract a spin
                        bar.spins--
                            //if out of spins then
                            if (bar.spins == 0) {
                                bar.active = false
                                    //do the final spin
                                    //which is a tween
                                this.finalSpin(bar)
                            }
                    }
                }
            }.bind(this)
        )
    },
    finalSpin: function(bar) {
        const ty = -(bar.stopPoint - 1) * 100
        const finalTween = game.add.tween(bar).to({
                y: ty
            },
            2000,
            Phaser.Easing.Linear.None,
            true
        )
        finalTween.onComplete.add(this.checkFinished, this)
    },
    checkFinished() {
        //subtract 1 from spinCount every time
        //a bar stops
        this.spinCount--

            //if all bars have stop reset
            if (this.spinCount == 0) {
                game.time.events.remove(this.spinTimer)
                this.btnSpin.visible = true
            }
    },
    update: function() {}
}