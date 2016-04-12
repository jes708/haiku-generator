var fs = require('fs');
var cmudictFile = fs.readFileSync('./cmudict.txt');
var franklinFile = fs.readFileSync('./Franklin.txt');

function formatData(data) {
  
  var wordBySyllables = {},
      lines = data.toString().split("\n"),
      lineSplit,
      syllables,
      len
  lines.forEach(function(line) {
    lineSplit = line.split("  ");
    
    if (lineSplit[1]) {
      syllables = lineSplit[1].match(/\d/g);
      
      if (syllables) {
        len = syllables.length 

        if (lineSplit[0].slice(-1) !== ")") {
          buildObj(wordBySyllables, len, lineSplit[0])
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

function createHaiku(structure) {
  for (var i = 0; i < structure.length; i++) {
    console.log(
      structure[i].map(function(syllables) {
        return chooseWord(syllables);
      }).join(" ")
    )
  }
}

function haikuSearch(text) {
  var textArr = text.toString().split(/[\W|_]*\s[\W|_]*/);
  var i = randIndex(textArr);
  var dict = formatData(cmudictFile);
  var lines = [[], [], []];
  var syllablesRequired = [5, 7, 5]


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
      if (syllables > syllablesRequired[j] || !(textArr[i])) {
        syllables = 0;
        lines[j] = [];
        i = randIndex(textArr);
      }
    }
  }

  var haiku = lines.map(function(line) {
    return line.join(" ");
  }).join("\n");
  console.log(haiku);
}

console.log(createHaiku(structurer()));
console.log(haikuSearch(franklinFile));

// As a next step, let the user choose a random haiku, or a specific text, or they can type in numbers.