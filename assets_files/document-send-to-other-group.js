$(document).ready(function () {
    sendtoothergroupviewmodel.initialize();
});

var sendtoothergroupviewmodel = {
    id: 0,
    edatsdocumentid: 0,
    isDirty: false,
    isForConfirmation: false,
    action: "",
    isCentralOffice: false,
    initialize: function () {
        sendtoothergroupviewmodel.initializeFormValidation();

        $("#SOG_OfficeField").select2()
        .change(function () {
            $("#sendToOtherGroupForm").validate().element('#' + this.id);
            sendtoothergroupviewmodel.setFormIsDirty(true);

            $("#SOG_ExternalOfficeField").rules("remove");
            commonViewModel.removeSelectFieldValidation("#SOG_ExternalOfficeField", "#SOG_ExternalOfficeDiv");

            if (sendtoothergroupviewmodel.isCentralOffice) {
                if ($("#SOG_OfficeField").val() != "") {
                    // disabled external
                    $("#SOG_ExternalOfficeField").empty();
                    $("#SOG_ExternalOfficeField").prop("disabled", true);
                }
                else {
                    $("#SOG_ExternalOfficeField").rules("add", {
                        required: true
                    });

                    $("#SOG_ExternalOfficeField").prop("disabled", false);
                    sendtoothergroupviewmodel.reloadExternal();
                }
            }
        });
        
        $("#SOG_ExternalOfficeField").select2()
        .change(function () {
            $("#sendToOtherGroupForm").validate().element('#' + this.id);
            sendtoothergroupviewmodel.setFormIsDirty(true);

            $("#SOG_OfficeField").rules("remove");
            commonViewModel.removeSelectFieldValidation("#SOG_OfficeField", "#SOG_OfficeDiv");

            if (sendtoothergroupviewmodel.isCentralOffice) {
                if ($("#SOG_ExternalOfficeField").val() != "") {
                    // disabled external
                    $("#SOG_OfficeField").empty();
                    $("#SOG_OfficeField").prop("disabled", true);
                }
                else {
                    $("#SOG_OfficeField").rules("add", {
                        required: true
                    });

                    $("#SOG_OfficeField").prop("disabled", false);
                    sendtoothergroupviewmodel.reloadInternal();
                }
            }
        });

        $("#SOG_RoutingOfficeGroupField").select2()
        .change(function () {
            $("#sendToOtherGroupForm").validate().element('#' + this.id);
            sendtoothergroupviewmodel.setFormIsDirty(true);

            if ($("#SOG_RoutingOfficeGroupField").val() != "") {
                sendtoothergroupviewmodel.reloadInternal();

                $("#SOG_OfficeField").rules("add", {
                    required: true
                });
            }
            else {
                $("#SOG_OfficeField").rules("remove");
                commonViewModel.removeSelectFieldValidation("#SOG_OfficeField", "#SOG_OfficeDiv");
                $("#SOG_OfficeField").empty();
            }

            sendtoothergroupviewmodel.validateOfficeField($("#SOG_RoutingOfficeGroupField").val());
        });

        $('.selectdata_sog').change(function () {
            $("#sendToOtherGroupForm").validate().element('#' + this.id);
            sendtoothergroupviewmodel.setFormIsDirty(true)
        });

        $('#sendToOtherGroupModal').on('shown.bs.modal', function (e) {
            $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
        });

        $('#sendToOtherGroupModal').on('hidden.bs.modal', function (e) {
            if (!sendtoothergroupviewmodel.isForConfirmation) {
                sendtoothergroupviewmodel.resetModalForm();
            }
        });

        $("#saveSendToOtherGroupBtn").click(function (e) {
            if ($("#sendToOtherGroupForm").valid()) {
                $("#saveSendToOtherGroupBtn").button('loading');

                sendtoothergroupviewmodel.isForConfirmation = true;
                $('#sendToOtherGroupModal').modal('hide');

                if (sendtoothergroupviewmodel.action == "SEND TO RMD") {
                    notification.confirm("Create request and send to RMD?", "This will create request and will be routed to RMD.", "SEND to RMD", "CANCEL", sendtoothergroupviewmodel.saveYes, sendtoothergroupviewmodel.saveNo);
                }
                else if (sendtoothergroupviewmodel.action == "SEND TO OTHER GROUP") {
                    notification.confirm("Send to other group?", "Document will be released to other group.", "SEND TO OTHER GROUP", "CANCEL", sendtoothergroupviewmodel.saveYes, sendtoothergroupviewmodel.saveNo);
                }
                else if (sendtoothergroupviewmodel.action == "RELEASE TO RMIS") {
                    var cc = sendtoothergrouproutingofficeviewmodel.filtertableRow.fnGetData();
                    var title = $("#SOG_OfficeField").val() != "" || $("#SOG_ExternalOfficeField").val() || cc.length > 0
                        ? "Send to other group and release document to RMIS?" : "Release document to RMIS?";
                    var detail = $("#SOG_OfficeField").val() != "" || $("#SOG_ExternalOfficeField").val() || cc.length > 0
                        ? "Document will be released to other group and to RMIS." : "Document will be released to RMIS.";

                    notification.confirm(title, detail, "RELEASE", "CANCEL", sendtoothergroupviewmodel.saveYes, sendtoothergroupviewmodel.saveNo);
                }
            }
        });

        //// Cancel Button
        $("#cancelSendToOtherGroupBtn").click(function () {
            if (sendtoothergroupviewmodel.isDirty) {

                sendtoothergroupviewmodel.isForConfirmation = true;
                $('#sendToOtherGroupModal').modal('hide');

                notification.confirmCancelation(sendtoothergroupviewmodel.cancellationYes, sendtoothergroupviewmodel.cancellationNo);
            }
            else {
                $('#sendToOtherGroupModal').modal('hide');
            }
        });
    },
    validateOfficeField: function (routingGroupId) {
        $("#SOG_ExternalOfficeField").rules("remove");

        $("#SOG_ExternalOfficeDiv").hide();
        $("#SOG_ExternalOfficeFiel").empty();

        commonViewModel.removeSelectFieldValidation("#SOG_ExternalOfficeField", "#SOG_ExternalOfficeDiv");

        if (routingGroupId > 0) {
            $.getJSON(baseUrl + "api/edatsroutinggroup/IsRoutingGroupCentralOffice/" + routingGroupId, function (result) {
                sendtoothergroupviewmodel.isCentralOffice = result;

                if (result) {
                    $("#SOG_ExternalOfficeDiv").show();

                    $("#SOG_ExternalOfficeField").rules("add", {
                        required: true
                    });

                    if (($("#SOG_OfficeField").val() == "" || $("#SOG_OfficeField").val() == null)) {
                        sendtoothergroupviewmodel.reloadExternal();
                    }
                }
            });
        }
        else {
            sendtoothergroupviewmodel.isCentralOffice = false;
        }
    },
    reloadInternal: function () {
        var ccIds = [];
        var datas = sendtoothergrouproutingofficeviewmodel.filtertableRow.fnGetData();
        $.each(datas, function (i, item) {
            $.merge(ccIds, item.OfficeIds.split(','));
        });

        var internal = $("#SOG_OfficeField").val() == null ? "" : $("#SOG_OfficeField").val();
        commonViewModel.loadList("SOG_OfficeField", baseUrl + "api/edatsroutinggroup/getallroutinggroupofficesbyidandtype/" + $("#SOG_RoutingOfficeGroupField").val() + "/Internal", internal, "", true, ccIds);
    },
    reloadExternal: function () {
        var ccIds = [];
        var datas = sendtoothergrouproutingofficeviewmodel.filtertableRow.fnGetData();
        $.each(datas, function (i, item) {
            $.merge(ccIds, item.ExternalOfficeIds.split(','));
        });

        var external = $("#SOG_ExternalOfficeField").val() == null ? "" : $("#SOG_ExternalOfficeField").val();
        commonViewModel.loadList("SOG_ExternalOfficeField", baseUrl + "api/edatsroutinggroup/getallroutinggroupofficesbyidandtype/" + $("#SOG_RoutingOfficeGroupField").val() + "/External", external, "", true, ccIds);
    },
    cancellationYes: function () {
        sendtoothergroupviewmodel.isForConfirmation = false;
        sendtoothergroupviewmodel.resetModalForm();
    },
    cancellationNo: function () {
        $('#sendToOtherGroupModal').modal('show');
        sendtoothergroupviewmodel.isForConfirmation = false;
    },
    saveYes: function () {
        commonViewModel.processingSave("#sendToOtherGroupModal", "#saveSendToOtherGroupBtn");

        var ccList = [];
        var datas = sendtoothergrouproutingofficeviewmodel.filtertableRow.fnGetData();
        $.each(datas, function (i, item) {
            ccList.push(new CC
            (
                item.Id,
                item.RoutingGroupId,
                item.OfficeIds,
                item.ExternalOfficeIds
            ));
        });

        $.ajax({
            url: baseUrl + "api/edatsdocument/sendtoothergroup",
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(
                {
                    routedId: parseInt($('#RoutedOffice').val()),
                    routingGroupId: $("#SOG_RoutingOfficeGroupField").val(),
                    routingOfficeId: $("#SOG_OfficeField").val(),
                    routingExternalOfficeId: $("#SOG_ExternalOfficeField").val(),
                    isExternalRoutingOffice: $("#SOG_OfficeField").prop("disabled"),
                    ccList: JSON.stringify(ccList),
                    action: sendtoothergroupviewmodel.action
                }),
            success: (result) => {
                if (commonViewModel.convertToUpper(result) == commonViewModel.convertToUpper("Ok")) {
                    sendtoothergroupviewmodel.isForConfirmation = false;

                    commonViewModel.doneSave("#sendToOtherGroupModal", "#saveSendToOtherGroupBtn");

                    if (sendtoothergroupviewmodel.action == "SEND TO RMD") {
                        notification.success("", "Request has been created and released to RMD.");
                    }
                    else if (sendtoothergroupviewmodel.action == "SEND TO OTHER GROUP") {
                        notification.success("", "The document has been successfully released to other group.");
                    }
                    else if (sendtoothergroupviewmodel.action == "RELEASE TO RMIS") {
                        var message = $("#SOG_OfficeField").val() != "" || $("#SOG_ExternalOfficeField").val() || ccList.length > 0
                            ? "The document has been successfully released to other group and to RMIS?" : "The document has been successfully released to RMIS.";
                        notification.success("", message);
                    }

                    sendtoothergroupviewmodel.resetModalForm();

                    routingviewmodel.firstLoad = true;
                    routingviewmodel.loadTimeline();
                }
                else {
                    notification.warning("", result);
                    commonViewModel.doneWithError("#sendToOtherGroupModal", "#saveSendToOtherGroupBtn");
                    sendtoothergroupviewmodel.isForConfirmation = false;
                }
            },
            failure: (response) => {
                notification.warning("", response);
                commonViewModel.doneWithError("#sendToOtherGroupModal", "#saveSendToOtherGroupBtn");
                sendtoothergroupviewmodel.isForConfirmation = false;
            }
        });
    },
    saveNo: function () {
        commonViewModel.doneWithError("#sendToOtherGroupModal", "#saveSendToOtherGroupBtn");
        sendtoothergroupviewmodel.isForConfirmation = false;
    },
    resetModalForm: function () {
        $('#sendToOtherGroupForm').trigger("reset");

        $("#SOG_RoutingOfficeGroupField").val("").trigger('change');
        $("#SOG_ExternalOfficeField").val("").trigger('change');
        $("#SOG_OfficeField").val("").trigger('change');

        $("#sendToOtherGroupForm").find(".has-error").removeClass("has-error");
        $("#sendToOtherGroupForm").find(".has-success").removeClass("has-success");

        sendtoothergroupviewmodel.isForConfirmation = false;
        sendtoothergroupviewmodel.isDirty = false;

        $("#saveSendToOtherGroupBtn").button('reset');
        $("#saveSendToOtherGroupBtn").prop("disabled", true);

        $("#SOG_OfficeField").prop("disabled", false);
        $("#SOG_ExternalOfficeField").prop("disabled", false);

        $("#SOG_OfficeField").rules("add", {
            required: true
        });
    },
    setFormIsDirty: function (value) {
        sendtoothergroupviewmodel.isDirty = value;
        $("#saveSendToOtherGroupBtn").prop("disabled", !value);
    },
    initializeFormValidation: function () {
        var form = $("#sendToOtherGroupForm");
        var error = $(".alert-danger", form);
        var success = $(".alert-success", form);

        form.validate({
            errorElement: "span", //default input error message container
            errorClass: "help-block help-block-error", // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",  // validate all fields including form hidden input
            rules: {
                SOG_RoutingOfficeGroupField: {
                    required: true,
                },
                SOG_OfficeField: {
                    required: true,
                },
                SOG_ExternalOfficeField: {
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

class CC {
    constructor(id, routingGroupId, officeIds, externalOfficeIds) {
        this.id = id;
        this.routingGroupId = routingGroupId;
        this.officeIds = officeIds;
        this.externalOfficeIds = externalOfficeIds
    }
}