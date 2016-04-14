var fs = require('fs');
var cmudictFile = customFile('cmudict.txt');
var franklinFile = customFile('Franklin.txt');

function customFile(file) {
  return fs.readFileSync('./texts/' + file);
}

function formatData(data) {
  
  var wordBySyllables = {},
      lines = data.toString().split("\n");
  lines.forEach(function(line) {
    var lineSplit = line.split("  ");
    
    if (lineSplit[1]) {
      var syllables = lineSplit[1].match(/\d/g);
      
      if (syllables) {
        var len = syllables.length 

        if (lineSplit[0].slice(-1) !== ")") {
          buildObj(wordBySyllables, len, lineSplit[0]);
        }
      }
    }
  });
  return wordBySyllables;
}

function buildObj(obj, prop, val) {
  if (obj.hasOwnProperty(prop)) {
    obj[prop].push(val);
  } else {
    obj[prop] = [val];
  }  
}

function randSumTo(num) {
  var result = [];

  var recursion = function(num) {
    if (num !== 0) {
      var randNum = Math.ceil(Math.random() * num)
      result.push(randNum);
      recursion(num - randNum);
    }
  }

  recursion(num);
  return result;
}

function chooseWord(syllables) {
  var options = formatData(cmudictFile)[syllables];
  return options[randIndex(options)];
}

function randIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

function structurer() {
  return [randSumTo(5), randSumTo(7), randSumTo(5)];
}

function chooseStructure(numString) {
  var nums = numString.split("").map(Number);
  var lines = [[], [], []];
  var syllablesRequired = [5, 7, 5]
  var enoughNums = nums.reduce(function(sum, num) {
        return sum + num;
      }, 0)

  for (var j = 0; j < 3; j++) {
    var syllables = 0;

    while (syllables !== syllablesRequired[j]) {
      lines[j].push(nums.shift());
      syllables = lines[j].reduce(function(sum, num) {
        return sum + num;
      }, 0)
      if (enoughNums !== 17 || syllables > syllablesRequired[j]) {
        console.log("These numbers won't work\nDue to bad syllable math.\nPlease type something else:")
        return "";
      }
    }
  }
  return lines;
}

function dictHaiku(structure) {
  for (var i = 0; i < structure.length; i++) {
    console.log(
      structure[i].map(function(syllables) {
        return chooseWord(syllables);
      }).join(" ")
    )
  }{}
}

function haikuSearch(text) {
  var textArr = text.toString().split(/[\W|_]*\s[\W|_]*/);
  var i = randIndex(textArr);
  var dict = formatData(cmudictFile);
  var lines = [[], [], []];
  var syllablesRequired = [5, 7, 5]
  var iterations = 0
  var maxIterations = 500;


  for (var j = 0; j < 3; j++) {
    var syllables = 0;

    while (syllables !== syllablesRequired[j]) {
      for (var prop in dict) {
        if (dict[prop].indexOf(textArr[i].toUpperCase()) !== -1) {
          lines[j].push(textArr[i]);
          var syllablesToAdd = Number(prop);
          syllables += syllablesToAdd;
          break;
        }
      }
      i++
      iterations++
      if (syllables > syllablesRequired[j] || !(textArr[i])) {
        syllables = 0;
        lines[j] = [];
        i = randIndex(textArr);
      } else if (iterations > maxIterations){
        console.log("Let's try something else.\nI could not find a haiku\nIn the text you gave.");
        return 'error';
      }
    }
  }

  var haiku = lines.map(function(line) {
    return line.join(" ");
  }).join("\n");
  console.log(haiku);
}

function createHaiku(structureOrText) {
  var result;
  if (Array.isArray(structureOrText)) {
    dictHaiku(structureOrText); 
  } else if (typeof(structureOrText) === 'object'){
    result = haikuSearch(structureOrText);
  }
  if (typeof(structureOrText) !== 'string' && result !== 'error')
  setTimeout( function() {
    console.log("\nWhat a great haiku!\nYou should become a poet.\nWho's our next author?");
  }, 2000);
}

function optionsHelp() {
  console.log("-CMU\n-(Type numbers without spaces to define structure, ie: 575 or 23345)\n-Ben Franklin\n-(Choose a text file from the texts folder, ie: King James.txt)\n-Help\n-Quit")
}

console.log("Welcome to Haiku!\nLet's create a haiku now.\nHere are your options:");
  optionsHelp();
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  process.stdin.on('data', function (text) {
    text = text.trim();
    if (text.toUpperCase() === 'CMU') {
      createHaiku(structurer());
    } else if (!isNaN(Number(text))) { 
      createHaiku(chooseStructure(text))
    } else if (text.toLowerCase() === 'ben franklin') {
      createHaiku(franklinFile);
    } else if (text.toLowerCase() === 'help') {
      console.log("I heard you need help.\nI hope you find this helpful.\nSelect an option:");
      optionsHelp();
    } else if (text.toLowerCase() === 'quit') {
      console.log("Thank you for playing.\nIt was fun making haikus.\nPlease play again soon!")
      process.exit();
    } else {

      fs.stat('./texts/' + text, function(err, stat) {
        if (err) {
          console.log("I don't understand\nPerhaps you made a typo?\nPlease type something else:");
        } else {
          createHaiku(customFile(text));
        }
      });
    }
  });