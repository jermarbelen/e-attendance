$(document).ready(function () {
    viewmodel.initialize();
});

var viewmodel = {
    initialize: function () {
        if ($("#HasSaved").val() == 1) {
            if ($("#IsCreated").val() == 1) {
                notification.created();
            }
            else {
                notification.updated();
            }

            if ($("#IsPrintAcknowledgement").val() == 1) {
                viewmodel.generateReport(parseInt($("#EdatsDocumentIdForPrint").val()), "Acknowledgement Receipt");
            }
        }

        this.bindEvents();
    },
    bindEvents: function () {
        $("#viewFilterField").select2({ minimumResultsForSearch: -1 })
        .on("change", function (e) {
            $("#allDocumentDiv").hide();
            $("#needsActionDiv").hide();
            $("#inTransitDiv").hide();
            $("#releasedDiv").hide();
            $("#archivedDiv").hide();

            $('#dataTable').DataTable().destroy();
            $('#dataTable-needs-action').DataTable().destroy();
            $('#dataTable-intransit').DataTable().destroy();
            $('#dataTable-released').DataTable().destroy();
            $('#dataTable-archived').DataTable().destroy();

            if ($("#viewFilterField").val() == "All") {
                $("#allDocumentDiv").show();
                
                if (!$.fn.DataTable.isDataTable('#dataTable')) {
                    alldocumentsviewmodel.loadTable();
                }
                else {
                    alldocumentsviewmodel.filtertable.fnFilter("");
                }
            }
            else if ($("#viewFilterField").val() == "NeedsAction") {
                $("#needsActionDiv").show();
                if (!$.fn.DataTable.isDataTable('#dataTable-needs-action')) {
                    needsactionviewmodel.loadTable();
                }
                else {
                    needsactionviewmodel.filtertable.fnFilter("");
                }
            }
            else if ($("#viewFilterField").val() == "InTransit") {
                $("#inTransitDiv").show();
                if (!$.fn.DataTable.isDataTable('#dataTable-intransit')) {
                    intransitviewmodel.loadTable();
                }
                else {
                    intransitviewmodel.filtertable.fnFilter("");
                }
            }
            else if ($("#viewFilterField").val() == "Released") {
                $("#releasedDiv").show();
                if (!$.fn.DataTable.isDataTable('#dataTable-released')) {
                    releasedviewmodel.loadTable();
                }
                else {
                    releasedviewmodel.filtertable.fnFilter("");
                }
            }
            else if ($("#viewFilterField").val() == "Archived") {
                $("#archivedDiv").show();
                if (!$.fn.DataTable.isDataTable('#dataTable-archived')) {
                    archivedviewmodel.loadTable();
                }
                else {
                    archivedviewmodel.filtertable.fnFilter("");
                }
            }

            $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
        });

        $(window).bind('resize', function () {
            if ($(window).width() - 215 > 700) {
                $('#progressNoteDetails').height($(window).width() - 215)
            }

            var contentHeight = $(window).innerHeight();
            var paddingHeight = 500;

            if (contentHeight > 500) {
                $('#progressNoteDetails').height(contentHeight - paddingHeight);

            } else {
                $('#progressNoteDetails').height(500);
            }
        }).trigger('resize');

        $("#viewFilterField").val($("#FilterData").val()).trigger('change');
    },
    generateReport: function (addresseeId, reportType) {
        $.ajax({
            url: edatsBaseUrl + "Report/GenerateByReportType",
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(
                {
                    reportType: reportType,
                    addresseeId: addresseeId,
                    multiple: true
                }),
            success: (result) => {
                if (result.Message.toUpperCase().search("Error".toUpperCase()) > -1) {
                    notification.warning("", result.Message);
                }
                else {
                    window.open(result.FilePath, '_blank');
                    viewmodel.deleteFile(result.FolderName, result.FileName);
                }
            },
            failure: (response) => {
                commonViewModel.unloadDiv("RoutingDiv");
                notification.warning("", "Encountered Error!");
            }
        });
    },
    deleteFile: function (folderName, fileName) {
        setTimeout(function () {
            $.ajax({
                url: edatsBaseUrl + "Report/DeleteFile",
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ folderName: folderName, fileName: fileName }),
                success: (result) => { },
                failure: (response) => { }
            });
        }, 5000);
    }
};