const WALL_COLOR    = '#000000';
const CURRENT_COLOR = '#BBBBBB';

var Direction = {
    LEFT:   0,
    RIGHT:  1,
    TOP:    2,
    BOTTOM: 3
}
var Directions = [Direction.LEFT, Direction.RIGHT, Direction.TOP, Direction.BOTTOM];

var CellStatus = {
    UN_VISITED: 0,
    VISITED:    1
};

var CellColor = {};
CellColor[CellStatus.UN_VISITED] = '#999999';
CellColor[CellStatus.VISITED]    = '#FFFFFF';

class Cell {

    constructor(x, y, cellSize) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.status = CellStatus.UN_VISITED;
        this.neighbors = [];
        this.walls = [];
        for (const direction of Directions) {
            this.neighbors[direction] = undefined;
            this.walls[direction] = true;
        }
    }

    setNeighbor(direction, neighbor) {
        this.neighbors[direction] = neighbor;
    }

    isNeighbor(neighbor) {
        var direction = undefined;
        for (const oneDirection of Directions) {
            if (this.neighbors[oneDirection] == neighbor) {
                direction = oneDirection;
            }
        }
        return direction;
    }

    getRandomUnVisitedNeighbor() {
        const unVisitedNeighbors = this.neighbors.filter(function(neighbor) {
            return neighbor && neighbor.status === CellStatus.UN_VISITED;
        });
        var unVisitedNeighbor = undefined;
        if (unVisitedNeighbors.length > 0) {
            unVisitedNeighbor = unVisitedNeighbors[Utils.getRandom(unVisitedNeighbors.length)];
            this.visit(unVisitedNeighbor);
        }
        return unVisitedNeighbor;
    }

    visit(neighbor) {
        neighbor.status = CellStatus.VISITED;
        this.walls[this.isNeighbor(neighbor)] = false;
        neighbor.walls[neighbor.isNeighbor(this)] = false;
    }

    posX(offsetX, mid = false) {
        return offsetX + this.cellSize * this.x + (mid ? this.cellSize / 2 : 0);
    }

    posY(offsetY, mid = false) {
        return offsetY + this.cellSize * this.y + (mid ? this.cellSize / 2 : 0);
    }

    drawCell(context, offsetX, offsetY, isCurrent) {
        context.fillStyle = isCurrent ? CURRENT_COLOR : CellColor[this.status];
        context.fillRect(this.posX(offsetX), this.posY(offsetY), this.cellSize, this.cellSize);
    }
    
    drawWalls(context, offsetX, offsetY) {
        for (const direction of Directions) {
            if (this.walls[direction]) {
                this.drawLine(context, direction, offsetX, offsetY);
            }
        }
    }

    drawLine(context, direction, offsetX, offsetY) {
        var x1, y1, x2, y2;
        switch (direction) {
            case Direction.TOP:
                x1 = this.x;
                y1 = this.y;
                x2 = this.x + 1;
                y2 = this.y;
                break;
            case Direction.RIGHT:
                x1 = this.x + 1;
                y1 = this.y;
                x2 = this.x + 1;
                y2 = this.y + 1;
                break;
            case Direction.BOTTOM:
                x1 = this.x + 1;
                y1 = this.y + 1;
                x2 = this.x;
                y2 = this.y + 1;
                break;
            case Direction.LEFT:
                x1 = this.x;
                y1 = this.y + 1;
                x2 = this.x;
                y2 = this.y;
                break;              
        }
        x1 *= this.cellSize;
        y1 *= this.cellSize;
        x2 *= this.cellSize;
        y2 *= this.cellSize;
        x1 += offsetX;
        y1 += offsetY;
        x2 += offsetX;
        y2 += offsetY;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineWidth = 2;
        context.strokeStyle = WALL_COLOR;
        context.stroke(); 
    }

}
