let idToken;
let chatId;

function updatePage() {
    var notebookPageDTO = {
        ChatId: chatId,
        PageContent: $("#txtNotes").val()
    };
    $.ajax({
        url: "/api/virtual/UpdatePage",
        type: "POST",
        data: JSON.stringify(notebookPageDTO),
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "Bearer " + idToken);
        },
        success: function (data, textStatus, xhr) {
            if (xhr.status === 200) {
                alert("Updated successfully!");
                $("#txtNotes").val("");
            }
        },
        error: function (data, textStatus, xhr) {
            if (xhr === "Bad Request") {
                alert(data.responseText);
            }
        },
        complete: function () {
        }
    });
}

function successfulLogin() {
    $("#loading").hide();
    microsoftTeams.initialize();
    microsoftTeams.getContext((context) => {
        chatId = context.chatId;
    });
}