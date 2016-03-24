var CMD = null;
var inputChanged = false;
var suggestionIndex = 0;
var suggestions = [];

function AutoComplete(){
    var inp = $("#input").val();
    if (inputChanged){
        //Clear array.
        suggestions = [];
        for (i=0; i<CMD.commandList.length; i++){
            //Check if the command starts with the input and see if the command is unlocked.
            if (CMD.commandList[i].lastIndexOf(inp,0) === 0 && CMD.commandUnlocked[i])
                suggestions.push(CMD.commandList[i]);
        }
    }
    $("#input").val(suggestions[suggestionIndex]);
    inputChanged = false;
}
//Had to make a seperate function. KeyPress didn't work for tab.
$("#submitForm").on('keydown', '#input', function(e) { 
  var keyCode = e.keyCode || e.which; 
  if (keyCode == 9) { 
    //Prevent jumping to next control and don't insert tab character.
    e.preventDefault();
    AutoComplete();
    //Increment the index of the next command.
    suggestionIndex++;
    //Length is not 0-indexed. So if index equals array length it's actually out of range.
    if (suggestionIndex == suggestions.length)
        suggestionIndex = 0;
  } 
});

//Check if the Enter key was pressed 
$(document).keypress(function(e) {
  //Changes were made. Reset autocomplete suggestions.
  inputChanged = true;
  suggestionIndex = 0;
  if (e.which == 13) {
    CMD.command();
    CMD.historyBufferCurrentIdx = -1; // Reset history index
    $('#cmdWindow').scrollTop($('#cmdWindow')[0].scrollHeight);
    inputChanged = true;
  }  
});

//Make the console act more like a real one by adding the arrow key up goes to the last command.
$('#input').keyup(function(e) {
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
  })

//Called when the user first enters the page. 
$(document).ready(function() {
  CMD = NewCMD();
  CMD.respond("Welcome to CMD++");
  CMD.respond("Your goal here is to mine data.");
  if (localStorage.getItem("storage") === null || localStorage.getItem("data") === null || localStorage.getItem("money") === null || localStorage.getItem("unlocked") === null) {
    CMD.runCommand("save");
  } else {
    CMD.runCommand("load");
  }

  CMD.respond("Type 'help' to get started.");
  $("#input").focus();
  CMD.gameLoop();
});