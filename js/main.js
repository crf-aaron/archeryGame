/**
 * Created by CRF on 2018/9/12.
 */
function Balloon(config) {
    this.init = function () {
        this.balloons = game.add.group();
        this.balloons.enableBody = true;
        this.balloons.createMultiple(config.selfPool, config.selfPic);
        this.balloons.setAll('outOfBoundsKill', true);
        this.balloons.setAll('checkWorldBounds', true);
        // 气球的随机位置范围
        this.maxWidth = game.width - game.cache.getImage(config.selfPic).width;
        // 产生气球的定时器
        this.timerBalloon = game.time.events.loop(Phaser.Timer.SECOND * config.selfTimeInterval, this.generateBalloon, this);
        // 气球的爆炸效果
        this.explosions = game.add.group();
        this.explosions.createMultiple(config.explodePool, config.explodePic);
        this.explosions.forEach(function(explosion) {
            explosion.animations.add(config.explodePic);
        }, this);
    }
    // 产生气球
    this.generateBalloon = function () {
        var e = this.balloons.getFirstExists(false);
        if (e) {
            e.reset(game.rnd.integerInRange(350, this.maxWidth), -game.cache.getImage(config.selfPic).height);
            e.body.velocity.y = config.velocity;
        }
    }
    // 打中气球
    this.hitBalloon = function(arrow, balloon) {
        arrow.kill();
        balloon.kill();
        var explosion = this.explosions.getFirstExists(false);
        explosion.reset(balloon.body.x-56, balloon.body.y-124);
        explosion.play(config.explodePic, 10, false, true);
        numTotal = 21 - game.num.frame--;
        if(balloon.key == 'balloon01') {
            num1++;
            score += config.score;
        } else if(balloon.key == 'balloon02') {
            num2++;
            score += config.score;
        } else if(balloon.key == 'balloon05') {
            num5++;
            score += config.score;
        } else {
            num0++;
            score = 0;
        }
    };
}
var score = 0;// 分数
var numTotal = 0;// 击中总个数
var num0 = 0;// 对应编号气球击中的个数
var num1 = 0;
var num2 = 0;
var num5 = 0;
var time = 0;// 倒计时

var game = new Phaser.Game(750,1106,Phaser.CANVAS,'game');
game.States = {};
game.States.boot = function () {
    this.preload = function () {
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.forcePortrait = true;
        this.scale.refresh();

        game.load.image('loading','assets/preloader.gif');
    }
    this.create = function () {
        game.state.start('preload');
    }
}
game.States.preload = function () {
    this.preload = function () {
        // 进度条
        var preloadSprite = game.add.sprite(game.width/2 - 190, game.height/2 - 50, 'loading');
        game.load.setPreloadSprite(preloadSprite);

        game.load.image('balloon01', 'assets/1@2x.png');
        game.load.image('balloon02', 'assets/2@2x.png');
        game.load.image('balloon05', 'assets/5@2x.png');
        game.load.image('balloon00', 'assets/clear-zero.png');
        game.load.image('arch01', 'assets/arch01.png');
        game.load.image('arch02', 'assets/arch02.png');
        game.load.image('pot', 'assets/pot@2x.png');
        game.load.image('cross', 'assets/cross.png');
        game.load.image('game-bg', 'assets/game-bg.jpg');
        game.load.image('num-bg', 'assets/num-bg.png');
        game.load.image('time-bg', 'assets/time-bg.png');
        game.load.image('arrow', 'assets/arrow.png');

        game.load.spritesheet('boom', 'assets/boom.png', 360, 306, 3);
        game.load.spritesheet('count-down', 'assets/count-down.png', 293, 156, 17);
        game.load.spritesheet('num', 'assets/num.png', 144, 77, 21);
        game.load.spritesheet('startbutton', 'assets/startbutton.png', 100, 40, 2);
        // 摇杆
        game.load.atlas('generic', 'assets/generic-joystick.png', 'assets//generic-joystick.json');
    }
    this.create = function () {
        game.state.start('main');
    }
}
game.States.main = function () {
    this.create = function () {
        this.game.renderer.renderSession.roundPixels = true;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        var bg = game.add.tileSprite(0,0,game.width,game.height,'game-bg');
        // 产生气球
        var config = {
            balloon01: {
                game: this,
                selfPic: 'balloon01',
                selfPool: 3,
                selfTimeInterval: 3,
                explodePic: 'boom',
                explodePool: 10,
                velocity: 300,
                score: 1,
            },
            balloon02: {
                game: this,
                selfPic: 'balloon02',
                selfPool: 2,
                selfTimeInterval: 5,
                explodePic: 'boom',
                explodePool: 10,
                velocity: 300,
                score: 2,
            },
            balloon05: {
                game: this,
                selfPic: 'balloon05',
                selfPool: 1,
                selfTimeInterval: 7,
                explodePic: 'boom',
                explodePool: 5,
                velocity: 300,
                score: 5,
            },
            balloon00: {
                game: this,
                selfPic: 'balloon00',
                selfPool: 1,
                selfTimeInterval: 9,
                explodePic: 'boom',
                explodePool: 5,
                velocity: 300,
                score: 0
            }
        };
        this.balloon01 = new Balloon(config.balloon01);
        this.balloon01.init();
        this.balloon02 = new Balloon(config.balloon02);
        this.balloon02.init();
        this.balloon05 = new Balloon(config.balloon05);
        this.balloon05.init();
        this.balloon00 = new Balloon(config.balloon00);
        this.balloon00.init();
        // 击中个数
        game.add.image(10, 10, 'num-bg');
        game.num = game.add.sprite(53, 40, 'num', 20);
        // 倒计时
        game.add.image(game.width - 280, 10, 'time-bg');
        this.countDown = game.add.sprite(game.width - 270, 50, 'count-down');
        this.timerEvent = game.time.events.loop(Phaser.Timer.SECOND, this.countDownFn, this);
        // 弓
        this.arch = game.add.sprite(0,game.height - 510,'arch02');
        this.arch.scale.set(0.8);
        // 箭
        this.arrow = game.add.sprite(0, game.height - 140, 'arrow');
        // this.arrow.anchor.set(0.5);
        this.arrow.scale.set(0.8);
        this.arrow.rotation = -2.2;
        game.physics.arcade.enable(this.arrow);
        // this.arrow.animations.add('shoot');
        // 对象池方式（bug：重置的箭是最后一帧的样子）
        /*this.arrows = game.add.group();
        this.arrows.enableBody = true;
        this.arrows.createMultiple(1, 'arrow');
        this.arrow = this.arrows.getFirstExists(false);
        this.arrow.anchor.x = 0.5;
        this.arrow.anchor.y = 0.5;
        if(this.arrow) {
            this.arrow.reset(150, game.height - 323);
        }
        this.arrow.animations.add('shoot');*/
        // 瞄准器
        this.cross = game.add.sprite(game.world.centerX, game.world.centerY, 'cross');
        this.cross.anchor.set(0.5);
        game.physics.arcade.enable(this.cross);
        this.cross.body.collideWorldBounds = true;

        // 开始按钮
        // this.btn = game.add.button(game.width/2 - 20,game.height/2 - 50,'startbutton',this.onStartClick, this, 1, 1, 0);
        // 摇杆
        this.pad = game.plugins.add(Phaser.VirtualJoystick);

        this.stick = this.pad.addStick(0, 0, 200, 'generic');
        this.stick.showOnTouch = true;//触摸时显示
        // this.stick.alignBottomRight(20);
        this.stick.onUp.add(this.archery, this);
    }
    this.update = function () {
        $.each(this.balloon01.balloons.children,function (i,v) {
            if(v.position.y > game.height - 500) {
                v.kill();
            }
        });
        $.each(this.balloon02.balloons.children,function (i,v) {
            if(v.position.y > game.height - 500) {
                v.kill();
            }
        });
        $.each(this.balloon05.balloons.children,function (i,v) {
            if(v.position.y > game.height - 500) {
                v.kill();
            }
        });
        $.each(this.balloon00.balloons.children,function (i,v) {
            if(v.position.y > game.height - 500) {
                v.kill();
            }
        });
        if(time >= 15) {
            this.cross.body.velocity.set(0);
            return;
        }
        var maxSpeed = 600;// 瞄准器移动速度
        if (this.stick.isDown) {
            this.physics.arcade.velocityFromRotation(this.stick.rotation, this.stick.force * maxSpeed, this.cross.body.velocity);
            // this.arrow.rotation = this.stick.rotation;
        }
        if(this.stick.isUp) {
            this.cross.body.velocity.set(0);
        }
        game.physics.arcade.overlap(this.arrow, this.balloon01.balloons, this.balloon01.hitBalloon, null, this.balloon01);
        game.physics.arcade.overlap(this.arrow, this.balloon02.balloons, this.balloon02.hitBalloon, null, this.balloon02);
        game.physics.arcade.overlap(this.arrow, this.balloon05.balloons, this.balloon05.hitBalloon, null, this.balloon05);
        game.physics.arcade.overlap(this.arrow, this.balloon00.balloons, this.balloon00.hitBalloon, null, this.balloon00);
    }
    // 倒计时
    this.countDownFn = function () {
        time = this.countDown.frame++;
        if(time == 15) {
            // 移除倒计时定时器
            game.time.events.remove(this.timerEvent);// 正式环境 要移到time=16里
            // 移除产生气球的定时器
            game.time.events.remove(this.balloon01.timerBalloon);
            game.time.events.remove(this.balloon02.timerBalloon);
            game.time.events.remove(this.balloon05.timerBalloon);
            game.time.events.remove(this.balloon00.timerBalloon);
            // 移除箭的动画
            if(this.arrowScaleTween) {
                this.arrowScaleTween.pause();
                this.arrowTween.pause();
            }
            // 禁止气球下落
            this.balloon01.balloons.forEach(function (ballon) {
                ballon.body.velocity.y = 0;
            });
            this.balloon02.balloons.forEach(function (ballon) {
                ballon.body.velocity.y = 0;
            });
            this.balloon05.balloons.forEach(function (ballon) {
                ballon.body.velocity.y = 0;
            });
            this.balloon00.balloons.forEach(function (ballon) {
                ballon.body.velocity.y = 0;
            });
            // 禁止摇杆
            this.stick.enabled = false;
            // 绘制一个蓝色的背景条
            var bar = game.add.graphics();
            bar.beginFill(0x000000, 0.2);
            bar.drawRect(0, game.world.centerY-100, 750, 200);
            // 文字提示
            var style = {font: "65px Arial", fill: "#ff0044", align: "center"};
            var text = game.add.text(game.world.centerX, game.world.centerY, '总共击中：'+ numTotal +'个\n总共得分：'+ score +'分', style);
            text.anchor.setTo(0.5);
        }
        if(time == 16) {
            // game.state.start('over');
        }
    }
    // 摇杆结束
    this.archery = function () {
        if(time >= 15) {
            return;
        }
        this.crossX = this.cross.body.x + 43;
        this.crossY = this.cross.body.y + 40;
        this.arrowScaleTween = game.add.tween(this.arrow.scale).to({x: 0, y: 0}, 1000, Phaser.Easing.Linear.None, true);
        this.arrowTween = game.add.tween(this.arrow).to({x:this.crossX, y:this.crossY}, 1000, Phaser.Easing.Linear.None, true);
        // this.arrow.animations.play('shoot',6,false,true);
        this.arrowTween.onComplete.add(this.killArrow, this);
    }
    // 射箭动画完成的回调
    this.killArrow = function () {
        this.arrow.kill();
        this.arrow = game.add.sprite(0, game.height - 140, 'arrow');
        // this.arrow.anchor.set(0.5);
        this.arrow.scale.set(0.8);
        this.arrow.rotation = -2.2;
        game.physics.arcade.enable(this.arrow);
        // this.arrow.animations.add('shoot');
        /*this.arrow = this.arrows.getFirstExists(false);
        if(this.arrow) {
            this.arrow.reset(150, game.height - 323);
        }*/
    }
    // 调试
    this.render = function () {
        // 显示精灵的边界
        /*game.debug.spriteBounds(this.cross);
        game.debug.spriteBounds(this.arrow);*/
    }
    /*this.onStartClick = function () {
        // game.world.remove(this.btn);
    }*/
}
game.States.over = function () {
    this.create = function () {
        console.log('over');
        // var bg = game.add.tileSprite(0,0,game.width,game.height,'game-bg');
    }
}

game.state.add('boot',game.States.boot);
game.state.add('preload',game.States.preload);
game.state.add('main',game.States.main);
game.state.add('over',game.States.over);

game.state.start('boot');
