export const state = {
    turn : 1,
    board: Array.from({length: 17}, () => Array(17).fill(0)),
    shown_board: Array.from({length: 17}, () => Array(17).fill(null)),
    player1_captures: 0,
    player2_captures: 0,
    game_won: false
};