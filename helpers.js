const $ = require('cheerio');
const moment = require('moment-timezone');
const ical = require('ical-generator');

function toMatch(callback, [homeAway, day, time, opposition, tourney]){

  var dateTime = moment.tz(day.slice(5) + " " + time, 'DD MMM h:m aa', 'Europe/London');
  var now = moment();
  var afterNewYear = now.month() >= 0 && now.month() < 6;
  var seasonStartYear = afterNewYear ? now.year() - 1 : now.year();
  var seasonEndYear = seasonStartYear + 1;
  var year = dateTime.month() > 4 ? seasonStartYear : seasonEndYear;
  dateTime.year(year);
  callback({against: opposition, time: dateTime, at: homeAway === 'A' ? 'A' : 'H', tournament: tourney});
}

function extractListingsFromHTML (html) {
  var fixtures = $('.awaydivcss , .homedivcss', html);
  var result = [];

  for(var i = 0; i < fixtures.length; i = i + 2){
    var texts = $('td',fixtures.slice(i, i+1)).map((i, e) => $(e).text().trim());
    toMatch((x) => result.push(x), texts.toArray());
  }

  return result;
}

function toICal(html){

  var matches = extractListingsFromHTML(html)

// Create new Calendar and set optional fields
  const cal = ical({
    domain: 'christinning.uk',
    name: 'QOS fixtures',
  });

  cal.ttl(60 * 60 * 24).name('QOS fixtures');

  matches.forEach( (m) => {
    cal.createEvent({
      start: m.time.utc(),
      end: moment(m.time).add(2, 'hour').utc(),
      timestamp: moment(),
      summary: m.at + ": " + m.against + "; " + m.tournament
    });
  })
  return cal;
}





module.exports = {
  extractListingsFromHTML: extractListingsFromHTML,
  toICal: toICal,
};
