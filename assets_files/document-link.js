$(document).ready(function () {
    linkdocumentviewmodel.initialize();
    linkdocumentviewmodel.loadTable();
});

var linkdocumentviewmodel = {
    forVerify: false,
    initialize: function () {
        $('#linkDocumentModal').on('shown.bs.modal', function (e) {
            $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
        });

        //// Cancel Button
        $("#cancelLinkBtn").click(function () {
            $('#linkDocumentModal').modal('hide');
        });
    },
    loadData: function (forVerify) {
        linkdocumentviewmodel.forVerify = forVerify;
        $('#linkDocumentModal').modal();
        linkdocumentviewmodel.filtertable.fnFilter("");
    },
    verifyData: function () {
        var subject = $("#SubjectPrefix").val() + " " + $("#Subject").val();
        if (subject.trim() != "") {
            $.getJSON(baseUrl + "api/edatsdocument/getpossiblerelateddocument/" + formmodel.id + "/" + true + "/" + ($("#SubjectPrefix").val() + " " + $("#Subject").val()).replace(/\//g, "$a909$"), function (data) {
                $("#PossibleRelatedDocumentLink").text("There are (" + data + ") possible related documents");
            });
        }
        else {
            $("#PossibleRelatedDocumentLink").text("There are (0) possible related documents");
        }
    },
    unlinkDocument: function () {
        $("#DocumentLinkId").val(0);
        $("#DocumentLinkSubject").val("");

        $("#UnlinkDocumentDiv").hide();
        formmodel.setFormIsDirty(true)
    },
    loadTable: function () {
        var table = $('#dataTable-link-document');

        linkdocumentviewmodel.filtertable = $('#dataTable-link-document').dataTable({
            filter: false,
            orderCellsTop: true,
            serverSide: true,
            stateSave: false,
            responsive: true,
            processing: true,
            paginate: {
                "previous": "Prev",
                "next": "Next",
                "last": "Last",
                "first": "First"
            },
            pagingType: "bootstrap_full_number",
            language: {
                "lengthMenu": "_MENU_",
                "processing": ""
            },
            ajax: {
                "url": edatsBaseUrl + "Document/GetPossibleRelatedDocument",
                "type": "POST",
                "data": function (d) {
                    d.edatsDocumentId = formmodel.id,
                    d.searchsubject = $("#SubjectPrefix").val() + " " + $("#Subject").val(),
                    d.forVerify = linkdocumentviewmodel.forVerify ? 1 : 0
                }
            },
            columns: [
               { "data": "Id", "visible": false },
               { "data": "Rank", "visible": false },
               { "data": "Subject", "orderable": false },
               {
                   "data": "Action",
                   "orderable": false,
                   "width": "10%",
                   "visible": !linkdocumentviewmodel.forVerify,
                   "render": function (data, type, full, meta) {
                       return "<u><a href='#' class='link forLink'>Link</a></u>";
                   }
               }
            ],

            order: [[1, "desc"]],

            lengthMenu: [
                [5, 10, 15],
                [5, 10, 15] // change per page values here
            ],

            pageLength: 5,

            dom: "frtlip", // horizobtal scrollable datatable
        });

        datatableviewmodel.DropdownFilterDataCountBesideInfo();

        table.on('click', '.link', function (e) {
            e.preventDefault();

            var nRow = $(this).parents('tr')[0];
            var data = linkdocumentviewmodel.filtertable.fnGetData(nRow);

            $("#DocumentLinkId").val(data.Id);
            $("#DocumentLinkSubject").val(data.Subject);
            $("#UnlinkDocumentDiv").show();

            $('#linkDocumentModal').modal('hide');

            formmodel.setFormIsDirty(true)
        });
    }
}