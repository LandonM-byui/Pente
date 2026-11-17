import {state} from './state.js'
const check = {"t-l": [-1, -1], "t-m": [-1,0], "t-r": [-1, 1], "m-l": [0, -1], "m-r": [0, 1], "b-l": [1, -1], "b-m": [1, 0], "b-r": [1, 1]}

function place(r, c){
    if (state.board[r][c] == 0) {
        switch (state.turn){
            case 1:
                state.board[r][c] = 1;
                winCheck(r, c)
                state.turn = 2;
                break;
            case 2:
                state.board[r][c] = 2;
                winCheck(r, c)
                state.turn = 1;
                break;
        }
    }
}

function winCheck(r, c){
    if (state[`player${state.turn}_captures`] == 5){
        console.log(`Player ${state.turn} wins!`)
    }
    else {
        const directions = ["m-r", "b-m", "b-r", "b-l"];

        for (const key of directions) {
            let count = 1;

            count += countDirection(r, c, check[key][0], check[key][1]);
            count += countDirection(r, c, -check[key][0], -check[key][1]);

            if (count >= 5) {
                console.log(`Player ${state.turn} wins!`)
            }
        }

    }

}

function countDirection(r, c, dr, dc) {
    let count = 0;
    let row = r + dr;
    let col = c + dc;

    while (
        row >= 0 &&
        row < state.board.length &&
        col >= 0 &&
        col < state.board[row].length &&
        state.board[row][col] === state.turn
    ) {
        count++;
        row += dr;
        col += dc;
    }

    return count;
}

function removalCheck(r,c,current=null, list = []){
    if (current === null){
        for (let key in check){
            if ((r + check[key][0] >= 0) && (c + check[key][1] >= 0) && (r + check[key][0] <= state.board.length -1) && (c + check[key][1] <= state.board[r].length -1)) {
                if ((state.board[r + check[key][0]][c + check[key][1]] != state.turn) && ((state.board[r + check[key][0]][c + check[key][1]] != 0))){
                    
                    let removal = removalCheck(r + check[key][0], c + check[key][1], check[key], [[r + check[key][0],c + check[key][1]]])
                    if (removal !== null && removal.length == 2){
                        remove(removal)
                    }
                }
            }
        }
    }
    else {
        if ((r + current[0] >= 0) && (c + current[1] >= 0) && (r + current[0] <= state.board.length - 1) && (c + current[1] <= state.board[r].length -1)) {
            if ((state.board[r + current[0]][c + current[1]] != state.turn) && ((state.board[r + current[0]][c + current[1]] != 0))){
                list.push([r + current[0], c + current[1]])
                return removalCheck(r + current[0], c + current[1], current, list)
            }
            else if (state.board[r + current[0]][c + current[1]] == state.turn){
                return list;
            }
        }
    }
    return null;
}

function remove(coords){
    state.board[coords[0][0]][coords[0][1]] = 0;
    state.board[coords[1][0]][coords[1][1]] = 0;
    state[`player${state.turn}_captures`] += 1;
}

export { place, winCheck, countDirection, removalCheck, remove };
