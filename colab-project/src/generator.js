import {state} from './state.js'
import { place } from './board.js'

const board = document.querySelector(".board")

const BOARD_SIZE = 19
const CELL_SIZE = 10
const SVG_NAMESPACE = "http://www.w3.org/2000/svg"

function boardGenerator(board) {
    board.replaceChildren()

    const svg = document.createElementNS(SVG_NAMESPACE, "svg")
    svg.setAttribute("viewBox", `0 0 ${BOARD_SIZE * CELL_SIZE} ${BOARD_SIZE * CELL_SIZE}`)

    const background = document.createElementNS(SVG_NAMESPACE, "rect")
    background.classList.add("board-background")
    background.setAttribute("width", BOARD_SIZE * CELL_SIZE)
    background.setAttribute("height", BOARD_SIZE * CELL_SIZE)
    background.setAttribute("fill", "#fddea3")
    svg.append(background)

    let index = 0
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const tile = tileGenerator(x, y, index)
            if (x === 0 && y === 0) {
                tile.append(lineGenerator(5, 5, 10, 5))
                tile.append(lineGenerator(5, 5, 5, 10))
            } else if (x === 0 && y === BOARD_SIZE - 1) {
                tile.append(lineGenerator(5, 5, 10, 5))
                tile.append(lineGenerator(5, 5, 5, 0))
            } else if (x === BOARD_SIZE - 1 && y === 0) {
                tile.append(lineGenerator(0, 5, 5, 5))
                tile.append(lineGenerator(5, 5, 5, 10))
            } else if (x === BOARD_SIZE - 1 && y === BOARD_SIZE - 1) {
                tile.append(lineGenerator(0, 5, 5, 5))
                tile.append(lineGenerator(5, 0, 5, 5))
            } else {
                if (x < BOARD_SIZE - 1) {
                    tile.append(lineGenerator(5, 5, 10, 5))
                }
                if (x > 0) {
                    tile.append(lineGenerator(0, 5, 5, 5))
                }
                if (y < BOARD_SIZE - 1) {
                    tile.append(lineGenerator(5, 5, 5, 10))
                }
                if (y > 0) {
                    tile.append(lineGenerator(5, 0, 5, 5))
                }
            }
            svg.append(tile)
            index++
        }
    }

    board.append(svg)
}

function tileGenerator(x, y, id) {
    const tile = document.createElementNS(SVG_NAMESPACE, "g")
    tile.setAttribute("transform", `translate(${x * CELL_SIZE},${y * CELL_SIZE})`)
    tile.append(rectGenerator(id))
    if (((x != 0) && (y != 0) && ((x <= 17) && (y <= 17)))){
        tile.addEventListener("click",() => {place(y - 1, x - 1)})
        state.shown_board[y-1][x-1] = tile
    }
    return tile
}

export function placePiece(r, c) {
    const piece = document.createElementNS(SVG_NAMESPACE, "circle");

    piece.classList.add("piece", `player-${state.turn}`)
    piece.setAttribute("cx", "5");
    piece.setAttribute("cy", "5");
    piece.setAttribute("r", "3.5");
    piece.setAttribute("pointer-events", "none");

    state.shown_board[r][c].append(piece);
}

export function removePiece(r,c) {
    state.shown_board[r][c].querySelector("circle")?.remove();
}

function rectGenerator(id) {
    const rect = document.createElementNS(SVG_NAMESPACE, "rect")
    rect.setAttribute("id", `cell-${id}`)
    rect.setAttribute("width", CELL_SIZE)
    rect.setAttribute("height", CELL_SIZE)
    rect.setAttribute("fill-opacity", "0")
    rect.setAttribute("pointer-events", "all")
    return rect
}

function lineGenerator(x1, y1, x2, y2) {
    const line = document.createElementNS(SVG_NAMESPACE, "line")
    line.classList.add("board-line")
    line.setAttribute("x1", x1)
    line.setAttribute("y1", y1)
    line.setAttribute("x2", x2)
    line.setAttribute("y2", y2)
    return line
}

boardGenerator(board)