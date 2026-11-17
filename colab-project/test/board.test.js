import assert from 'node:assert/strict';
import { beforeEach, describe, test } from 'node:test';
import { state } from '../src/state.js';
import {
    countDirection,
    place,
    removalCheck,
    winCheck
} from '../src/board.js';

function resetState() {
    state.turn = 1;
    state.player1_captures = 0;
    state.player2_captures = 0;

    for (const row of state.board) {
        row.fill(0);
    }
}

function captureConsoleLogs(callback) {
    const messages = [];
    const originalLog = console.log;
    console.log = (...args) => messages.push(args.join(' '));

    try {
        callback();
    } finally {
        console.log = originalLog;
    }

    return messages;
}

beforeEach(resetState);

describe('countDirection', () => {
    test('counts matching pieces horizontally', () => {
        state.turn = 1;
        state.board[5][6] = 1;
        state.board[5][7] = 1;
        state.board[5][8] = 1;

        assert.equal(countDirection(5, 5, 0, 1), 3);
    });

    test('stops at an empty square, opponent piece, or board edge', () => {
        state.turn = 1;
        state.board[0][1] = 1;
        state.board[0][2] = 2;
        state.board[0][3] = 1;

        assert.equal(countDirection(0, 0, 0, 1), 1);
        assert.equal(countDirection(0, 3, -1, 0), 0);
    });
});

describe('winCheck', () => {
    const lines = [
        {
            name: 'horizontal',
            cells: [[5, 1], [5, 2], [5, 3], [5, 4], [5, 5]]
        },
        {
            name: 'vertical',
            cells: [[1, 5], [2, 5], [3, 5], [4, 5], [5, 5]]
        },
        {
            name: 'diagonal down-right',
            cells: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]]
        },
        {
            name: 'diagonal down-left',
            cells: [[1, 5], [2, 4], [3, 3], [4, 2], [5, 1]]
        }
    ];

    for (const line of lines) {
        test(`detects five in a row: ${line.name}`, () => {
            for (const [row, col] of line.cells) {
                state.board[row][col] = 1;
            }

            const logs = captureConsoleLogs(() => winCheck(...line.cells[2]));

            assert.ok(logs.some(message => message.includes('Player 1 wins!')));
        });
    }

    test('does not report a win for only four pieces', () => {
        for (let col = 1; col <= 4; col++) {
            state.board[5][col] = 1;
        }

        const logs = captureConsoleLogs(() => winCheck(5, 4));

        assert.equal(logs.length, 0);
    });

    test('detects a line longer than five', () => {
        for (let col = 1; col <= 6; col++) {
            state.board[5][col] = 1;
        }

        const logs = captureConsoleLogs(() => winCheck(5, 3));

        assert.ok(logs.some(message => message.includes('Player 1 wins!')));
    });
});

describe('place', () => {
    test('places the current player and switches turns', () => {
        place(4, 4);

        assert.equal(state.board[4][4], 1);
        assert.equal(state.turn, 2);
    });

    test('does not overwrite an occupied square', () => {
        state.board[4][4] = 2;

        place(4, 4);

        assert.equal(state.board[4][4], 2);
        assert.equal(state.turn, 1);
    });
});

describe('removalCheck', () => {
    test('removes exactly two enemy pieces when bracketed', () => {
        state.turn = 1;
        state.board[5][5] = 1;
        state.board[5][6] = 2;
        state.board[5][7] = 2;
        state.board[5][8] = 1;

        removalCheck(5, 5);

        assert.equal(state.board[5][6], 0);
        assert.equal(state.board[5][7], 0);
        assert.equal(state.player1_captures, 1);
    });

    test('does not remove three enemy pieces', () => {
        state.turn = 1;
        state.board[5][5] = 1;
        state.board[5][6] = 2;
        state.board[5][7] = 2;
        state.board[5][8] = 2;
        state.board[5][9] = 1;

        assert.doesNotThrow(() => removalCheck(5, 5));
        assert.equal(state.board[5][6], 2);
        assert.equal(state.board[5][7], 2);
        assert.equal(state.board[5][8], 2);
    });
});
