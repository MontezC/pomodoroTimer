var workMillis;
var breakMillis;
var prog;
var progBreak;
var sound = new Audio("https://4b43c9dbc19dc6ee81b5634b527d8832cc934b7d.googledrive.com/host/0B205xFXTp3AmSkZqSU1pWWdWTlU/Alarm-clock-sound-short.mp3");
//setup timer
var workTimer = new(function(){
    var workStart = parseInt($('.workSet').html());
    workMillis = workStart * 60 * 1000;
    var inc = 60; //millisecond increments
    var $pomodoro;
    
    $(function() {
        $pomodoro = $('#workTimer');
        workTimer.Timer = $.timer(showTime, inc, false);
    });
    //reset the countdown
    this.resetTimer = function() {
        var newTime = parseInt($('.workSet').html()) * 60 * 1000;
        if (newTime > 0) {workMillis = newTime;}
        workTimer.Timer.stop().once();
    };
    // show time
    function showTime(){
        var timeOutput = formatTime(workMillis);
        $pomodoro.html(timeOutput);
        if (workMillis == 0){
            workTimer.Timer.stop();
            sound.play(); //replace with alarm sound
            $('#workTimer').hide();
            $('#workProg').hide();
            $('#workProg').empty();
            workTimer.resetTimer();
            $('#breakTimer').show('slow');
            breakTimer.Timer.play();
            progBreak = new ProgressBar.SemiCircle('#breakProg', {
                strokeWidth: 6,
                color: '#000',
                trailWidth: 1,
                trailColor: '#2C3E50',
                duration: breakMillis,
                svgStyle: null,
                text: {
                    value: 'BREAK',
                },
                from: {color: '#E74C3C'},
                to: {color: '#1ABC9C'},
                step: (state, prog) => {
                    prog.path.setAttribute('stroke', state.color);
                }
            });
            if ($('#breakProg').is(':hidden')) {
                $('#breakProg').show();
            }
            progBreak.animate(1.0);
            return;
        }
        workMillis -= inc;
        if (workMillis < 0) workMillis = 0;  
    }
});

var breakTimer = new(function(){
    var breakStart = parseInt($('.breakSet').html());
    breakMillis = breakStart * 60 * 1000;
    var inc = 60;
    var $pomodoroBreak;
    
    $(function() {
        $pomodoroBreak = $('#breakTimer');
        breakTimer.Timer = $.timer(showTime, inc, false);
    });
    
    //reset countdown
    this.resetTimer = function() {
        var newTime = parseInt($('.breakSet').html()) * 60 * 1000;
        if (newTime > 0) {breakMillis = newTime;}
        breakTimer.Timer.stop().once();
    };
    
    //show break time
    function showTime(){
        var timeOutput = formatTime(breakMillis);
        $pomodoroBreak.html(timeOutput);
        if (breakMillis == 0){
            breakTimer.Timer.stop();
            sound.play(); //replace with alarm sound
            $('#breakTimer').hide();
            breakTimer.resetTimer();
            $('#breakProg').hide();
            $('#breakProg').empty();
            $('#pauseTimer').hide();
            $('#workTimer').show();
            $('#startTimer').show();
            return;
        }
        breakMillis -= inc;
        if (breakMillis < 0) breakMillis = 0;
    }
});

//hide unneeded elements on load
$('#pauseTimer').hide();
$('#resumeTimer').hide();
$('#breakTimer').hide();

//set work time amount
$('#work .dec').click(function(){
    var $work = parseInt($('.workSet').html());
    
    if ($work > 1 && workTimer.Timer.isActive === false || $work > 1 && workTimer.Timer.hasOwnProperty('isActive') === false){
        $('.workSet').html($work - 1);
        workTimer.resetTimer();
    }
    else {
        $(this).prop("disabled");
    }
});
$('#work .inc').click(function(){
    var $work = parseInt($('.workSet').html());
    
    if ($work < 60 && workTimer.Timer.isActive === false || $work < 60 && workTimer.Timer.hasOwnProperty('isActive') === false){
        $('.workSet').html($work + 1);
        workTimer.resetTimer();
    }
    else {
        $(this).prop("disabled");
    }
});

//set break time amount
$('#break .dec').click(function(){
    var $break = parseInt($('.breakSet').html());
    
    if ($break > 1 && breakTimer.Timer.isActive === false || $break > 1 && breakTimer.Timer.hasOwnProperty('isActive') === false){
        $('.breakSet').html($break - 1);
        breakTimer.resetTimer();
    }
    else {
        $(this).prop("disabled");
    }
});
$('#break .inc').click(function(){
    var $break = parseInt($('.breakSet').html());
    
    if ($break < 10 && breakTimer.Timer.isActive === false || $break < 10 && breakTimer.Timer.hasOwnProperty('isActive') === false){
        $('.breakSet').html($break + 1);
        breakTimer.resetTimer();
    }
    else {
        $(this).prop("disabled");
    }
});

//start and pause button functionality 
$('#startTimer').click(function(){
    workTimer.Timer.play();
    $(this).hide();
    $('#pauseTimer').show();
    
    prog = new ProgressBar.SemiCircle('#workProg', {
            strokeWidth: 6,
            color: '#000',
            trailWidth: 1,
            trailColor: '#2C3E50',
            duration: workMillis,
            svgStyle: null,
            text: {
                value: 'SESSION',
            },
            from: {color: '#1ABC9C'},
            to: {color: '#E74C3C'},
            step: (state, prog) => {
                prog.path.setAttribute('stroke', state.color);
            }
        });
    prog.animate(1.0);
    if ($('#workProg').is(':hidden')) {
        $('#workProg').show();
    }
});
$('#pauseTimer').click(function(){
    if (workTimer.Timer.isActive === true) {
        workTimer.Timer.pause();
        prog.stop();
    }
    else if (breakTimer.Timer.isActive === true) {
        breakTimer.Timer.pause();
        progBreak.stop();
    } 
    $(this).hide();
    $('#resumeTimer').show();
});
$('#resumeTimer').click(function(){
    if ($('#breakTimer').is(':hidden')) {
        workTimer.Timer.play();
        prog.animate(1.0, {
            duration: workMillis,
        });
    }
    else if ($('#workTimer').is(':hidden')) {
        breakTimer.Timer.play();
        progBreak.animate(1.0, {
            duration: breakMillis,
        });
    }
    $(this).hide();
    $('#pauseTimer').show();
});


//functions

    //add zeros to time
    function addZeros(n, len){
        var string = '' + n;
        while (string.length < len){
            string = '0' + string;
            break;
        }
        return string;
    }

    //format the time
    function formatTime(time) {
        time = time / 10;
        var mins = parseInt(time / 6000);
        var secs = parseInt(time / 100) - (mins * 60);
        var millis = addZeros(time - (secs * 100) - (mins * 6000), 2);
        return (mins > 0 ? addZeros(mins, 2) : "00") + ":" + addZeros(secs, 2);
    }