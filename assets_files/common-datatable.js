var datatableviewmodel = {
    fixedHeaderOffset: 0,
    AddSearchColumn: function (elem, idPrefix) {
        if (idPrefix === undefined) {
            idPrefix = "";
        }

        var i = 1;
        $('#' + elem + ' thead tr:eq(1) th').each(function () {
            var thData = $('#' + elem + ' thead tr:eq(0) th').eq($(this).index());
            var title = thData.text();
            var type = $(this).attr('data-type');
            var search = $(this).attr('data-search');

            if (type == "text") {
                $(this).html('<input type="text" class="searchColumn form-control" style="width: 100%;padding: 3px;box-sizing: border-box;" id="' + idPrefix + i++ + '" placeholder="' + title + '" />');
            }
            else if (type == "int") {
                $(this).html('<input type="text" class="searchColumn form-control" onkeydown="input_helper.integerOnly(this, event);" style="width: 100%;padding: 3px;box-sizing: border-box; text-align:right" id="' + idPrefix + i++ + '" placeholder="' + title + '" />');
            }
            else if (type == "decimal") {
                $(this).html('<input type="text" class="searchColumn form-control" onkeydown="input_helper.currencyNumeric(event)" style="width: 100%;padding: 3px;box-sizing: border-box; text-align:right" id="' + idPrefix + i++ + '" placeholder="' + title + '" />');
            }
            else if ((type == "date" ||
                title.toUpperCase().search("Date".toUpperCase()) > -1 ||
                title.toUpperCase().search("Created".toUpperCase()) > -1 ||
                title.toUpperCase().search("Modified".toUpperCase()) > -1) && search != "false")
            {
                $(this).html('<input type="text" class="searchColumn form-control" name="dateRange' + idPrefix + title.replace(/\s/g, '') + '" id="dateRange' + idPrefix + title.replace(/\s/g, '') + '" placeholder="' + title + '"/>');
            }
            else if (type == "select")
            {
                $(this).html('<select class="form-control searchSelect" style="width: auto;" name="select' + idPrefix + title.replace(/\s/g, '') + '" id="select' + idPrefix + title.replace(/\s/g, '') + '">' +
                                '<option value="">All</option>' +
                                '<option value="No">No</option>' +
                                '<option value="Yes">Yes</option>' +
                              '</select>');
            }
            else
            {
                if (title != "" && title != "Action" && title != "Actions" && title != "." && search != "false") {
                    $(this).html('<input type="text" class="searchColumn form-control" style="width: 100%;padding: 3px;box-sizing: border-box;" id="' + idPrefix + i++ + '" placeholder="' + title + '" />');
                }
            }
            
            if (type == "select" &&
                title.toUpperCase().search("Date".toUpperCase()) > -1)
            {
                $(this).html('<select class="form-control searchSelect" style="width: auto;" name="select' + idPrefix + title.replace(/\s/g, '') + '" id="select' + idPrefix + title.replace(/\s/g, '') + '">' +
                    '<option value="">All</option>' +
                    '<option value="No">No</option>' +
                    '<option value="Yes">Yes</option>' +
                    '</select>');
            }
        });
    },
    InitializeEventsForSearchColumn: function (elem, oTable, idPrefix) {
        var i = 1;
        idPrefix = idPrefix != null && idPrefix != undefined ? idPrefix : "";
        $('#' + elem + ' thead tr:eq(1) th').each(function () {
            var title = $('#' + elem + ' thead tr:eq(0) th').eq($(this).index()).text();
            var type = $(this).attr('data-type');

            if (type == "date"||
                title.toUpperCase().search("Date".toUpperCase()) > -1 ||
                title.toUpperCase().search("Created".toUpperCase()) > -1 ||
                title.toUpperCase().search("Modified".toUpperCase()) > -1)
            {
                $('input[name="dateRange' + idPrefix + title.replace(/\s/g, '') + '"]').daterangepicker({
                    opens: 'left',
                    autoUpdateInput: false,
                    locale: {
                        cancelLabel: 'Clear'
                    }
                });

                $('input[name="dateRange' + idPrefix + title.replace(/\s/g, '') + '"]').on('apply.daterangepicker', function (ev, picker) {
                    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
                    oTable.fnFilter($(this).val(), this.parentNode.cellIndex);
                });

                $('input[name="dateRange' + idPrefix + title.replace(/\s/g, '') + '"]').on('cancel.daterangepicker', function (ev, picker) {
                    $(this).val('');
                    oTable.fnFilter("", this.parentNode.cellIndex);
                });
            }
            else if (type == "select")
            {
                $("#select" + idPrefix + title.replace(/\s/g, '')).select2({ minimumResultsForSearch: -1 });
                $("#select" + idPrefix + title.replace(/\s/g, '')).change(function () {
                    oTable.fnFilter(this.value, this.parentNode.cellIndex);
                });
            }
            if (type == "select" &&
                title.toUpperCase().search("Date".toUpperCase()) > -1) {
                $("#select" + idPrefix + title.replace(/\s/g, '')).select2({ minimumResultsForSearch: -1 });
                $("#select" + idPrefix + title.replace(/\s/g, '')).change(function () {
                    oTable.fnFilter(this.value, this.parentNode.cellIndex);
                });
            }
        });

        $("#" + elem + " .searchColumn").keyup(function (e) {
            if (e.keyCode == 13) {
                for (var i = 0; i < this.parentNode.attributes.length; i++) {
                    if (this.parentNode.attributes[i].name == "data-type") {
                        if (this.parentNode.attributes[i].value == "currency") {
                            let value = input_helper.thousandSeparator(this.value);
                            this.value = value == "NaN" ? "" : value;
                        }

                        if (this.parentNode.attributes[i].value == "decimal") {
                            let value = parseFloat(this.value).toFixed(2);
                            this.value = value == "NaN" ? "" : value;
                        }
                    }
                }

                oTable.fnFilter(this.value, this.parentNode.cellIndex);
            }
        });
    },
    FixHeader: function () {
        this.fixedHeaderOffset = 0;
        if (App.getViewPort().width < App.getResponsiveBreakpoint('md')) {
            if ($('.page-header').hasClass('page-header-fixed-mobile')) {
                this.fixedHeaderOffset = $('.page-header').outerHeight(true);
            }
        } else if ($('body').hasClass('page-header-menu-fixed')) { // admin 3 fixed header menu mode
            this.fixedHeaderOffset = $('.page-header-menu').outerHeight(true);
        } else if ($('body').hasClass('page-header-top-fixed')) { // admin 3 fixed header top mode
            this.fixedHeaderOffset = $('.page-header-top').outerHeight(true);
        } else if ($('.page-header').hasClass('navbar-fixed-top')) {
            this.fixedHeaderOffset = $('.page-header').outerHeight(true);
        } else if ($('body').hasClass('page-header-fixed')) {
            this.fixedHeaderOffset = 64; // admin 5 fixed height
        }
    },
    DropdownFilterDataCountBesideInfo: function () {
        $(".dataTables_length").css('clear', 'none');
        $(".dataTables_length").css('margin-right', '20px');

        //reset clear and padding
        $(".dataTables_info").css('clear', 'none');
        $(".dataTables_info").css('padding', '5');
    }
}