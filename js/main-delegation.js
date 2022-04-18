import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
    getCurrentTurnElement,
    getCellElementList,
    getGameStatusElement,
    getReplayButtonElement,
    getCellElementAtIdx,
    getCellListElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";

// console.log(checkGameStatus(["X", "O", "O", "", "X", "", "", "O", "X"]));

// console.log(getCellElementAtIdx(4));
// console.log(getCellElementList());
// console.log(getCurrentTurnElement());
// console.log(getGameStatusElement());

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill("");
let gameStatus = GAME_STATUS.PLAYING;

function toggleTurn() {
    //  toggle turn
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

    //  update turn on DOM element
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }
}

function updateGameStatus(newGameStatus) {
    gameStatus = newGameStatus;
    const gameStatusElement = getGameStatusElement();
    if (getGameStatusElement) gameStatusElement.textContent = newGameStatus;
}

function showReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.add("show");
}

function hideReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.remove("show");
}

function highlightWinCells(winPositions) {
    if (!Array.isArray(winPositions) || winPositions.length !== 3) {
        throw new Error("Invalid win position");
    }

    for (const position of winPositions) {
        const cell = getCellElementAtIdx(position);
        if (cell) cell.classList.add("win");
    }
}

function handleCellList(cell, index) {
    const isClicked =
        cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);

    // const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
    if (isClicked || gameStatus !== GAME_STATUS.PLAYING) return;

    // set selected cell
    cell.classList.add(currentTurn);

    //  update cell values

    cellValues[index] =
        currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

    // toggle turn
    toggleTurn();

    // check game status
    const game = checkGameStatus(cellValues);
    console.log(game.status);
    switch (game.status) {
        case GAME_STATUS.ENDED:
            {
                updateGameStatus(game.status);
                showReplayButton();

                break;
            }
        case GAME_STATUS.O_WIN:
        case GAME_STATUS.X_WIN:
            {
                updateGameStatus(game.status);
                showReplayButton();
                highlightWinCells(game.winPositions);
                break;
            }
        default:
    }
}

function initCellElementList() {
    const liList = getCellElementList();
    liList.forEach((cell, index) => {
        cell.dataset.idx = index;
    });

    const ulElement = getCellListElement();

    if (ulElement) {
        ulElement.addEventListener("click", (event) => {
            if (event.target.tagName !== "LI") return;

            const index = Number.parseInt(event.target.dataset.idx);
            handleCellList(event.target, index);
        });
    }
}

function resetGame() {
    // reset temp global vars
    currentTurn = TURN.CROSS;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map(() => "");

    //  reset dom elements
    //  reset game status
    updateGameStatus(GAME_STATUS.PLAYING);
    // reset game board

    const cellElementList = getCellElementList();

    for (const cellElement of cellElementList) {
        // cellElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        cellElement.className = "";
    }
    // reset current turn
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(TURN.CROSS);
    }
    // hide replay button
    hideReplayButton();
}

function initReplayButton() {
    const replayButton = getReplayButtonElement();

    if (replayButton) {
        replayButton.addEventListener("click", resetGame);
    }
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
    initCellElementList();
    // bind click event for all li element
    //  bind click event for replay button
    initReplayButton();
})();