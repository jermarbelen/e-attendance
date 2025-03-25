var datatableviewmodel = {
    fixedHeaderOffset: 0,
    AddSearchColumn: function (elem) {
        var i = 1;
        $('#' + elem + ' thead tr:eq(1) th').each(function () {
            var title = $('#' + elem + ' thead tr:eq(0) th').eq($(this).index()).text();
            if (title != "") {
                $(this).html('<input type="text" class="searchColumn" style="width: 100%;padding: 3px;box-sizing: border-box;" id="' + i++ + '" placeholder="' + title + '" />');
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