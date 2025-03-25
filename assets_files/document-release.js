$(document).ready(function () {
    releaseviewmodel.initialize();
});

var releaseviewmodel = {
    id: 0,
    edatsdocumentid: 0,
    isDirty: false,
    isForConfirmation: false,
    isCentralOffice: false,
    initialize: function () {
        releaseviewmodel.initializeFormValidation();

        $("#InternalOfficeField").select2()
        .change(function () {
            $("#releaseForm").validate().element('#' + this.id);
            releaseviewmodel.setFormIsDirty(true);

            if (releaseviewmodel.isCentralOffice) {
                if ($("#InternalOfficeField").val() != "") {
                    // disabled external
                    $("#ExternalOfficeField").rules("remove");
                    commonViewModel.removeSelectFieldValidation("#ExternalOfficeField", "#ExternalOfficeDiv");

                    $("#ExternalOfficeField").empty();
                    $("#ExternalOfficeField").prop("disabled", true);
                }
                else {
                    $("#ExternalOfficeField").rules("add", {
                        required: true
                    });

                    $("#ExternalOfficeField").prop("disabled", false);
                    releaseviewmodel.reloadExternal(false);
                }
            }

            releaseviewmodel.reloadInternal(true);
        });

        $("#ExternalOfficeField").select2()
        .change(function () {
            $("#releaseForm").validate().element('#' + this.id);
            releaseviewmodel.setFormIsDirty(true);

            if ($("#ExternalOfficeField").val() != "") {
                // disabled internal
                $("#InternalOfficeField").empty();
                $("#InternalOfficeField").prop("disabled", true);

                $("#InternalOfficeField").rules("remove");
                commonViewModel.removeSelectFieldValidation("#InternalOfficeField", "#InternalOfficeDiv");
            }
            else {
                $("#InternalOfficeField").rules("add", {
                    required: true
                });

                $("#InternalOfficeField").prop("disabled", false);
                releaseviewmodel.reloadInternal(false);
            }

            releaseviewmodel.reloadExternal(true);
        });

        $("#InternalOfficeCCField").select2({ closeOnSelect: false })
        .on('select2:close', function (e) {
             $("#releaseForm").validate().element('#' + this.id);
             releaseviewmodel.setFormIsDirty(true);

             if (routingviewmodel.isRoutCC) {
                 if (releaseviewmodel.isCentralOffice) {
                     if ($("#InternalOfficeCCField").val() != null && $("#InternalOfficeCCField").val().length > 0) {
                         // disabled external
                         $("#ExternalOfficeCCField").empty();
                         $("#ExternalOfficeCCField").prop("disabled", true);

                         $("#ExternalOfficeCCField").rules("remove");
                         commonViewModel.removeSelectFieldValidation("#ExternalOfficeCCField", "#ExternalOfficeCCDiv");
                     }
                     else {
                         $("#ExternalOfficeCCField").rules("add", {
                             required: true
                         });

                         $("#ExternalOfficeCCField").prop("disabled", false);
                         releaseviewmodel.reloadExternal(true);
                     }
                 }
             }
             else {
                 releaseviewmodel.reloadInternal(false);
             }
         });

        $("#ExternalOfficeCCField").select2({ closeOnSelect: false })
        .on('select2:close', function (e) {
            $("#releaseForm").validate().element('#' + this.id);
            releaseviewmodel.setFormIsDirty(true);
            
            if (routingviewmodel.isRoutCC) {
                if ($("#ExternalOfficeCCField").val() != null && $("#ExternalOfficeCCField").val().length > 0) {
                    // disabled internal
                    $("#InternalOfficeCCField").empty();
                    $("#InternalOfficeCCField").prop("disabled", true);

                    $("#InternalOfficeCCField").rules("remove");
                    commonViewModel.removeSelectFieldValidation("#InternalOfficeCCField", "#InternalOfficeCCDiv");
                }
                else {
                    $("#InternalOfficeCCField").rules("add", {
                        required: true
                    });

                    $("#InternalOfficeCCField").prop("disabled", false);
                    releaseviewmodel.reloadInternal(true);
                }
            }
            else {
                releaseviewmodel.reloadExternal(false);
            }
        });

        $('.selectdatarelease').change(function () {
            $("#releaseForm").validate().element('#' + this.id);
            releaseviewmodel.setFormIsDirty(true);
        });

        $('#releaseModal').on('shown.bs.modal', function (e) {
            $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
        });

        $('#releaseModal').on('hidden.bs.modal', function (e) {
            if (!releaseviewmodel.isForConfirmation) {
                releaseviewmodel.resetModalForm();
            }
        });

        $("#releaseToLmisChk").click(function (e) {
            $("#InternalOfficeField").empty();
            $("#ExternalOfficeField").empty();

            if ($("#releaseToAtrsChk").is(':checked')) {
                $("#releaseToAtrsChk").prop('checked', false);
            }

            if ($("#releaseToLmisChk").is(':checked')) {
                $.getJSON(baseUrl + "api/edatssettings/getlmisoffice", function (data) {
                    if (data != null) {
                        $("#InternalOfficeField").empty();
                        $("#InternalOfficeField").append("<option selected='selected' value='" + data.id + "'>" + data.name + " </option>");
                    }
                    else {
                        notification.warning("Warning!", "No LMIS office found. Plase contact your administrator");
                    }
                });

                $("#InternalOfficeField").prop("disabled", true);
                $("#ExternalOfficeField").prop("disabled", true);

                commonViewModel.removeSelectFieldValidation("#ExternalOfficeField", "#ExternalOfficeDiv");
                commonViewModel.removeSelectFieldValidation("#InternalOfficeField", "#InternalOfficeDiv");

                releaseviewmodel.validateCC(false);
            }
            else {
                $("#InternalOfficeField").prop("disabled", false);
                $("#ExternalOfficeField").prop("disabled", false);

                releaseviewmodel.reloadInternal(false);
                releaseviewmodel.reloadExternal(false);
                releaseviewmodel.validateCC(true);

                $("#InternalOfficeField").rules("add", {
                    required: true
                });

                $("#ExternalOfficeField").rules("add", {
                    required: true
                });
            }

            releaseviewmodel.setFormIsDirty(true);
        });

        $("#releaseToAtrsChk").click(function () {
            $("#InternalOfficeField").empty();
            $("#ExternalOfficeField").empty();

            if ($("#releaseToLmisChk").is(':checked')) {
                $("#releaseToLmisChk").prop('checked', false);
            }

            if ($("#releaseToAtrsChk").is(':checked')) {
                $.getJSON(baseUrl + "api/edatssettings/getatrsoffice", function (data) {
                    if (data != null) {
                        $("#InternalOfficeField").empty();
                        $("#InternalOfficeField").append("<option selected='selected' value='" + data.id + "'>" + data.name + " </option>");
                    }
                    else {
                        notification.warning("Warning!", "No ATRS office found. Plase contact your administrator");
                    }
                });

                $("#InternalOfficeField").prop("disabled", true);
                $("#ExternalOfficeField").prop("disabled", true);

                commonViewModel.removeSelectFieldValidation("#ExternalOfficeField", "#ExternalOfficeDiv");
                commonViewModel.removeSelectFieldValidation("#InternalOfficeField", "#InternalOfficeDiv");

                releaseviewmodel.validateCC(false);
            }
            else {
                $("#InternalOfficeField").prop("disabled", false);
                $("#ExternalOfficeField").prop("disabled", false);

                releaseviewmodel.reloadInternal(false);
                releaseviewmodel.reloadExternal(false);
                releaseviewmodel.validateCC(true);

                $("#InternalOfficeField").rules("add", {
                    required: true
                });

                $("#ExternalOfficeField").rules("add", {
                    required: true
                });
            }

            releaseviewmodel.setFormIsDirty(true);
        });

        $("#saveReleaseBtn").click(function (e) {
            if ($("#releaseForm").valid()) {
                $("#saveReleaseBtn").button('loading');

                releaseviewmodel.isForConfirmation = true;
                $('#releaseModal').modal('hide');

                notification.confirm("Release Document?", "Document will be released.", "RELEASE", "CANCEL", releaseviewmodel.saveYes, releaseviewmodel.saveNo);
            }
        });

        //// Cancel Button
        $("#cancelReleaseBtn").click(function () {
            if (releaseviewmodel.isDirty) {

                releaseviewmodel.isForConfirmation = true;
                $('#releaseModal').modal('hide');

                notification.confirmCancelation(releaseviewmodel.cancellationYes, releaseviewmodel.cancellationNo);
            }
            else {
                $('#releaseModal').modal('hide');
            }
        });
    },
    cancellationYes: function () {
        releaseviewmodel.isForConfirmation = false;
        releaseviewmodel.resetModalForm();
    },
    cancellationNo: function () {
        $('#releaseModal').modal('show');
        releaseviewmodel.isForConfirmation = false;
    },
    saveYes: function () {
        commonViewModel.processingSave("#releaseModal", "#saveReleaseBtn");
        $.ajax({
            url: baseUrl + "api/edatsdocument/release",
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(
                {
                    routedId: parseInt($('#RoutedOffice').val()),
                    internalOfficeId: $('#InternalOfficeField').val() == "" ? 0 : parseInt($('#InternalOfficeField').val()),
                    externalOfficeId: $('#ExternalOfficeField').val() == "" ? 0 : parseInt($('#ExternalOfficeField').val()),
                    internalOfficeCCIds: $("#InternalOfficeCCField").val() != null ? $("#InternalOfficeCCField").val().join(',') : "",
                    externalOfficeCCIds: $("#ExternalOfficeCCField").val() != null ? $("#ExternalOfficeCCField").val().join(',') : "",
                    releaseToLMIS: $("#releaseToLmisChk").is(':checked'),
                    releaseToATRS: $("#releaseToAtrsChk").is(':checked')
                }),
            success: (result) => {
                if (commonViewModel.convertToUpper(result) == commonViewModel.convertToUpper("Ok")) {
                    releaseviewmodel.isForConfirmation = false;

                    commonViewModel.doneSave("#releaseModal", "#saveReleaseBtn");
                    notification.success("", "The document has been released!");
                    releaseviewmodel.resetModalForm();

                    routingviewmodel.firstLoad = true;
                    routingviewmodel.loadTimeline();
                }
                else {
                    notification.warning("", result);
                    commonViewModel.doneWithError("#releaseModal", "#saveReleaseBtn");
                    releaseviewmodel.isForConfirmation = false;
                }
            },
            failure: (response) => {
                notification.warning("", response);
                commonViewModel.doneWithError("#releaseModal", "#saveReleaseBtn");
                releaseviewmodel.isForConfirmation = false;
            }
        });
    },
    saveNo: function () {
        commonViewModel.doneWithError("#releaseModal", "#saveReleaseBtn");
        releaseviewmodel.isForConfirmation = false;
    },
    validateCC: function(withCC){
        if (withCC) {
            $("#ReleaseCCDiv").show();
            releaseviewmodel.reloadInternal(true);
            releaseviewmodel.reloadExternal(true);
        }
        else {
            $("#ReleaseCCDiv").hide();
            $("#InternalOfficeCCField").empty();
            $("#ExternalOfficeCCField").empty();

            commonViewModel.removeSelectFieldValidation("#InternalOfficeCCField", "#InternalOfficeCCDiv");
            commonViewModel.removeSelectFieldValidation("#ExternalOfficeCCField", "#ExternalOfficeCCDiv");
        }
    },
    reloadInternal: function (isCC) {
        if (isCC) {
            var ids = [];
            if ($("#InternalOfficeField").val() != "") {
                ids.push($("#InternalOfficeField").val());
            }

            var internal = $("#InternalOfficeCCField").val() == null ? "" : $("#InternalOfficeCCField").val();
            commonViewModel.loadList("InternalOfficeCCField", baseUrl + "api/edatsroutinggroup/getalluserroutingofficesbytype/Internal", internal, "", false, ids);
        }
        else {
            if (!$("#InternalOfficeField").prop("disabled")) {
                var ids = $("#InternalOfficeCCField").val() == null ? [] : $("#InternalOfficeCCField").val();
                var internal = $("#InternalOfficeField").val() == null ? "" : $("#InternalOfficeField").val();
                commonViewModel.loadList("InternalOfficeField", baseUrl + "api/edatsroutinggroup/getalluserroutingofficesbytype/Internal", internal, "", true, ids);
            }
        }
    },
    reloadExternal: function (isCC) {
        if (isCC) {
            var ids = [];
            if ($("#ExternalOfficeField").val() != "") {
                ids.push($("#ExternalOfficeField").val());
            }

            var external = $("#ExternalOfficeCCField").val() == null ? "" : $("#ExternalOfficeCCField").val();
            commonViewModel.loadList("ExternalOfficeCCField", baseUrl + "api/edatsroutinggroup/getalluserroutingofficesbytype/External", external, "", false, ids);
        }
        else {
            if (!$("#ExternalOfficeField").prop("disabled")) {
                var ids = $("#ExternalOfficeCCField").val() == null ? [] : $("#ExternalOfficeCCField").val();
                var external = $("#ExternalOfficeField").val() == null ? "" : $("#ExternalOfficeField").val();
                commonViewModel.loadList("ExternalOfficeField", baseUrl + "api/edatsroutinggroup/getalluserroutingofficesbytype/External", external, "", true, ids);
            }
        }
    },
    resetModalForm: function () {
        $('#releaseForm').trigger("reset");

        $("#InternalOfficeField").empty();
        $("#InternalOfficeCCField").empty();

        $("#ExternalOfficeField").empty();
        $("#ExternalOfficeCCField").empty();

        $("#releaseForm").find(".has-error").removeClass("has-error");
        $("#releaseForm").find(".has-success").removeClass("has-success");

        releaseviewmodel.isForConfirmation = false;
        releaseviewmodel.isDirty = false;

        $("#saveReleaseBtn").button('reset');
        $("#saveReleaseBtn").prop("disabled", true);

        $("#InternalOfficeField").prop("disabled", false);
        $("#ExternalOfficeField").prop("disabled", false);
    },
    setFormIsDirty: function (value) {
        releaseviewmodel.isDirty = value;
        $("#saveReleaseBtn").prop("disabled", !value);
    },
    initializeFormValidation: function () {
        var form = $("#releaseForm");
        var error = $(".alert-danger", form);
        var success = $(".alert-success", form);

        form.validate({
            errorElement: "span", //default input error message container
            errorClass: "help-block help-block-error", // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",  // validate all fields including form hidden input
            rules: {
                InternalOfficeField: {
                    required: true,
                },
                ExternalOfficeField: {
                    required: true,
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
    }
}