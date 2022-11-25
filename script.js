//script
const priceTable = {
    "Pe&Mao": "40",
    "Escova I": "40",
    "Escova II": "45",
    "Escova III": "50",
    "Escova IV": "55",
    "Escova V": "60",
    "Escova VI": "65",
    "Escova VII": "70",
    "Pe": "30",
    "Mao": "20",
    "Hidratacao I": "90",
    "Hidratacao II": "120",
    "Nutricao": "100",
    "Reconstrucao": "100",
    "Sobrancelha": "20",
    "Corte": "100",
    "Aplicação de Tinta": "40",
    "Coloracao I": "120",
    "Coloracao II": "200",
    "Mechas I": "250",
    "Mechas II": "350",
    "Buco": "20"    
}
 
class Cliente {
    constructor(name) {
        this.name = name;
        this.value = 0;
    }
    // constructor(obj, name) {
    //     console.log("Virtual " + name);
    //     this.name = obj.name;
    //     this.value = obj.value;
    //     this.services = obj.services;
    // }
    
    services = [];

    remService(service) {
        this.services = this.services.filter(function(e) { return e !== service })
        this.decreaseValue(service)    
    }

    

    decreaseValue(service) {
        this.value = this.value - Number(priceTable[service]);
    }
    // addService = this.addService(service).bind(this)
}
const increaseValue = function(client,service) {
    client.value = client.value + Number(priceTable[service]); 
}
const addService = function(client,service) {
    client.services.push(service);
    increaseValue(client, service);
}

//current board list
var currentBoard = JSON.parse(localStorage.getItem("current-board"));
if (currentBoard == null) {
    currentBoard = [];
}
//history board list
var historyBoard = JSON.parse(localStorage.getItem("history-board"));
if (historyBoard == null) {
    historyBoard = [];
}


const updateBoard = function() {
    
    console.log("Board updating..")
    currentBoard.forEach(obj => {
        if(!document.getElementById(obj.name)){
            
            // console.log(obj.name);
            //create div to contains the client
            var client = document.createElement("div");
            client.classList.add("client");
           
            //create element "p" to contains the client's name
            var name = document.createElement("p");
            name.classList.add("name");
            var textName = document.createTextNode(obj.name);
            name.appendChild(textName);
            //create element "p" to contains the client's value
            var value = document.createElement("p");
            value.classList.add("value");
            var textValue = document.createTextNode("R$" + obj.value);
            console.log(obj);
            value.appendChild(textValue);
            
            //create add service select
            var serviceSelect = document.createElement("select");
            serviceSelect.name = obj.name;
            serviceSelect.style.height = "20px";

            var services = Object.keys(priceTable);
            var optDefault = document.createElement("option");
            optDefault.disabled = true;
            optDefault.selected = true;
            optDefault.value = " ";
            optDefault.text = "select";
            serviceSelect.appendChild(optDefault);
            services.forEach(e => {
                var opt = document.createElement("option");
                var optText = document.createTextNode(e);
                opt.value = e;
                opt.appendChild(optText);
                serviceSelect.appendChild(opt);
            })
            serviceSelect.onchange = function(event) {
                console.log(event);
                currentBoard.forEach( function( e) {
                    if( e.name == event.target.name && !e.services.includes(event.target.value)) {
                        addService(e,event.target.value);
                        console.log("Serviço " + event.target.value + " adicionado a " + event.target.name);
                        // console.log(this.addService(toString(event.target.value)));
                    }
                })
                localStorage.setItem("current-board",JSON.stringify(currentBoard));
                location.reload();
            }

            //create a finishClient button
            var finishClient = document.createElement("button");
            finishClient.name = obj.name;
            finishClient.textContent = "Finalizar";
            finishClient.onclick = function(event) {
                console.log(event.target.name);
                // var historySide = document.getElementById("history-board");
                var client = document.getElementById(event.target.name);
                // historySide.appendChild(client);
                historyBoard.push(currentBoard.filter(item => item.name == event.target.name)[0]);
                currentBoard = currentBoard.filter(item => item.name !== event.target.name)
                localStorage.setItem("current-board",JSON.stringify(currentBoard));
                localStorage.setItem("history-board",JSON.stringify(historyBoard));
                updateHistoryBoard();
                location.reload();
            }
           

            //creating service tags
            var serviceTags = document.createElement("div");
            //servicetags style
            // serviceTags.style.display = "flex";
            // serviceTags.style.flexDirection = "row";
            serviceTags.classList.add("service-tags");

            obj.services.forEach( function(e) {
                if(e != null) {
                    var tag = document.createElement("p");
                    var textTag = document.createTextNode(e);
                    tag.appendChild(textTag);
                    tag.name = obj.name;
                    tag.classList.add("tag");
                    tag.onclick = function(event) {
                        // console.log(event.target.textContent);
                        var virtualClient = new Cliente(event.target.name);
                        virtualClient.value = obj.value;
                        virtualClient.services = obj.services;
                        virtualClient.remService(event.target.textContent);
                        obj.services =  virtualClient.services;
                        obj.value = virtualClient.value;
                        console.log(virtualClient.value + " virtual client/obj   " + obj.value);
                        event.target.remove();
                        localStorage.setItem("current-board",JSON.stringify(currentBoard));
                        location.reload();
                    }
                    serviceTags.appendChild(tag);
                }

            })
            
            var clientStatus = document.createElement("div");
            clientStatus.style.display = "flex";
            clientStatus.style.flexDirection = "row";
            clientStatus.style.justifyContent = "space-between"
            clientStatus.appendChild(name);
            clientStatus.appendChild(serviceSelect);
            clientStatus.appendChild(finishClient);
            clientStatus.appendChild(value);
            //appending subnodes to the main div
            client.id = obj.name;
            client.classList.add("clients");
            client.appendChild(clientStatus);
            client.appendChild(serviceTags);
            
            //append the new client to the list
            var element = document.getElementById("current-board");
            element.appendChild(client);
        }
    });
}

const updateHistoryBoard = function() {
    historyBoard.forEach( obj => {
        
        // console.log(obj.name);
        //create div to contains the client
        var oldClient = document.createElement("div");
        oldClient.classList.add("history");
        
        //create element "p" to contains the client's name
        var name = document.createElement("p");
        name.classList.add("name");
        var textName = document.createTextNode(obj.name);
        name.appendChild(textName);
        //create element "p" to contains the client's value
        var value = document.createElement("p");
        value.classList.add("value");
        var textValue = document.createTextNode("R$" + obj.value);
        value.appendChild(textValue);
        //console.log(obj);
        
        //creating a close button
        var closeButton = document.createElement("button");
        closeButton.name =  obj.name;
        closeButton.textContent = "Excluir";
        closeButton.onclick = function(event) {
            var historyContainer = document.getElementById("history-board");
            var element = document.getElementById(event.target.name);
            historyContainer.remove(element);
            historyBoard = historyBoard.filter(item => item.name != event.target.name);
            localStorage.setItem("history-board",JSON.stringify(historyBoard));
            location.reload();
        }
        
                
        //creating service tags
        var serviceTags = document.createElement("div");
        //servicetags style
        serviceTags.classList.add("service-tags");
        // serviceTags.style.display = "flex";
        // serviceTags.style.flexDirection = "row";
        // serviceTags.style;flexWrap

        obj.services.forEach( function(e) {
            if(e != null) {
                var tag = document.createElement("p");
                tag.classList.add("tag");
                var textTag = document.createTextNode(e);
                tag.appendChild(textTag);
                tag.name = obj.name;
                tag.style.border = "1px solid #bdb495";
                serviceTags.appendChild(tag);
            }

        })
        
        var clientStatus = document.createElement("div");
        clientStatus.style.display = "flex";
        clientStatus.style.flexDirection = "row";
        clientStatus.style.justifyContent = "space-between"
        clientStatus.appendChild(name);
        
        clientStatus.appendChild(value);
        clientStatus.appendChild(closeButton);
        //appending subnodes to the main div
        oldClient.id = obj.name;
        oldClient.classList.add("oldClients");
        
        oldClient.appendChild(clientStatus);
        oldClient.appendChild(serviceTags);
        //append the new client to the list
        var element = document.getElementById("history-board");
        element.appendChild(oldClient);
    });
}

/*
    Brief: creates a new Cliente obj with client's name and push it to the currentBoard list
    Func: addClient
*/
const addClient = function() {
    //getting the client Name text from inputfield
    var clientName =  document.getElementById("new-client").value;
    var flag = true;
    currentBoard.forEach(e => {
        (flag == true && e.name != clientName)?flag=true:flag=false;
    })
    if(flag == true){
        //create a new client object
        const newClient = new Cliente(clientName);
        currentBoard.push(newClient);
        localStorage.setItem("current-board",JSON.stringify(currentBoard));
        location.reload();
    }else{
        window.alert("Cliente ja existente!");

    }
    updateBoard();
}

const remClient = function(name) {
    var element = document.getElementById(name);
    element.remove();
    currentBoard =  currentBoard.filter(e => e.name !== name);
    localStorage.setItem("current-board", JSON.stringify(currentBoard));
    updateBoard();
}

const update = function() {
    updateBoard();
    updateHistoryBoard();
}
// const handleChange = function(name,value) {
//     console.log(name + " " + value);
// }
// const cliente = new Cliente("Matheus Tomazi");
// cliente.addService("Manicure");
// cliente.addService("Pedicure");
// console.log(cliente);


// rever abordagem de OO
// criar um objeto Cliente a partir do nome, copiar valor e services e depois utilizar methodos da classe
// devolver addServices e increaseValue para a classe Cliente

// https://stackoverflow.com/questions/16206322/how-to-get-js-variable-to-retain-value-after-page-refresh