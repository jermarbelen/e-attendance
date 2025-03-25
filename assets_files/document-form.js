$(document).ready(function () {
    formmodel.initialize();
});

var formmodel = {
    id: 0,
    isDirty: false,
    initialize: function () {
        this.initializeFormValidation();
        this.bindEvents();

        formmodel.id = parseInt($("#Id").val());
        formmodel.isDirty = parseInt($("#HasError").val()) == 1;

        if ($("#HasError").val() == 1) {
            $("#ConfidentialCode").val($("#Confidential").val()).trigger('change');
            commonViewModel.scrollElement("", ".form-body");
        }

        if ($("#IsRoutedOffice").val() == 1 && formmodel.id > 0) {

            $("#editorForm :input").prop("disabled", true);

            $("#clearAttachmentBtn").prop("disabled", true);
            
            $("#newRowAddresseeBtn, #LinkDocument").click(function () {
                false;
            });

            $("#newRowAddresseeBtn, #LinkDocument").attr("onclick", "return false").css({
                cursor: "not-allowed",
                opacity: ".6"
            });

            $("#SecondSubject").prop("disabled", false);
            $("#cancelBtn").prop("disabled", false);
        }

        $("#SubjectPrefix").prop("disabled", true);
        $("#DocumentLinkSubject").prop("disabled", true);
        $("#saveBtn").prop("disabled", parseInt($("#HasError").val()) != 1);
        $("#HasChangesInAttachment").val(0);

        commonViewModel.disabledNotActiveOrDeletedOption();

        if (formmodel.id > 0) {
            var value = $("#SenderType").val();
            if (value == "Private") {
                $("#SenderOfficeId").empty();
                $("#SenderId").empty();

                $("#SenderIdDiv").hide();

                $("#SenderOfficeId").prop("disabled", true);
                $("#SenderPrivateDiv").show();

                $("#SenderOfficeId").rules("remove");
                $("#SenderId").rules("remove");
                $("#SenderPrivate").rules("add", {
                    required: true,
                    maxlength: 1000
                });
            }
        }
        else {
            $('#ActualDateTimeReceived').datetimepicker('setDate', new Date());
        }
    },
    bindEvents: function () {
        $("#ConfidentialCode").select2({ minimumResultsForSearch: -1 });
        $("#ModeOfTransferId").select2({ minimumResultsForSearch: -1 });
        $("#DocumentTypeId").select2({ minimumResultsForSearch: -1 });

        $("#SenderOfficeId").select2();
        $("#SenderId").select2();

        $('.date-picker').datepicker({
            rtl: App.isRTL(),
            orientation: "left",
            autoclose: true,
        }).change(function () {
            $("#editorForm").validate().element('#' + this.id);
            formmodel.setFormIsDirty(true);
        });;

        $("#ActualDateTimeReceived").datetimepicker({
            ampm: true,
            autoclose: !0,
            format: "mm/dd/yyyy HH:ii P",
            setDate: new Date(),
            pick12HourFormat: true,
            showMeridian: true,
            todayBtn: !0,
            todayHighlight: !0
        }).change(function () {
            $("#editorForm").validate().element('#' + this.id);
            formmodel.setFormIsDirty(true);
        });

        $('#DocumentDate').mask('99/99/9999');

        $('.selectdata').change(function () {
            $("#editorForm").validate().element('#' + this.id);
            formmodel.setFormIsDirty(true)
        });

        $('.inputdata').keyup(function () {
            $("#editorForm").validate().element('#' + this.id);
            formmodel.setFormIsDirty(true)
        });

        $('#DocumentTypeId').change(function () {
            $("#editorForm").validate().element('#DocumentTypeId');
            formmodel.setFormIsDirty(true);

            if ($('#DocumentTypeId').val() == "") {
                $("#SubjectPrefix").val("");
            }
            else {
                formmodel.generateSubjectPrefix();
            }
        });

        $("#DocumentDate").change(function () {
            if ($('#DocumentTypeId').val() == "") {
                return;
            }
            else {
                formmodel.generateSubjectPrefix();
            }
        });

        $('#SenderOfficeId').change(function () {
            $("#editorForm").validate().element('#SenderOfficeId');
            formmodel.setFormIsDirty(true);

            var value = $('input[name=typeRadio]:checked').val();
            if ($('#SenderOfficeId').val() == "" ||
                $('#SenderOfficeId').val() == undefined ||
                $('#SenderOfficeId').val() == null)
            {
                $("#SenderAddress").val("");
            }
            else {
                commonViewModel.loadList("SenderId", baseUrl + "api/documentsender/getofficesenderlist/" + value + "/" + $('#SenderOfficeId').val(), "", "");

                $.getJSON(baseUrl + "api/edatsdocument/getdocumentofficeaddress/" + $('#SenderOfficeId').val() + "/" + value, function (data) {
                    $("#SenderAddress").val(data);
                    $("#editorForm").validate().element('#SenderAddress');
                });
            }
        });

        $('input[type=radio][name=typeRadio]').change(function () {
            $("#SenderAddress").val('');
            $("#SenderPrivate").val('');
            $("#SenderOfficeId").empty();
            $("#SenderId").empty();

            $("#SenderIdDiv").hide();
            $("#SenderPrivateDiv").hide();

            var value = $('input[name=typeRadio]:checked').val();
            if (value != "Private") {
                commonViewModel.loadList("SenderOfficeId", baseUrl + "api/documentsender/getdocumentsenderofficelist/" + value, "", "");

                $("#SenderOfficeId").prop("disabled", false);
                $("#SenderIdDiv").show();

                $("#SenderPrivate").rules("remove");
                $("#SenderOfficeId").rules("add", {
                    required: true
                });

                $("#SenderId").rules("add", {
                    required: true
                });
            }
            else {
                $("#SenderOfficeId").prop("disabled", true);
                $("#SenderPrivateDiv").show();

                $("#SenderOfficeId").rules("remove");
                $("#SenderId").rules("remove");
                $("#SenderPrivate").rules("add", {
                    required: true,
                    maxlength: 1000
                });
            }

            commonViewModel.removeSelectFieldValidation("#SenderOfficeId", "#SenderTypeDiv");
            commonViewModel.removeSelectFieldValidation("#SenderId", "#SenderDiv");
            commonViewModel.removeInputFieldValidation("#SenderAddress", "#SenderAddressDiv");
            commonViewModel.removeInputFieldValidation("#SenderPrivate", "#SenderPrivateDiv");
            formmodel.setFormIsDirty(true)
        });

        // Attachment Files
        $("#AttachmentFiles").on("change", function () {
            formmodel.setFormIsDirty(true)
            $("#filesList").empty();

            var files = $("#AttachmentFiles").prop("files")
            var names = $.map(files, function (val) {
                return val.name;
            });

            // Display the file names
            $.map(names, function (val) {
                $("#filesList").append("<li><i class='fa fa-file'></i>&nbsp;&nbsp;" + val + "</li>");
            });

            $("#HasChangesInAttachment").val(1);
        });

        $("#isPrintAcknowledgementReceiptChk").click(function () {
            formmodel.setFormIsDirty(true)
        });
        
        // Clear Attachment Button
        $("#clearAttachmentBtn").click(function () {
            formmodel.setFormIsDirty(true)
            $("#AttachmentFiles").val("");
            $("#filesList").empty();
            $("#HasChangesInAttachment").val(1);
        });

        //// Cancel Button
        $("#cancelBtn").click(function () {
            if (formmodel.isDirty) {
                formmodel.isForConfirmation = true;
                $('#editorModal').modal('hide');

                notification.confirmCancelation(formmodel.cancellationYes, null);
            }
            else {
                formmodel.cancellationYes();
            }
        });

        $("#saveBtn").click(function () {
            if ($("#editorForm").valid()) {
                if (addresseeviewmodel.filtertable.fnGetData().length <= 0) {
                    notification.warning("", "At least one Addressee is required!");
                }
                else {
                    if (formmodel.id == 0) {
                        notification.confirmSave(formmodel.saveYes, null);
                    }
                    else {
                        notification.confirmUpdate(formmodel.saveYes, null);
                    }
                }
            }
            else {
                commonViewModel.scrollElement("", ".form-body");
            }
        });
    },
    cancellationYes: function () {
        if (formmodel.id > 0) {
            window.location.href = edatsBaseUrl + "document/View/?id=" + formmodel.id + "&type=DOCUMENT";
        }
        else {
            window.location.href = edatsBaseUrl + "document";
        }
    },
    saveYes: function () {
        commonViewModel.disabledDiv("#page-wrap");

        var addressees = [];
        var addresseesdatas = addresseeviewmodel.filtertable.fnGetData();
        $.each(addresseesdatas, function (i, item) {
            var value = item.Id + ">" +
                      item.AddresseeId + ">" +
                      item.Addressee + ">" +
                      item.AddresseeType + ">" +
                      item.Address + ">" +
                      item.CC + ">" +
                      item.ReleaseDocumentOnSave;

            addressees.push(value);
        });

        $("#SubjectPrefix").prop("disabled", false); 
        $("#DocumentLinkSubject").prop("disabled", false);
        $("#Confidential").val($("#ConfidentialCode").val());
        $("#Addressees").val(addressees.join("*"));
        $("#PrintAcknowledgementReceipt").val($("#isPrintAcknowledgementReceiptChk").is(':checked') ? 1 : 0);
        $('#SenderType').val($('input[name=typeRadio]:checked').val());
        $("#saveBtn").button('loading');

        if ($("#IsRoutedOffice").val() == 1 && formmodel.id > 0) {

            $("#editorForm :input").prop("disabled", false);

            $("#clearAttachmentBtn").prop("disabled", true);

            $("#newRowAddresseeBtn, #LinkDocument").click(function (e) {
                e.preventDefault();
                return data, canManageEdit;
            });

            $("#newRowAddresseeBtn, #LinkDocument").attr("onclick", "return false").css({
                cursor: "not-allowed",
                opacity: ".6"
            });

            $("input[name='__RequestVerificationToken']").prop("disabled", false);
            $("#SecondSubject").prop("disabled", false);
            $("#cancelBtn").prop("disabled", false);
        }

        $("#editorForm").submit();
    },
    saveNo: function () {
        commonViewModel.doneWithError("#editorModal", "#saveBtn");
        formmodel.isForConfirmation = false;
    },
    initializeFormValidation: function () {
        var form = $("#editorForm");
        var error = $(".alert-danger", form);
        var success = $(".alert-success", form);

        form.validate({
            errorElement: "span", //default input error message container
            errorClass: "help-block help-block-error", // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",  // validate all fields including form hidden input
            rules: {
                ActualDateTimeReceived: {
                    required: true,
                    maxDate: true,
                    date: true,
                },
                DocumentDate: {
                    required: true,
                },
                ConfidentialCode: {
                    required: true,
                },
                ModeOfTransferId: {
                    required: true,
                },
                DocumentTypeId: {
                    required: true,
                },
                SenderAddress: {
                    required: true,
                    maxlength: 1000
                },
                Subject: {
                    required: true
                },
                SenderOfficeId: {
                    required: true
                },
                SenderId: {
                    required: true
                },
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
    },
    setFormIsDirty: function (value) {
        formmodel.isDirty = value;
        $("#saveBtn").prop("disabled", !value);
    },
    generateSubjectPrefix: function () {
        $.getJSON(baseUrl + "api/edatsdocument/getsubjectprefixbydocumenttype/" + $('#DocumentTypeId').val(), function (data) {
            $("#SubjectPrefix").val(data + " " + $("#DocumentDate").val());
        });
    }
}