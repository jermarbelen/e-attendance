$(document).ready(function () {
    usermodel.initialize();
});

var usermodel = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
      
    },
    activate_deactivate: function (id, name, type, isactive) {
        var action = isactive == 1 ? "activated" : "deactivated";
        var title = isactive == 1 ? "Activate" : "Deactivate";
        swal({
            title: title + " Account?",
            text: "Account will be tagged as " + action + ".",
            type: "info",
            showCancelButton: true,
            confirmButtonClass: "btn-info",
            confirmButtonText: title.toUpperCase(),
            cancelButtonText: "CANCEL",
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: baseUrl + "api/user/setactivevalue/" + id + "/" + type + "/" + isactive,
                    type: "GET",
                })
                .success(function (result) {
                    if (commonViewModel.convertToUpper(result) == commonViewModel.convertToUpper("Ok")) {
                        viewmodel.filtertable.fnFilter("");
                        //swal("User [" + name + "]" + " was successfully " + action + ".", "", "success");

                        notification.success("", "Account has been " + action + "!");
                    }
                    else {
                        //swal(result, "", "error");
                        notification.warning("", result);
                    }
                })
                .error(function () {
                    //swal("Error encountered.", "", "error");
                    notification.warning("", "Error encountered.");
                })
            }
        });
    },
    resetPassword: function (id, name) {
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
                commonViewModel.loadDiv("tableDiv");
                commonViewModel.disabledDiv("#layoutDiv");

                $.ajax({
                    url: baseUrl + "api/user/resetpassword/" + id,
                    type: "GET",
                })
                .success(function (result) {
                    if (commonViewModel.convertToUpper(result) == commonViewModel.convertToUpper("Ok")) {
                        viewmodel.filtertable.fnFilter("");
                        //swal("User [" + name + "]" + " password was successfully reset.", "", "success");
                        notification.success("", "Change password link was successfully sent!");
                        commonViewModel.unloadDiv("tableDiv");
                        commonViewModel.enabledDiv("#layoutDiv");
                    }
                    else {
                        //swal(result, "", "error");
                        notification.warning("", result);
                        commonViewModel.unloadDiv("tableDiv");
                        commonViewModel.enabledDiv("#layoutDiv");
                    }
                })
                .error(function () {
                    //swal("Error encountered.", "", "error");
                    notification.warning("", "Error encountered.");
                    commonViewModel.unloadDiv("tableDiv");
                    commonViewModel.enabledDiv("layoutDiv");
                })
            }
        });
    }
}