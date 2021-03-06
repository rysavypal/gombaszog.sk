/**
 * @name		jQuery Countdown Plugin
 * @author		Martin Angelov
 * @version 	1.0
 * @url			http://tutorialzine.com/2011/12/countdown-jquery/
 * @license		MIT License
 */



$(function () {
    var currentDate = new Date,
        finished = false,
        availiableExamples = {
            set3daysFromNow: 3 * 24 * 60 * 60 * 1E3,
            set2daysFromNow: 2 * 24 * 60 * 60 * 1E3,
            set5minFromNow: 5 * 60 * 1E3,
            set1minFromNow: 1 * 60 * 1E3
        };
    var d, h, m, s;

    function callback(event) {
        var timeFormat = "%d day(s) %h:%m:%s";
        $this = $(this);
        if (finished) {
            $this.fadeTo(0, 1);
            finished = false
        }
        switch (event.type) {
        case "days":
            d = event.value;
            break;
        case "hours":
            h = event.value;
            break;
        case "minutes":
            m = event.value;
            break;
        case "seconds":
            s = event.value;
            break;
        case "finished":
            $this.fadeTo("slow",
                0.5);
            finished = true;
            break
        }
        if (d > 0) {
            timeFormat = timeFormat.replace(/\%d/, d);
            timeFormat = timeFormat.replace(/\(s\)/, Number(d) == 1 ? "" : "s")
        } else timeFormat = timeFormat.replace(/\%d day\(s\)/, "");
        timeFormat = timeFormat.replace(/\%h/, h);
        timeFormat = timeFormat.replace(/\%m/, m);
        timeFormat = timeFormat.replace(/\%s/, s);
        $(".time_days").text(d);
        $(".time_hours").text(h);
        $(".time_minutes").text(m);
        $(".time_seconds").text(s)
    }
    $("div#clock").countdown(countdown_value, callback)
});
(function ($) {
    $.fn.countdown = function (toDate, callback) {
        var handlers = ["seconds", "minutes", "hours", "days", "weeks", "daysLeft"];

        function delegate(scope, method) {
            return function () {
                return method.call(scope)
            }
        }
        return this.each(function () {
            if (!(toDate instanceof Date))
                if (String(toDate).match(/^[0-9]*$/)) toDate = new Date(toDate);
                else if (toDate.match(/([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{2,4})\s([0-9]{1,2})\:([0-9]{2})\:([0-9]{2})/) || toDate.match(/([0-9]{2,4})\/([0-9]{1,2})\/([0-9]{1,2})\s([0-9]{1,2})\:([0-9]{2})\:([0-9]{2})/)) toDate =
                new Date(toDate);
            else if (toDate.match(/([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{2,4})/) || toDate.match(/([0-9]{2,4})\/([0-9]{1,2})\/([0-9]{1,2})/)) toDate = new Date(toDate);
            else throw new Error("Doesn't seen to be a valid date object or string");
            var $this = $(this),
                values = {},
                lasting = {},
                interval = $this.data("countdownInterval"),
                currentDate = new Date,
                secondsLeft = Math.floor((toDate.valueOf() - currentDate.valueOf()) / 1E3);

            function triggerEvents() {
                if ($this.closest("html").length === 0) {
                    stop();
                    dispatchEvent("removed");
                    return
                }
                secondsLeft--;
                if (secondsLeft < 0) secondsLeft = 0;
                lasting = {
                    seconds: secondsLeft % 60,
                    minutes: Math.floor(secondsLeft / 60) % 60,
                    hours: Math.floor(secondsLeft / 60 / 60) % 24,
                    days: Math.floor(secondsLeft / 60 / 60 / 24),
                    weeks: Math.floor(secondsLeft / 60 / 60 / 24 / 7),
                    daysLeft: Math.floor(secondsLeft / 60 / 60 / 24) % 7
                };
                for (var i = 0; i < handlers.length; i++) {
                    var eventName = handlers[i];
                    if (values[eventName] != lasting[eventName]) {
                        values[eventName] = lasting[eventName];
                        dispatchEvent(eventName)
                    }
                }
                if (secondsLeft == 0) {
                    stop();
                    dispatchEvent("finished");
                    $this.html(countdown_finish)
                }
            }
            triggerEvents();

            function dispatchEvent(eventName) {
                var event = $.Event(eventName);
                event.date = new Date((new Date).valueOf() + secondsLeft);
                event.value = values[eventName] || "0";
                event.toDate = toDate;
                event.lasting = lasting;
                switch (eventName) {
                case "seconds":
                case "minutes":
                case "hours":
                    event.value = event.value < 10 ? "0" + event.value.toString() : event.value.toString();
                    break;
                default:
                    if (event.value) event.value = event.value.toString();
                    break
                }
                callback.call($this, event)
            }

            function stop() {
                clearInterval(interval)
            }

            function start() {
                $this.data("countdownInterval", setInterval(delegate($this, triggerEvents), 1E3));
                interval = $this.data("countdownInterval")
            }
            if (interval) stop();
            start()
        })
    }
})(jQuery);