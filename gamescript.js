var play = false;
var next = false;
var CellSize = 10;
var CanvasWidth = 720;
var CanvasHeight = 480;
var backgoundColor = "white";
var liveCellColor = "black";
var UpdateSpeed = 1;

var cells = [];
var gridLines = [];
var background;

var inputBgColor = document.getElementById("BgColor");

function startGame() {
    cells = [];
    gridLines = [];
    CanvasArea.start();
    background = new cube(0, 0, CanvasArea.canvas.height, CanvasArea.canvas.width, backgoundColor);
    CanvasArea.canvas.addEventListener("click", canvasClick, false);
    MakeGrid(CellSize, "gray");
    fillCells(CanvasArea.canvas.height, CanvasArea.canvas.width, CellSize);
}

var CanvasArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = CanvasWidth;
        this.canvas.height = CanvasHeight;
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(gameUpdate, UpdateSpeed);
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function canvasClick(event) {
    var mouseX = event.clientX - CanvasArea.canvas.offsetLeft + document.documentElement.scrollLeft;
    var mouseY = event.clientY - CanvasArea.canvas.offsetTop + document.documentElement.scrollTop;
    var xLength = CanvasArea.canvas.width / CellSize;
    var cellColms = cells.length / xLength;  
    
    mouseX = Math.floor(mouseX / CellSize) * CellSize;
    mouseY = Math.floor(mouseY / CellSize) * CellSize;
    
    var start = (mouseX / CellSize) * cellColms;
    
    for (var i = start; i < start + cellColms; i++) {
        if (cells[i].x == mouseX && cells[i].y == mouseY) {
            if (cells[i].alive) {
                cells[i].alive = false;
            }
            else {
                cells[i].alive = true;
            }
        }
    } 
}

function gameUpdate() {
    if (play || next) {
        cells.forEach(element => {
            element.CanISurvive();
        });
    }
    CanvasArea.clear();
    background.Update();
    cells.forEach(element => {
        element.Update()
    });
    gridLines.forEach(element => element.Update());
    if (next) {next = false;}
}

function Cell(x, y, size, alive) {
    this.x = x;
    this.y = y;
    this.alive = alive;
    this.nextGen;
    this.neighbor;
    this.Update = function() {
        if (play || next) {
            this.alive = this.nextGen;
        }
        ctx = CanvasArea.context;
        if (this.alive) {
            ctx.fillStyle = liveCellColor;
            ctx.fillRect(this.x, this.y, size, size);
        }
    }
    this.CheckForNeigbor = function() {
        this.neighbor = 0;
        
        var offX = this.x - CellSize;
        var offY = this.y - CellSize;

        for (var i = 0; i < (3 * CellSize); i += CellSize) {
            for (var j = 0; j < (3 * CellSize); j += CellSize) {
                var p = cells.find(element => {
                    return element.x == (offX + j) && element.y == (offY + i);
                });
                //console.log(p);
                try {
                    if (p.alive == true && !(this.x == (offX + j) && this.y == (offY + i))) {
                        this.neighbor++;
                    }
                }
                catch {
                }
            }
        }
    }
    this.CanISurvive = function() {
        this.CheckForNeigbor();
        if (this.alive) {
            if (this.neighbor == 2 || this.neighbor == 3) {
                this.nextGen = true;
            }
            else if (this.neighbor > 3 || this.neighbor < 2) {
                this.nextGen = false;
            }
        }
        else if (!this.alive) {
            if (this.neighbor == 3) {
                this.nextGen = true;
            }
        }
    }
}

function cube(x, y, height, width, color) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.color = color;
    this.Update = function() {
        ctx = CanvasArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, width, height);
    }
}

function SetOnPlay(action) {
    play = action;
}

function fillCells(heigth, width, size) {
    for (var i = 0; i < width / size; i++) {
        for (var j = 0; j < heigth / size; j++) {
            cells.push(new Cell(i * size, j * size, size, false));
        }
    }
    console.log(cells.length + " Cells has been loaded");
}

function MakeGrid(size, color) {
    var xlines = CanvasArea.canvas.width / size;
    var ylines = CanvasArea.canvas.height / size;
    
    for (var i = 0; i < xlines; i++) {
        gridLines.push(new cube(i * size, 0, CanvasArea.canvas.height, 1, color));
    }
    for (var i = 0; i < ylines; i++) {
        gridLines.push(new cube(0, i * size, 1, CanvasArea.canvas.width, color));
    }
}

function setCanvasSize(height, width) {
    CanvasHeight = height;
    CanvasWidth = width;
    startGame();
}

function SetCellSize(size) {
    CellSize = size;
    startGame();
}

function ChangeCellColor(elementID) {
    liveCellColor = "#" + document.getElementById(elementID).value;
}

function ChangeBgColor(elementID) {
    background.color = "#" + document.getElementById(elementID).value;
}