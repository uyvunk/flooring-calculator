let INCREMENT = 1/16; // smallest increment the tape measure has
let tileWidth = document.getElementById("tile-width");
let tileHeight = document.getElementById("tile-height");
let minWidth = document.getElementById("min-width");
let minHeight = document.getElementById("min-height");
let roomWidth = document.getElementById("room-width");
let roomHeight = document.getElementById("room-height");
let inputArea = document.getElementById("input-area");
let visualArea = document.getElementById("visual");
let widthResultHtml = document.getElementById("widthCalculateResult");
let btnCalculate = document.getElementById("btn-calculate");
btnCalculate.addEventListener("click", calculate);

let resultCalculateWidth = {};
let resultCalculateHeight = {};

function getValue(element) {
    return parseFloat(element.value || 0);
}

function convertTo16String(floatVal) {
    let whole = Math.floor(floatVal);
    let numerator = Math.floor((floatVal - whole)/ INCREMENT);
    return whole == floatVal ? whole : `${whole} ${numerator}/16`;
}

function calculateWidth() {
    let minStartWidth = getValue(minWidth);
    let maxStartWidth = getValue(tileWidth);
    for (let startWidth = minStartWidth; startWidth <= maxStartWidth; startWidth = startWidth + INCREMENT) {
        let row = 0;
        let endWidth = 0;
        do {
            let currentStartWidth = row == 0 ? startWidth : endWidth;
            let wholeTiles = Math.floor((getValue(roomWidth) - currentStartWidth) / getValue(tileWidth));
            endWidth = getValue(roomWidth) - currentStartWidth - wholeTiles * getValue(tileWidth);
            row++;
        } while (endWidth >= getValue(minWidth) && row * getValue(tileHeight) <= getValue(roomHeight))
        resultCalculateWidth[`${startWidth}`] = {rows: row, endWidth, height: row * getValue(tileHeight)}
    }
    // Object.keys(resultCalculateWidth).forEach(startWidth => {
    //     console.log(`${startWidth}: rows: ${resultCalculateWidth[startWidth].rows}, height: ${resultCalculateWidth[startWidth].height}, endWidth: ${resultCalculateWidth[startWidth].endWidth}`)
    // });
    let sortedKeys = Object.keys(resultCalculateWidth).sort((a, b) => {
        return resultCalculateWidth[b].rows - resultCalculateWidth[a].rows;
    });
    // Creating HTML table
    let htmlTable = "<table><thead><tr><th>Start Width</th><th>Rows</th><th>Height</th><th>End Width</th></tr></thead><tbody>";
    sortedKeys.forEach(key => {
        let rowData = resultCalculateWidth[key];
        htmlTable += `<tr><td>${convertTo16String(key)}</td><td>${rowData.rows}</td><td>${convertTo16String(rowData.height)}</td><td>${convertTo16String(rowData.endWidth)}</td></tr>`;
    });
    
    htmlTable += "</tbody></table>";
    widthResultHtml.innerHTML = htmlTable;
}

function calculateHeight() {
    let minStartHeight = getValue(minHeight);
    let maxStartHeight = getValue(tileHeight);
    for (let startHeight = minStartHeight; startHeight <= maxStartHeight; startHeight = startHeight + INCREMENT) {
        let wholeTiles = Math.floor((getValue(roomHeight) - startHeight) / getValue(tileHeight));
        let endHeight = getValue(roomHeight) - startHeight - wholeTiles * getValue(tileHeight);
        if (endHeight >= getValue(minHeight)) {
            resultCalculateHeight[startHeight] = {startHeight: startHeight, endHeight: endHeight};
        }
    }
    // Object.keys(resultCalculateHeight).forEach(startHeight => {
    //     console.log(`${startHeight}: startHeigth: ${resultCalculateHeight[startHeight].startHeight}, endHeight: ${resultCalculateHeight[startHeight].endHeight}`)
    // });
    // Sorting keys based on the 'endHeight' property in descending order
    let sortedKeys = Object.keys(resultCalculateHeight).sort((a, b) => {
        return resultCalculateHeight[b].endHeight - resultCalculateHeight[a].endHeight;
    });

    // Creating HTML table
    let htmlTable = "<table><thead><tr><th>Start Height</th><th>End Height</th></tr></thead><tbody>";

    sortedKeys.forEach(key => {
        let rowData = resultCalculateHeight[key];
        htmlTable += `<tr><td>${convertTo16String(rowData.startHeight)}</td><td>${convertTo16String(rowData.endHeight)}</td></tr>`;
    });

    htmlTable += "</tbody></table>";

    // Inserting the HTML table into the div with id "heightCalculateResult"
    let heightResultDiv = document.getElementById("heightCalculateResult");
    heightResultDiv.innerHTML = htmlTable;
}

function calculate() {
    calculateWidth();
    calculateHeight();
}