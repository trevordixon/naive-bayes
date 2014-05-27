var ProgressBar = require('progress');
var Table = require('cli-table');
var countWords = require('./count-words');

var classifier = process.argv[2];
if (classifier !== 'bernoulli' && classifier !== 'multinomial' && classifier !== 'baseline') {
  console.error('Argument classifier required. May be one of bernoulli, multinomial, or baseline.');
  process.exit();
}

var categories = require('./' + classifier + '.json');
var classify = require('./classify-' + classifier)(categories);

var matrix = {};
var numCorrect = 0, total = 0;
var bar = new ProgressBar('[:bar]', {total: 7532, width: 50});
countWords('test')
  .on('document', function(d) {
    var actualCategory = d.category;
    var reportedCategory = classify(d.words);

    matrix[actualCategory] = matrix[actualCategory] || {};
    matrix[actualCategory][reportedCategory] = matrix[actualCategory][reportedCategory] || 0;
    ++matrix[actualCategory][reportedCategory];

    ++total;
    if (actualCategory == reportedCategory) ++numCorrect;

    bar.tick();
  })
  .on('end', function() {
    var cats = Object.keys(categories);
    var categoryHeaders = cats.map(function(cat) {
      return cat.split('.').map(function(c) { return c[0]; }).join('.');
    });

    var table = new Table({ head: [''].concat(categoryHeaders) });

    for (var i = 0; i < cats.length; i++) {
      var rowCat = cats[i];
      var col = [];
      for (var j = 0; j < cats.length; j++) {
        var colCat = cats[j];
        col.push(matrix[rowCat][colCat] || 0);
      }
      var row = {};
      row[rowCat] = col;
      table.push(row);
    }

    console.log(table.toString());
    console.log(Math.round(numCorrect*100/total) + '% correct');
  });