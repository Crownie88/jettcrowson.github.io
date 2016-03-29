//Basic game variables
var CMD = {
	money: 0,
	increment: 1,
	incCost: 2,
	autoIncrement: 0,
	historyBufferEnabled: true,
	historyBuffer: [],
	historyBufferCurrentIdx: -1,
	historyLastDirection: null,
	data: 0,
	counter: 0,
	currentStorage: "selectronTube",
	currScheme: "default",
    autoMineSpeed: 2000,
    autoMineAmount: 1
}

//List commands here and then add them to gameCommands.js
var commands = {

	HELP: {name:"help", unlocked:true, cost:0},
	MINEDATA: {name:"mineData", unlocked:true, cost:0},
	SAVE: {name:"save",unlocked:true, cost:0},
	AUTOMINE: {name:"autoMine", unlocked:false, cost:20},
	SELLDATA: {name:"sellData", unlocked:false, cost:250},
	BUYDATA: {name:"buyData", unlocked:false, cost:150},
	BUYCOMMAND: {name:"buyCommand", unlocked:true, cost:0},
	UPGRADESTORAGE: {name:"upgradeStorage", unlocked:true, cost:0},
	CLEAR: {name:"clear",unlocked:true, cost:0},
	LOAD: {name:"load", unlocked:true, cost:0},
	CURRENTSTORAGE: {name:"currentStorage", unlocked:true, cost:0},
	UPGRADEMINE: {name:"upgradeMine", unlocked:true, cost:0},
	COLORSCHEME: {name:"colorScheme", unlocked:false, cost:5120},
    HARDWARESHOP: {name:"hardwareShop", unlocked:true, cost:0}

}

//Themes are listed here and then add a css file under /css/themes/[theme].css
var themes = {

	coral: {name:"coral", accent:"#859900"},
	naked: {name:"naked", accent:"#27588F"},
	ocean: {name:"ocean", accent:"#105BAD"},
	hacker: {name:"hacker", accent:"#887F32"},
	fire: {name:"fire", accent:"yellow"},
	mint: {name:"mint", accent:"#7CFFA6"},
	invert: {name:"invert", accent:"black"},
	default: {name:"default", accent:"white"}

}

//Storages
var storages = {

	selectronTube: {name:"selectronTube", size:"512Bytes", price:0, selected:true},
	floppyDisk: {name:"floppyDisk", size:"1509949Bytes", price:2500, selected:false},
	zipDrive: {name:"zipDrive", size:"100MB", price:170000, selected:false},
	DVD: {name:"DVD", size:"5GB", price:500000, selected:false},
	sdCard: {name:"sdCard", size:"32GB", price:1500000, selected:false},
	flashDrive: {name:"flashDrive", size:"512GB", price:8000000, selected:false},
	SSD: {name:"SSD", size:"1TB", price:25000000, selected:false},
	ssdArray: {name:"ssdArray", size:"16TB", price:75000000, selected:false},
	serverRack: {name:"serverRack", size:"100TB", price:1750000000, selected:false},
	serverRoom: {name:"serverRoom", size:"1PB", price:5250000000, selected:false},
	serverWarehouse: {name:"serverWarehouse", size:"512PB", price:14000000000, selected:false},
	multipleLocations: {name:"multipleLocations", size:"128EB", price:10000000000000, selected:false},
	multipleCountries: {name:"multipleCountries", size:"1ZB", price:40000000000000, selected:false},
	smallAfricanCountry: {name:"smallAfricanCountry", size:"512ZB", price:400000000000000, selected:false},
	alienSpaceArray: {name:"alienSpaceArray", size:"100000YB", price:3000000000000000, selected:false},
	enslaveHumans: {name:"enslaveHumans", size:"9999999999999999YB", price:9007199254740991, selected:false}
}

var upgrades = {
    CPU: {
        Tier1: {name: "CPU Tier 1", speedMultiplier: 0.5, price: 100, unlocked: false},
        Tier2: {name: "CPU Tier 2", speedMultiplier: 0.5, price: 1000, unlocked: false},
        Tier3: {name: "CPU Tier 3", speedMultiplier: 0.5, price: 10000, unlocked: false}
    },
    RAM: {
        Tier1: {name: "RAM Tier 1", autoMineMultiplier: 2, price: 150, unlocked: false},
        Tier2: {name: "RAM Tier 2", autoMineMultiplier: 2.5, price: 1500, unlocked: false},
        Tier3: {name: "RAM Tier 3", autoMineMultiplier: 2, price: 15000, unlocked: false}
    }
}

//Intervals
function NewIntervalHandler(){
    this.intervalList = [];
    this.addInterval = function (cName, func, timeOut) {
        intervalList.push({name: cName, handle: setInterval(func, timeOut)});
    };
    this.removeInterval = function (name) {
                            intervalList.forEach(function(obj){
                                if (obj.name === name){
                                    clearInterval(obj.handle);
                                    return;
                                }
                            })
                        };
    return this;
}