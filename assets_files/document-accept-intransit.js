$(document).ready(function () {
    acceptintransitviewmodel.initialize();
    commonViewModel.disabledNotActiveOrDeletedOption();
});

var acceptintransitviewmodel = {
    id: 0,
    edatsdocumentid: 0,
    isDirty: false,
    isForConfirmation: false,
    initialize: function () {
        acceptintransitviewmodel.initializeFormValidation();

        //$('.date-picker').datepicker({
        //    rtl: App.isRTL(),
        //    orientation: "left",
        //    autoclose: true
        //}).change(function () {
        //    $("#acceptInTransitForm").validate().element('#' + this.id);
        //    acceptintransitviewmodel.setFormIsDirty(true);
        //});
        $("#InTransit_ActualDateReceived").datetimepicker({
            ampm: true,
            autoclose: !0,
            format: "mm/dd/yyyy HH:ii P",
            setDate: new Date(),
            pick12HourFormat: true,
            showMeridian: true,
            todayBtn: !0,
            todayHighlight: !0
        }).change(function () {
            $("#acceptInTransitForm").validate().element('#' + this.id);
            acceptintransitviewmodel.setFormIsDirty(true);
        });

        $('.inputdataInTransit').keyup(function () {
            $("#acceptInTransitForm").validate().element('#' + this.id);
            acceptintransitviewmodel.setFormIsDirty(true)
        });

        $('#acceptInTransitModal').on('shown.bs.modal', function (e) {
            $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
        });

        $('#acceptInTransitModal').on('hidden.bs.modal', function (e) {
            if (!acceptintransitviewmodel.isForConfirmation) {
                acceptintransitviewmodel.resetModalForm();
            }
        });

        $("#saveInTransitBtn").click(function (e) {
            if ($("#acceptInTransitForm").valid()) {
                $("#saveInTransitBtn").button('loading');

                acceptintransitviewmodel.isForConfirmation = true;
                $('#acceptInTransitModal').modal('hide');

                notification.confirm("Accept Document?", "New document will be added.", "ACCEPT", "CANCEL", acceptintransitviewmodel.saveYes, acceptintransitviewmodel.saveNo);
            }
        });

        //// Cancel Button
        $("#cancelInTransitBtn").click(function () {
            if (acceptintransitviewmodel.isDirty) {

                acceptintransitviewmodel.isForConfirmation = true;
                $('#acceptInTransitModal').modal('hide');

                notification.confirmCancelation(acceptintransitviewmodel.cancellationYes, acceptintransitviewmodel.cancellationNo);
            }
            else {
                $('#acceptInTransitModal').modal('hide');
            }
        });

        $('#InTransit_ActualDateReceived').datetimepicker('setDate', new Date());
    },
    acceptInTransit: function (id) {
        acceptintransitviewmodel.id = id;
        $('#acceptInTransitModal').modal();

        $.getJSON(baseUrl + "api/edatsdocument/getroutinginformationbyid/" + parseInt(id), function (data) {
            $("#IT_DocumentCode").html(data.documentCode);
            $("#IT_Subject").html(data.subject);
            $("#IT_Sender").html(data.sender);
            $("#IT_SenderAddress").html(data.senderAddress);
            $("#IT_Addressees").html(data.addressees);
            $("#IT_CCAddressees").html(data.ccAddressees);
            $("#IT_Confidential").html(data.confidential);
            $("#IT_ActualDateReleased").html(data.actualDateReleased);
            
            $("#IT_Attachments").empty();            
            for (var i = 0; i < data.attachments.length; i++) {
                $("#IT_Attachments").append("<li><a target='_blank' href='" + baseUrl + "Attachments/EDATS/Document/" + data.attachments[i] + "'>" + data.attachments[i] + "</a></li>");
            }
        });
    },
    cancellationYes: function () {
        acceptintransitviewmodel.isForConfirmation = false;
        acceptintransitviewmodel.resetModalForm();
    },
    cancellationNo: function () {
        $('#acceptInTransitModal').modal('show');
        acceptintransitviewmodel.isForConfirmation = false;
    },
    saveYes: function () {
        $('#InTransit_ActualDateReceived').prop("disabled", false);
        commonViewModel.processingSave("#acceptInTransitModal", "#saveInTransitBtn");

        $.ajax({
            url: baseUrl + "api/edatsdocument/acceptintransit",
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(
              {
                  id: acceptintransitviewmodel.id,
                  actualDateReceived: $("#InTransit_ActualDateReceived").val(),
                  remarks: $("#InTransit_Remarks").val(),
              }),
            success: (result) => {
                if (commonViewModel.convertToUpper(result) == commonViewModel.convertToUpper("Ok")) {
                    acceptintransitviewmodel.isForConfirmation = false;

                    commonViewModel.doneSave("#acceptInTransitModal", "#saveInTransitBtn");
                    notification.success("", "The document has been accepted!");
                    acceptintransitviewmodel.resetModalForm();
                    //// intransitviewmodel.filtertable.fnFilter("");
                    $('#InTransit_ActualDateReceived').prop("disabled", true);
                    window.location.href = edatsBaseUrl + "Document/View?id=" + acceptintransitviewmodel.id + "&type=ROUT";
                }
                else {
                    $('#InTransit_ActualDateReceived').prop("disabled", false);
                    notification.warning("", "Encountered Error!");
                    commonViewModel.doneWithError("#acceptInTransitModal", "#saveInTransitBtn");
                    acceptintransitviewmodel.isForConfirmation = false;
                }
            },
            failure: (response) => {
                $('#InTransit_ActualDateReceived').prop("disabled", false);
                notification.warning("", "Encountered Error!");
                commonViewModel.doneWithError("#acceptInTransitModal", "#saveInTransitBtn");
                acceptintransitviewmodel.isForConfirmation = false;
            }
        });
    },
    saveNo: function () {
        commonViewModel.doneWithError("#acceptInTransitModal", "#saveInTransitBtn");
        acceptintransitviewmodel.isForConfirmation = false;
    },
    resetModalForm: function () {
        $('#acceptInTransitForm').trigger("reset");

        $("#acceptInTransitForm").find(".has-error").removeClass("has-error");
        $("#acceptInTransitForm").find(".has-success").removeClass("has-success");

        commonViewModel.removeInputFieldValidation("#InTransit_ActualDateReceived", "#InTransit_ActualDateReceivedDiv");
        commonViewModel.removeInputFieldValidation("#InTransit_Remarks", "#InTransit_RemarksDiv");

        acceptintransitviewmodel.isForConfirmation = false;
        acceptintransitviewmodel.isDirty = false;

        $('#InTransit_ActualDateReceived').datetimepicker('setDate', new Date());

        $("#saveInTransitBtn").button('reset');
    },
    setFormIsDirty: function(){
        acceptintransitviewmodel.isDirty = true;
    },
    initializeFormValidation: function () {
        var form = $("#acceptInTransitForm");
        var error = $(".alert-danger", form);
        var success = $(".alert-success", form);

        form.validate({
            errorElement: "span", //default input error message container
            errorClass: "help-block help-block-error", // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",  // validate all fields including form hidden input
            rules: {
                InTransit_ActualDateReceived: {
                    required: true,
                    maxDate: true,
                    date: true,
                },
                InTransit_Remarks: {
                    maxlength: 3000
                }
            },

            messages: {
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

        $.validator.addMethod("maxDate", function (value, element) {
            var curDate = new Date();
            var inputDate = new Date(value);
            if (inputDate <= curDate)
                return true;
            return false;
        }, "Please enter date not later than today.");
    }
}