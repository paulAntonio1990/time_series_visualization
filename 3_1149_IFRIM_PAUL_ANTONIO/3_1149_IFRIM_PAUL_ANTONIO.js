var myData = {};

fetch("./media/data.json").then(function(res) {
  return res.json();
}).then(function(data){
    myData = data
  console.log(myData);
})

function onClickShowTable() {
    console.log("hello");

    var menu = document.getElementById("menu");
    menu.style.display = "none";

    // var formTableDiv = document.getElementById("tableForm");
    // formTableDiv.style.display = "inline";

    var tableDiv = document.getElementById("dataTable");
    tableDiv.style.display = "inline";
    
    var dataJSON = myData;

    var headers = [];
    for (var i = 0; i < dataJSON.length; i++) {
        for (var key in dataJSON[i]) {
            if (headers.indexOf(key) === -1) {
                headers.push(key);
            }
        }
    }

    
}

function backToMenu() {
    var menu = document.getElementById("menu");
    menu.style.display = "inline";

    var tableDiv = document.getElementById("dataTable");
    tableDiv.style.display = "none";
}
