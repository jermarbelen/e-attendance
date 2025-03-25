$(document).ready(function () {
    routingviewmodel.initialize();
    timelineviewmodel.initialize();
});

var routingviewmodel = {
    routingId: 0,
    byAddressee: true,
    firstLoad: true,
    isRoutCC: false,
    initialize: function () {
        routingviewmodel.routingId = parseInt($("#EdatsAddresseeId").val());

        $("#PN_DocumentCode").html($("#DocumentcodeData").val());
        $("#RoutedOffice").select2({ minimumResultsForSearch: -1 });
        routingviewmodel.byAddressee = false;

        $('#tabs').tabs({
            activate: function (event, ui) {
                var tabId = ui.newTab.context.hash.replace("#", "");
                $("#DefaultTab").val(tabId);

                if (tabId == "routingInformationTab") {
                    routingviewmodel.loadTimeline();
                }
            }
        });

        $('#RoutedOffice').change(function () {
            routingviewmodel.loadRoutedInformationByRoutedOffice();
            routingviewmodel.reloadTimeLine(true);
        });

        $('#tabs a[href="#' + $("#DefaultTab").val() + '"]').trigger('click');

        if ($("#DefaultTab").val() == "documentInformationTab") {
            routingviewmodel.loadTimeline();
        }
    },
    loadTimeline:function(){
        if (routingviewmodel.firstLoad) {
            $.getJSON(baseUrl + "api/edatsdocument/getroutinglistonload/" + $('#EdatsAddresseeId').val(), function (data) {
                console.log(data);
                $("#timelinelist").empty();
                var countli = $('.events ol li').size() + 1;

                for (var i = 0; i < data.length; i++) {
                    var rout = data[i];
                    $(".events ol").append('<li><a href="#0" onclick="routingviewmodel.loadRoutedInformation(' +  rout.routedOfficeId + ', this, false)" data-rank="' + countli + '" style="left:' + (countli * 150) + 'px" class="border-after-red bg-after-red ' + rout.selected + '">' + (parseInt(rout.count) > 1 ? parseInt(rout.count) : "") + '</a></li>');

                    countli++;

                    if (rout.routedOffices != null && rout.routedOffices != undefined) {
                        $("#RoutedOffice").empty();
                        commonViewModel.loadDiv("RoutedOfficeDiv");
                        if (rout.routedOffices.length > 0) {
                            $.each(rout.routedOffices, function (index, value) {
                                var selected = rout.routedOfficeId.toString().trim() == value.id.toString().trim() ? "selected='selected'" : "";
                                $("#RoutedOffice").append("<option " + selected + " value='" + value.id + "'>" + value.name + " </option>");
                            });
                        }

                        commonViewModel.unloadDiv("RoutedOfficeDiv");
                    };
                }

                $(".prev").click();
                $(".firstSelected").click();

                routingviewmodel.firstLoad = $("#DefaultTab").val() == "documentInformationTab";
            });
        }
    },
    reloadTimeLine: function (fromRoutedOffice) {
        var selectedTimeLine = null;

        $(".events ol li").each(function (index) {
            if ($(this).find('a').hasClass("selected")) {
                selectedTimeLine = $(this).find('a')[0];
            }
        });

        routingviewmodel.loadRoutedInformation(parseInt($('#RoutedOffice').val()), selectedTimeLine, fromRoutedOffice);
    },
    loadRoutedInformationByRoutedOffice: function () {
        commonViewModel.loadDiv("RoutingInformation");
        commonViewModel.loadDiv("ProgressNoteDetails");

        $.getJSON(baseUrl + "api/edatsdocument/getroutinginformationbyid/" + $('#RoutedOffice').val(), function (data) {
            console.log(data);
            $("#DocumentStatus").html(data.status);
            $("#ReceiverName").html(data.receiverName);
            $("#ReceivedDateTime").html(data.receivedDateTime);
            $("#ReceiverOffice").html(data.receiverOffice);

            $("#DestinationId").val(data.destinationId);
            $("#DestinationType").val(data.destinationType);

            routingviewmodel.routingId = parseInt(data.routingId);

            if (!data.isReceived)
            {
                $("#RoutingPhotoDiv").hide();
            }
            else {
                $("#RoutingPhotoDiv").show();

                if (data.receiverImage != "" && data.receiverImage != null && data.receiverImage != undefined) {
                    $("#RoutingPhoto").attr("src", baseUrl + data.receiverImage);
                }
                else {
                    $("#RoutingPhoto").attr("src", baseUrl + "Content/img/nophoto.gif");
                }
            }

            $("#SenderName").html(data.senderOffice);
            $("#AcceptanceRemarks").html(data.acceptanceRemarks);

            $("#progressNoteBtn").prop("disabled", data.canManageProgressNote == false);
            $("#releaseBtn").prop("disabled", data.canManageReleaseDocument == false);
            $("#finalActionBtn").prop("disabled", data.canManageFinalAction == false);

            if (data.canManageEdit === true) {

                $("#editBtn").click(function (e) {
                    e.preventDefault();
                    return true;
                });

                $("#editBtn").attr("onclick", "return true").css({
                    cursor: "pointer",
                    opacity: "1"
                });
            }
            else {
                $("#editBtn").click(function (e) {
                    e.preventDefault();
                    return false;
                });

                $("#editBtn").attr("onclick", "return false").css({
                    cursor: "not-allowed",
                    opacity: ".6"
                });
            }

            if (data.edatsRmisOffice && !data.isRoutCC) {
                $("#releaseToRmisBtn").show();
                $("#releaseToRmisBtn").prop("disabled", data.canReleaseToRmis == false);
            }
            else {
                $("#releaseToRmisBtn").hide();
            }

            if (data.canSendToOtherGroup) {
                $("#sendToOtherGroupBtn").show();
            }
            else {
                $("#sendToOtherGroupBtn").hide();
            }

            if (data.requestToSendToOtherGroup) {
                $("#requesttoSendToOtherGroupBtn").show();
            }
            else {
                $("#requesttoSendToOtherGroupBtn").hide();
            }

            routingviewmodel.isRoutCC = data.isRoutCC;

            $("#CCDiv").hide();
            $("#CCActionInfo").hide();

            $("#CCActionInfo_Status").text(data.routCCActionStatus);
            $("#CCActionInfo_Remarks").text(data.routCCActionRemarks);
            $("#CCActionInfo_ActionDate").text(data.routCCActionDate);
            $("#CCActionInfo_ActionBy").text(data.routCCActionBy);

            if (data.isRoutCC) {
                $("#CCDiv").show();
               
                if (data.isRoutArchived) {
                    $("#CCActionInfo").show();
                }
            }

            commonViewModel.unloadDiv("RoutingInformation");

            routingviewmodel.addTimeLine();
        });

        $.getJSON(baseUrl + "api/edatsdocument/getprogressnotebyroutedoffice/" + $('#RoutedOffice').val(), function (data) {
            var template = _.template($("#progress-note-template").html());
            $("#progressnotelist").empty();

            for (var i = 0; i < data.length; i++) {
                $('#progressnotelist').append(template({
                    baseUrl: baseUrl,
                    data: data[i].mainNote,
                }));

                if (data[i].mainNote.actionOfficerName == "" ||
                    data[i].mainNote.actionOfficerName == null ||
                    data[i].mainNote.actionOfficerName == undefined) {
                    $("#mt-action-body_" + data[i].mainNote.id).css('padding-left', 'unset');
                }

                $("#container_" + data[i].mainNote.id).css('background-color', '#fdfdfd');

                for (var a = 0; a < data[i].replies.length; a++) {
                    $('#progressnotelist').append(template({
                        baseUrl: baseUrl,
                        data: data[i].replies[a],
                    }));

                    $("#container_" + data[i].replies[a].id).css('background-color', '#f5f7d9');
                }
            }

            commonViewModel.unloadDiv("ProgressNoteDetails");
        });
    },
    loadList: function (elem, url) {
        $("#" + elem).empty();
        commonViewModel.loadDiv(elem + "Div");
        $.getJSON(url, function (data) {
            if (data.length > 0) {
                $.each(data, function (index, value) {
                    $("#" + elem).append("<option value='" + value.id + "'>" + value.name + " </option>");
                });
            }

            commonViewModel.unloadDiv(elem + "Div");

            if (elem == "RoutedOffice") {
                routingviewmodel.loadRoutedInformationByRoutedOffice();
            }
        });
    },
    loadRoutedInformation: function (id, elem, fromRoutedOffice) {
        if (!routingviewmodel.firstLoad) {
            $(".events ol li").each(function (index) {
                var originRank = parseInt($(elem).data("rank"));
                var rank = parseInt($(this).find('a').data("rank"));

                if (rank > originRank) {
                    this.remove();
                }
            });

            if (!fromRoutedOffice) {
                if (id <= 0) {
                    routingviewmodel.routingId = parseInt($("#EdatsAddresseeId").val());
                    routingviewmodel.byAddressee = true;
                }

                routingviewmodel.loadList("RoutedOffice", baseUrl + "api/edatsdocument/getroutingofficebyorigin/" + routingviewmodel.byAddressee + "/" + (routingviewmodel.routingId) + "/" + id);
                routingviewmodel.byAddressee = false;
            }
        }
        else {
            routingviewmodel.loadRoutedInformationByRoutedOffice();
            timelineviewmodel.initialize();
        }
    },
    addTimeLine: function () {
        $.getJSON(baseUrl + "api/edatsdocument/getnextrouteddata/" + $('#RoutedOffice').val(), function (data) {
            if (parseInt(data) > 0) {
                var countli = $('.events ol li').size() + 1;
                $(".events ol").append('<li><a href="#0" onclick="routingviewmodel.loadRoutedInformation(' + parseInt($('#RoutedOffice').val()) + ', this, false)" data-rank="' + countli + '" style="left:' + (countli * 150) + 'px" class="border-after-red bg-after-red">' + (parseInt(data) > 1 ? parseInt(data) : "") + '</a></li>');
                timelineviewmodel.initialize();
            }
        });
    }
}