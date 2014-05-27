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
      var cWords = categories[cat].words;

      // Start with P(c)
      var p = Math.log(docsInCategory/totalDocs);

      // For each word, multiply by P(word|c)
      for (var word in words) {
        var docsThatContainWord = cWords[word] || 0;

        /*
          "Laplacian correction" here. (From http://www.cs.nyu.edu/faculty/davise/ai/bayesText.html)

            Let CW be the number of documents in C that contain at least one occurrence of W. 
            Let V be the number of different words in D. 
            Let |C| be the number of documents in the category C. 
            Then estimate Prob(W|C) as (1+CW)/(|C|+V).
           
          I'm not sure, but I think this counts as "smoothing" as mentioned in the requirements.
        */
        p += Math.log((docsThatContainWord+1) / (docsInCategory+wordsInDocument));
      }

      if (p > max) {
        max = p;
        maxCat = cat;
      }
    }

    return maxCat;
  }
}