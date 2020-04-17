let startDay = null;
let startHour = null;

let endDay;
let endHour;

var mouseX, mouseY;
var mouseStart;
let appointmentEl;

let appointments = [];

let dayPartheight = 35;
var timeout;
var highestId = 0;
let editable = true;

$(document).mousemove(function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
}).mouseover(); // call the handler immediately

$(document).ready(function(){
    console.log('ready');



    $(".daywrap .daypartswrap .daypart").on({
        mouseenter: function () {
            $(this).addClass('hover');
            if(startDay != null){
                $(this).addClass('selected');
            }
        },
        mouseleave: function () {
            $(this).removeClass("hover");
        }
    });

    $(".daywrap .daypartswrap .daypart").on({
        mousedown: function () {
            console.log( 'click on ' + $(this).attr('data-day') + '-' + $(this).attr('data-hour') );
            startDay = $(this).attr('data-day');
            startHour = Number($(this).attr('data-hour'));

        },
        mouseup: function () {
            console.log( 'release on ' + $(this).attr('data-day') + '-' + $(this).attr('data-hour') );
            endDay = $(this).attr('data-day');
            endHour = Number($(this).attr('data-hour'));
            checkPoints();
            removePreviewHover();

        }
    });

    $(document).on("mousedown", ".calendarwrap .appointment" , function() {
         console.log('click app');
         mouseStart = mouseY;
         appointmentEl = $(this);
         $(this).css({cursor: 'grabbing'});
         timeout = setInterval(function(){
             moveAppointment();
         }, 300);
    });

    $(document).on("mouseup", ".calendarwrap" , function() {
         console.log('release');
         clearInterval(timeout);
         $(appointmentEl).css({cursor: 'grab'});
         clearPointsMove();
    });

})

function checkPoints(){
    if(startDay == endDay){
        if(endHour < startHour){
            var x = startHour;
            startHour = endHour;
            endHour = x;
        }

        if(startHour != endHour && !(checkIsApp(startDay, Number(startHour), Number(endHour), -1)) ){
            let temp = createJsonApp();
            console.log('correct');
            drawApp(temp.id);
        }

    }
    clearPointsSet();
}

function clearPointsSet(){
    startDay = null;
    startHour = null;
    endDay = null;
    endHour = null;
}

function clearPointsMove(){
    mouseStart = null;
    appointmentEl = null;
}

function moveAppointment(){
    if(editable){
        if(mouseStart != null && appointmentEl != null){
            let appId = ($(appointmentEl).attr('id')).substring(4);
            let tempApp = getApp(appId);
            let mouseEnd = mouseStart - mouseY;

            let fakeMouseEnd = Math.round(mouseEnd / dayPartheight);
            if(editable){
                // appointments[appId].startTime -= fakeMouseEnd;
                // appointments[appId].endTime -= fakeMouseEnd;
                tempApp.startTime -= fakeMouseEnd;
                tempApp.endTime -= fakeMouseEnd;
                if(!checkIsApp(tempApp.day, tempApp.startTime, tempApp.endTime, tempApp.id)){
                    changeAppObj(tempApp);
                    changeApp(appId);
                }


            }
            console.log(appointments[appId]);

            // let currentTop = appointmentEl.offset().top;
            mouseStart = mouseStart - mouseEnd;
        }
    }
    else {
        console.log('move app does nothing')
    }



    // clearPointsMove();
}

function removePreviewHover(){
    $('.calendarwrap .daypart').each(function(index){
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
        }
    })
}

function createJsonApp(){

    let tempApp = {
        id: highestId,
        day: startDay,
        startTime: Number(startHour),
        endTime: Number(endHour),
        totalTime: Number(endHour) - Number(startHour),
        tags: '',
        type: 'looking',
        appearance: 'normal',
        answerid: -1
    };

    appointments.push(tempApp);
    highestId++;
    return tempApp;

}

function checkIsApp(day, starttime, endtime, ownId){
    let returnv = false;
    $.each(appointments, function(i, v){
        // console.log(v);
        if(v.type != 'deleted'){
            if(v.id != ownId){
                console.log('id check' + v.id + '- id in ' + ownId)
                if(v.day == day){
                    if(starttime < v.endTime && endtime > v.startTime ){
                        console.log('true')
                        returnv = true;
                        return;
                    }
                }
            }
        }

    })
    return returnv;
}

function checkHasWorktime(day, starttime, endtime, idcheck){
    let returnv = false;
    $.each(appointments, function(i, v){
        // console.log(v);
        if(v.type == 'worktime'){
            if(v.answerid != idcheck){
                console.log('id check' + v.id + '- id in ' + idcheck)
                if(v.day == day){
                    if(starttime < v.endTime && endtime > v.startTime ){
                        console.log('true')
                        returnv = true;
                        return;
                    }
                }
            }
        }

    })
    return returnv;
}

function getAppIdOverlap(day, starttime, endtime, ownId){
    let returnv = -1;
    $.each(appointments, function(i, v){
        // console.log(v);
        if(v.type != 'deleted'){
            if(v.id != ownId){
                console.log('id check' + v.id + '- id in ' + ownId)
                if(v.day == day){
                    if(starttime < v.endTime && endtime > v.startTime ){
                        returnv = v.id;
                        return;
                    }
                }
            }
        }

    })
    return returnv;
}


function drawApp(appId){
    let tempApp = getApp(appId);
    console.log(editable);
    if(editable == true){
        let height = tempApp.totalTime * dayPartheight;
        let left;
        let top;
        left = $('#' + tempApp.day + (tempApp.startTime).toString()).offset().left;
        top = $('#' + tempApp.day  + (tempApp.startTime).toString()).offset().top;

        let btn = '<button onclick="changeAppData(' + appId + ')">EDIT</button>'
        $('.calendarwrap').append('<div id="app_' + tempApp.id + '" style="top: ' + ( top + 0) + '; left: '+ left +'; height: ' + height +'px;" class="appointment"><p> ' + tempApp.startTime + ':00 - ' + tempApp.endTime + ':00 </p><p>' +  tempApp.totalTime + ':00</p>' + btn + '</div>');
        calcWorktime();
        console.log('draw app normal')
    }
    else if(tempApp.type == 'worktime'){

        let height = tempApp.totalTime * dayPartheight;
        let left;
        let top;
        left = $('#' + tempApp.day + (tempApp.startTime).toString()).offset().left;
        top = $('#' + tempApp.day  + (tempApp.startTime).toString()).offset().top;
        let btns = '<div class="worktimeanswer"><button class="accept" onclick="worktimeAnswer(0, ' + appId + ')">+</button>';
        btns += '<button class="info" onclick="worktimeinfo(' + appId + ')">?</button>';
        btns += '<button class="decline" onclick="worktimeAnswer(1, ' + appId + ')">-</button></div>';

        $('.calendarwrap').append('<div id="app_' + tempApp.id + '" style="top: ' + ( top + 0) + '; left: '+ left +'; height: ' + height +'px;" class="appointment answer"><p> ' + tempApp.startTime + ':00 - ' + tempApp.endTime + ':00 </p><p>' +  tempApp.totalTime + ':00</p>' + btns + ' </div>');


    }

}

function changeApp(appId){
    let tempApp = getApp(appId);

    if(tempApp.type == 'deleted'){
        $('#app_' + appId).remove();
    }
    else{

        if(tempApp.startTime < 0){
            appointments[appId].startTime = 0;
            appointments[appId].endTime = 0 + tempApp.totalTime;

        }
        else if(tempApp.endTime > 24){
            appointments[appId].endTime = 24;
            appointments[appId].startTime = 24 - tempApp.totalTime;

        }

        height = tempApp.totalTime * dayPartheight;
            let left;
            let top;
            left = $('#' + tempApp.day + (tempApp.startTime).toString()).offset().left;
            top = $('#' + tempApp.day  + (tempApp.startTime).toString()).offset().top;
            let btn = '<button onclick="changeAppData(' + appId + ')">EDIT</button>'


            $('#app_' + appId).empty();

            if(tempApp.type == 'worktime'){
                if(tempApp.appearance == 'accepted'){

                    $('#app_' + appId).addClass('accepted');
                    let btns = '<div class="worktimeanswer"><button class="info" onclick="worktimeinfo(' + appId + ')">?</button></div>';

                    $('#app_' + appId).append('<p> ' + tempApp.startTime + ':00 - ' + tempApp.endTime + ':00 </p><p>' +  tempApp.totalTime + ':00</p>' + btns)


                }
                else if(tempApp.appearance == 'declined'){

                    $('#app_' + appId).remove();

                }
            }
            else{

                if(tempApp.appearance == 'locked'){
                    console.log('in locked')
                    $('#app_' + appId).css({top: top}).css({height: height});
                    if(tempApp.type != 'busy'){
                        $('#app_' + appId).removeClass('busy');
                    }
                    else{
                        $('#app_' + appId).addClass('busy');
                    }

                    if(tempApp.type == 'looking'){
                        $('#app_' + appId).addClass('locked');
                    }
                }
                else if(tempApp.type != 'deleted'){
                    $('#app_' + appId).append('<p> ' + tempApp.startTime + ':00 - ' + tempApp.endTime + ':00 </p><p>' +  tempApp.totalTime + ':00</p>' + btn)
                    $('#app_' + appId).css({top: top}).css({height: height});
                    $('#app_' + appId).removeClass('locked');


                    if(tempApp.type != 'busy'){
                        $('#app_' + appId).removeClass('busy');
                    }
                    else{
                        $('#app_' + appId).addClass('busy');
                    }

                    if(tempApp.type == 'worktime'){

                    }
                }
                else {

                }

            }



    }

    calcWorktime();

}

function changeAppData(appId){
    let tempApp = getApp(appId);
    let check = '';
    if(tempApp.type != 'deleted' || tempApp.type != 'busy'){
        check = 'checked';
    }
    let popup = '<div id="popup" class="popup">'
    popup += '<p>Werktijd aanpassen</p>'
    popup += '<label>Begintijd</label></br><input min="0" max="24" id="popupStarttime" type="number" value="' + tempApp.startTime +'"></br>'
    popup += '<label>Eindtijd</label></br><input min="0" max="24" id="popupEndtime" type="number" value="' + tempApp.endTime +'"></br>'
    popup += '<label>Beschikbaar</label></br><input type="checkbox" id="available" '+ check +'></br>'
    popup += '<button onclick="confirmAppData(' + appId + ')">Confirm</button>'
    popup += '<button onclick="deleteApp(' + appId + ')">Delete</button>'
    popup += '<button onclick="closePopUp()">Close</button>'
    popup += '</div>'
    $('.popupcontainer').css({display: 'flex'}).append(popup);
}

function closePopUp(){
    $('.popup').remove();
    $('.popupcontainer').css({display: 'none'});
}

function getApp(appId){
    let returnv = null;
    $.each(appointments, function(i, v){
        // console.log(v);
        if(v.id == appId){
            returnv = v;
            return;
        }

    })
    return returnv;
}

function confirmAppData(appId){
    let tempApp = getApp(appId);
    tempApp.startTime = $('#popupStarttime').val();
    tempApp.endTime = $('#popupEndtime').val();
    tempApp.totalTime = tempApp.endTime - tempApp.startTime;
    if ($('#available').is(":checked"))
    {
        tempApp.type = 'looking';
    }
    else{
        tempApp.type = 'busy';
    }
    console.log(tempApp);
    changeAppObj(tempApp);
    closePopUp();
    changeApp(appId);
}

function deleteApp(appId){
    let tempApp = getApp(appId);
    tempApp.type = 'deleted';

    changeAppObj(tempApp);
    closePopUp();
    changeApp(appId);
}

function changeAppObj(tempApp){
    $.each(appointments, function(i, v){
        // console.log(v);
        if(v.id == tempApp.id){
            v = tempApp;
        }

    })
}

function calcWorktime(){
    let workTime = 0;
    $.each(appointments, function(i, v){
        if(v.type != 'deleted' || v.type != 'busy'){
            if(editable){
                if(v.type == 'looking'){
                    workTime += v.totalTime;

                }
            }
            else{
                if(v.type == 'worktime'){
                    workTime += v.totalTime;

                }
            }
        }
    })

    $('#worktime').empty().append('<label>Totale werkweek</label><h2>' +  workTime + ' uren</h2>')
}

function generateWorkweek(){
    if(editable){
        editable = false;
        $.each(appointments, function(i, v){
            if(v.type != 'busy' || v.type != 'deleted'){
                v.appearance = 'locked';
                changeApp(v.id);
            }
        })

        $.each(appointments, function(i, v){
            if(v.type != 'busy' && v.type != 'deleted' && v.type != 'worktime' ){

                console.log('before generate work time')
                let tempWorktime = generateWorktime(v);

                if(tempWorktime != null){

                    if(!checkHasWorktime(v.day, v.startTime, v.endTime, v.id)){

                        if(!checkIsApp(v.day, v.startTime, v.endTime, v.id)){
                            appointments.push(tempWorktime);
                            console.log('made worktime')
                            highestId++;
                            drawApp(tempWorktime.id);
                        }
                        else{
                            otherId = getAppIdOverlap(v.day, v.startTime, v.endTime, v.id);
                            let tempOther = getApp(otherId);

                            if(Math.random() > .2){

                                if(tempOther.startTime < newstart){
                                    newstart = tempOther.startTime;
                                }

                                if(tempOther.endTime > newend){
                                    newend = tempOther.endTime;
                                }

                                if(rnd < .7){
                                    var extra =  Math.floor((Math.random() * 3));
                                    rnd = Math.random();
                                    if(rnd < .5){
                                        newstart += extra;
                                    }
                                    else{
                                        newstart -= extra;
                                    }

                                    extra =  Math.floor((Math.random() * 3));
                                    rnd = Math.random();

                                    if(rnd < .5){
                                        newend += extra;
                                    }
                                    else{
                                        newend -= extra;
                                    }

                                }
                                else if(rnd < .6){
                                    nomatch = true;
                                }

                                if(newstart < 0){
                                    newstart = 0;
                                }

                                if(newend > 24){
                                    newend = 24;
                                }

                                tempApp = {
                                    id: highestId,
                                    day: v.day,
                                    startTime: Number(newstart),
                                    endTime: Number(newend),
                                    totalTime: Number(newend) - Number(newstart),
                                    tags: '',
                                    type: 'worktime',
                                    appearance: 'normal',
                                    answerid: v.id
                                };

                                appointments.push(tempApp);
                                console.log('made with double')
                                highestId++;
                                drawApp(tempApp.id);

                            }


                        }

                    }




                }

            }
        })
    }
}

function generateWorktime(appObj){
    console.log('generate work time');
    console.log(appObj);
    var rnd = Math.random();
    console.log('random number' + rnd)
    var newstart = appObj.startTime;
    var newend = appObj.endTime;
    var nomatch = false;

    if(rnd < .7){
        var extra =  Math.floor((Math.random() * 3) + 1);
        rnd = Math.random();
        if(rnd < .5){
            newstart += extra;
        }
        else{
            newstart -= extra;
        }

        extra =  Math.floor((Math.random() * 3) + 1);
        rnd = Math.random();

        if(rnd < .5){
            newend += extra;
        }
        else{
            newend -= extra;
        }

    }
    else if(rnd < .6){
        nomatch = true;
    }

    if(newstart < 0){
        newstart = 0;
    }

    if(newend > 24){
        newend = 24;
    }

    if(!nomatch){
        let tempApp = {
            id: highestId,
            day: appObj.day,
            startTime: Number(newstart),
            endTime: Number(newend),
            totalTime: newend - newstart,
            tags: '',
            type: 'worktime',
            appearance: 'normal',
            answerid: appObj.id
        };

        if(tempApp.totalTime > 0){
            return tempApp;
        }
        else{
            return null;
        }
    }
    else{
        return null;
    }
}

$(document).on('input', '.slider', function() {
    var name = $(this).attr('id');
    var shortname = name.substring(6);
    var sliderval = $(this).val();

    $('#number' + shortname).val(sliderval);
})

$(document).on('input', '.numberslider', function() {
    var name = $(this).attr('id');
    var shortname = name.substring(6);
    var numberval = $(this).val();

    $('#slider' + shortname).val(numberval);
})


function worktimeinfo(appId){
    let tempApp = getApp(appId);

    if(tempApp.type == 'worktime'){
        let popup = '<div id="popup" class="popup">'
        popup += '<h2>Werk informatie</h2>'
        popup += '<label>Werktijden</label>'
        popup += '<h3>' + tempApp.startTime + ':00 - ' + tempApp.endTime + ':00 </h3>'
        popup += '<label>Totale tijd</label>'
        popup += '<h3>' + tempApp.totalTime + ':00</h3>'
        popup += '<label>Locatie</label>'
        popup += '<h3>Eindhoven </h3>'
        popup += '<label>Type werk</label>'
        popup += '<h3>Ouderenzorg </h3>'
        popup += '<label>Tarief</label>'
        popup += '<h3>€' + $('#number_price').val() + ',-</h3>'
        popup += '<button onclick="closePopUp()">Close</button>'
        popup += '</div>'
        $('.popupcontainer').css({display: 'flex'}).append(popup);
    }

}

function worktimeAnswer(answer, appId){
    answer = Number(answer);
    let tempApp = getApp(appId);
    console.log('answer = ' + answer);

    if(answer == 0){
        tempApp.appearance = 'accepted';
    }
    else{
        tempApp.appearance = 'declined';
    }

    console.log(tempApp);

    changeAppObj(tempApp);
    changeApp(appId);
}
