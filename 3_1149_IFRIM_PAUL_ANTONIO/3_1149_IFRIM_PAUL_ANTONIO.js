var dataJSON = {};
const MIN = 1987;
const MAX = 2017;
const pipe = (...functions) => args => functions.reduce((arg, fn) => fn(arg), args);
const filter = arg => array => array.filter(arg);
const map = arg => array => array.map(arg);

fetch("./media/data.json").then(function(res) {
    return res.json();
}).then(function(data) {
    dataJSON = data
    console.log("dataJSON = ", dataJSON);
})

function onClickShowTableMenu() {
    var menu = document.getElementById("menu");
    menu.style.display = "none";

    var tableDiv = document.getElementById("dataTable");
    tableDiv.style.display = "inline";
}

function backToMenu() {
    var menu = document.getElementById("menu");
    menu.style.display = "inline";

    var tableDiv = document.getElementById("dataTable");
    tableDiv.style.display = "none";
}

function generateTable() {
    var from = document.getElementById("fromYear").value;
    var to = document.getElementById("toYear").value;

    if (from < MIN || from > MAX || to < MIN || to > MAX || from > to) {
        window.alert("Please insert a valid period in between " + MIN + " and " + MAX + "!");
        console.error("Please insert a valid period in between " + MIN + " and " + MAX + "!");
    } else {
        var divTable = document.getElementById("dataTable");

        if (document.getElementById("series-table")) {
            var tableToBeDeleted = document.getElementById("series-table");
            tableToBeDeleted.parentNode.removeChild(tableToBeDeleted);
        }
        var table = document.createElement("table");
        table.setAttribute("id", "series-table");

        var thead = generateHeader(from, to);
        table.appendChild(thead);

        table = generateAndAppendBody(table, from, to);

        divTable.appendChild(table);
        console.log(from, to);
    }
}

function generateHeader(from, to) {
    var thead = document.createElement("tr");
    var emptyCell = document.createElement("th");
    emptyCell.setAttribute("colspan", "2");

    thead.appendChild(emptyCell);

    for (var i = from; i <= to; i++) {
        var cell = document.createElement("th");
        var cellContent = document.createTextNode(i);
        cell.appendChild(cellContent);
        thead.appendChild(cell);
    }

    return thead;
}

function generateAndAppendBody(table, from, to) {
    dataJSON.forEach(obj => {
        var row = document.createElement("tr");
        var countryCell = document.createElement("td");
        countryCell.setAttribute("rowspan", "3");
        var countryCellValue = document.createTextNode(obj.country);
        countryCell.appendChild(countryCellValue);
        row.appendChild(countryCell);

        for (let i = 0; i < obj.characteristics.length; i++) {
            if (i == 0) {
                var charCell = document.createElement("td");
                var charCellName = document.createTextNode(obj.characteristics[i].name);
                charCell.appendChild(charCellName);
                row.appendChild(charCell);

                appendDataCells(table, row, obj.characteristics[i], from, to);
            } else {
                var secRow = document.createElement("tr");
                var secCtyCell = document.createElement("td");
                var secCtyCellName = document.createTextNode(obj.characteristics[i].name);
                secCtyCell.appendChild(secCtyCellName);
                secRow.appendChild(secCtyCell);

                appendDataCells(table, secRow, obj.characteristics[i], from, to);
            }
        }
    });

    return table;
}

function appendDataCells(table, row, characteristics, from, to) {
    let stop = characteristics.values.length;
    let values = characteristics.values;

    for (let j = 0; j < stop; j++) {
        let start = from;

        var cell = document.createElement("td");
        var value = document.createTextNode((values[j])[parseInt(start) + j]);
        cell.appendChild(value);
        row.appendChild(cell);
        table.appendChild(row);
        if (from == to) {
            break;
        }
    }
}

function displayHystogramMenu() {
    var menu = document.getElementById("menu");
    menu.style.display = "none";

    var histogram = document.getElementById("histogram");
    histogram.style.display = "inline";

    var entities = document.getElementById("entities");
    dataJSON.forEach(data => {
        var entityOption = document.createElement("option");
        entityOption.setAttribute("value", data.country);

        var entityOptionTitle = document.createTextNode(data.country);
        entityOption.append(entityOptionTitle);
        entities.append(entityOption);
    });

    var characteristics = document.getElementById("characteristics");
    dataJSON[0].characteristics.forEach(characteristic => {
        var characteristicOption = document.createElement("option");
        characteristicOption.setAttribute("value", characteristic.name);

        var characteristicOptionTitle = document.createTextNode(characteristic.name);
        characteristicOption.append(characteristicOptionTitle);
        characteristics.append(characteristicOption);
    });
}

function backToMenuFromHistogram() {
    var menu = document.getElementById("menu");
    menu.style.display = "inline";

    var histogram = document.getElementById("histogram");
    histogram.style.display = "none";

    var canvasHistogram = document.getElementById("canvas-histogram");
    canvasHistogram.style.display = "none";

    clearDropDownOptions();
}

function clearDropDownOptions() {
    var entities = document.getElementById("entities");
    while (entities.firstChild) {
        entities.removeChild(entities.lastChild);
    }

    var characteristics = document.getElementById("characteristics");
    while (characteristics.firstChild) {
        characteristics.removeChild(characteristics.lastChild);
    }
}

function generateHistogram() {
    var selectedEntity = document.getElementById("entities").value;
    var selectedCharacteristic = document.getElementById("characteristics").value;

    selectedData = (pipe(
        filter(arr => { return arr.country == selectedEntity; }),
        map(arr => {
            var char = arr.characteristics.filter(ch => ch.name == selectedCharacteristic)
            return char[0].values;
        })
    )(dataJSON))[0];

    drawHistogram(selectedData, selectedCharacteristic);
}

function drawHistogram(inputData, selectedCharacteristic) {
    var canvasHistogram = document.getElementById("canvas-histogram");
    var context = canvasHistogram.getContext("2d");
    canvasHistogram.style.display = "inline";

    context.fillStyle = "red";
    context.strokeStyle = "green"
    context.lineWidth = 2;
    context.clearRect(0, 0, canvasHistogram.width, canvasHistogram.height);

    var space = 10;
    var xCoord = space;
    var width = 30;
    inputData.forEach((v, k) => {
        context.beginPath();
        if (selectedCharacteristic != 'market value of listed companies (% GDP)') {
            context.rect(xCoord, canvasHistogram.height - v[MIN + k] * 10, width, v[MIN + k] * 10);
        } else {
            context.rect(xCoord, canvasHistogram.height - v[MIN + k], width, v[MIN + k]);
        }
        context.fill();
        context.stroke();
        xCoord += (width + space);
    })
}