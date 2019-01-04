var assert = require('assert');
var fs = require('fs');
var moment = require('moment-timezone')

const {extractListingsFromHTML, toICal} = require(__dirname+'/../helpers');

var html;
fs.readFile(__dirname + '/data.html', 'utf8', function (err, data) {
  if (err) {
    throw err;
  }
  html = data;
});


describe('Extract match objects', function () {

  it('returns one object per match ', function(){
    assert.strictEqual(extractListingsFromHTML(html).length, 45);
  });

  it('a match object created', function(){
    var matches = extractListingsFromHTML(html);

    var firstMatch = matches[0];

    assert.strictEqual(firstMatch.time.tz('Europe/London').toString(),
        moment("30 Jun 2018 2:00 PM", 'DD MMM YYYY h:mm a').tz('Europe/London').toString());
    assert.strictEqual(firstMatch.at, "A");
    assert.strictEqual(firstMatch.tournament, "Friendly");
    assert.strictEqual(firstMatch.against, "Annan Athletic");

    var lastMatch = matches[matches.length - 1];

    assert(moment("04/5/19 3:00 PM", 'DD/MM/YY h:mm a').isSame(lastMatch.time));
    assert.strictEqual(lastMatch.at, "H");
    assert.strictEqual(lastMatch.tournament, "Ladbrokes Championship");
    assert.strictEqual(lastMatch.against, "Partick Thistle");
  });

  it('create an ical', function() {
    var cal = toICal(html);


    var e = cal.events()[0];


    assert.strictEqual(e.summary(), "A: Annan Athletic; Friendly");
  });
})