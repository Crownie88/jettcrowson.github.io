var jsonOBJ = null;
//Find formatted json in js/JSON/data.json
var jsonStr = '{"commands":[{"command":"help","unlocked":true,"cost":0,"costsData":true},{"command":"mineData","unlocked":true,"cost":0,"costsData":true},{"command":"save","unlocked":true,"cost":0,"costsData":true},{"command":"autoMine","unlocked":false,"cost":20,"costsData":true},{"command":"sellData","unlocked":false,"cost":250,"costsData":true},{"command":"buyData","unlocked":false,"cost":150,"costsData":true},{"command":"buyCommand","unlocked":true,"cost":0,"costsData":true},{"command":"upgradeStorage","unlocked":true,"cost":0,"costsData":true},{"command":"clear","unlocked":true,"cost":0,"costsData":true},{"command":"load","unlocked":true,"cost":0,"costsData":true},{"command":"currentStorage","unlocked":true,"cost":0,"costsData":true},{"command":"upgradeMine","unlocked":true,"cost":0,"costsData":true},{"command":"colorScheme","unlocked":false,"cost":5120,"costsData":true}],"colorSchemes":[{"name":"coral","selected":false},{"name":"naked","selected":false},{"name":"ocean","selected":false},{"name":"hacker","selected":false},{"name":"fire","selected":false},{"name":"mint","selected":false},{"name":"invert","selected":false},{"name":"default","selected":true}],"storages":[{"name":"selectronTube","size":"512Bytes","price":0,"selected":true},{"name":"floppyDisk","size":"1509949Bytes","price":2500,"selected":false},{"name":"zipDrive","size":"100MB","price":170000,"selected":false},{"name":"DVD","size":"5GB","price":500000,"selected":false},{"name":"sdCard","size":"32GB","price":1500000,"selected":false},{"name":"flashDrive","size":"512GB","price":8000000,"selected":false},{"name":"SSD","size":"1TB","price":25000000,"selected":false},{"name":"ssdArray","size":"16TB","price":75000000,"selected":false},{"name":"serverRack","size":"100TB","price":1750000000,"selected":false},{"name":"serverRoom","size":"1PB","price":5250000000,"selected":false},{"name":"serverWarehouse","size":"512PB","price":14000000000,"selected":false},{"name":"multipleLocations","size":"128EB","price":10000000000000,"selected":false},{"name":"multipleCountries","size":"1ZB","price":40000000000000,"selected":false},{"name":"smallAfricanCountry","size":"512ZB","price":400000000000000,"selected":false},{"name":"alienSpaceArray","size":"100000YB","price":3000000000000000,"selected":false},{"name":"enslaveHumans","size":"9999999999999999YB","price":9007199254740991,"selected":false}]}';
function loadJSON(){
    jsonOBJ = JSON.parse(jsonStr);
}

function ParseSingleCommand(obj){
    return {
        command: obj.command, 
        unlocked: obj.unlocked,
        cost: obj.cost,
        costsData: obj.costsData
    };
}

function ParseCommands(){
    var result = [];
    var commandsObj = jsonOBJ.commands;
    // console.log(JSON.stringify(commandsObj));
    commandsObj.forEach(function (line){
       result.push(ParseSingleCommand(line)); 
    });
    return result;    
}

function ParseSingleScheme(obj){
    return {
        name: obj.name, 
        selected: obj.selected
    };
}

function ParseSchemes(){
    var result = [];
    var schemesObj = jsonOBJ.colorSchemes;
    schemesObj.forEach(function (line){
       result.push(ParseSingleScheme(line)); 
    });
    return result;
}

function ParseSingleStorage(obj){
    return {
        name: obj.name,
        size: obj.size,
        price: obj.price, 
        selected: obj.selected
    };
}

function ParseStorages(){
    var result = [];
    var storagesObj = jsonOBJ.storages;
    storagesObj.forEach(function (line){
       result.push(ParseSingleStorage(line)); 
    });
    return result;
}

function DoFindCommand(ToFind){
    var result = null, found = false;
    ToFind = String(ToFind).toUpperCase();
    jsonCommands.forEach(function(cmnd){
        if (!found && String(cmnd.command).toUpperCase() == ToFind){
            result = cmnd;
            found = true;
        }
    });
    return result;
}

function newManager(){
    loadJSON();
    this.jsonCommands = ParseCommands();
    this.jsonColorSchemes = ParseSchemes();
    this.jsonStorage = ParseStorages();
    this.FindCommand = DoFindCommand;
    
    return this;
}

