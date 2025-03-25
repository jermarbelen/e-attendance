$(document).ready(function () {
    signalrmodel.initialize();
});

var signalrmodel = {
    ctr: 0,
    initialize: function () {
        // signalr js code for start hub and send receive notification  
        var notificationHub = $.connection.notificationHub;
        $.connection.hub.start().done(function () {
            console.log('Notification hub started');
        });
        //signalr method for push server message to client  
        notificationHub.client.notify = function (message) {
            if (message && (message.search(ais_username) > -1)) {
                signalrmodel.updateNotificationCount();
            }
        }

        notificationHub.client.progressbar = function (message) {
            var result = message.split('-');
            var data = result[1].split(',')
            if (message && (data[0].search(ais_username) > -1)) {
                var percentage = parseFloat(data[1]);
                $('#RemittanceProgressBarDiv').css('width', percentage + '%');
                $('#RemittanceProgressBarDiv').html(percentage + '%');

                $('#RemittanceProgressBarLabel').text('Progress Status: ' + result[0])
            }
        }

        signalrmodel.updateNotificationCount();

        $('#header_notification_bar').click(function () {
            signalrmodel.getNotification();
            
            $.ajax({
                url: baseUrl + "api/notification/viewall",
                type: "POST",
                async: false,
                contentType: 'application/json; charset=utf-8',
                success: (result) => {
                    if (commonViewModel.convertToUpper(result).search(commonViewModel.convertToUpper("Ok")) > -1) {
                        signalrmodel.updateNotificationCount();
                    }
                    else {
                        notification.warning("", result);
                    }
                },
                failure: (response) => {
                    notification.warning("", "Encountered Error!");
                }
            });
        });
    },
    updateNotificationCount: function () {
        $('#header_notification_bar').show();
        $.getJSON(baseUrl + "api/notification/getcount", function (data) {
            var count = parseInt(data);
            if (count > 0) {
                $('#notificationCountLink').show();
                $('#NotificationCountLabel').html(count);
            }
            else {
                $('#notificationCountLink').hide();
            }
        });
    },
    getNotification: function () {
        $.getJSON(baseUrl + "api/notification/getnotifications", function (data) {
            $("#notiContent").empty();
            var template = _.template($("#notification-template").html());

            for (var i = 0; i < data.length; i++) {
                $('#notiContent').append(template({
                    data: data[i],
                }));

                if (!data[i].isRead) {
                    $("#noti_" + data[i].id).css('background-color', '#EBF7FC');
                }
            }

            signalrmodel.updateNotificationCount();
        });
    },
    loadLink: function (elem) {
        var id = parseInt($(elem).data("id"));
        var referenceId = parseInt($(elem).data("reference"));

        $.ajax({
            url: baseUrl + "api/notification/read",
            type: "POST",
            async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(
                {
                    id: id,
                }),
            success: (result) => {
                if (commonViewModel.convertToUpper(result).search(commonViewModel.convertToUpper("Ok")) > -1) {
                    var type = result.split('-')[1];
                    if (type == "Progress Note") {
                        window.location.href = edatsBaseUrl + "Document/View?id=" + referenceId + "&type=ROUT";
                    }

                    if (type == "Received Document") {
                        $.getJSON(baseUrl + "api/edatsdocument/validateifedatsroutingisrecall/" + referenceId, function (data) {
                            if (data != "") {
                                notification.warning("", data);
                            } else {
                               window.location.href = edatsBaseUrl + "Document/LoadViewByFilter?filter=InTransit";
                            }
                        });
                    }

                    if (type == "Release Document To Lmis") {
                        $.getJSON(baseUrl + "api/edatsdocument/validateifedatsroutingisrecall/" + referenceId, function (data) {
                            if (data != "") {
                                notification.warning("", data);
                            } else {
                                window.location.href = lmisBaseUrl + "Document/FormView";
                            }
                        });
                    }

                    if (type == "Release Document To Atrs") {
                        $.getJSON(baseUrl + "api/edatsdocument/validateifedatsroutingisrecall/" + referenceId, function (data) {
                            if (data != "") {
                                notification.warning("", data);
                            } else {
                                window.location.href = atrisBaseUrl + "Document/LoadViewByFilter?filter=InTransit";
                            }
                        });
                    }

                    if (type == "Lmis Received Document") {
                        $.getJSON(baseUrl + "api/lmisdocument/validateiflmisroutingisrecall/" + referenceId, function (data) {
                            if (data != "") {
                                notification.warning("", data);
                            } else {
                                window.location.href = lmisBaseUrl + "Document/LoadViewByFilter?filter=InTransit";
                            }
                        });
                    }

                    if (type == "Lmis Progress Note") {
                        window.location.href = lmisBaseUrl + "Document/View?id=" + referenceId + "&type=ROUT";
                    }

                    if (type == "Lmis Finalized Document") {
                        window.location.href = edatsBaseUrl + "Document/LoadViewByFilter?filter=InTransit";
                    }

                    // ATRS
                    var atrsSection = type == "Atrs Document for processing" ? "PROCESSING"
                        : type == "Atrs Document for approval" ? "APPROVAL"
                        : type == "Atrs Document for releasing" ? "RELEASING"
                        : type == "Atrs Document for receiving" ? "RECEIVING"
                        : "";

                    if (atrsSection != "") {
                        if (atrsSection == "RECEIVING") {
                            window.location.href = atrisBaseUrl + "Document/FormView/" + referenceId;
                        }
                        else {
                            window.location.href = atrisBaseUrl + "Document/View?id=" + referenceId + "&type=DOCUMENT&section=" + atrsSection + "&routeBack=false";
                        }
                        
                    }
                }
                else {
                    notification.warning("", result);
                }
            },
            failure: (response) => {
                notification.warning("", "Encountered Error!");
            }
        });
    }
}
