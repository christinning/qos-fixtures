const $ = require('cheerio');
const moment = require('moment-timezone');
const ical = require('ical-generator');

function toMatch(now, [homeAway, day, time, opposition, tourney]){

  let dayDatePart = day.slice(4);
  var dateTime = moment.tz(dayDatePart + " " + time, 'DD MMM h:m aa', 'Europe/London');
  let isJanuaryToMay = now.month() >= 0 && now.month() < 5;
  let seasonStartYear = isJanuaryToMay ? now.year() - 1 : now.year();
  let seasonEndYear = seasonStartYear + 1;
  let year = dateTime.month() > 4 ? seasonStartYear : seasonEndYear;

  // reparse the datetime to ensure Feb 29 is dealt with
  dateTime = moment.tz(year + " " + dayDatePart + " " + time, 'YYYY DD MMM h:m aa', 'Europe/London')
  return {against: opposition, time: dateTime, at: homeAway === 'A' ? 'A' : 'H', tournament: tourney};
}

function extractListingsFromHTML (html, now) {
  var fixtures = $('.awaydivcss , .homedivcss', html);
  var result = [];

  for(var i = 0; i < fixtures.length; i = i + 2){
    let texts = $('td',fixtures.slice(i, i+1)).map((i, e) => $(e).text().trim());
    let m = toMatch(now, texts.toArray());
    result.push(m)
  }

  return result;
}

function toICal(html, now){

  if (typeof now === 'undefined') { now = moment(); }

  var matches = extractListingsFromHTML(html, now)

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
  toMatch: toMatch
};
