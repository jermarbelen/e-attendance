$(document).ready(function () {
    alldocumentsviewmodel.initialize();
});

var alldocumentsviewmodel = {
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
        $("#dataTable").on("click", "td.details-control", function () {
            var nTr = $(this).parents('tr')[0];
            var tr = $(this).closest("tr");
            var data = alldocumentsviewmodel.filtertable.fnGetData(tr);

            if (alldocumentsviewmodel.filtertable.fnIsOpen(nTr)) {
                /* This row is already open - close it */
                alldocumentsviewmodel.filtertable.fnClose(nTr);
                tr.removeClass("shown");
            }
            else {
                /* Open this row */
                alldocumentsviewmodel.filtertable.fnOpen(nTr, alldocumentsviewmodel.generateChildGrid(data), "");
                alldocumentsviewmodel.loadChildTable(data);
                tr.addClass("shown");
            }
        });
    },
    generateChildGrid: function (d) {
        var compiled = _.template($("#detail-template").html());
        return compiled({ id: d.Id });
    },
    loadTable: function () {
        datatableviewmodel.AddSearchColumn("dataTable");
        datatableviewmodel.FixHeader();

        alldocumentsviewmodel.filtertable = $('#dataTable').dataTable({
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
                "url": edatsBaseUrl + "Document/GetDocumentViewData",
                "type": "POST",
                "data": function (d) {
                    d.code = $("#1").val(),
                    d.subject = $("#2").val(),
                    d.sender = $("#3").val(),
                    d.dateCreatedFrom = $("#dateRangeDateCreated").val() == "" ? "" : $("#dateRangeDateCreated").val().split(" - ")[0],
                    d.dateCreatedTo = $("#dateRangeDateCreated").val() == "" ? "" : $("#dateRangeDateCreated").val().split(" - ")[1]
                }
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
                    "orderable": true,
                    "width": "15%",
                    "render": function (data, type, full, meta) {
                        return "<a href='" + edatsBaseUrl + "Document/View?id=" + full["Id"] + "&type=DOCUMENT'>" + full["Code"] + "</a>";
                    }
               },
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
                                    ? '<a target="_blank" href="' + baseUrl + 'Attachments/EDATS/Document/' + full["AttachmentFileName"] + '"><i class="fa fa-paperclip" aria-hidden="true"></i></a>'
                                    : "";
                       }
                   }
               },
               { "data": "Subject", "orderable": true },
               { "data": "Addressee", "orderable": true, "className": "text-center", },
               { "data": "Sender", "width": "15%", "orderable": true },
               { "data": "DateCreated", "width": "10%", "orderable": true },
            ],

            fixedHeader: {
                header: true,
                headerOffset: datatableviewmodel.fixedHeaderOffset
            },

            order: [[7, "desc"]],

            lengthMenu: [
                [5, 10, 15, 20, 30],
                [5, 10, 15, 20, 30] // change per page values here
            ],

            pageLength: 10,

            dom: "frtlip", // horizobtal scrollable datatable,

            drawCallback: function () {
                $('[data-toggle="popover"]').popover({
                    html: true,
                    placement: 'right',
                    container: 'body'
                });
            }
        });

        datatableviewmodel.InitializeEventsForSearchColumn("dataTable", alldocumentsviewmodel.filtertable);
        datatableviewmodel.DropdownFilterDataCountBesideInfo();
    },
    loadChildTable: function (d) {
        datatableviewmodel.AddSearchColumn('dataTableDetail' + d.Id, "detail");

        alldocumentsviewmodel.detailTable = $('#dataTableDetail' + d.Id).dataTable({
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
                "url": edatsBaseUrl + "Document/GetDocumentAddresseeData",
                "type": "POST",
                "data": function (c) {
                    c.id = d.Id
                    c.code = $("#detail1").val(),
                    c.addressee = $("#detail2").val(),
                    c.cc = $("#selectdetailCC").val()
                }
            },
            columns: [
                {
                     "data": "Code",
                     "orderable": true,
                     "render": function (data, type, full, meta) {
                         return "<a href='" + edatsBaseUrl + "Document/View?id=" + full["Id"] + "&type=ROUT'>" + full["Code"] + "</a>";
                     }
                },
                { "data": "Addressee", "orderable": true },
                { "data": "CC", "orderable": true },
                { "data": "DaysElapsed", "orderable": false, "className": "text-center", },
            ],

            order: [[0, "asc"]],

            lengthMenu: [
                [5, 10, 15, 20, 30],
                [5, 10, 15, 20, 30] // change per page values here
            ],

            pageLength: 5,

            dom: "frtlip", // horizobtal scrollable datatable
        });

        datatableviewmodel.InitializeEventsForSearchColumn("dataTableDetail" + d.Id, alldocumentsviewmodel.detailTable, "detail");
        datatableviewmodel.DropdownFilterDataCountBesideInfo();
    }
};