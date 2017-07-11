'use strict';

module.exports = function(com, lowerCase=true) {
  if(lowerCase) com = com.toLowerCase();
  let output = [];
  let words = com.split(' ');
  let inQuotes = false;
  let currentSegment = 0;
  let hasPushed = false;

  for(let i = 0; i < words.length; i++) {
    hasPushed = false;
    let word = words[i];
    let cleanedWord = word.trim().replace(/\"/g, '').replace(/\'/g, '');
    if(word.indexOf('"') !== -1 || word.indexOf("'") !== -1) {
      if(word.startsWith('"') || word.startsWith("'")){
        //start the segment
        currentSegment = output.length;
        inQuotes = true;
        output[currentSegment] = [];
        output[currentSegment].push(cleanedWord);
        hasPushed = true;
      }

      if(word.endsWith('"') || word.endsWith("'")){
        //finish the segment
        if(!hasPushed) output[currentSegment].push(cleanedWord);
        output[currentSegment] = output[currentSegment].join(' ');
        inQuotes = false;
      }
    } else {
      if (inQuotes) {
        output[currentSegment].push(cleanedWord);
      } else {
        output.push(cleanedWord);
      }
    }
  }

  return output;
};
