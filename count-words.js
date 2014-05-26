var fs = require('fs');
var zlib = require('zlib');
var tar = require('tar');
var split = require('split');
var EventEmitter = require('events').EventEmitter;

var commonWords = require('./common-words');

function countWords(collection) {
  var emitter = new EventEmitter();

  // Load documents straight out of .tar.gz files
  var stream = fs.createReadStream(__dirname + '/' + collection + '.tar.gz').pipe(zlib.createGunzip()).pipe(tar.Parse());

  // Gets called for each file or directory
  stream.on('entry', function (e) {
    // If it tells us about a directory, ignore. (type 0 is file, 5 is folder)
    if (e.props.type !== '0') return;

    // e.props.path looks like 20news-bydate-test/alt.atheism/53068
    // Split by / and the second element is the category
    var category = e.props.path.split('/')[1];
    var words = {};

    // Split file into words
    e = e.pipe(split(/[^a-zA-Z]/));

    e.on('data', function (c) {
      // Ignore short words
      if (c.length < 3) return;

      c = c.toString().toLowerCase();

      // Ignore common words
      if (c in commonWords) return;

      // Add or increase count for word
      words[c] = (words[c] || 0) + 1;
    });

    e.on('end', function () {
      emitter.emit('document', {category: category, words: words});
    });
  });

  stream.on('end', function() { emitter.emit('end'); });

  return emitter;
}

module.exports = countWords;