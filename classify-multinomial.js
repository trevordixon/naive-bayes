module.exports = function makeClassifier(categories) {
  // Total number of documents in all categories
  var totalDocs = 0;
  for (var cat in categories) {
    totalDocs += categories[cat].count;
  }

  return function classify(words) {
    var wordsInDocument = Object.keys(words).length;

    var maxCat, max = -Infinity;
    for (var cat in categories) {
      var docsInCategory = categories[cat].count;

      // Words in this category
      var totalWords = categories[cat].totalWords;
      var cWords = categories[cat].words;

      // Start with P(c)
      var p = Math.log(docsInCategory/totalDocs);

      // For each word, multiply by P(word|c)
      for (var word in words) {
        var timesWordOccurs = cWords[word] || 0;

        /*
          "Laplacian correction" here. (From http://www.cs.nyu.edu/faculty/davise/ai/bayesText.html)

          Let CW be the total number of occurrences of word W in documents of category C.
          Let V be the number of different words in D. 
          Let |C| be the sum of the lengths of all the documents in the category C. 
          Then estimate Prob(W|C) as (1+CW)/(|C|+V). 
           
          I'm not sure, but I think this counts as "smoothing" as mentioned in the requirements.
        */
        p += Math.log(Math.pow((timesWordOccurs+1) / (totalWords+wordsInDocument), words[word]));
      }

      if (p > max) {
        max = p;
        maxCat = cat;
      }
    }

    return maxCat;
  }
}