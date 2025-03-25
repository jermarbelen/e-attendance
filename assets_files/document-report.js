$(document).ready(function () {
    documentreportsviewmodel.initialize();
});

var documentreportsviewmodel = {
    fileName: "",
    folderName: "",
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        // resize window
        $(window).bind('resize', function () {
            if ($(window).width() - 215 > 700) {
                $('#edatsReportIframe').height($(window).width() - 215)
            }

            var contentHeight = $(window).innerHeight();
            var paddingHeight = 250;

            if (contentHeight > 250) {
                $('#edatsReportIframe').height(contentHeight - paddingHeight)
            } else {
                $('#edatsReportIframe').height(400)
            }
        }).trigger('resize');

        $('#edatsReportModal').on('hidden.bs.modal', function (e) {
            documentreportsviewmodel.deleteFile();
            $("#edatsReportIframe").attr("src", "");
        });

        $('#edatsReportIframe').load(function () {
            if ($("#edatsReportIframe").length) {
                documentreportsviewmodel.deleteFile();
            }
        });
    },
    generateReport: function (addresseeId, reportType) {
        commonViewModel.loadDiv("RoutingDiv");

        $.ajax({
            url: edatsBaseUrl + "Report/GenerateByReportType",
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(
                {
                    reportType: reportType,
                    addresseeId: addresseeId
                }),
            success: (result) => {
                if (result.Message.toUpperCase().search("Error".toUpperCase()) > -1) {
                    commonViewModel.unloadDiv("RoutingDiv");
                    notification.warning("", result.Message);
                }
                else {
                    documentreportsviewmodel.fileName = result.FileName;
                    documentreportsviewmodel.folderName = result.FolderName;

                    window.open(result.FilePath);

                    commonViewModel.unloadDiv("RoutingDiv");
                }
            },
            failure: (response) => {
                commonViewModel.unloadDiv("RoutingDiv");
                notification.warning("", "Encountered Error!");
            }
        });
    },
    deleteFile: function () {
        setTimeout(function () {
            $.ajax({
                url: edatsBaseUrl + "Report/DeleteFile",
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ folderName: documentreportsviewmodel.folderName, fileName: documentreportsviewmodel.fileName }),
                success: (result) => { },
                failure: (response) => { }
            });
        }, 5000);
    }
}