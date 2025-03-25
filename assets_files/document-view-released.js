$(document).ready(function () {
    releasedviewmodel.initialize();
});

var releasedviewmodel = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        $(document).on('click', function (e) {
            $('[data-toggle="popover"],[data-original-title]').each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false 
                }
            });
        });

        // Open Child Grid
        $("#dataTable-released").on("click", "td.details-control", function () {
            var nTr = $(this).parents('tr')[0];
            var tr = $(this).closest("tr");
            var data = releasedviewmodel.filtertable.fnGetData(tr);

            if (releasedviewmodel.filtertable.fnIsOpen(nTr)) {
                /* This row is already open - close it */
                releasedviewmodel.filtertable.fnClose(nTr);
                tr.removeClass("shown");
            }
            else {
                /* Open this row */
                releasedviewmodel.filtertable.fnOpen(nTr, releasedviewmodel.generateChildGrid(data), "");
                releasedviewmodel.loadChildTable(data);
                tr.addClass("shown");
            }
        });
    },
    generateChildGrid: function (d) {
        var compiled = _.template($("#detailreleased-template").html());
        return compiled({ id: d.Id });
    },
    loadTable: function () {
        var table = $('#dataTable-released');

        datatableviewmodel.AddSearchColumn("dataTable-released", "released");
        datatableviewmodel.FixHeader();

        releasedviewmodel.filtertable = $('#dataTable-released').dataTable({
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
                "url": edatsBaseUrl + "Document/GetDocumentReleasedData",
                "type": "POST",
                "data": function (d) {
                    d.code = $("#released1").val(),
                    d.subject = $("#released2").val(),
                    d.sender = $("#released3").val(),
                    d.addressee = $("#released4").val(),
                    d.releasingOffice = $("#released5").val(),
                    d.dateReleasedFrom = $("#dateRangereleasedReleaseDate").val() == "" ? "" : $("#dateRangereleasedReleaseDate").val().split(" - ")[0],
                    d.dateReleasedTo = $("#dateRangereleasedReleaseDate").val() == "" ? "" : $("#dateRangereleasedReleaseDate").val().split(" - ")[1]
                },
            },
            columns: [
               { "data": "Id", "visible": false },
               {
                   "className": "details-control",
                   "orderable": false,
                   "data": null,
                   "defaultContent": "",
                   "width": "3px"
               },
               {
                   "data": "Code",
                   "width": "15%",
                   "orderable": true,
                   "render": function (data, type, full, meta) {
                       return "<a href='" + edatsBaseUrl + "Document/View?id=" + full["Id"] + "&type=ROUT'>" + full["Code"] + "</a>";
                   }
               },
               { "data": "Subject", "orderable": true },
               {
                   "data": "null",
                   "orderable": false,
                   "width": "2%",
                   "render": function (data, type, full, meta) {
                       if (full["IsMultipleAttachment"] == true)
                       {
                           var attachments = "";
                           var files = full["MultipleAttachments"].split(",");
                           for (var i = 0; i < files.length; i++) {
                               attachments = attachments +
                                   "<li><a target='_blank' href='" + baseUrl + "Attachments/EDATS/Document/" + files[i] + "'><i class='fa fa-paperclip' aria-hidden='true'></i>&nbsp;&nbsp;" + files[i] + "</a></li>";
                           }

                           return '<a href="#" ' +
                               'data-toggle="popover" ' +
                               'data-content="' +
                                  "<ul style='list-style-type:none; padding: 0;'>" + attachments + '</ul>' +
                               '">' +
                               '<i class="fa fa-paperclip" aria-hidden="true"></i></a>';
                       }
                       else
                       {
                           return full["AttachmentFileName"] != ""
                                    ? '<a target="_blank" href="'+ baseUrl + 'Attachments/EDATS/Document/' + full["AttachmentFileName"] + '"><i class="fa fa-paperclip" aria-hidden="true"></i></a>'
                                    : "";
                       }
                   }
               },
               { "data": "Sender", "width": "15%", "orderable": true },
               { "data": "For_To", "orderable": true, },
               { "data": "ReleasingOffice", "orderable": true, },
               { "data": "DateReleased", "width": "10%", "orderable": true },
                {
                    "data": "Action",
                    "orderable": false,
                    "render": function (data, type, full, meta) {
                        if (full["ForRecall"] == true) {
                            var action = "<div class='btn-group pull-right'>" +
                                           "<button type='button' class='btn green btn-sm btn-outline dropdown-toggle' data-toggle='dropdown'> Actions<i class='fa fa-angle-down'></i></button>" +
                                           "<ul class='dropdown-menu pull-right' role='menu'>" +

                                           "<li><a class='recall' href='#'>Recall</a></li>" +
                                           "</ul></div>";

                            return action;
                        }
                        else {
                            return "";
                        }
                    }
                }
            ],

            fixedHeader: {
                header: true,
                headerOffset: datatableviewmodel.fixedHeaderOffset
            },

            order: [[8, "desc"]],

            lengthMenu: [
                [5, 10, 15, 20, 30],
                [5, 10, 15, 20, 30] // change per page values here
            ],

            pageLength: 10,

            dom: "frtlip", // horizobtal scrollable datatable,

            drawCallback: function () {
                $('[data-toggle="popover"]').popover({
                    html: true,
                    placement: 'right'
                });
            }
        });

        datatableviewmodel.InitializeEventsForSearchColumn("dataTable-released", releasedviewmodel.filtertable, "released");
        datatableviewmodel.DropdownFilterDataCountBesideInfo();

        table.on('click', '.recall', function (e) {
            e.preventDefault();

            var nRow = $(this).parents('tr')[0];
            var data = releasedviewmodel.filtertable.fnGetData(nRow)

            releasedviewmodel.id = data.Id;
            notification.confirm("Recall Document?", "Document will be recalled.", "RECALL", "CANCEL", releasedviewmodel.recallYes, null);

        });
    },
    recallYes: function () {
        $.ajax({
            url: baseUrl + "api/edatsdocument/recall",
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(
              {
                  id: releasedviewmodel.id,
              }),
            success: (result) => {
                if (commonViewModel.convertToUpper(result) == commonViewModel.convertToUpper("Ok")) {
                    notification.success("", "The document has been recall!");
                    releasedviewmodel.filtertable.fnFilter("");
                }
                else {
                    notification.warning("", "Encountered Error!");
                }
            },
            failure: (response) => {
                notification.warning("", "Encountered Error!");
            }
        });
    },
    loadChildTable: function (d) {
        releasedviewmodel.detailTable = $('#dataTableReleasedDetail' + d.Id).dataTable({
            filter: false,
            orderCellsTop: true,
            stateSave: false,
            processing: true,
            serverSide: false,
            autoWidth: true,
            bPaginate: false,
            bInfo : false,
            pagingType: "bootstrap_full_number",
            language: {
                "lengthMenu": "_MENU_",
                "processing": ""
            },
            ajax: {
                "url": edatsBaseUrl + "Document/GetDocumentReleasedDetailData",
                "type": "POST",
                "data": function (c) {
                    c.id = d.Id
                }
            },
            columns: [
                { "data": "DestinationOffice", "orderable": false },
                { "data": "AcceptedDate", "orderable": false },
                { "data": "DaysInTransit", "orderable": false, "className": "text-center", },
                { "data": "Status", "orderable": false },
            ],

            order: [[1, "desc"]],

            dom: "frtlip", // horizobtal scrollable datatable
        });

        datatableviewmodel.DropdownFilterDataCountBesideInfo();
    }
};