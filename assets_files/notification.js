$(document).ready(function () {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    commonViewModel.initEventHandlers();
});

var notification = {
    initEventHandlers: function () {
    },
    success: function (title, message) {
        toastr["success"](message, title)
    },
    warning: function (title, message) {
        toastr["warning"](message, title)
    },
    created: function () {
        toastr["success"]("The record has been successfully created!", "")
    },
    updated: function () {
        toastr["success"]("The record has been successfully updated!", "")
    },
    deleted: function () {
        toastr["success"]("The record has been successfully deleted!", "")
    },
    confirm: function (title, text, confirmbutton, cancelbutton, saveYes, saveNo) {
        swal({
            title: title,
            text: text,
            type: "info",
            showCancelButton: true,
            confirmButtonClass: "btn-info",
            confirmButtonText: confirmbutton,
            cancelButtonText: cancelbutton,
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                saveYes();
            }
            else {
                if (typeof saveNo == 'function') {
                    saveNo();
                }
            }
        });
    },
    confirmSave: function (saveYes, saveNo) {
        swal({
            title: "Save Record?",
            text: "New record will be added.",
            type: "info",
            showCancelButton: true,
            confirmButtonClass: "btn-info",
            confirmButtonText: "SAVE",
            cancelButtonText: "CANCEL",
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                saveYes();
            }
            else {
                if (typeof saveNo == 'function') {
                    saveNo();
                }
            }
        });
    },
    confirmUpdate: function (saveYes, saveNo) {
        swal({
            title: "Update Record?",
            text: "Record will be updated.",
            type: "info",
            showCancelButton: true,
            confirmButtonClass: "btn-info",
            confirmButtonText: "UPDATE",
            cancelButtonText: "CANCEL",
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                saveYes();
            }
            else {
                if (saveNo != null) {
                    if (typeof saveNo == 'function') {
                        saveNo();
                    }
                }
            }
        });
    },
    confirmDeletion: function (deletionYes, deletionNo, detail) {
        swal({
            title: "Delete Record?",
            text: '"' + detail + '" will be deleted.',
            type: "error",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "DELETE",
            cancelButtonText: "CANCEL",
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                deletionYes();
            }
            else {
                if (deletionNo != null) {
                    if (typeof deletionNo == 'function') {
                        deletionNo();
                    }
                }
            }
        });
    },
    confirmCancelation: function (cancelationYes, cancelationNo) {
        swal({
            title: "Cancel Changes?",
            text: "Any unsaved changes will be lost.",
            type: "warning",
            showCancelButton: true,
            cancelButtonText: "No",
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes",
        },
        function (isConfirm) {
            if (isConfirm) {
                cancelationYes();
            }
            else {
                if (cancelationNo != null) {
                    if (typeof cancelationNo == 'function') {
                        cancelationNo();
                    }
                }
            }
        });
    }
}
