$(document).ready(function () {
    intransitviewmodel.initialize();
});

var intransitviewmodel = {
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
    },
    loadTable: function () {
        datatableviewmodel.AddSearchColumn("dataTable-intransit", "intransit");
        datatableviewmodel.FixHeader();

        intransitviewmodel.filtertable = $('#dataTable-intransit').dataTable({
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
                "url": edatsBaseUrl + "Document/GetDocumentInTransitData",
                "type": "POST",
                "data": function (d) {
                    d.code = $("#intransit1").val(),
                    d.subject = $("#intransit2").val(),
                    d.routing = $("#intransit3").val(),
                    d.sender = $("#intransit4").val(),
                    d.for_to = $("#intransit5").val(),
                    d.releasingOffice = $("#intransit6").val(),
                    d.dateReleasedFrom = $("#dateRangeintransitDateReleased").val() == "" ? "" : $("#dateRangeintransitDateReleased").val().split(" - ")[0],
                    d.dateReleasedTo = $("#dateRangeintransitDateReleased").val() == "" ? "" : $("#dateRangeintransitDateReleased").val().split(" - ")[1]
                }
            },
            columns: [
               { "data": "Id", "visible": false },
               {
                   "data": "Code",
                   "width": "15%",
                   "orderable": true,
                   "render": function (data, type, full, meta) {
                       if (full["CanReceived"]) {
                           return "<a href='#' onclick='acceptintransitviewmodel.acceptInTransit(" + full["Id"] + ")'>" + full["Code"] + "</a>";
                       }
                       else {
                           return full["Code"];
                       }
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
                                    ? '<a target="_blank" href="' + baseUrl + 'Attachments/EDATS/Document/' + full["AttachmentFileName"] + '"><i class="fa fa-paperclip" aria-hidden="true"></i></a>'
                                    : "";
                       }
                   }
               },
               { "data": "Routing", "orderable": false, "className": "text-center" },
               { "data": "Sender", "width": "15%", "orderable": true, },
               { "data": "For_To", "width": "10%", "orderable": true },
               { "data": "ReleasingOffice", "width": "15%", "orderable": true },
               { "data": "DateReleased", "width": "10%", "orderable": true },
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

        datatableviewmodel.InitializeEventsForSearchColumn("dataTable-intransit", intransitviewmodel.filtertable, "intransit");
        datatableviewmodel.DropdownFilterDataCountBesideInfo();
    }
};