function start(){
    loadJSON();
    loadXML();
}

async function loadJSON(){
    let result = document.getElementById('json');
    fetch('http://localhost:5000/json/07.json')
        .then(response => response.json())
        .then(resp => {
            result.innerText = JSON.stringify(resp);
        });
}

async function loadXML() {
    let result = document.getElementById('xml');
    fetch('http://localhost:5000/xml/07.xml')
        .then(response => response.text())
        .then(resp => {
            result.innerText = resp;
        });
}