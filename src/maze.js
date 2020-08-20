const VERSION = "0.1.0"
const BACKGROUND_COLOR = '#FFFFFF';
const DEFAULT_PERIOD = 50;
const DEFAULT_CELL_SIZE = 50;

class Maze {

    constructor(canvasId, period = DEFAULT_PERIOD, cellSize = DEFAULT_CELL_SIZE) {
        var maze = this;
        this.canvas = document.getElementById(canvasId);
        this.context = canvas.getContext('2d');
        this.period = period;
        this.cellSize = cellSize;

        this.reset();
        this.draw();

        this.timer = setInterval(function() { maze.frame(); }, this.period);
        window.addEventListener('resize', function() { maze.reset(); });
        this.canvas.addEventListener('click', function() { maze.reset(); });
    }

    populateNeighbors() {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (x > 0) {
                    this.cells[y][x].setNeighbor(Direction.LEFT, this.cells[y][x - 1]);
                }
                if (y > 0) {
                    this.cells[y][x].setNeighbor(Direction.TOP, this.cells[y - 1][x]);
                }
                if (x < this.width - 1) {
                    this.cells[y][x].setNeighbor(Direction.RIGHT, this.cells[y][x + 1]);
                }
                if (y < this.height - 1) {
                    this.cells[y][x].setNeighbor(Direction.BOTTOM, this.cells[y + 1][x]);
                }
            }
        }
    }

    reset() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = Math.floor((window.innerWidth - 1) / this.cellSize);
        this.height = Math.floor((window.innerHeight - 1) / this.cellSize);
        this.offsetX = (this.canvas.width  - (this.cellSize * this.width )) / 2;
        this.offsetY = (this.canvas.height - (this.cellSize * this.height)) / 2;
        this.cells = [];
        for (var y = 0; y < this.height; y++) {
            this.cells[y] = [];
            for (var x = 0; x < this.width; x++) {
                this.cells[y][x] = new Cell(x, y, this.cellSize);
            }
        }
        this.populateNeighbors();
        this.current = this.cells[0][0];
        this.current.status = CellStatus.VISITED;
        this.stack = [];
    }

    frame() {
        if (this.current) {
            var unVisitedNeighbor = this.current.getRandomUnVisitedNeighbor();
            if (unVisitedNeighbor) {
                this.stack.push(this.current);
                this.current = unVisitedNeighbor;
            } else if (this.stack.length > 0) {
                this.current = this.stack.pop();
            } else {
                this.current = undefined;
            }
        }

        this.draw();
    }

    draw() {
        this.context.fillStyle = BACKGROUND_COLOR;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                const isCurrent = this.current === this.cells[y][x];
                this.cells[y][x].drawCell(this.context, this.offsetX, this.offsetY, isCurrent);
            }
        }
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.cells[y][x].drawWalls(this.context, this.offsetX, this.offsetY);
            }
        }
    }
    
}
