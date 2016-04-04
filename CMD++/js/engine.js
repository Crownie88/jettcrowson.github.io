/***

	This file is for basic commands. Game commands go into gameCommands.js

***/

var IntervalHandler = NewIntervalHandler();

//Turns bytes into higher values such as 34GB, 5KB, etc.
function formatBytes(bytes, decimals) {

    if (bytes === 0) return '0 Byte';
    var k = 1024;
    var dm = decimals + 1 || 2;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];

}

//This is the opposite of formatBytes. It turns something like 23GB into bytes.
function formatLargeData(str) {

    var digits = str.replace(/\D/g, "");
    var letters = str.replace(/[^a-z]/gi, "");

    switch (letters) {
        case "BYTES":
            return digits * 1;
        case "KB":
            return formatLargeData((digits * 1024) + "BYTES");
        case "MB":
            return formatLargeData((digits * 1024) + "KB");
        case "GB":
            return formatLargeData((digits * 1024) + "MB");
        case "TB":
            return formatLargeData((digits * 1024) + "GB");
        case "PB":
            return formatLargeData((digits * 1024) + "TB");
        case "EB":
            return formatLargeData((digits * 1024) + "PB");
        case "ZB":
            return formatLargeData((digits * 1024) + "EB");
        case "YB":
            return formatLargeData((digits * 1024) + "ZB");
    }

}

//Makes sure you still have storage available
function checkStorage() {

    if (CMD.data <= formatLargeData(storages[CMD.currentStorage].size)) {
        return true;
    } else {
        return false;
    }

}

//Creates a new line on the CMD
function respond(text, prefix) {

    if (typeof prefix == 'undefined') prefix = '>';
    $("#responses").append("<tr class='response'><td class='response'><span class='accent'>" + prefix + "</span> " +
        text + "</td></tr>");

}

//Takes the commands and variables and passes them into gameCommands.js
function runCommand(commandToRun) {
    var environment = "http://jettcrowson.github.io/CMD++/CMD.html";
    //Secret command to add 10% of your storage capacity. This is mostly just for testing what works. I'll remove this before release.
    respond(commandToRun, '$');
    commandToRun = commandToRun.toUpperCase();
    if (window.location.href != environment){
        if (commandToRun === "POPPIES") {
            CMD.data += formatLargeData(storages[CMD.currentStorage].size) / 10;
            return;
        }
        //secret command to add $100k for testing purposes.
        if (commandToRun == "MONEYZ"){
            CMD.money += 100000;
            return;
        }
    }

    //Break away args
    if (commandToRun.indexOf(" ") !== -1 && commandToRun[commandToRun.indexOf(" ") + 1] === undefined) {

        respond("Command not found.");
        console.log("Command not found.");
        localStorage.clear();

    } else {

        //Seperate the command and the argument
        var commandAndArgs = commandToRun.split(" ");
        //Check if it exists
        if (commands[commandAndArgs[0]] === undefined) {

            respond("Command not found.");

        } else {

            console.log(commandAndArgs);

            if (commands[commandAndArgs[0]].unlocked) {

                gameCommands[commandAndArgs[0]](commandAndArgs[1]);

            } else {

                respond("Command locked. Use buyCommand to unlock new commands.");

            }
        }
    }
}

//Adds data
function addData(amount) {
    CMD.data += amount;
    update();
}

//Adds money
function addMoney(amount) {

    CMD.money += amount;
    update();

}

//Updates #stats bar
function update() {

    //These are the top elements on the screen.
    $("#dataCount").html(formatBytes(CMD.data));
    $("#moneyCount").html("$" + nFormat(CMD.money));
    var per = Math.floor(100 * CMD.data / formatLargeData(storages[CMD.currentStorage].size));
    $("#capac").html(per + "%");

}

//Handles passing the command to runCommand()
function command() {

    if ($("#input").val() !== "") {

        //Submit the command
        var command = $("#input").val();
        runCommand(command);

        // Add command to history
        if (CMD.historyBufferEnabled) {

            if (CMD.historyBuffer[0] != command) {

                CMD.historyBuffer.unshift(command);

            }
            if (CMD.historyBuffer.length > 10) { // Ensure we have a circular history

                CMD.historyBuffer.pop();

            }
        }
        //Reset the imput field
        $("#input").val("");
    }
}

//If the user hits enter, run the command
$(document).keypress(function(e) {

    //Changes were made. Reset autocomplete suggestions.
    inputChanged = true;
    suggestionIndex = 0;

    if (e.which == 13) {

        command();
        CMD.historyBufferCurrentIdx = -1; // Reset history index
        $('#cmdWindow').scrollTop($('#cmdWindow')[0].scrollHeight);
        inputChanged = true;

    }
});

//If the user hits the up key, get the last commands
$(document).keyup(function(e) {

    if (CMD.historyBufferEnabled && (e.which == 38 || e.which == 40)) { // Handling command history

        var iCurrentBufferSize = CMD.historyBuffer.length;
        var sSelectedCommand = '';

        if (e.which == 38) { // up = previous cmd in history

            CMD.historyBufferCurrentIdx++;

            if (CMD.historyBufferCurrentIdx > iCurrentBufferSize) CMD.historyBufferCurrentIdx = 0;

            sSelectedCommand = CMD.historyBuffer[CMD.historyBufferCurrentIdx];
            CMD.historyLastDirection = 'up';

        }

        if (e.which == 40) { // down = next cmd in history

            CMD.historyBufferCurrentIdx--;

            if (CMD.historyBufferCurrentIdx < 0) {

                CMD.historyBufferCurrentIdx = -1; // Should empty the prompt
                sSelectedCommand = '';

            } else {

                sSelectedCommand = CMD.historyBuffer[CMD.historyBufferCurrentIdx];

            }
            CMD.historyLastDirection = 'down';
        }
        $('#input').val(sSelectedCommand);
    }
    $("#input").focus();
});

//Game loop
function GameLoop(){
    CMD.counter++;
    //Save it every 10 seconds
    if (CMD.counter % 10 === 0) {
        gameCommands.SAVE(false);
        IntervalHandler.removeInterval("gameLoop");
    }
    if (checkStorage()) {
        addData(CMD.autoIncrement);
    } else {
        update();
        if (CMD.counter % 10 === 0) {
            //If it is filled, every 10 seconds remind you to upgrade.
            respond("Please upgrade your storage with upgradeStorage.");
        }
    }
};
IntervalHandler.addInterval("gameLoop",GameLoop, 1000);

function GetAutoMineSpeed(){
    var Speed = 2000;
    // respond(upgrades.CPU.Tier1.name);
    for (i = 0; i < Object.keys(upgrades.CPU).length; i++){
        if (upgrades.CPU[Object.keys(upgrades.CPU)[i]].unlocked){
            Speed *= upgrades.CPU[Object.keys(upgrades.CPU)[i]].speedMultiplier;
        }
    }
    return Speed;
}

function SetAutoMineAmount(){
    var amount = 1;
    for (i = 0; i < Object.keys(upgrades.RAM).length; i++){
        if (upgrades.RAM[Object.keys(upgrades.RAM)[i]].unlocked){
            amount *= upgrades.RAM[Object.keys(upgrades.RAM)[i]].autoMineMultiplier;
        }
    }
    CMD.autoMineAmount = amount;
}

function AutoMineTick(){
    if (checkStorage()) {
        addData(CMD.autoMineAmount);
    }
}

//These are all for formatting numbers such as 1000 to 1K
var nLog = Math.log(10);

function floor(n) {

    return (Math.abs(Math.abs(n) - Math.abs(Math.floor(n))) >= 0.999999991) ? ((n >= 0) ? Math.ceil(n) : Math.floor(n)) : ((n >= 0) ? Math.floor(n) : Math.ceil(n));

}

function nFormat(n, d) {

    var nArray = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "UnD", "DuD", "TrD", "QaD", "QiD", "SeD", "SpD", "OcD", "NoD", "Vi", "UnV"];
    var l = (floor(Math.log(Math.abs(n)) / nLog) <= 0) ? 0 : floor(Math.log(Math.abs(n)) / nLog),
        p = (l % 3 === 0) ? 2 : (((l - 1) % 3 === 0) ? 1 : 0),
        r = (Math.abs(n) < 1000) ? ((typeof d === "number") ? n.toFixed(d) : floor(n)) : (floor(n / (Math.pow(10, floor(l / 3) * 3 - p))) / Math.pow(10, p));
    return (r + nArray[floor(l / 3)] + ((floor(r) === 42) ? "~" : "")) || "Infinite";

}

var inputChanged = false;
var suggestionIndex = 0;
var suggestions = [];

//Autocompletes when the user hits tab
function AutoComplete() {

    var inp = $("#input").val();

    if (inputChanged) {

        //Clear array.
        suggestions = [];

        for (i = 0; i < Object.keys(commands).length; i++) {

            //Check if the command starts with the input and see if the command is unlocked.
            if (Object.keys(commands)[i].lastIndexOf(inp, 0) === 0 && commands[Object.keys(commands)[i]].unlocked)
                
                suggestions.push(Object.keys(commands)[i]);
        
        }
    }
    $("#input").val(suggestions[suggestionIndex]);
    inputChanged = false;
}

//Autocomplete
$("#submitForm").on('keydown', '#input', function(e) {

    var keyCode = e.keyCode || e.which;

    if (keyCode == 9) {

        //Prevent jumping to next control and don't insert tab character.
        e.preventDefault();
        AutoComplete();
        //Increment the index of the next command.
        suggestionIndex++;

        //Length is not 0-indexed. So if index equals array length it's actually out of range.
        if (suggestionIndex == suggestions.length) suggestionIndex = 0;

    }
});
