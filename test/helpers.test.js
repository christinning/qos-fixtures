var assert = require('assert');
var fs = require('fs');
var moment = require('moment-timezone')

const {extractListingsFromHTML, toICal, toMatch} = require(__dirname+'/../helpers');

let html = fs.readFileSync(__dirname + '/fixtures_20_21.html', 'utf8');
let now = moment("21 Jun 2020 2:00 PM", 'DD MMM YYYY h:mm a');

describe('Extract match objects', function () {

  it('returns one object per match ', function(){
    assert.strictEqual(extractListingsFromHTML(html, now).length, 32,
        "Now: " + now.toString() + "; Html: " + html);
  });

  it('a match object created from scrape in first half of season', function(){

    const nowBeforeNewYear = now;
    var matches = extractListingsFromHTML(html, nowBeforeNewYear);

    var firstMatch = matches[0];

    assert.strictEqual(firstMatch.time.tz('Europe/London').toString(), 'Tue Oct 06 2020 19:45:00 GMT+0100')
    assert.strictEqual(firstMatch.at, "A");
    assert.strictEqual(firstMatch.tournament, "Betfred Cup");
    assert.strictEqual(firstMatch.against, "Greenock Morton");

    var lastMatch = matches[matches.length - 1];

    assert.strictEqual(lastMatch.time.tz('Europe/London').toString(), 'Fri Apr 30 2021 19:05:00 GMT+0100');
    assert.strictEqual(lastMatch.at, "H");
    assert.strictEqual(lastMatch.tournament, "Scottish Championship");
    assert.strictEqual(lastMatch.against, "Dundee");
  });

  it('a match object created from scrape in second half of season', function(){

    const nowAfterNewYear = moment("1 Feb 2021 2:00 PM", 'DD MMM YYYY h:mm a');
    var matches = extractListingsFromHTML(html, nowAfterNewYear);

    var firstMatch = matches[0];

    assert.strictEqual(firstMatch.time.tz('Europe/London').toString(), 'Tue Oct 06 2020 19:45:00 GMT+0100')
    assert.strictEqual(firstMatch.at, "A");
    assert.strictEqual(firstMatch.tournament, "Betfred Cup");
    assert.strictEqual(firstMatch.against, "Greenock Morton");

    var lastMatch = matches[matches.length - 1];

    assert.strictEqual(lastMatch.time.tz('Europe/London').toString(), 'Fri Apr 30 2021 19:05:00 GMT+0100');
    assert.strictEqual(lastMatch.at, "H");
    assert.strictEqual(lastMatch.tournament, "Scottish Championship");
    assert.strictEqual(lastMatch.against, "Dundee");
  });

  it('handles matches on 29th Feb', function(){

    const now = moment("11 Jul 2019 2:00 PM", 'DD MMM YYYY h:mm a');
    var match = toMatch(now, ["H", "Sat, 29 Feb", "3:00 PM", "Rangers", "Friendly"]);

    assert.strictEqual(match.time.isValid(), true);

  });

  it('create an ical', function() {
    var cal = toICal(html, now);


    var e = cal.events()[0];


    assert.strictEqual(e.summary(), "A: Greenock Morton; Betfred Cup");
  });
})