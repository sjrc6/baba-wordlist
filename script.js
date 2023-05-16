/*
 * Use promise to ensure the words have been loaded before proceeding.
 * https://developers.google.com/web/fundamentals/getting-started/primers/promises
 */
function get(url) {
   // Return a new promise.
   return new Promise(function(resolve, reject) {
     // Do the usual XHR stuff
     var req = new XMLHttpRequest();
     req.open('GET', url);

     req.onload = function() {
       // This is called even on 404 etc
       // so check the status
       if (req.status == 200) {
         // Resolve the promise with the response text
         resolve(req.response);
       }
       else {
         // Otherwise reject with the status text
         // which will hopefully be a meaningful error
         reject(Error(req.statusText));
       }
     };

     // Handle network errors
     req.onerror = function() {
       reject(Error("Network Error"));
     };

     // Make the request
     req.send();
   });
 }
var NounListURL = 'https://sjrc6.github.io/baba-wordlist/resources/nouns-list.txt';
var NounListRequest = get(NounListURL)
var OperatorListURL = 'https://sjrc6.github.io/baba-wordlist/resources/operators-list.txt';
var OperatorListRequest = get(OperatorListURL)
var PropertieListURL = 'https://sjrc6.github.io/baba-wordlist/resources/properties-list.txt';
var PropertieListRequest = get(PropertieListURL)



function findWords() {
    var myLetters = document.getElementById("letters").value;

    /* Make sure all inputs are lower case */
    myLetters = myLetters.toUpperCase()
    
    /* Make sure that word list has been loaded */
    NounListRequest.then(function(response) {
      var words = response.split(/\r?\n/);  // Split on newlines
      var patterns = createPatterns('', '', '');

      var matchingWords = words.filter(function(word){
        return checkWordPossible(word, patterns, myLetters);
      })

      if (matchingWords.length == 0){
        matchingWords = ['No words found'];
      }

      html = "<p>" + matchingWords.join("</p><p>") + "</p>";
      document.getElementById("NOUNS").innerHTML = html;
    }, function(error) {
      console.error("Failed!", error);
    });

    OperatorListRequest.then(function(response) {
      var words = response.split(/\r?\n/);  // Split on newlines
      var patterns = createPatterns('', '', '');

      var matchingWords = words.filter(function(word){
        return checkWordPossible(word, patterns, myLetters);
      })

      if (matchingWords.length == 0){
        matchingWords = ['No words found'];
      }

      html = "<p>" + matchingWords.join("</p><p>") + "</p>";
      document.getElementById("OPERATORS").innerHTML = html;
    }, function(error) {
      console.error("Failed!", error);
    });

    PropertieListRequest.then(function(response) {
      var words = response.split(/\r?\n/);  // Split on newlines
      var patterns = createPatterns('', '', '');

      var matchingWords = words.filter(function(word){
        return checkWordPossible(word, patterns, myLetters);
      })

      if (matchingWords.length == 0){
        matchingWords = ['No words found'];
      }

      html = "<p>" + matchingWords.join("</p><p>") + "</p>";
      document.getElementById("PROPERTIES").innerHTML = html;
    }, function(error) {
      console.error("Failed!", error);
    });

}

/**
  * Finds regex pattern to pick out words that start with and
  * end with certain letters and have a certain length gap.
  */
function createPatterns(startsWith, endsWith, gapLength){
  var startPattern = '^' + startsWith;
  var endPattern = endsWith + '$';

  if (gapLength != ''){
    var midPattern = '.{' + gapLength + ',' + gapLength + '}';
  }
  else {
    var midPattern = '.+';
  }

  return {
    pattern: new RegExp(startPattern + midPattern + endPattern),
    startPattern: new RegExp(startPattern),
    endPattern: new RegExp(endPattern)
  };
}

function checkWordFits(word, pattern){
  var res = pattern.exec(word);
  if (res == null){
    return false;
  }
  else{
    return res[0];
  }
}

/**
  * Get none empty splits from a regex pattern applied to a word.
  */
function getNonZeroSplits(pattern, word){
  splits = word.split(pattern);
  var nonZeroSplits = splits.filter(function(split){
    return split != '';
  });
  return nonZeroSplits;
}

/**
  * Find leftover fragment after removing characters found by
  * startPattern and endPattern.
  */
function split(word, startPattern, endPattern){
  var end = getNonZeroSplits(startPattern,word)[0];
  var finalSplits = getNonZeroSplits(endPattern, end);
  var middle = finalSplits[finalSplits.length - 1];
  return middle;
}

function containedBy(part, whole){
  var isContained = true;
  for (i = 0; i < part.length; i++){
    if (whole.includes(part[i])){
      /* If the letter is in the bag, use it and move on */
      var wholeArray = [].slice.call(whole);
      index = wholeArray.indexOf(part[i]);
      if (index > -1) {
        wholeArray.splice(index, 1);
      }
      whole = wholeArray.join("");
      continue;
    }
    else{
      return false;
    }
  }
  return true
}

function checkWordPossible(word, patterns, myLetters){
  if (checkWordFits(word, patterns.pattern)){
    var neededLetters = split(word,
                      patterns.startPattern,
                      patterns.endPattern);
    return containedBy(neededLetters, myLetters);
  }
  else {
    return false;
  }
}
