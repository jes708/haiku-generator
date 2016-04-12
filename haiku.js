var fs = require('fs');
var cmudictFile = fs.readFileSync('./cmudict.txt');

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
          if (wordBySyllables.hasOwnProperty(len)) {
            wordBySyllables[len].push(lineSplit[0]);
          } else {
            wordBySyllables[len] = [lineSplit[0]];
          }
        }
      }
    }
  });
  return wordBySyllables;
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
  return options[Math.floor(Math.random() * options.length)];
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

console.log(createHaiku(structurer()));