import { TURN } from "./constants.js";
import { getCurrentTurnElement, getCellElementList } from "./selectors.js";

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

function toggleTurn() {
    //  toggle turn
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

    //  update turn on DOM element
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurn.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurn.classList.add(currentTurn);
    }
}

function handleCellList(cell, index) {
    const isClicked =
        cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);

    if (isClicked) return;

    // set selected cell
    cell.classList.add(currentTurn);

    // toggle turn
    toggleTurn();
    console.log("click", cell, index);
}

function initCellElementList() {
    const cellElementList = getCellElementList();
    // for (const cell of cellElementList) {
    //     cell.addEventListener("click", () => handleCellList(cell));
    // }

    cellElementList.forEach((cell, index) => {
        cell.addEventListener("click", () => handleCellList(cell, index));
    });
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
})();