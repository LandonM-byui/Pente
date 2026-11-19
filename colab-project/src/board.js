import {state} from './state.js'
import { placePiece, removePiece } from './generator.js';
const check = {"t-l": [-1, -1], "t-m": [-1,0], "t-r": [-1, 1], "m-l": [0, -1], "m-r": [0, 1], "b-l": [1, -1], "b-m": [1, 0], "b-r": [1, 1]}
const turn = document.querySelector(".turn p")
const captures = [document.querySelector("#player_1_pieces p"), document.querySelector("#player_2_pieces p")]

function place(r, c){
    if (!state.game_won){   
        if (state.board[r][c] == 0) {
            switch (state.turn){
                case 1:
                    state.board[r][c] = 1;
                    placePiece(r,c)
                    removalCheck(r, c)
                    winCheck(r, c)
                    state.turn = 2;
                    turn.textContent = `Player 2's turn`
                    break;
                case 2:
                    state.board[r][c] = 2;
                    placePiece(r,c)
                    removalCheck(r,c)
                    winCheck(r, c)
                    state.turn = 1;
                    turn.textContent = `Player 1's turn`
                    break;
            }
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
                state.game_won = true;
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

document.querySelector("#reset").addEventListener("click", reset)
function reset(){
    state.board = state.board.map(row => row.map(() => 0))
    state.shown_board.forEach(row => {
        row.forEach(column => column.querySelector("circle")?.remove())
    });
    state.turn = 1
    turn.textContent = `Player 1's turn`
    state.player1_captures = 0;
    state.player2_captures = 0;
    state.game_won = false;
    captures[0].textContent = "Player 1 captures: 0"
    captures[1].textContent = "Player 2 captures: 0"
}

function remove(coords){
    state.board[coords[0][0]][coords[0][1]] = 0;
    removePiece(coords[0][0],coords[0][1])
    state.board[coords[1][0]][coords[1][1]] = 0;
    removePiece(coords[1][0],coords[1][1])
    state[`player${state.turn}_captures`] += 1;
    captures[state.turn - 1].textContent = `Player ${state.turn} captures: ` + String(state[`player${state.turn}_captures`])
}

export { place, winCheck, countDirection, removalCheck, remove };
