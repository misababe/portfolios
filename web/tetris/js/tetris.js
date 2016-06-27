/**
 * Created by Administrator on 2016/6/17.
 */
var Tetris = (function(){
    var interval;
    var cols = 10;
    var rows = 15;
    var blockSize = 47;
    var speed = 800;
    var gameOver = false;

    // Tetris 构造函数
    function Tetris(){
        this.board = new Board();
        this.score = new Score();
        this.level = new Level();
        this.nextShape = new NextShape();   //下一个形状预告
        Keyboard.call(this);    //屏幕触摸事件
        this.init();
    }
    Tetris.prototype = {
        init: function(){
            this.eventHandlers();
            this.newGame();
        },
        newGame: function(){
            var self = this;
            var sprite = this.board.shape.block.sprite.image;
            sprite.onload = function(){
                self.board.init();
                interval = setInterval(function(){
                    self.board.tick();
                }, speed);
            };
        },
        endGame: function(){
            clearInterval(interval);
            alert("Game Over");
        }
    };

    // 加载小格底纹图片
    function SpriteLoader(src){
        var path = 'img/';
        this.image = new Image();
        this.image.src = path + ((src) ? src : 'blocks.png');
        this.imageSize = blockSize || 32;
        this.total = 7;
    }

    // Canvas 构造函数
    function Canvas(id, width, height){
        this.id = id;
        this.el = document.getElementById(this.id);
        this.ctx = this.el.getContext('2d');
        this.width  = width  || window.innerWidth  || documentElement.clientWidth;
        this.height = height || window.innerHeight || documentElement.clientHeight;
        this.setSize();
    }
    Canvas.prototype = {
        setSize: function(){
            this.el.width  = this.width;
            this.el.height = this.height;
        },
        clear: function(fromX, fromY, toX, toY){
            var fromX = fromX || 0;
            var fromY = fromY || 0;
            var toX = toX || this.width;
            var toY = toY || this.height;
            this.ctx.clearRect(fromX, fromY, toX, toY);
        },
        drawText: function(text){
            this.clear(0, 50);
            this.ctx.font = "25px Arial";
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(text, this.width/2, 84);
        }
    };

    // 单个块
    function Block(){
        this.sprite = new SpriteLoader();
        this.image = this.sprite.image;
        this.size  = this.sprite.imageSize;
        this.total = this.sprite.total;
    }
    //随机生成图片底纹
    Block.prototype = {
        random: function(){
            return Math.floor( Math.random() * this.total ) + 1;
        },
        draw: function(context, x, y, blockType){
            var blockType = blockType || this.random();
            var s = this.size;
            context.drawImage(this.image, (blockType-1)*s, 0, s, s, s*x, s*y, s, s);
        }
    };

    //随机生成形状
    function Shape(){
        this.block = new Block();
        this.layout;
        this.blockType;
        this.currentX = 0;
        this.currentY = 0;
        this.layouts = [
            [
                [ 0, 1, 0 ],
                [ 1, 1, 1 ]
            ],[
                [ 0, 0, 1 ],
                [ 1, 1, 1 ]
            ],[
                [ 1, 0, 0 ],
                [ 1, 1, 1 ]
            ],[
                [ 1, 1, 0 ],
                [ 0, 1, 1 ]
            ],[
                [ 0, 1, 1 ],
                [ 1, 1, 0 ]
            ],[
                [ 1, 1, 1, 1 ]
            ],[
                [ 1, 1 ],
                [ 1, 1 ]
            ]
        ];
    }
    Shape.prototype = {
        random: function(){
            var layout = this.layouts[ Math.floor(Math.random() * this.layouts.length) ];
            this.blockType = this.block.random();

            for (var y=0; y < layout.length; y++){
                for (var x=0; x < layout[0].length; x++){
                    if (layout[y][x]) layout[y][x] = this.blockType;
                }
            }
            this.layout = layout;
        },
        defaultXY: function(){
            this.currentX = Math.floor((cols - this.layout[0].length)/2);
            this.currentY = 0;
        },
        new: function(){
            this.random();
            this.defaultXY();
            return this;
        },
        fixCurrentXY: function(){
            if (this.currentX < 0) this.currentX = 0;
            if (this.currentY < 0) this.currentY = 0;
            if (this.currentX + this.layout[0].length > cols) this.currentX = cols - this.layout[0].length;
            if (this.currentY + this.layout.length    > rows) this.currentY = rows - this.layout.length;
        },
        //旋转
        rotate: function(){
            var newLayout = [];//新布局
            for (var y=0; y < this.layout[0].length; y++){
                newLayout[y] = [];
                for (var x=0; x < this.layout.length; x++){
                    newLayout[y][x] = this.layout[this.layout.length - 1 - x][y];
                }
            }
            this.layout = newLayout;
            this.fixCurrentXY();
        },
        draw: function(context){
            try {
                for (var y=0; y < this.layout.length; y++){
                    for (var x=0; x < this.layout[y].length; x++){
                        if (this.layout[y][x]) this.block.draw(context, x + this.currentX, y + this.currentY, this.blockType);
                    }
                }
            } catch(e){
                console.log("Error: can't draw the shape.");
            }
        }
    };

    // 面板构造函数
    function Board(){
        var grid;
        this.cols = cols || 13;
        this.rows = rows || 16;
        this.blockSize = blockSize || 38;
        this.canvas = new Canvas('board', cols*blockSize, rows*blockSize);
        this.shape  = new Shape();
        this.nextShape = new Shape();
        this.ctx  = this.canvas.ctx;
        this.list = [];
    }
    Board.prototype = {
        init: function(){
            this.initGrid();
            this.drawGrid();
            this.shape.new().draw(this.ctx);
            this.nextShape.new();
            window.Tetris.nextShape.render(this.nextShape);
        },
        //网格
        initGrid: function(){
            for (var y=0; y < this.rows; y++){
                this.list[y] = [];
                for (var x=0; x < this.cols; x++){
                    this.list[y][x] = 0;
                }
            }
        },
        drawGrid: function(){
            this.ctx.strokeStyle = 'rgba(40,40,40,0)';
            this.ctx.lineWidth = 1;

            for (var i=0; i < this.rows; i++){
                this.ctx.moveTo(0, i * this.blockSize);
                this.ctx.lineTo(this.canvas.width, i * this.blockSize);
                this.ctx.stroke();
            }
            for (var i=0; i < this.cols; i++){
                this.ctx.moveTo(i * this.blockSize, 0);
                this.ctx.lineTo(i * this.blockSize, this.canvas.height);
                this.ctx.stroke();
            }
            grid = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        },
        validMove: function(incX, incY, shape){
            var shape = shape || this.shape;
            var offsetX = shape.currentX + incX;
            var offsetY = shape.currentY + incY;

            for (var y=0; y < shape.layout.length; y++){
                for (var x=0; x < shape.layout[0].length; x++){
                    if (shape.layout[y][x]){
                        if ( typeof this.list[offsetY + y] === 'undefined'
                            || typeof this.list[offsetY + y][offsetX + x] === 'undefined'
                            || this.list[offsetY + y][offsetX + x]
                            || offsetX + x < 0
                            || offsetX + x >= this.cols
                            || offsetY + y >= this.rows ){
                            return false;
                        }
                    }
                }
            }

            return true;
        },
        addShapeToBoard: function(){
            loop1:
                for (var y=0; y < this.shape.layout.length; y++){
                    loop2:
                        for (var x=0; x < this.shape.layout[0].length; x++){
                            if (this.shape.layout[y][x]){
                                var boardX = this.shape.currentX + x;
                                var boardY = this.shape.currentY + y;
                                if (this.list[boardY][boardX]){
                                    gameOver = true;
                                    break loop1;
                                } else this.list[boardY][boardX] = this.shape.layout[y][x];
                            }
                        }
                }
        },
        clearLines: function(){
            var lines = 0;
            for (var y=this.rows-1; y >= 0; y--){
                var filled = true;
                for (var x=0; x < this.cols; x++){
                    if (!this.list[y][x]){
                        filled = false;
                        break;
                    }
                }
                if (filled && y){
                    for (var yy=y; yy > 0; yy--){
                        for (var x=0; x < this.cols; x++){
                            this.list[yy][x] = this.list[yy - 1][x];
                        }
                    }
                    lines++;
                    y++;
                }
            }
            if (lines) window.Tetris.score.updateScore(lines); // Update current score
        },
        drawBlocks: function(){
            for (var y=0; y < this.rows; y++){
                for (var x=0; x < this.cols; x++){
                    if (this.list[y][x]) this.shape.block.draw(this.ctx, x, y, this.list[y][x]);
                }
            }
        },
        refresh: function(){
            this.canvas.clear();
            this.ctx.putImageData(grid, 0, 0);
            this.drawBlocks();
        },
        tick: function(){
            if (this.validMove(0,1)){
                this.shape.currentY++;
            } else {
                this.addShapeToBoard();
                this.clearLines();

                if (gameOver){
                    window.Tetris.endGame();
                    return false;
                }

                var tempShape = this.shape.new();
                this.shape = this.nextShape;
                this.shape.defaultXY();

                this.nextShape = tempShape;
                window.Tetris.nextShape.render(this.nextShape); // Update next shape
            }
            this.refresh();
            this.shape.draw(this.ctx);
        }
    };

    // 屏幕仿质按键按下动作
    function Keyboard(){
        var self = this;

        this.eventHandlers =function(){
            var aChangeSP = document.getElementsByClassName('shape');
            var rightKey = document.getElementsByClassName('right')[0];
            var leftKey = document.getElementsByClassName('left')[0];
            var downKey = document.getElementsByClassName('down')[0];

            var refresh = false;
            for(var i=0;i<aChangeSP.length;i++){
                aChangeSP[i].addEventListener('touchstart',function(){
                    self.board.shape.rotate();
                    if (self.board.validMove(0,0))
                        refresh = true;
                },true);
            }

            rightKey.addEventListener('touchstart',function(){
                if (self.board.validMove(1,0)){
                    self.board.shape.currentX++;
                    refresh = true;}
            },true);
            downKey.addEventListener('touchstart',function(){
                if (self.board.validMove(0,1)){
                                    clearInterval(interval);
                    self.board.shape.currentY++;
                                    refresh = true;
                    if (refresh){
                        self.board.refresh();
                        self.board.shape.draw(self.board.ctx);
                                    interval = setInterval(function(){
                                        self.board.tick();
                                    }, speed);

                            }
                }
            },true);
            leftKey.addEventListener('touchstart',function(){
                if (self.board.validMove(-1,0)){
                    self.board.shape.currentX--;
                                    refresh = true;
                                }
            },true);
        }

    }

    // 分数
    function Score(){
        this.canvas = new Canvas('score', 200, 100);
        this.ctx = this.canvas.ctx;
        this.total = 0;
        this.blocks = cols;
        this.factor = 100;
        this.init();
    }
    Score.prototype = {
        init: function(){
            this.updateScore(this.total);
        },
        numberWithCommas: function(){
            return this.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        calcScore: function(lines){
            return lines * this.blocks * this.factor;
        },
        render: function(){
            this.canvas.drawText(this.numberWithCommas());
        },
        updateScore: function(lines){
            this.total += this.calcScore(lines);
            this.render();
        }
    };
    // 下一个形状
    function NextShape(){
        this.canvas = new Canvas('next-shape', 380, 250);
        this.ctx = this.canvas.ctx;
        this.init();
    };
    NextShape.prototype = {
        init: function(){
        },
        render: function(nextShape){
            this.canvas.clear(0, 50);
            nextShape.currentX = 2;
            nextShape.currentY = 2;
            nextShape.draw(this.ctx);
        }
    };

    // 游戏等级  待完善
    function Level(){
        this.canvas = new Canvas('level', 200, 100);
        this.ctx = this.canvas.ctx;
        this.init();
    };
    Level.prototype = {
        init: function(){
            this.render();
        },
        render: function(nextShape){
            this.canvas.drawText('1');
        }
    };


    return new Tetris();
})();