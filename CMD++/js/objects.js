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
	currScheme: "default"
}

//List commands here and then add them to gameCommands.js
var commands = {

	help: {name:"help", unlocked:true, cost:0},
	mineData: {name:"mineData", unlocked:true, cost:0},
	save: {name:"save",unlocked:true, cost:0},
	autoMine: {name:"autoMine", unlocked:false, cost:20},
	sellData: {name:"sellData", unlocked:false, cost:250},
	buyData: {name:"buyData", unlocked:false, cost:150},
	buyCommand: {name:"buyCommand", unlocked:true, cost:0},
	upgradeStorage: {name:"upgradeStorage", unlocked:true, cost:0},
	clear: {name:"clear",unlocked:true, cost:0},
	load: {name:"load", unlocked:true, cost:0},
	currentStorage: {name:"currentStorage", unlocked:true, cost:0},
	upgradeMine: {name:"upgradeMine", unlocked:true, cost:0},
	colorScheme: {name:"colorScheme", unlocked:false, cost:5120}

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