//When the document loads
$(document).ready(function() {

  respond("Welcome to CMD++");
  respond("Your goal here is to mine data.");

  if (localStorage.getItem("CMD") === null || localStorage.getItem("commands") === null || localStorage.getItem("themes") === null || localStorage.getItem("storages") === null) {
    
    gameCommands.save();

  } else {

    gameCommands.LOAD();

  }
  respond("Type 'help' to get started.");
  $("#input").focus();
});

function GetNextUpgrade(upgradeType){
    result = null
    for (i = 0; i < Object.keys(upgradeType).length; i++){
        if (!upgradeType[Object.keys(upgradeType)[i]].unlocked){
            return upgradeType[Object.keys(upgradeType)[i]];
        }
    }
}

//Create your game commands here
var gameCommands = {

    HELP: function(toHelp) {

      //Check if help was passed with an argument or not. If it was, do the command specific help, otherwise do the command list generic help.
      if (toHelp !== undefined) {

        switch (toHelp) {
          case "HELP":
            respond(toHelp + ": Gives list of commands or specific instructions for commands.");
            respond("To use: help, help [command]");
            break;
          case "MINEDATA":
            respond(toHelp + ": Increments data by your increment amount. The default is 1 byte.");
            respond("To use: mineData");
            break;
          case "SAVE":
            respond(toHelp + ": Saves files to your browser so you can load the game.");
            respond("To use: save");
            break;
          case "LOAD":
            respond(toHelp + ": Reloads your saved data files.")
            respond("To use: load");
            break;
          case "AUTOMINE":
            respond(toHelp + ": Every second, increments your data by the auto increment amount. Default is 1 byte per second.");
            respond("To use: autoMine");
            break;
          case "SELLDATA":
            respond(toHelp + ": Converts data to money. The conversion is 1 byte for $1, but the data deteriorates during transfer.");
            respond("To use: sellData [amount with unit, 1MB, 500Bytes, 88TB, etc]");
            break;
          case "BUYDATA":
            respond(toHelp + ": Converts money to data. The conversion is 1 byte for $2.");
            respond("To use: buyData [amount]");
            break;
          case "BUYCOMMAND":
            var listOfAvailable = [];
            respond(toHelp + ": Purchases and unlocks a command.");

            Object.keys(commands).forEach(function(com){

              if (commands[com].unlocked === false) {

                listOfAvailable.push("<span class='accent'>"+commands[com].name + ":</span> " + (formatBytes(commands[com].cost)));
              
              }
            });
            respond("Available commands: " + listOfAvailable.join(", "));
            respond("To use: buyCommand [command]");
            break;
          case "UPGRADESTORAGE":
            var li = [];
            var storageLi = Object.keys(storages);

            storageLi.forEach(function(store){
                li.push("<span class='accent'>"+ store + ":</span> " + storages[store].size + " - $" + nFormat(storages[store].price));
            });

            
            respond(toHelp + ": Upgrades the max amount of data you can hold.");
            respond("Available upgrades: " + li.join(",    "));
            respond("To use: upgradeStorage [storage device]");
            break;
          case "CURRENTSTORAGE":
            respond(toHelp + ": Check how much data you can hold.");
            respond("To use: currentStorage");
            break;
          case "CLEAR":
            respond(toHelp + ": Clears the text off the screen.");
            respond("To use: clear");
            break;
          case "UPGRADEMINE":
            respond(toHelp + ": Increases your mineData increment.");
            respond("Current increment: "+formatBytes(CMD.increment)+". Next price: $"+CMD.incCost);
            respond("To use: upgradeMine");
          break;
          case "COLORSCHEME":
            respond(toHelp + ": Changes the theme.");
            respond("Available themes: "+Object.keys(themes).join(", "));
            respond("To use: colorScheme [scheme]");
          break;
          case "HARDWARESHOP":
            respond(toHelp + ": Buy upgrades for your computer.");
            respond("Available arguments:");
            var cpuPrice = GetNextUpgrade(upgrades.CPU);
            var ramPrice = GetNextUpgrade(upgrades.RAM);
            respond("BuyCPU: " + ((cpuPrice != null) ? "$" + cpuPrice.price : "fully upgraded") + ", BuyRAM: " + ((ramPrice != null) ? "$" + ramPrice.price : "fully upgraded"));
            respond("CPU increases the speed of autoMine, RAM increases the amount of data mined by autoMine");
          break;
          default:
            respond("Command not found or no help is available. Type 'help' with no arguments to see a list of commands.");
        }
      } else {
        respond("<span class='accent'>########################################</span>");
        respond("List of commands:");
        var availableCommands = [];
        //Only view commands that are available under the CMD.commandUnlocked array

        Object.keys(commands).forEach(function(obj){
        	if(commands[obj].unlocked){
            	availableCommands.push(commands[obj].name); 
        	}
        });

        respond(availableCommands.join(", "));
        respond(" ");
        respond("For specific command help type, 'help [command]'");
        respond("<span class='accent'>########################################</span>");
      }},

CLEAR: function(){
	respond("Clearing...")
	setTimeout(function() {
		$("#responses").html("");
	}, 1500);
},

BUYCOMMAND: function(toBuy) {

  if (toBuy !== undefined) {

    //Make sure that the command exists
    if (commands[toBuy] !== undefined) {

      //Make sure there is enough data to buy the command.
      if (CMD.data >= commands[toBuy].cost) {

        //Make sure it hasn't been unlocked already
        if (commands[toBuy].unlocked !== true) {

          //Unlock the command under the CMD.commandUnlocked array
          commands[toBuy].unlocked = true;
          //Spend data on unlocking this command
          addData(commands[toBuy].cost * -1);
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

  }},

UPGRADEMINE: function(){

  if(CMD.money>=CMD.incCost){

    CMD.money-=CMD.incCost;
    CMD.increment+=1;
    respond("mineData upgraded to increment: "+CMD.increment+" for $"+Math.floor(CMD.incCost));
    CMD.incCost=Math.floor(CMD.incCost*1.50);

  }else{

    respond("Not enough money to upgrade the mineData command.");

	}
},

MINEDATA: function() {

  if (checkStorage()&&(CMD.data+CMD.increment)<=formatLargeData(storages[CMD.currentStorage].size)) {

    respond(formatBytes(CMD.increment)+ " mined.");
    addData(CMD.increment);

  } else {

    CMD.respond("Please upgrade your storage with upgradeStorage.");

  }},

BUYDATA: function(amountToBuy) {

  //For some reason the amount to buy was turning into a string, so I added Number() to convert it back
  Number(amountToBuy);

  if (amountToBuy !== undefined) {

    //1 byte cost $2
    var cost = amountToBuy * 2;

    if (CMD.money >= cost && typeof amountToBuy !== "number") {

      CMD.money -= cost;
      CMD.data += Number(amountToBuy);
      respond("" + amountToBuy + " data bought with $" + cost + ".");

    } else {

      respond("You do not have enough money.");

    }
  } else {

    respond("Argument needed. Try: " + "buyData [amount]");

  }
},

SELLDATA: function(amount) {

  if (amount !== undefined) {

      amount=formatLargeData(amount);
      Number(amount);
    console.log(typeof amount + ", "+ amount);

    //You must sell at least 50, and you must have enough to sell
    if (CMD.data >= amount && CMD.data >= 50 && typeof amount === "number") {

      //Here is where we deteriorate the data. Too much? 
      var loss = Math.floor(Math.random() * 15 + 10);
      console.log(loss);
      //Apply the loss to the total money received
      var transfer = Math.round(amount * (1 - loss / 100));
      CMD.money += transfer;
      CMD.data -= amount;
      //No idea what data integrity is but it sounded right.
      respond(loss + "% data integrity lost in transfer. Data sold: " +
        amount + ". Money gained: $" + transfer + ".");

    } else {

      respond("Please make sure you have enough data and are using units. Example: sellData 150Bytes, sellData 154MB, etc.");

    }
  } else {

    respond("Argument needed. Try: " + "sellData [amount]");

  }
},

CURRENTSTORAGE: function() {

  respond("Your " + CMD.currentStorage + " can hold " + storages[CMD.currentStorage].size);

},

AUTOMINE: function() {
  CMD.autoIncrement = 1;
  respond("Automatic mining begining at a rate of " + CMD.autoIncrement + " byte per second.");
  SetAutoMineAmount();
  IntervalHandler.removeInterval("autoMine");
  IntervalHandler.addInterval("autoMine",AutoMineTick, GetAutoMineSpeed());
},

UPGRADESTORAGE: function(toUpgrade) {
  if (toUpgrade !== undefined) {
    Object.keys(storages).forEach(function(obj){
      if (storages[obj].name === toUpgrade) {
        if (CMD.money >= storages[obj].price) {
          CMD.money -= storages[obj].price;
          CMD.currentStorage = storages[obj].name;
          respond("Storage upgraded to " + CMD.currentStorage + " with a capacity of " + storages[obj].size);
        } else {
          respond("Not enough money or you may have already unlocked this storage device.");
        }
      }
	});
  } else {
    respond("Please enter an argument. For help type 'help upgradeStorage'");
  }
},

LOAD: function() {

  //Make sure that the localstorage is not corrupted (This is not perfect, you may have to clear it with a new update)
  if (localStorage.getItem("CMD") !== "null" && localStorage.getItem("commands") !== "null") {

    //Load save.
    CMD = JSON.parse(localStorage.getItem("CMD"));
    commands = JSON.parse(localStorage.getItem("commands"));
    if (commands.AUTOMINE.unlocked){
        // respond("autoMine is unlocked");
    }else{
        // respond(GetAutoMineSpeed());
        // respond("autoMine is NOT unlocked!!");
    }
    themes = JSON.parse(localStorage.getItem("themes"));
    storages = JSON.parse(localStorage.getItem("storages"));
    respond("Save loaded.");
    gameCommands.COLORSCHEME(CMD.currScheme);
  
  } else {

    CMD.commands.save();
    respond("No save found.");

  }
},

SAVE: function(respondSave) {

  if (typeof(Storage) !== "undefined") {

    //Store variables in local storage
    localStorage.setItem("CMD", JSON.stringify(CMD));
    localStorage.setItem("commands", JSON.stringify(commands));
    localStorage.setItem("themes", JSON.stringify(themes));
    localStorage.setItem("storages", JSON.stringify(storages));

    //Gives the option to respond "Data saved" if you pass a variable. This is used so it doesn't output this every 10 seconds when the game is saved.
    if (respondSave === undefined) {

      respond("Data saved.");

    }
  } else {

    respond("Local storage is not supported on your browser.");

  }
},

COLORSCHEME: function(theme){

    if(theme !== undefined){

        var schemes = Object.keys(themes);

        schemes.forEach(function(q){

            if(theme===q){

                var accent = themes[q].accent;
                $("#"+CMD.currScheme).remove();
                $("head").append("<link id='"+theme+"' rel='stylesheet' href='css/themes/" + theme + ".css' />");
                $("head").append("<style>.accent{color:"+accent+";}#input{border-top:1px solid "+accent+";}</style>");
                CMD.currScheme=theme;
                respond("Scheme changed to "+theme);
            }

        });
    }else{

        respond("Please enter an argument. For a list of schemes type, 'help colorScheme'");
    
    }
},
HARDWARESHOP: function(toBuy){
    
    if (toBuy !== undefined){
        var upgradeType = null;
        switch (toBuy){
            case "BUYCPU":
                upgradeType = upgrades.CPU;
            break;
            case "BUYRAM":
                upgradeType = upgrades.RAM;
            break;
            
        }
        var upgrade = GetNextUpgrade(upgradeType);
        console.log("im here");
        if (upgradeType == null){
            respond("Unknown arguement. For a list of arguments type, 'help hardwareShop'");
            return;
        }else if(upgrade == null){
            respond("No new upgrade available");
        }
        if (CMD.money >= upgrade.price){
            addMoney(upgrade.price*-1);
            upgrade.unlocked = true;
            //only perform this code if automine is running!
            if (CMD.autoIncrement > 0){
                //Calculate automine tick value in case of RAM upgrade.
                SetAutoMineAmount();
                //reset interval with new speed in case op CPU upgrade.
                IntervalHandler.removeInterval("autoMine");
                IntervalHandler.addInterval("autoMine",AutoMineTick, GetAutoMineSpeed());                
            }
        }else{
            respond("You don't have enough money to buy this upgrade.")
        }
    }else{
        respond("Please enter an argument. For a list of arguments type, 'help hardwareShop'");
    }
}
}