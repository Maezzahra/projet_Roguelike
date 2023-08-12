const GRID_WIDTH = 25;
const GRID_HEIGHT = 15;
const PLAYER_START_X = 20;
const PLAYER_START_Y = 13;
const MONSTER_START_POSITIONS = [[17, 5], [19, 11], [13, 10]];
const TREASURE_POSITIONS = [[15, 1], [11, 9], [20, 5]];
const EMPTY_POSITIONS = [[16, 1], [17, 1], [18, 1], [15, 2], [16, 2], [17, 2], [18, 2],
                        [18, 3], [18, 4], [19, 4], [15, 5], [16, 5], [18, 5],[19, 5], 
                         [15, 6], [16, 6], [17, 6], [18, 6], [19, 6], [20, 6],
                        [15, 7], [19, 7], [12, 8], [13, 8], [15, 8], [19, 8], [12, 9], 
                        [13, 9], [14, 9], [15, 9], [19, 9], [20,9], [11, 10], [12, 10], 
                         [19, 10], [20, 10], [21, 10],[20, 11], [19, 12], 
                        [20, 12],[19, 13], [20, 13]];
let positionJoueur = [PLAYER_START_X, PLAYER_START_Y];
let monsterPositions = [...MONSTER_START_POSITIONS];
let tresorcollecte = 0;

function createGrid() {
    let grid = [];
    for (let i = 0; i < GRID_HEIGHT; i++) {
        let row = [];
        for (let j = 0; j < GRID_WIDTH; j++) {
            row.push(' ');
        }
        grid.push(row);
    }
    return grid;
}

function drawGrid(grid) {
    let table = document.getElementById('grid');
    table.innerHTML = '';
    for (let i = 0; i < grid.length; i++) {
        let row = grid[i];
        let tr = document.createElement('tr');
        for (let j = 0; j < row.length; j++) {
            let cell = row[j];
            let td = document.createElement('td');
            if (cell === 'P') {
                td.id = 'player';
            } else if (cell === 'M') {
                td.id = 'monster';
            } else if (cell === 'T') {
                td.id = 'treasure';
            } else if (cell === '#w') {
                td.id = 'wall';
            } else if (cell === '#v') {
                td.id = 'empty';
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function updateGrid(grid) {
    // Clear the entire grid
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] = ' ';
        }
    }
    // Set the player's position
    grid[positionJoueur[1]][positionJoueur[0]] = 'P';
    // Set the monster positions
    for (let i = 0; i < monsterPositions.length; i++) {
        let monsterPosition = monsterPositions[i];
        grid[monsterPosition[1]][monsterPosition[0]] = 'M';
    }
    // Set the treasure positions
    for (let i = 0; i < TREASURE_POSITIONS.length; i++) {
        let treasurePosition = TREASURE_POSITIONS[i];
        if (grid[treasurePosition[1]][treasurePosition[0]] !== 'P') {
            grid[treasurePosition[1]][treasurePosition[0]] = 'T';
        }
    }
    // Set the empty positions
    for (let i = 0; i < EMPTY_POSITIONS.length; i++) {
        let emptyPosition = EMPTY_POSITIONS[i];
        if (grid[emptyPosition[1]][emptyPosition[0]] !== 'P' &&
            grid[emptyPosition[1]][emptyPosition[0]] !== 'T') {
            grid[emptyPosition[1]][emptyPosition[0]] = '#v';
        }
    }
}


function movePlayer(direction) {
    if (direction === 'up' && grid[positionJoueur[1]-1][positionJoueur[0]]=='#v' || grid[positionJoueur[1]-1][positionJoueur[0]]=='T') {
        positionJoueur[1] -= 1;
    } else if (direction === 'down' && grid[positionJoueur[1]+1][positionJoueur[0]]=='#v'||grid[positionJoueur[1]+1][positionJoueur[0]]=='T') {
        positionJoueur[1] += 1;
    } else if (direction === 'left'&& grid[positionJoueur[1]][positionJoueur[0]-1]=='#v'||grid[positionJoueur[1]][positionJoueur[0]-1]=='T') {
        positionJoueur[0] -= 1;
    } else if (direction === 'right'&& grid[positionJoueur[1]][positionJoueur[0]+1]=='#v'||grid[positionJoueur[1]][positionJoueur[0]+1]=='T') {
        positionJoueur[0] += 1;
    }
    if (positionJoueur[0] < 0 || positionJoueur[0] >= EMPTY_POSITIONS || positionJoueur[1] < 0 || positionJoueur[1] >= EMPTY_POSITIONS) {
        resetGame();
    }
    for (let i = 0; i < monsterPositions.length; i++) {
        let monsterPosition = monsterPositions[i];
        if (monsterPosition[0] === positionJoueur[0] && monsterPosition[1] === positionJoueur[1]) {
            alert("Vous avez perdu!")
            resetGame();
        }
    }
    for (let i = 0; i < TREASURE_POSITIONS.length; i++) {
        let treasure_position = TREASURE_POSITIONS[i];
        if (treasure_position[0] == positionJoueur[0] && treasure_position[1] == positionJoueur[1]) {
            tresorcollecte += 1;
            document.getElementById('score').innerHTML = tresorcollecte;
            TREASURE_POSITIONS.splice(i, 1);
        }
        if (TREASURE_POSITIONS.length == 0) {
            alert("Felicitation vous avez gagne!");
            resetGame();
        }
    }
    updateMonsters();
    updateGrid(grid);
    drawGrid(grid);
}

function updateMonsters() {
    for (let i = 0; i < monsterPositions.length; i++) {
        let monster_position = monsterPositions[i];
        let direction = Math.floor(Math.random() * 2);
        if (direction === 0) {
            monster_position[0] += Math.floor(Math.random() * 3) - 1;
        } else {
            monster_position[1] += Math.floor(Math.random() * 3) - 1;
        }
        if (monster_position[0] < 0) {
            monster_position[0] = GRID_WIDTH - 1;
        } else if (monster_position[0] >= GRID_WIDTH) {
            monster_position[0] = 0;
        }
        if (monster_position[1] < 0) {
            monster_position[1] = GRID_HEIGHT - 1;
        } else if (monster_position[1] >= GRID_HEIGHT) {
            monster_position[1] = 0;
        }
    }
}

function resetGame() {
    positionJoueur = [PLAYER_START_X, PLAYER_START_Y];
    monsterPositions = [...MONSTER_START_POSITIONS];
    tresorcollecte = 0;
    document.getElementById('score').innerHTML = tresorcollecte;
    grid = createGrid();
    updateGrid(grid);
    drawGrid(grid);
}


// Initialisation
let grid = createGrid();
updateGrid(grid);
drawGrid(grid);

// Attacher les gestionnaires d'événements pour les boutons (non inclus dans le code précédent)
document.querySelector('#upButton').addEventListener('click', () => movePlayer('up'));
document.querySelector('#downButton').addEventListener('click', () => movePlayer('down'));
document.querySelector('#leftButton').addEventListener('click', () => movePlayer('left'));
document.querySelector('#rightButton').addEventListener('click', () => movePlayer('right'));
document.querySelector('#resetButton').addEventListener('click', resetGame);
