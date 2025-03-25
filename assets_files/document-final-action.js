$(document).ready(function () {
    finalactionviewmodel.initialize();
    commonViewModel.disabledNotActiveOrDeletedOption();
});

var finalactionviewmodel = {
    id: 0,
    edatsdocumentid: 0,
    isDirty: false,
    isForConfirmation: false,
    initialize: function () {
        finalactionviewmodel.initializeFormValidation();

        $('#FinalActionStatus').select2();
        //commonViewModel.loadList("FinalActionStatus", baseUrl + "api/codelistvalue/getdocumentfinalactionstatuslist", "", "");
        finalactionviewmodel.loadList("FinalActionStatus", baseUrl + "api/codelistvalue/getdocumentfinalactionstatuslist");

        $('.inputdataFA').keyup(function () {
            $("#finalActionForm").validate().element('#' + this.id);
            finalactionviewmodel.setFormIsDirty(true)
        });

        $('.selectdataFA').change(function () {
            $("#finalActionForm").validate().element('#' + this.id);
            finalactionviewmodel.setFormIsDirty(true)
        });

        $('#finalActionModal').on('hidden.bs.modal', function (e) {
            if (!finalactionviewmodel.isForConfirmation) {
                finalactionviewmodel.resetModalForm();
            }
        });

        $("#saveFinalActionBtn").click(function (e) {
            if ($("#finalActionForm").valid()) {
                finalactionviewmodel.isForConfirmation = true;
                $('#finalActionModal').modal('hide');

                notification.confirm("Finalize Document?", "Document will be finalize.", "SAVE", "CANCEL", finalactionviewmodel.saveYes, finalactionviewmodel.saveNo);
            }
        });

        //// Cancel Button
        $("#cancelFinalActionBtn").click(function () {
            if (finalactionviewmodel.isDirty) {

                finalactionviewmodel.isForConfirmation = true;
                $('#finalActionModal').modal('hide');

                notification.confirmCancelation(finalactionviewmodel.cancellationYes, finalactionviewmodel.cancellationNo);
            }
            else {
                $('#finalActionModal').modal('hide');
            }
        });
    },
    finalAction: function () {
        finalactionviewmodel.id = parseInt($('#RoutedOffice').val());
        $('#finalActionModal').modal();

        $.getJSON(baseUrl + "api/edatsdocument/getaddreseebyid/" + finalactionviewmodel.id, function (data) {
            $("#FA_DocumentCode").html(data.code);
            $("#FA_Subject").html(data.edatsDocument.subjectPrefix + " " + data.edatsDocument.subject);
            $("#FA_Sender").html(data.edatsDocument.sender);
        });
    },
    cancellationYes: function () {
        finalactionviewmodel.isForConfirmation = false;
        finalactionviewmodel.resetModalForm();
    },
    cancellationNo: function () {
        $('#finalActionModal').modal('show');
        finalactionviewmodel.isForConfirmation = false;
    },
    saveYes: function () {
        commonViewModel.processingSave("#finalActionModal", "#saveFinalActionBtn");

        $.ajax({
            url: baseUrl + "api/edatsdocument/finalaction",
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(
              {
                  id: finalactionviewmodel.id,
                  finalActionStatusId: $("#FinalActionStatus").val(),
                  remarks: $("#FA_Remarks").val(),
              }),
            success: (result) => {
                if (commonViewModel.convertToUpper(result) == commonViewModel.convertToUpper("Ok")) {
                    finalactionviewmodel.isForConfirmation = false;

                    $.getJSON(baseUrl + "api/edatsdocument/getaddreseebyid/" + finalactionviewmodel.id, function (data) {
                        $("#FinalActionStatusLabel").html(data.actionStatus != null ? data.actionStatus.name : "");
                        $("#FinalActionRemarksLabel").html(data.actionRemarks);
                        $("#FinalActionByLabel").html(data.actionBy != null ? data.actionBy.name : "");

                        var date = new Date(data.actionOn);
                        $("#FinalActionDateLabel").html(data.actionStatus != null
                            ? (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' +
                               date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
                            : "");

                        /*$("#DocumentReport ul li").each(function (index) {
                            if (this.innerText != "Document" &&
                                this.innerText != "Routing Slip" &&
                                this.innerText != "Blank Routing Slip") {
                                    this.remove();
                            }
                        });*/
                    });

                    commonViewModel.doneSave("#finalActionModal", "#saveFinalActionBtn");
                    notification.success("", "The document has been finalized!");
                    finalactionviewmodel.resetModalForm();

                    routingviewmodel.firstLoad = true;
                    routingviewmodel.loadTimeline();
                }
                else {
                    notification.warning("", "Encountered Error!");
                    commonViewModel.doneWithError("#finalActionModal", "#saveFinalActionBtn");
                    finalactionviewmodel.isForConfirmation = false;
                }
            },
            failure: (response) => {
                notification.warning("", "Encountered Error!");
                commonViewModel.doneWithError("#finalActionModal", "#saveFinalActionBtn");
                finalactionviewmodel.isForConfirmation = false;
            }
        });
    },
    saveNo: function () {
        commonViewModel.doneWithError("#finalActionModal", "#saveFinalActionBtn");
        finalactionviewmodel.isForConfirmation = false;
    },
    resetModalForm: function () {
        $('#finalActionForm').trigger("reset");

        $("#FinalActionStatus").val('').trigger('change');

        $("#finalActionForm").find(".has-error").removeClass("has-error");
        $("#finalActionForm").find(".has-success").removeClass("has-success");

        commonViewModel.removeSelectFieldValidation("#FinalActionStatus", "#FA_FinalActionStatusDiv");
        commonViewModel.removeInputFieldValidation("#FA_Remarks", "#FinalAction_RemarksDiv");

        finalactionviewmodel.isForConfirmation = false;
        finalactionviewmodel.isDirty = false;

        $("#saveFinalActionBtn").button('reset');
        $("#saveFinalActionBtn").prop("disabled", true);
    },
    setFormIsDirty: function(){
        finalactionviewmodel.isDirty = true;
        $("#saveFinalActionBtn").prop("disabled", false);
    },
    initializeFormValidation: function () {
        var form = $("#finalActionForm");
        var error = $(".alert-danger", form);
        var success = $(".alert-success", form);

        form.validate({
            errorElement: "span", //default input error message container
            errorClass: "help-block help-block-error", // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",  // validate all fields including form hidden input
            rules: {
                FinalActionStatus: {
                    required: true,
                },
                FA_Remarks: {
                    maxlength: 3000
                }
            },

            messages: {
            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                success.hide();
                error.show();
                //App.scrollTo(error, -200);
            },

            errorPlacement: function (error, element) { // render error placement for each input type
                commonViewModel.errorPlacement(error, element);
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest(".form-input-group").removeClass("has-success").addClass("has-error"); // set error class to the control group   
            },

            unhighlight: function (element) { // revert the change done by hightlight
            },

            success: function (label, element) {
                var icon = $(element).parent(".input-icon").children("i");
                $(element).closest(".form-input-group").removeClass("has-error").addClass("has-success"); // set success class to the control group
                icon.removeClass("fa-warning").addClass("fa-check");
            }
        });

        $.validator.addMethod("maxDate", function (value, element) {
            var curDate = new Date();
            var inputDate = new Date(value);
            if (inputDate <= curDate)
                return true;
            return false;
        }, "Please enter date not later than today.");
    },
    loadList: function (elem, url) {
        $("#" + elem).empty();
        commonViewModel.loadDiv(elem + "Div");
        $.getJSON(url, function (data) {
            if (data.length > 0) {
                $("#" + elem).append("<option value=''>SELECT ONE</option>");
                $.each(data, function (index, value) {
                    var insert = true;
                    if (commonViewModel.convertToUpper(value.name.trim()) == "RELEASE TO RMD"){
                        insert = false;
                    }

                    if (insert) {
                        $("#" + elem).append("<option value='" + value.id + "'>" + value.name + " </option>");
                    }
                });
            }

            commonViewModel.unloadDiv(elem + "Div");
        });
    }
}