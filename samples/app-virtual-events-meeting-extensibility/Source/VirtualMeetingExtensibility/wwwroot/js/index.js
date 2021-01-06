let accessToken;
let idToken;
let suggesions = [];

var $disabledResults = $(".js-example-disabled-results");
$disabledResults.select2();

var today = new Date().toISOString().split("T")[0];
$(".start-date ,.end-date").val(today);

function submitEvent() {
    const participantsEmails = [];
    document.querySelector('mgt-people-picker').selectedPeople.forEach(item => {
        if (item.userPrincipalName && !item.userPrincipalName.includes('#EXT#')) {
            participantsEmails.push(item.userPrincipalName);
        } else if (item.userPrincipalName && item.userPrincipalName.includes('#EXT#')) {
            participantsEmails.push(item.mail);
        } else {
            participantsEmails.push(item.scoredEmailAddresses[0].address);
        }
    });

    const eventViewModel = {
        Subject: $("#subject").val(),
        Participants: participantsEmails.toString(),
        StartDate: CombineDateAndTime($("#startDate").val(), $("#startTime").val()),
        EndDate: CombineDateAndTime($("#endDate").val(), $("#endTime").val())
    };

    $.ajax({
        url: "/api/virtual",
        async: false,
        type: "POST",
        data: JSON.stringify(eventViewModel),
        contentType: "application/json",

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "Bearer " + idToken);
        },
        success: function (data, textStatus, xhr) {
            if (xhr.status === 200) {
                alert("Created successfully!");
            }
        },
        error: function (data, textStatus, xhr) {
            if (xhr === "Bad Request") {
                alert(data.responseText);
            }
        },
        complete: function () {
            ClearFields();
        }
    });
}

function ClearFields() {
    $("#subject").val("");
    $("#startDate").val("");
    $("#endDate").val("");
    $("#startTime").val("");
    $("#endTime").val("");
}

function CombineDateAndTime(date, time) {
    return new Date(moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').format()).toISOString();
};



function showSugg() {
    suggesions = [];
    $('#suggTimes').css("display", "block")
    $('#suggLinks').empty();
    const startTimeHrs = new Date("01/01/0001 " + $("#newStartTime").val()).getHours();
    const endTimeHrs = new Date("01/01/0001 " + $("#newEndTime").val()).getHours();

    const startTimeMin = new Date("01/01/0001 " + $("#newStartTime").val()).getMinutes();
    const endTimeMin = new Date("01/01/0001 " + $("#newEndTime").val()).getMinutes();

    const diffHrs = endTimeHrs - startTimeHrs;
    const diffMins = endTimeMin - startTimeMin;

    let newstartFrom = endTimeHrs;
    for (let i = 1; i <= 3; i++) {
        newstartFrom = newstartFrom + 1
        if (i != 1) {
            newstartFrom = newstartFrom + diffHrs;
        }
        if (newstartFrom > 23) {
            newstartFrom = 0;
        }
        let newToTime = newstartFrom + diffHrs;
        if (newToTime > 23) {
            newToTime = 0;
        }
        const FromTime = newstartFrom + ":" + startTimeMin;
        const ToTime = newToTime + ":" + (startTimeMin + diffMins);
        if (newToTime != 0 && newstartFrom != 0) {
            suggesions.push({ from: FromTime, to: ToTime, id: i });
            $('#suggLinks').append('<a href="#",  id="edit_' + i + '" style="margin-right:15px;" >' + tConvert(FromTime) + " - " + tConvert(ToTime) + '</a>');
        }
        $(document).on("click", "#edit_" + i, function (event) {
            editid = event.currentTarget.id.split('_')[1];
            const sugg = suggesions.find(x => x.id == editid);
            if (sugg) {
                setSuggTime(sugg.from, sugg.to);
            }
        })
    }
}


$("#newStartTime").change(function () {
    if ($("#newEndTime").val() && $("#newStartTime").val()) {
        showSugg();
    }
    else {
        $('#suggTimes').css("display", "none");
    }
})

$("#newRequiredParticipants").change(function () {

    if ($("#newStartTime").val() && $("#newEndTime").val()) {
        showSugg();
    } else {
        $('#suggTimes').css("display", "none");
    }
})

$("#newEndTime").change(function () {

    if ($("#newStartTime").val() && $("#newEndTime").val()) {
        showSugg();
    } else {
        $('#suggTimes').css("display", "none");
    }
})

function setSuggTime(from, to) {
    $("#newStartTime").val(from)
    $("#newEndTime").val(to)
}

function tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
}

function successfulLogin() {
    $("#loading").hide();
}


