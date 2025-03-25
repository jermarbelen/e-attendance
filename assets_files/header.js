$(document).ready(function () {
    headermodel.initialize();
});

var headermodel = {
    accessmenu: [],
    initialize: function () {
        this.bindEvents();
        $.getJSON(baseUrl + "api/user/getmenu", function (data) {
            headermodel.accessmenu = data;
            $(".menuaccess").empty();
            $("#defaultAccessSetting").empty();

            if (data.length > 0) {
                $.sessionTimeout({
                    title: 'Session Timeout Notification',
                    message: 'Your session is about to expire.',
                    keepAliveUrl: baseUrl + "User/KeepAlive",
                    redirUrl: baseUrl + "User/Logout",
                    logoutUrl: baseUrl + "User/Logout",
                    // 1 hour
                    warnAfter: 3600000,
                    // 30 seconds
                    redirAfter: 30000,
                    ignoreUserActivity: false,
                    countdownMessage: 'Will logout in {timer} seconds.',
                    countdownBar: true,
                    appendTime: true
                });
            }

            for (var i = 0; i < data.length; i++) {
                var menu = data[i].menu == "AIS" ? "Home/Menu" : data[i].menu + "/Home";
                var menulabel = data[i].menu.toUpperCase().search("TDRIS".toUpperCase()) > -1 ? data[i].menu.replace("TDRIS", "").toUpperCase() : data[i].menu;
                menulabel = data[i].menu.toUpperCase().search("ATRIS".toUpperCase()) > -1 ? data[i].menu.replace("ATRIS", "ATRS").toUpperCase() : data[i].menu;
                
                var menuAccessLabel = "";
                if (Object.values(data[i]).indexOf('TDRISScholarship') > -1) {
                    menuAccessLabel = "TDRIS Scholarship";
                }
                else if (Object.values(data[i]).indexOf('TDRISTraining') > -1) {
                    menuAccessLabel = "TDRIS Training";
                }
                else if (Object.values(data[i]).indexOf('ATRIS') > -1) {
                    menuAccessLabel = "ATRS";
                }
                else
                    menuAccessLabel = data[i].menu;

                $(".menuaccess").append('<li><a href="' + baseUrl + menu + '"><i class="icon-home"></i> ' + menuAccessLabel + '</a></li>');

                var ischecked = data[i].isDefault ? "checked" : "";
                $("#defaultAccessSetting").append('<div class="row" style="padding-bottom:3px">' +
                                '<div class="col-lg-8">' + menulabel + '</div>' +
                                    '<div class="col-lg-4">' +
                                        '<input id="das_' + menulabel + '" name="GroupedSwitches" value="' + data[i].menu + '" ' + ischecked + ' type="radio" class="menuswitch make-switch" data-size="mini" data-on-text="<i class=\'fa fa-check\'></i>" data-off-text="<i class=\'fa fa-times\'></i>">' +
                                    '</div>' +
                                '</div>');

                $("#das_" + menulabel).bootstrapSwitch();
            }
           
            $(".menuswitch").on('switchChange.bootstrapSwitch', function (event, state) {
                $.ajax({
                    url: baseUrl + "api/user/setdefaultaccesssetting",
                    type: "POST",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            menu: $('input[name=GroupedSwitches]:checked').val(),
                            isDefault: $(this).is(':checked')
                        }),
                    success: (result) => {
                        if (commonViewModel.convertToUpper(result) == commonViewModel.convertToUpper("Ok")) {
                            for (var i = 0; i < data.length; i++) {
                                var datamenu = data[i].menu.toUpperCase().search("TDRIS".toUpperCase()) > -1 ? data[i].menu.replace("TDRIS", "").toUpperCase() : data[i].menu;
                                if (datamenu.toUpperCase() != menu.toUpperCase()) {
                                    $("#das_" + datamenu).prop("checked", false);
                                }
                            }
                        }
                        else {
                            notification.warning("Warning!", result);
                        }
                    },
                    failure: (response) => {
                        notification.warning("Warning!", "Error Encountered!");
                    }
                });
            });
        });
    },
    bindEvents: function () {

        $("body").on("click", "a", function () {

            var href = $(this).attr("href");

            var nomodal = $(this).attr("nomodal");
            if (nomodal !== undefined) return;

            if (href && href !== "#" && !href.startsWith("#") && href.indexOf("javascript:") == -1 && href.indexOf("#tab") == -1 && !$(this).attr("download") && $(this).attr("target") !== "_blank") {
                $("#NavigatingScreen").modal("hide");
                $("#NavigatingScreen").modal("show");
                window.location.replace(href);
            }
        });

        $("#requestChangePassword").click(function (e) {
            //usermodel.resetPassword(userId, userFullName);
            swal({
                title: "Reset Password?",
                text: "Change password link will be sent via email.",
                type: "info",
                showCancelButton: true,
                confirmButtonClass: "btn-info",
                confirmButtonText: "Reset",
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    commonViewModel.loadDiv("page-wrap");

                    // For Rmis
                    commonViewModel.loadDiv("layoutDiv");

                    $.ajax({
                        url: baseUrl + "api/user/resetpassword/" + userId,
                        type: "GET",
                    })
                    .success(function (result) {
                        if (commonViewModel.convertToUpper(result) == commonViewModel.convertToUpper("Ok")) {
                            notification.success("", "Change password link was successfully sent!");
                            commonViewModel.unloadDiv("page-wrap");
                            commonViewModel.unloadDiv("layoutDiv");
                        }
                        else {
                            notification.warning("", result);
                            commonViewModel.unloadDiv("page-wrap");
                            commonViewModel.unloadDiv("layoutDiv");
                        }
                    })
                    .error(function () {
                        notification.warning("", "Error encountered.");
                        commonViewModel.unloadDiv("page-wrap");
                        commonViewModel.unloadDiv("layoutDiv");
                    })
                }
            });
        });
    },
    logout: function () {
        window.location.href = baseUrl + "User/Logout";
    },
    getManual: function (module) {
        window.open(baseUrl + "Attachments/UserManual/DENR " + module + " User Guide.pdf");
    }
}
