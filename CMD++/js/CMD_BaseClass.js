function DoRespond(text, prefix){
    if (typeof prefix == 'undefined') prefix = '>';
    //Added multiline support. Text splits on \n and outputs each line with the prefix.
    text = text.split("\n");
    text.forEach(function(line){
        $("#responses").append("<tr class='response'><td class='response'><span class='accent'>" + prefix +"</span> "+ line + "</td></tr>");
    });
}

function GameLoopFunc(){
    counter++;
    //Save it every 10 seconds
    if (counter % 10 === 0){
        DoSave(false);
    }
    //Check storage
    if(checkStorage){
        CMD.addData(CMD.autoIncrement);
    }else{
        //Update
        update;
        if (counter % 10 === 0){
            respond("Please upgrade your storage with upgradeStorage.");
        }
    }
}

function DoGameLoop(){
    setInterval(GameLoopFunc,1000);
}

function DoRunCommand(commandToRun){
    //REMEMBER: ALWAYS ADD YOUR COMMANDS TO THE COMMANDLIST ARRAY AND THE COMMAND OBJECT
    //Secret command to add 10% of your storage capacity. This is mostly just for testing what works. I'll remove this before release.
    respond(commandToRun, '$');
    if (commandToRun === "poppies") {
      data += formatLargeData(storageCapacities[storages.indexOf(currStorage)]) / 10;
    }
    //Break away args
    if (commandToRun.indexOf(" ") !== -1 && commandToRun[commandToRun.indexOf(
        " ") + 1] === undefined) {
      respond("Command not found.");
      console.log("Command not found.");
    } else {
      //Seperate the command and the argument
      var commandAndArgs = commandToRun.split(" ");
      //Check if it exists
      if (commandList.indexOf(commandAndArgs[0]) === -1) {
        respond("Command not found.");
      } else {
        console.log(commandAndArgs);
        var commandIndex = commandList.indexOf(commandAndArgs[0]);
        if (commandUnlocked[commandIndex]) {
          ExecuteCommand(commandAndArgs[0], commandAndArgs[1]);
        } else {
          respond("Command locked. Use buyCommand to unlock new commands.");
        }
      }
    }
}

function DoCommand(){
    if ($("#input").val() !== "") {
        //Submit the command
        var command = $("#input").val();
        runCommand(command);
        // Add command to history
        if (historyBufferEnabled) {
            if (historyBuffer[0] != command) {
                historyBuffer.unshift(command);
            }
            if (historyBuffer.length > 10) { // Ensure we have a circular history
                historyBuffer.pop();
            }
        }
        //Reset the imput field
        $("#input").val("");
    }
}

function DoUpdate(){
    //These are the top elements on the screen.
    $("#dataCount").html(formatBytes(data));
    $("#moneyCount").html("$" + DoNFormat(money));
    var per = Math.floor(100 * data / formatLargeData(storageCapacities[storages.indexOf(currStorage)]));
    $("#capac").html(per + "%");
}

function DoCheckStorage(){
    if (data <= formatLargeData(storageCapacities[storages.indexOf(currStorage)])) {
      return true;
    } else {
      return false;
    }
}

function DoFormatBytes(bytes, decimals){
    if (bytes === 0) return '0 Byte';
    var k = 1024;
    var dm = decimals + 1 || 2;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function DoFormatLargeData(str){
    var digits = str.replace(/\D/g, "");
    var letters = str.replace(/[^a-z]/gi, "");
    switch (letters) {
      case "Bytes":
        return digits*1;
      case "KB":
        return formatLargeData((digits*1024)+"Bytes");
      case "MB":
        return formatLargeData((digits*1024)+"KB");
      case "GB":
        return formatLargeData((digits*1024)+"MB");
      case "TB":
        return formatLargeData((digits*1024)+"GB");
      case "PB":
        return formatLargeData((digits*1024)+"TB");
      case "EB":
        return formatLargeData((digits*1024)+"PB");
      case "ZB":
        return formatLargeData((digits*1024)+"EB");
      case "YB":
        return formatLargeData((digits*1024)+"ZB");
    }
}

function DoAddData(amount){
    data += amount;
    update();
}

function DoAddMoney(amount){
    money += amount;
    update();
}

function DoFloor(n){
    return (Math.abs(Math.abs(n) - Math.abs(Math.floor(n))) >= 0.999999991) ? ((n >= 0) ? Math.ceil(n) : Math.floor(n)) : ((n >= 0) ? Math.floor(n) : Math.ceil(n));
}

function DoNLog(){
    return Math.log(10);
}

function DoNFormat(n,d){
    var l = (floor(Math.log(Math.abs(n)) / nLog()) <= 0) ? 0 : floor(Math.log(Math.abs(n)) / nLog()),
    p = (l % 3 === 0) ? 2 : (((l - 1) % 3 === 0) ? 1 : 0),
    r = (Math.abs(n) < 1000) ? ((typeof d === "number") ? n.toFixed(d) : floor(n)) : (floor(n / (Math.pow(10, floor(l / 3) * 3 - p))) / Math.pow(10, p));
    return (r + nArray[floor(l / 3)] + ((floor(r) === 42) ? "~" : "")) || "Infinite";
}

function DoHelp(arg){
    if (arg !== undefined){
        switch (arg){
            case "help":
                respond(arg + ": Gives list of commands or specific instructions for commands.");
                respond("To use: help, help [command]");
                break;
            case "mineData":
                respond(arg + ": Increments data by your increment amount. The default is 1 byte.");
                respond("To use: mineData");
                break;
            case "save":
                respond(arg + ": Saves files to your browser so you can load the game.");
                respond("To use: save");
                break;
            case "load":
                respond(arg + ": Reloads your saved data files.")
                respond("To use: load");
                break;
            case "autoMine":
                respond(arg + ": Every second, increments your data by the auto increment amount. Default is 1 byte per second.");
                respond("To use: autoMine");
                break;
            case "sellData":
                respond(arg + ": Converts data to money. The conversion is 1 byte for $1, but the data deteriorates during transfer.");
                respond("To use: sellData [amount with unit, 1MB, 500Bytes, 88TB, etc]");
                break;
            case "buyData":
                respond(arg + ": Converts money to data. The conversion is 1 byte for $2.");
                respond("To use: buyData [amount]");
                break;
            case "buyCommand":
                var listOfAvailable = [];
                respond(arg + ": Purchases and unlocks a command.");
                for (var b = 0; b < goals[0].length; b++) {
                    if (goals[2][b] === false) {
                        listOfAvailable.push(goals[0][b] + ": " + (formatBytes(goals[1][b])));
                    }
                }
                respond("Available commands: " + listOfAvailable.join(", "));
                respond("To use: buyCommand [command]");
                break;
            case "upgradeStorage":
                var li = [];
                for (var q = 0; q < storages.length; q++) {
                    if (q > storages.indexOf(currStorage)) {
                        li.push(storages[q] + ": " + storageCapacities[q] + " - $" + nFormat(storagePricing[q]));
                    }
                }
                respond(arg + ": Upgrades the max amount of data you can hold.");
                respond("Available upgrades: " + li.join(",    "));
                respond("To use: upgradeStorage [storage device]");
            break;
            case "currentStorage":
                respond(arg + ": Check how much data you can hold.");
                respond("To use: currentStorage");
            break;
            case "clear":
                respond(arg + ": Clears the text off the screen.");
                respond("To use: clear");
            break;
            case "upgradeMine":
                respond(arg + ": Increases your mineData increment.");
                respond("Current increment: "+formatBytes(increment)+". Next price: $"+incCost);
                respond("To use: upgradeMine");
            break;
            case "colorScheme":
                respond(arg + ": Changes the theme.");
                respond("Available themes: "+schemes.join(", "));
                respond("To use: colorScheme [scheme]");
            break;
            default:
                respond("Command not found or no help is available. Type 'help' with no arguments to see a list of commands.");
        }
    }else{
        respond("<span class='accent'>########################################</span>");
        respond("List of commands:");
        var availableCommands = [];
        //Only view commands that are available under the commandUnlocked array
        for (var r = 0; r < commandList.length; r++) {
            if (commandUnlocked[r] === true) {
                availableCommands.push(commandList[r]);
            }
        }
        respond(availableCommands.join(", "));
        respond(" ");
        respond("For specific command help type, 'help [command]'");
        respond("<span class='accent'>########################################</span>");
    }
}

function DoBuyCommand(toBuy){
    if (toBuy !== undefined) {
        //Make sure that the command exists
        var commandIndex = goals[0].indexOf(toBuy);
        if (commandIndex >= 0) {
            //Make sure there is enough data to buy the command.
            if (data >= goals[1][commandIndex]) {
                //Make sure it hasn't been unlocked already
                if (goals[2][commandIndex] !== true) {
                    //Unlock the command under the commandUnlocked array
                    commandUnlocked[commandList.indexOf(toBuy)] = true;
                    //Unlock the command so you can't buy it multiple times
                    commands.goals[2][commandIndex] = true;
                    //Spend data on unlocking this command
                    addData(commands.goals[1][commandIndex] * -1);
                    respond("Command unlocked: " + toBuy);
                } else {
                    respond("Command already unlocked.");
                }
            } else {
                respond("You don't have enough data to buy this command.");
            }
        } else {
            respond("Command not found for purchase.");
        }
    } else {
        respond("Please enter a command to buy, or type, 'help buyCommand' to see available commands.");
    }
}

function DoClearCMD(){
    respond("Clearing...");
    setTimeout(function() {
        $("#responses").html("");
    }, 1500);
}

function DoUpgradeMine(){
    if (money >= incCost){
        money -= incCost;
        increment+=1;
        respond("mineData upgraded to increment: "+increment+" for $"+Math.floor(incCost));
        incCost=Math.floor(incCost*1.50);
    }else{
        respond("Not enough money to upgrade the mineData command.");
    }
}

function DoUpgradeStorage(arg){
    if (arg !== undefined) {
        for (var r = 0; r < storages.length; r++) {
            if (storages[r] === arg) {
                if (money >= storagePricing[storages.indexOf(arg)] && storages.indexOf(arg) > storages.indexOf(currStorage)) {
                    money -= storagePricing[storages.indexOf(arg)];
                    currStorage = storages[storages.indexOf(arg)];
                    respond("Storage upgraded to " + currStorage + " with a capacity of " + storageCapacities[storages.indexOf(currStorage)]);
                } else {
                    respond("Not enough money or you may have already unlocked this storage device.");
                }
            }
        }
    } else {
        respond("Please enter an argument. For help type 'help upgradeStorage'");
    }
}

function DoMineData(){
    if (checkStorage && (data+increment)<=formatLargeData(storageCapacities[storages.indexOf(currStorage)])) {
        respond(formatBytes(increment)+ " mined.");
        addData(increment);
    }else{
        respond("Please upgrade your storage with upgradeStorage.");
    }
}

function DoAutoMine(){
    autoIncrement = 1;
    respond("Automatic mining begining at a rate of " + autoIncrement + " byte per second.");
}

function DoBuyData(args){
    Number(args);
      if (args !== undefined) {
        //1 byte cost $2
        var cost = amountToBuy * 2;
        if (money >= cost && typeof args !== "number") {
          money -= cost;
          data += Number(args);
          respond("" + args + " data bought with $" + cost + ".");
        } else {
          respond("You do not have enough money.");
        }
      } else {
        respond("Argument needed. Try: " + "buyData [amount]");
      }
}

function DoCurrentStorage(){
    respond("Your " + currStorage + " can hold " + storageCapacities[storages.indexOf(currStorage)]);
}

function DoSellData(arg){
    if (arg !== undefined) {
          arg=formatLargeData(arg);
          Number(arg);
        console.log(typeof arg + ", "+ arg);
        //You must sell at least 50, and you must have enough to sell
        if (data >= arg && data >= 50 && typeof arg === "number") {
          //Here is where we deteriorate the data. Too much? 
          var loss = Math.floor(Math.random() * 15 + 10);
          console.log(loss);
          //Apply the loss to the total money received
          var transfer = Math.round(arg * (1 - loss / 100));
          money += transfer;
          data -= arg;
          //No idea what data integrity is but it sounded right.
          respond(loss + "% data integrity lost in transfer. Data sold: " +
            arg + ". Money gained: $" + transfer + ".");
        } else {
          respond(
            "Please make sure you have enough data and are using units. Example: sellData 150Bytes, sellData 154MB, etc."
          );
        }
      } else {
        respond("Argument needed. Try: " + "sellData [amount]");
      }
}

function DoColorScheme(arg){
    if (arg !== undefined){
        arg = arg.toLowerCase();
        if (schemes.indexOf(arg) > -1){
            $('#contentWrapper').removeClass();
            $('#contentWrapper').addClass(arg);
        }else{
            respond("Invalid colorscheme.");
        }        
    }else{
        respond("Please enter an argument. For help type, 'help colorScheme'");
    }
}

function ExecuteCommand(givenCommand, arguments){
    switch(givenCommand){
        case "help":
            DoHelp(arguments);
        break;
        case "buyCommand":
            //Purchase and unlock commands
            DoBuyCommand(arguments);
        break;
        case "clear":
            //Clear the CMD
            DoClearCMD();
        break;
        case "upgradeMine":
            DoUpgradeMine();
        break;
        case "upgradeStorage":
            DoUpgradeStorage(arguments);
        break;
        case "mineData":
            DoMineData();
        break;
        case "autoMine":
            DoAutoMine()
        break;
        case "buyData":
            DoBuyData(arguments);
        break;
        case "currentStorage":
            DoCurrentStorage();
        break;
        case "sellData":
            DoSellData(arguments);
        break;
        case "colorScheme":
            DoColorScheme(arguments);
        break;
        case "save":
            DoSave();
        break;
        case "load":
            DoLoad();
        break;
    }
}

function DoLoad(){
    //Make sure that the localstorage is not corrupted (This is not perfect, you may have to clear it with a new update)
    if (localStorage.getItem("data") !== "null" && localStorage.getItem("increment") !== "null") {
        //Load save.
        data = JSON.parse(localStorage.getItem("data"));
        money = JSON.parse(localStorage.getItem("money"));
        increment = JSON.parse(localStorage.getItem("increment"));
        autoIncrement = JSON.parse(localStorage.getItem("autoIncrement"));
        commandUnlocked = JSON.parse(localStorage.getItem("unlocked"));
        goals[2] = JSON.parse(localStorage.getItem("bought"));
        currStorage = JSON.parse(localStorage.getItem("storage"));
        incCost = JSON.parse(localStorage.getItem("incCost"));
        currScheme = JSON.parse(localStorage.getItem("currScheme"));
        ExecuteCommand("colorScheme", currScheme);
        respond("Save loaded.");
    } else {
        commands.save();
        respond("No save found.");
    }
}

function DoSave(arg){
    if (typeof(Storage) !== "undefined") {
        //Store variables in local storage
        localStorage.setItem("data", JSON.stringify(data));
        localStorage.setItem("money", JSON.stringify(money));
        localStorage.setItem("increment", JSON.stringify(increment));
        localStorage.setItem("autoIncrement", JSON.stringify(autoIncrement));
        localStorage.setItem("unlocked", JSON.stringify(commandUnlocked));
        localStorage.setItem("storage", JSON.stringify(currStorage));
        localStorage.setItem("bought", JSON.stringify(goals[2]));
        localStorage.setItem("incCost", JSON.stringify(incCost));
        localStorage.setItem("currScheme", JSON.stringify(currScheme));

        //Gives the option to respond "Data saved" if you pass a variable. This is used so it doesn't output this every 10 seconds when the game is saved.
        if (arg === undefined) {
          respond("Data saved.");
        }
      } else {
        respond("Local storage is not supported on your browser.");
      }
}

function NewCMD(){
    this.money = 0;
    this.increment = 1;
    this.incCost = 2;
    this.autoIncrement = 0;
    this.historyBufferEnabled = true;
    this.historyBuffer = [];
    this.historyBufferCurrentIdx = -1;
    this.historyLastDirection = null;
    this.unit = "byte";
    this.dataShow = 0;
    this.data = 0;
    this.counter = 0;
    //Schemes. Needs different approach!
    this.schemes = ["coral", "naked", "ocean", "hacker", "fire", "mint", "invert", "default"]
    this.currScheme = "default";
    this.storages = ["selectronTube", "floppyDisk", "zipDrive", "DVD", "sdCard", "flashDrive", "SSD", "ssdArray", "serverRack", "serverRoom", "serverWarehouse", "multipleLocations", "multipleCountries", "smallAfricanCountry", "alienSpaceArray", "enslaveHumans"];
    this.storageCapacities = ["512Bytes", "1509949Bytes", "100MB", "5GB", "32GB", "512GB", "1TB", "16TB", "100TB", "1PB", "512PB", "128EB", "1ZB", "512ZB", "100000YB", "9999999999999999YB"];
    this.storagePricing = [0, 2500, 170000, 500000, 1500000, 8000000, 25000000, 75000000, 1750000000, 5250000000, 14000000000, 10000000000000, 40000000000000, 400000000000000, 3000000000000000, 9007199254740991];
    this.currStorage = "selectronTube";
    this.respond = DoRespond;
    this.gameLoop = DoGameLoop;
    this.command = DoCommand;
    this.runCommand = DoRunCommand;
    this.update = DoUpdate;
    this.checkStorage = DoCheckStorage;
    this.formatBytes = DoFormatBytes;
    this.formatLargeData = DoFormatLargeData;
    this.addData = DoAddData;
    this.addMoney = DoAddMoney;
    this.nLog = DoNLog;
    this.nArray = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "UnD", "DuD", "TrD", "QaD", "QiD", "SeD", "SpD", "OcD", "NoD", "Vi", "UnV"];
    this.floor = DoFloor;
    this.nFormat = DoNFormat;
    //Needs different approach! (All arrays)
    this.commandList = ["help", "mineData", "save", "autoMine", "sellData", "buyData", "buyCommand", "upgradeStorage", "clear", "load", "currentStorage", "upgradeMine", "colorScheme"];
    //SET EACH FUNCTION TO WHETHER IT IS UNLOCKED
    this.commandUnlocked = [true, true, true, false, false, false, true, true, true, true, true, true, false];
    this.commands = ExecuteCommand;
    this.goals = [
      ["autoMine", "buyData", "sellData", "colorScheme"],
      [20, 150, 250, 5120],
      [false, false, false, false]
    ];
    this.Manager = newManager();
    console.log(Manager.FindCommand("help"));
    return this;
}