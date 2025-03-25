$(document).ready(function () {
    informationviewmodel.initialize();
});

var informationviewmodel = {
    initialize: function () {
        $("#EdatsAddresseeId").select2({ minimumResultsForSearch: -1 })
        .change(function () {
            window.location.href = edatsBaseUrl + "Document/View?id=" + $("#EdatsAddresseeId").val() + "&type=ADDRESSEE&defaultTab=" + $("#DefaultTab").val();
        });

        $("#finalActionBtn").click(function () {
            finalactionviewmodel.finalAction();
        });

        $("#releaseBtn").click(function () {
            if (routingviewmodel.isRoutCC) {
                $("#ToDiv").hide();

                $("#InternalOfficeField").rules("remove");
                $("#ExternalOfficeField").rules("remove");

                commonViewModel.removeSelectFieldValidation("#ExternalOfficeField", "#ExternalOfficeDiv");
                commonViewModel.removeSelectFieldValidation("#InternalOfficeField", "#InternalOfficeDiv");

                $("#InternalOfficeCCField").rules("add", {
                    required: true
                });
            }
            else {
                $("#ToDiv").show();

                $("#InternalOfficeCCField").rules("remove");
                $("#ExternalOfficeCCField").rules("remove");

                commonViewModel.removeSelectFieldValidation("#InternalOfficeCCField", "#InternalOfficeDiv");
                commonViewModel.removeSelectFieldValidation("#ExternalOfficeCCField", "#ExternalOfficeCCDiv");

                $("#InternalOfficeField").rules("add", {
                    required: true
                });

                $("#ExternalOfficeField").rules("add", {
                    required: true
                });
            }

            $.getJSON(baseUrl + "api/edatsroutinggroup/IsUserHasRoutingGroup", function (result) {
                if (result) {
                    $("#releaseModal").modal();
                    $("#ReleaseCCDiv").show();

                    releaseviewmodel.reloadInternal(true);
                    releaseviewmodel.reloadInternal(false);

                    $.getJSON(baseUrl + "api/edatsroutinggroup/IsUserInCentralOfficeGroup", function (result) {
                        releaseviewmodel.isCentralOffice = result;

                        if (result) {
                            if (routingviewmodel.isRoutCC) {
                                $("#ExternalOfficeCCField").rules("add", {
                                    required: true
                                });
                            }

                            releaseviewmodel.reloadExternal(false);
                            releaseviewmodel.reloadExternal(true);

                            $(".ExternalOfficeDiv").show();

                            if (releaseviewmodel.canReleaseATRS && !routingviewmodel.isRoutCC) {
                                $("#ReleaseToATRSDiv").show();
                            }
                            else {
                                $("#ReleaseToATRSDiv").hide();
                            }

                            if (releaseviewmodel.canReleaseLMIS && !routingviewmodel.isRoutCC) {
                                $("#ReleaseToLMISDiv").show();
                            }
                            else {
                                $("#ReleaseToLMISDiv").hide();
                            }
                        }
                        else {
                            $(".ExternalOfficeDiv").hide();

                            $("#ExternalOfficeCCField").rules("remove");
                            commonViewModel.removeSelectFieldValidation("#ExternalOfficeField", "#ExternalOfficeDiv");

                            $("#ExternalOfficeField").rules("remove");
                            commonViewModel.removeSelectFieldValidation("#ExternalOfficeField", "#ExternalOfficeDiv");
                        }
                    });
                }
                else {
                    notification.warning("", "Cannot proceed, user office not included in any routing group settings.");
                }
            });
        });

        $("#releaseToRmisBtn").click(function (e) {
            $("#SOG_RoutingOfficeGroupField").rules("remove");
            $("#SOG_OfficeField").rules("remove");

            sendtoothergroupviewmodel.isDirty = true;
            $("#saveSendToOtherGroupBtn").prop("disabled", false);

            sendtoothergroupviewmodel.action = "RELEASE TO RMIS";
            informationviewmodel.sendToOtherGroup();
            //notification.confirm("Release Document to RMIS?", "Document will be released to RMIS.", "RELEASE", "CANCEL", routingviewmodel.releaseToRMIS, null);
        });

        $("#sendToOtherGroupBtn").click(function (e) {
            $("#SOG_RoutingOfficeGroupField").rules("add", {
                required: true
            });

            $("#SOG_OfficeField").rules("add", {
                required: true
            });

            sendtoothergroupviewmodel.action = "SEND TO OTHER GROUP";
            informationviewmodel.sendToOtherGroup();
        });

        $("#requesttoSendToOtherGroupBtn").click(function (e) {
            $("#SOG_RoutingOfficeGroupField").rules("add", {
                required: true
            });

            $("#SOG_OfficeField").rules("add", {
                required: true
            });

            sendtoothergroupviewmodel.action = "SEND TO RMD";
            informationviewmodel.sendToOtherGroup();
        });

        $("#progressNoteBtn").click(function () {
            $("#progressNoteModal .modal-title").text("Progress Note");
            $("#progressNoteModal").modal();
        });
    },
    sendToOtherGroup: function () {
        sendtoothergrouproutingofficeviewmodel.loadTable();

        $.getJSON(baseUrl + "api/edatsroutinggroup/IsUserHasRoutingGroup", function (result) {
            if (result) {
                $.getJSON(baseUrl + "api/edatsdocument/GetSendToOtherGroupRequestByRoutingId/" + parseInt($('#RoutedOffice').val()), function (result) {
                    if (result != null) {
                        commonViewModel.loadList("SOG_RoutingOfficeGroupField", baseUrl + "api/edatsroutinggroup/getallotherroutinggroup", result.routingGroupId, "", true);
                        commonViewModel.loadList("SOG_OfficeField", baseUrl + "api/edatsroutinggroup/getallroutinggroupofficesbyidandtype/" + result.routingGroupId + "/Internal", result.routingOfficeId, "", true);

                        sendtoothergroupviewmodel.validateOfficeField(result.routingOfficeId);

                        $("#saveSendToOtherGroupBtn").prop("disabled", false);
                        sendtoothergroupviewmodel.isDirty = true;
                    }
                    else {
                        commonViewModel.loadList("SOG_RoutingOfficeGroupField", baseUrl + "api/edatsroutinggroup/getallotherroutinggroup", "", "", true);
                        sendtoothergroupviewmodel.validateOfficeField(0);
                    }

                    $("#sendToOtherGroupModal .modal-title").text(sendtoothergroupviewmodel.action);
                    $("#saveSendToOtherGroupBtn").text(sendtoothergroupviewmodel.action);
                    $("#sendToOtherGroupModal").modal();
                });
            }
            else {
                notification.warning("", "Cannot proceed, user office not included in any routing group settings.");
            }
        });
    }
}