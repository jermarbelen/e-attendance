$(document).ready(function () {
    reportsviewmodel.initialize();
});

var reportsviewmodel = {
    currentOfficeId: "",
    fileName: "",
    folderName: "",
    initialize: function () {
        this.initializeFormValidation();
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

        $("#ReportTypeField").select2();
        $("#OfficeField").select2();
        $("#OfficeToField").select2();
        $("#OfficeToField").val('').trigger('change');
        commonViewModel.removeInputFieldValidation("#OfficeToField", "#OfficeToFieldDiv");

        reportsviewmodel.currentOfficeId = $("#OfficeField").val();

        $('input[name="DateField"]').daterangepicker({
            opens: 'left',
            timePicker: true,
            startDate: new Date(),
            endDate: new Date(),
            locale: {
                format: 'MM/DD/YYYY h:mm A',
                cancelLabel: 'Clear'
            }
        });

        $('input[name="DateField"]').on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('MM/DD/YYYY h:mm A') + ' - ' + picker.endDate.format('MM/DD/YYYY h:mm A'));
            $("#reportForm").validate().element('#DateField');
        });

        $('input[name="DateField"]').on('cancel.daterangepicker', function (ev, picker) {
            $(this).val('');
            $("#reportForm").validate().element('#DateField');
        });

        $('#edatsReportModal').on('hidden.bs.modal', function (e) {
            reportsviewmodel.deleteFile();
            $("#edatsReportIframe").attr("src", "");
        });

        $('#edatsReportIframe').load(function () {
            if ($("#edatsReportIframe").length) {
                reportsviewmodel.deleteFile();
            }
        });

        $('.selectdata').change(function () {
            $("#reportForm").validate().element('#' + this.id);
        });

        $('.inputdata').keyup(function () {
            $("#reportForm").validate().element('#' + this.id);
        });

        $('#ReportTypeField').change(function () {
            $("#officeFromLabel").html("");
            $("#OfficeToFieldDiv").hide();

            $("#OfficeField").rules("add", {
                required: true,
            });

            $("#OfficeField").prop("disabled", false);
            
            if ($('#ReportTypeField').val() == "Accomplishment Report") {
                $("#OfficeField").rules("remove");
                $("#OfficeField").prop("disabled", true);
            }
            else if ($('#ReportTypeField').val() == "Transmittal Report") {
                $("#OfficeToFieldDiv").show();
                $("#officeFromLabel").html(" From");
            }

            $('#OfficeToField').val('').trigger('change');
            $("#OfficeField").val(reportsviewmodel.currentOfficeId).trigger('change');
            commonViewModel.removeInputFieldValidation("#OfficeToField", "#OfficeToFieldDiv");
            commonViewModel.removeInputFieldValidation("#OfficeField", "#OfficeFieldDiv");
        });

        $('#generateReportBtn').click(function () {
            if ($("#reportForm").valid()) {
                commonViewModel.loadDiv("ReportDiv");

                $.ajax({
                    url: edatsBaseUrl + "Report/GenerateReport",
                    type: "POST",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            reportType: $('#ReportTypeField').val(),
                            officeId: $('#OfficeField').prop('disabled') ? 0 : $("#OfficeField").val(),
                            officeToIds: $("#OfficeToField").val() != null && $("#OfficeToField").val() != "" ? $("#OfficeToField").val().join(',') : "",
                            dateFrom: $("#DateField").val().split(" - ")[0],
                            dateTo: $("#DateField").val().split(" - ")[1]
                        }),
                    success: (result) => {
                        if (result.Message.toUpperCase().search("Error".toUpperCase()) > -1) {
                            commonViewModel.unloadDiv("ReportDiv");
                            notification.warning("", result.Message);
                        }
                        else {
                            reportsviewmodel.fileName = result.FileName;
                            reportsviewmodel.folderName = result.FolderName;

                            window.open(result.FilePath);
    
                            commonViewModel.unloadDiv("ReportDiv");
                        }
                    },
                    failure: (response) => {
                        commonViewModel.unloadDiv("ReportDiv");
                        notification.warning("", "Encountered Error!");
                    }
                });
            }
        });
    },
    deleteFile: function () {
        setTimeout(function () {
            $.ajax({
                url: edatsBaseUrl + "Report/DeleteFile",
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ folderName: reportsviewmodel.folderName, fileName: reportsviewmodel.fileName }),
                success: (result) => { },
                failure: (response) => { }
            });
        }, 5000);
    },
    initializeFormValidation: function () {
        var form = $("#reportForm");
        var error = $(".alert-danger", form);
        var success = $(".alert-success", form);

        form.validate({
            errorElement: "span", //default input error message container
            errorClass: "help-block help-block-error", // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",  // validate all fields including form hidden input
            rules: {
                ReportTypeField: {
                    required: true
                },
                DateField: {
                    required: true
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                success.hide();
                error.show();
                //App.scrollTo(error, -200);
            },

            errorPlacement: function (error, element) { // render error placement for each input type
                commonViewModel.errorPlacement(error, element);
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest(".form-input-group").removeClass("has-success").addClass("has-error"); // set error class to the control group   
            },

            unhighlight: function (element) { // revert the change done by hightlight
            },

            success: function (label, element) {
                var icon = $(element).parent(".input-icon").children("i");
                $(element).closest(".form-input-group").removeClass("has-error").addClass("has-success"); // set success class to the control group
                icon.removeClass("fa-warning").addClass("fa-check");
            }
        });
    },
}