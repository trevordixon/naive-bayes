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

      // Start with P(c)
      var p = Math.log(docsInCategory/totalDocs);

      if (p > max) {
        max = p;
        maxCat = cat;
      }
    }

    return maxCat;
  }
}