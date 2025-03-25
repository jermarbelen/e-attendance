$(document).ready(function () {
    // Sidebar State
    commonViewModel.toggleSidebar();

    commonViewModel.initEventHandlers();
});

var commonViewModel = {
    convertToUpper: function (value) {
        return value == null ? "" : value.toUpperCase();
    },
    initEventHandlers: function () {
        $(".sidebar-toggler").click(function () {
            if ($("body").hasClass("page-sidebar-closed")) {
                Cookies.set("SidebarState", "Expanded");
            }
            else {
                Cookies.set("SidebarState", "Collapsed");
            }
        });

    },
    validTableResetField: function (elem) {
        var form = $("#" + elem);
        var error = $(".alert-danger", form);
        var success = $(".alert-success", form);
        success.show();
        error.hide();
    },
    resetForm: function (elem) {
        $(elem).trigger("reset");
        $(elem).find(".has-error").removeClass("has-error");
        $(elem).find(".has-success").removeClass("has-success");
    },
    loadDiv: function (elem) {
        App.blockUI({
            target: '#' + elem,
            animate: true
        });
    },
    unloadDiv: function (elem) {
        window.setTimeout(function () {
            App.unblockUI('#' + elem);
        }, 500);
    },
    disabledDiv: function (elem) {
        $(elem).addClass("disabledDiv");
    },
    enabledDiv: function (elem) {
        $(elem).removeClass("disabledDiv");
    },
    setActiveMenu: function (parentli) {
        $("#" + parentli).addClass('active open');
        $("#" + parentli + " ul").css("display", "block");
        $("#" + parentli + " a span").addClass("open");
    },
    scrollElement: function (div, el) {
        div = div == "" ? 'body, html' : div;
        var positionDiv = 0;

        if (div == "body, html") {
            positionDiv = $(el).offset().top - 50;
        }
        else {
            if ($(div).scrollTop() == 0) {
                positionDiv = $(el).offset().top - $(div).offset().top;
            }
            else {
                positionDiv = ($(div).scrollTop() + $(el).offset().top) - $(div).offset().top;
            }
        }

        $(div).animate({
            scrollTop: positionDiv
        }, 800);
    },
    errorPlacement: function (error, element) {
        if (element[0].localName == "select") {
            $("#" + element[0].id + "Div" + " span .select2-selection__rendered").attr("data-original-title", "");
        }
        else {
            $(element).attr("data-original-title", "");
        }

        if (error.text() != "") {
            if (element[0].localName == "select") {
                $("#" + element[0].id + "Div" + ' .select2-selection__rendered').removeAttr('title');
                $("#" + element[0].id + "Div" + " span .select2-selection__rendered").attr("data-original-title", error.text()).tooltip({ 'trigger': 'hover' });
            }
            else {
                $(element).attr("data-original-title", error.text()).tooltip({ 'trigger': 'hover' });
            }
        }
    },
    removeInputFieldValidation: function (elem, divId) {
        $(divId).removeClass("has-error").removeClass("has-success");
        $(elem).attr("data-original-title", "");
    },
    removeSelectFieldValidation: function (elem, divId) {
        $(elem).removeClass("has-error").removeClass("has-success");
        $(divId).removeClass("has-error").removeClass("has-success");
        $(divId + " span .select2-selection__rendered").attr("data-original-title", "");
    },
    loadList: function (elem, url, valueSelected, formElem, withSelectOne, notIncluded) {
        $("#" + elem).empty();
        commonViewModel.loadDiv(elem + "Div");

        $.getJSON(url, function (data) {
            if (data.length > 0) {
                var selectedValueIsInactive = false;
                var isMultiple = $("#" + elem).prop('multiple');

                if (withSelectOne || withSelectOne == undefined) {
                    var blankSelected = valueSelected.toString().trim() == "" ? "selected='selected'" : "";
                    $("#" + elem).append("<option " + blankSelected + " value=''>SELECT ONE</option>");
                }
                if (isMultiple == true) {
                    $("#" + elem).empty();
                }

                $.each(data, function (index, value) {
                    var add = true;
                    var selected = isMultiple ? "" : valueSelected.toString().trim() == value.id.toString().trim() ? "selected='selected'" : "";

                    let disabled = "";
                    if (value.isActive != null && !value.isActive) {
                        disabled = "disabled";  
                    }

                    if (value.isActive != null && !value.isActive && selected == "") {
                        add = false;
                    }

                    if (add && notIncluded != null && notIncluded != undefined) {
                        add = notIncluded.includes(value.id.toString()) ? false : true;
                    }

                    if (value.isActive != null && !value.isActive && selected != "") {
                        $("#" + elem + "Div" + " span .select2-selection__rendered").attr("data-original-title", "");
                        $("#" + elem + "Div" + ' .select2-selection__rendered').removeAttr('title');
                        $('#' + elem + "Div" + " span .select2-selection__rendered").attr("data-original-title", "Selected record is inactive.").tooltip({ 'trigger': 'hover' });
                        $("#" + elem.replace("Id", "")).addClass("has-error");

                        selectedValueIsInactive = true;
                    }

                    if (add) {
                        $("#" + elem).append("<option " + selected + " value='" + value.id + "' " + disabled + ">" + value.name + " </option>");
                    }
                });

                if (isMultiple == true) {
                    $.each(valueSelected, function (i, e) {
                        $("#" + elem + " option[value='" + e + "']").prop("selected", true);
                    });
                }

                if (!isMultiple && valueSelected.toString().trim() != "" && formElem.toString().trim() != "" && !selectedValueIsInactive) {
                    $(formElem).validate().element("#" + elem);
                }
            }
            else {
                if (withSelectOne || withSelectOne == undefined) {
                    var blankSelected = valueSelected.toString().trim() == "" ? "selected='selected'" : "";
                    $("#" + elem).append("<option " + blankSelected + " value=''>SELECT ONE</option>");
                }
            }

            commonViewModel.unloadDiv(elem + "Div");
        });
    },
    disabledNotActiveOrDeletedOption: function () {
        var hasNotActiveOrDeletedOption = false;

        $('select.selectdata').each(function () {
            if ($('#' + this.id + " option:selected").text().search("-disabled") > -1) {
                $('#' + this.id + ">option[value='" + $(this).val() + "']").attr('disabled', 'disabled');

                var data = $('#' + this.id + " option:selected").text();
                var value = data.replace("-disabled", '');
                $('#' + this.id + " option:selected").text(value);

                $('#' + this.id).select2();

                $("#" + this.id + "Div" + " span .select2-selection__rendered").attr("data-original-title", "");
                $("#" + this.id + "Div" + ' .select2-selection__rendered').removeAttr('title');
                $('#' + this.id + "Div" + " span .select2-selection__rendered").attr("data-original-title", "Selected record is inactive.").tooltip({ 'trigger': 'hover' });
                $("#" + this.id.replace("Id", "")).addClass("has-error");

                $('#' + this.id).rules("add", {
                    checkInactive: true
                });

                var valueData = $(this).val();
                $("#" + this.id + ">option").each(function () {
                    if (this.text.search("-disabled") > -1 && valueData != this.value) {
                        this.remove();
                    }
                });

                hasNotActiveOrDeletedOption = true;
            }
            else {
                $("#" + this.id + ">option").each(function () {
                    if (this.text.search("-disabled") > -1) {
                        this.remove();
                    }
                });
            }
        });

        if (hasNotActiveOrDeletedOption) {
            $.validator.addMethod("checkInactive",
              function (value, element) {
                  return value != null;
              }, "Selected record is inactive.");
        }
    },
    emailNotRequiredAddValidation: function (elem, form) {
        $(elem).keyup(function () {
            if ($(elem).val() != "") {
                $(elem).rules("add", {
                    email: true
                });
            }
            else {
                $(elem).rules("remove");
                commonViewModel.removeInputFieldValidation(elem, elem + "Div");
            }

            $(form).validate().element(elem);
        });
    },
    toggleSidebar: function () {
        if (Cookies.get("SidebarState") === "Collapsed") {
            $("body").addClass("page-sidebar-closed");
            $(".page-sidebar-menu").addClass("page-sidebar-menu-closed");
        }
    },
    successMessage: function () {
        setTimeout(function () {
            swal({
                title: "Record sucessfully saved.",
                type: "success"
            });
        }, 100);
    },
    processingSave: function (modal, btn) {
        $(btn).button('loading');
        $(modal).modal("show");
        commonViewModel.disabledDiv(".modal-body");
        commonViewModel.disabledDiv(".modal-footer");
    },
    doneSave: function (modal, btn) {
        $(btn).button('reset');
        $(modal).modal("hide");
        commonViewModel.enabledDiv(".modal-body");
        commonViewModel.enabledDiv(".modal-footer");
    },
    doneWithError: function (modal, btn) {
        $(btn).button('reset');
        $(modal).modal("show");
        commonViewModel.enabledDiv(".modal-body");
        commonViewModel.enabledDiv(".modal-footer");
    },
    deleteFile: function (folderName, fileName) {
        setTimeout(function () {
            $.ajax({
                url: dpisBaseUrl + "Report/DeleteFile",
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ folderName: folderName, fileName: fileName }),
                success: (result) => { },
                failure: (response) => { }
            });
        }, 30000);
    }
}
