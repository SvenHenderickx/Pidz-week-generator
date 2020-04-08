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
    if(mouseStart != null && appointmentEl != null){
        let appId = ($(appointmentEl).attr('id')).substring(4);
        let tempApp = getApp(appId);
        let mouseEnd = mouseStart - mouseY;

        let fakeMouseEnd = Math.round(mouseEnd / dayPartheight);
        if(checkIsApp(tempApp.day, tempApp.startTime, tempApp.endTime, tempApp.id) || true){
            // appointments[appId].startTime -= fakeMouseEnd;
            // appointments[appId].endTime -= fakeMouseEnd;
            tempApp.startTime -= fakeMouseEnd;
            tempApp.endTime -= fakeMouseEnd;
            changeAppObj(tempApp);
            changeApp(appId);

        }
        console.log(appointments[appId]);

        // let currentTop = appointmentEl.offset().top;
        mouseStart = mouseStart - mouseEnd;
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
        type: 'looking'
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
            if(true){
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

function drawApp(appId){
    let tempApp = getApp(appId);
    let height = tempApp.totalTime * dayPartheight;
    let left;
    let top;
    left = $('#' + tempApp.day + (tempApp.startTime).toString()).offset().left;
    top = $('#' + tempApp.day  + (tempApp.startTime).toString()).offset().top;

    let btn = '<button onclick="changeAppData(' + appId + ')">EDIT</button>'
    $('.calendarwrap').append('<div id="app_' + tempApp.id + '" style="top: ' + ( top + 0) + '; left: '+ left +'; height: ' + height +'px;" class="appointment"><p> ' + tempApp.startTime + ':00 - ' + tempApp.endTime + ':00 </p><p>' +  tempApp.totalTime + ':00</p>' + btn + '</div>');
    calcWorktime();

}

function changeApp(appId){
    let tempApp = appointments[appId];

    if(tempApp.startTime < 0){
        appointments[appId].startTime = 0;
        appointments[appId].endTime = 0 + tempApp.totalTime;

    }
    else if(tempApp.endTime > 24){
        appointments[appId].endTime = 24;
        appointments[appId].startTime = 24 - tempApp.totalTime;

    }
    else{
        let height = tempApp.totalTime * dayPartheight;
        let left;
        let top;
        left = $('#' + tempApp.day + (tempApp.startTime).toString()).offset().left;
        top = $('#' + tempApp.day  + (tempApp.startTime).toString()).offset().top;
        let btn = '<button onclick="changeAppData(' + appId + ')">EDIT</button>'

        $('#app_' + appId).empty();
        $('#app_' + appId).append('<p> ' + tempApp.startTime + ':00 - ' + tempApp.endTime + ':00 </p><p>' +  tempApp.totalTime + ':00</p>' + btn)
        $('#app_' + appId).css({top: top}).css({height: height});

        if(tempApp.type != 'busy'){
            $('#app_' + appId).removeClass('busy');
        }
        else{
            $('#app_' + appId).addClass('busy');
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
            workTime += v.totalTime;
        }
    })

    $('#worktime').empty().append('<label>Totale werkweek</label><h2>' +  workTime + ' uren</h2>')
}
