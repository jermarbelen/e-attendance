$(document).ready(function () {
    archivedviewmodel.initialize();
});

var archivedviewmodel = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
    },
    loadTable: function () {
        datatableviewmodel.AddSearchColumn("dataTable-archived", "archived");
        datatableviewmodel.FixHeader();

        archivedviewmodel.filtertable = $('#dataTable-archived').dataTable({
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
                "url": edatsBaseUrl + "Document/GetDocumentArchivedData",
                "type": "POST",
                "data": function (d) {
                    d.code = $("#archived1").val(),
                    d.subject = $("#archived2").val(),
                    d.sender = $("#archived3").val(),
                    d.for_to = $("#archived4").val()
                }
            },
            columns: [
               { "data": "Id", "visible": false },
               { "data": "FinalActionDate", "visible": false },
               {
                   "data": "Code",
                   "width": "15%",
                   "orderable": true,
                   "render": function (data, type, full, meta) {
                       return "<a href='" + edatsBaseUrl + "Document/View?id=" + full["Id"] + "&type=ROUT'>" + full["Code"] + "</a>";
                   }
               },
               { "data": "Subject", "orderable": true },
               { "data": "Sender", "width": "15%", "orderable": true, },
               { "data": "For_To", "width": "10%", "orderable": true },
            ],

            fixedHeader: {
                header: true,
                headerOffset: datatableviewmodel.fixedHeaderOffset
            },

            order: [[1, "desc"]],

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

        datatableviewmodel.InitializeEventsForSearchColumn("dataTable-archived", archivedviewmodel.filtertable, "archived");
        datatableviewmodel.DropdownFilterDataCountBesideInfo();
    }
};