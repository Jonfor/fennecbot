var repeat = require("repeat");

var LOGTAG = "Tablet Tuesday:";

var TUESDAY = 2; // 0 is Sunday, via Date.prototype.getDay().

var MESSAGE = "Have you tested on tablet recently? Did you know that today " +
    "is Tablet Tuesday? You should give it a shot!";

var bot, channels;

function start(bot, channels) {
  var millisUntilTuesday, now;

  // TODO: I'm a bad and lazy programmer.
  global.bot = bot;
  global.channels = channels;

  now = new Date();
  millisUntilTuesday = getMillisUntilDayOfWeek(TUESDAY, now);

  if (now.getDay() == TUESDAY) {
    console.log(LOGTAG, "Initial start on",
        new Date(now.getTime() + 60000));

    setTimeout(startTabletTuesday, 60000);
  }
  else {
    console.log(LOGTAG, "Initial start on",
        new Date(now.getTime() + millisUntilTuesday));
  }
  repeat(startTabletTuesday)
    .every(24 * 7, "hours")
    .start.in(millisUntilTuesday, "ms")
    .then(function () {}, function () {}, function () {
      log("Begin");
    });
}

function timeTillTomorrow() {
  var now = new Date();
  var tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0 /* hours */,
    0 /* minutes */,
    0 /* seconds */,
    0 /* millis */);
  return tomorrow.getTime() - now.getTime();
}

function startTabletTuesday() {
  // Make a random interval between 120 and 240 minutes (2 and 4 hours).
  var max = 240;
  var min = 120;
  var repeatInterval = Math.random() * (max - min) + min;
  var timeLeft = timeTillTomorrow();
  repeat(sayTabletTuesday)
    .every(repeatInterval, "minutes")
    .for(timeLeft, "ms")
    .start.now()
    .then(function () {
      log("Fin");
    }, function () {}, function () {
      log("Tick");
    });
}

function sayTabletTuesday() {
  global.channels.forEach(function (channel) {
    global.bot.say(channel, MESSAGE);
  });
}

/**
 * Returns millis until 00:00 of the given day of the week where Sunday is 0.
 * If today is the given day of the week but that time has passed, the millis
 * until next week's date will be returned.
 */
function getMillisUntilDayOfWeek(targetDayOfWeek, now) {
  var targetDate;

  if (now.getDay() >= targetDayOfWeek) {
    targetDayOfWeek += 7;
  }

  targetDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + (targetDayOfWeek - now.getDay()),
      0 /* hours */,
      0 /* minutes */,
      0 /* seconds */,
      0 /* millis */);
  return targetDate.getTime() - now.getTime();
}

function log() {
  var args = Array.prototype.slice.call(arguments, 0);
  console.log(LOGTAG, args.join(" "), "("+ new Date() + ")");
}

// TODO: JANE, STOP THIS CRAZY THING!
exports.start = start;
