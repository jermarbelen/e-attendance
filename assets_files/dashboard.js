$(document).ready(function () {
    module.initialize();
});

var module = {
    chart: null,
    initialize: function () {
        this.bindEvents();
        this.loadTable();
    },
    bindEvents: function () {
        // Chart
        module.chart = new Morris.Bar({
            barColors: ["#3598dc", "#e7505a", "rgb(85,208,58)"],
            element: "graphChart",
            hideHover: "auto",
            labels: ["Received", "Released", "Archived"],
            xLabelAngle: 50,
            resize: true,
            smooth: true,
            xkey: "Month",
            ykeys: ["Received", "Released", "Archived"]
        });

        // Fetch Graph Data from Server
        module.loadGraphData();

        // Generate Legend
        module.chart.options.labels.forEach(function (label, i) {
            var legendItem = $("<span></span>").text(label).prepend("<i>&nbsp;</i>");
            legendItem.find("i").css('backgroundColor', module.chart.options.barColors[i]);
            $("#legend").append(legendItem)
        });
    },
    loadGraphData: function () {
        $.getJSON(edatsBaseUrl + "Dashboard/GetEdatsDocumentGraphData", function (data) {
            module.chart.setData(data);
        });
    },
    loadTable: function () {
        var table = $('#dataTable');

        module.filtertable = $('#dataTable').dataTable({
            filter: false,
            serverSide: true,
            stateSave: false,
            responsive: true,
            processing: true,
            bLengthChange: false,
            paginate: {
                "previous": "Prev",
                "next": "Next",
                "last": "Last",
                "first": "First"
            },
            pagingType: "bootstrap_full_number",
            language: {
                "lengthMenu": "_MENU_",
                "processing": "",
            },
            ajax: {
                "url": edatsBaseUrl + "Dashboard/GetEdatsDocumentProcessed",
                "type": "POST",
                "data": function (d) {
                }
            },
            columns: [
               { "data": "ActionOfficer", "orderable": true },
               { "data": "Today", "orderable": true, "className": "text-center" },
               { "data": "ThisMonth", "orderable": true, "className": "text-center" },
            ],

            order: [[0, "asc"]],

            lengthMenu: [
                [5],
                [5] // change per page values here
            ],

            pageLength: 5,


            dom: '<"top"i>rt<"bottom"flp><"clear">'
        });

        datatableviewmodel.DropdownFilterDataCountBesideInfo();
    }
};