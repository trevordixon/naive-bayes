var ProgressBar = require('progress');
var countWords = require('./count-words');

var categories = {};

var bar = new ProgressBar('[:bar]', {total: 11314, width: 50});
countWords('train')
  .on('document', function(d) {
    var cat = categories[d.category] = categories[d.category] || {count: 0, totalWords: 0, words: {}};
    ++cat.count;

    for (var w in d.words) {
      cat.words[w] = (cat.words[w] || 0) + d.words[w];
      cat.totalWords += d.words[w];
    };

    bar.tick();
  })
  .on('end', function() {
    require('fs').writeFile(__dirname + '/multinomial.json', JSON.stringify(categories, null, 2));
    console.log('\nData written to multinomial.json');
  });