var ProgressBar = require('progress');
var Table = require('cli-table');
var countWords = require('./count-words');

var categories = require('./bernoulli.json');
var classify = require('./classify-bernoulli')(categories);

var matrix = {};
var bar = new ProgressBar('[:bar]', {total: 7532, width: 50});
countWords('test')
  .on('document', function(d) {
    var actualCategory = d.category;
    var reportedCategory = classify(d.words);

    matrix[actualCategory] = matrix[actualCategory] || {};
    matrix[actualCategory][reportedCategory] = matrix[actualCategory][reportedCategory] || 0;
    ++matrix[actualCategory][reportedCategory];

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
  });