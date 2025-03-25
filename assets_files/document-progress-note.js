$(document).ready(function () {
    progressnoteviewmodel.initialize();
    commonViewModel.disabledNotActiveOrDeletedOption();
});

var progressnoteviewmodel = {
    id: 0,
    forReply: false,
    edatsdocumentid: 0,
    isDirty: false,
    isForConfirmation: false,
    attachmentHasChanges: false,
    initialize: function () {
        progressnoteviewmodel.initializeFormValidation();

        $("#PN_ActionOfficer").select2({});
        commonViewModel.loadList("PN_ActionOfficer", baseUrl + "api/edatsdocument/getactionofficerlist", "", "");

        $('.selectdataPN').change(function () {
            $("#progressNoteForm").validate().element('#' + this.id);
            progressnoteviewmodel.setFormIsDirty(true)
        });

        $('.inputdataPN').keyup(function () {
            $("#progressNoteForm").validate().element('#' + this.id);
            progressnoteviewmodel.setFormIsDirty(true)
        });


        $('#progressNoteModal').on('shown.bs.modal', function (e) {
            $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
        });

        $('#progressNoteModal').on('hidden.bs.modal', function (e) {
            if (!progressnoteviewmodel.isForConfirmation) {
                progressnoteviewmodel.resetModalForm();
            }
        });

        // Attachment Files
        $("#PN_AttachmentFiles").on("change", function () {
            progressnoteviewmodel.setFormIsDirty(true)
            $("#PN_filesList").empty();

            var files = $("#PN_AttachmentFiles").prop("files")
            var names = $.map(files, function (val) {
                return val.name;
            });

            // Display the file names
            $.map(names, function (val) {
                $("#PN_filesList").append("<li><i class='fa fa-file'></i>&nbsp;&nbsp;" + val + "</li>");
            });

            progressnoteviewmodel.attachmentHasChanges = true;
        });

        // Clear Attachment Button
        $("#PN_clearAttachmentBtn").click(function () {
            progressnoteviewmodel.setFormIsDirty(true)
            $("#PN_AttachmentFiles").val("");
            $("#PN_filesList").empty();
            progressnoteviewmodel.attachmentHasChanges = true;
        });

        $("#savePNBtn").click(function (e) {
            if ($("#progressNoteForm").valid()) {
                $("#savePNBtn").button('loading');

                progressnoteviewmodel.isForConfirmation = true;
                $('#progressNoteModal').modal('hide');

                if (progressnoteviewmodel.id == 0 || progressnoteviewmodel.forReply) {
                    notification.confirmSave(progressnoteviewmodel.saveYes, progressnoteviewmodel.saveNo);
                }
                else {
                    notification.confirmUpdate(progressnoteviewmodel.saveYes, progressnoteviewmodel.saveNo);
                }
            }
        });

        //// Cancel Button
        $("#cancelPNBtn").click(function () {
            if (progressnoteviewmodel.isDirty) {

                progressnoteviewmodel.isForConfirmation = true;
                $('#progressNoteModal').modal('hide');

                notification.confirmCancelation(progressnoteviewmodel.cancellationYes, progressnoteviewmodel.cancellationNo);
            }
            else {
                $('#progressNoteModal').modal('hide');
            }
        });
    },
    cancellationYes: function () {
        progressnoteviewmodel.isForConfirmation = false;
        progressnoteviewmodel.resetModalForm();
    },
    cancellationNo: function () {
        $('#progressNoteModal').modal('show');
        progressnoteviewmodel.isForConfirmation = false;
    },
    saveYes: function () {
        commonViewModel.processingSave("#progressNoteModal", "#savePNBtn");

        var data = new FormData();
        var files = $("#PN_AttachmentFiles").get(0).files;

        // Add the uploaded file to the form data collection  
        if (files.length > 0) {
            for (f = 0; f < files.length; f++) {
                data.append("UploadedFiles", files[f]);
            }
        }
        
        data.append('Id', progressnoteviewmodel.id);
        data.append('RoutId', $('#RoutedOffice').val());
        data.append('ActionOfficerId', $('#PN_ActionOfficer').val());
        data.append('Note', $('#PN_ProgressNote').val());
        data.append('AttachmentHasChanges', progressnoteviewmodel.attachmentHasChanges ? 1 : 0);
        data.append('ForReply', progressnoteviewmodel.forReply ? 1 : 0);

        $.ajax({
            type: "POST",
            url: baseUrl + "api/edatsdocument/saveprogressnote",
            contentType: false,
            processData: false,
            data: data
        }).done(function (result) {
            if (commonViewModel.convertToUpper(result) == commonViewModel.convertToUpper("Ok")) {
                progressnoteviewmodel.isForConfirmation = false;

                commonViewModel.doneSave("#progressNoteModal", "#savePNBtn");

                if (progressnoteviewmodel.id == 0 || progressnoteviewmodel.forReply) {
                    notification.created();
                }
                else {
                    notification.updated();
                }

                progressnoteviewmodel.resetModalForm();
                routingviewmodel.loadRoutedInformationByRoutedOffice();
            }
            else {
                notification.warning("", "Encountered Error!");
                commonViewModel.doneWithError("#progressNoteModal", "#savePNBtn");
                progressnoteviewmodel.isForConfirmation = false;
            }
        }).fail(function (a, b, c) {
            notification.warning("", "Encountered Error!");
            commonViewModel.doneWithError("#progressNoteModal", "#savePNBtn");
            progressnoteviewmodel.isForConfirmation = false;
        });
    },
    saveNo: function () {
        commonViewModel.doneWithError("#progressNoteModal", "#savePNBtn");
        progressnoteviewmodel.isForConfirmation = false;
    },
    resetModalForm: function () {
        $('#progressNoteForm').trigger("reset");

        $("#PN_ActionOfficer").val('').trigger('change');
        $("#PN_filesList").empty();
        $("#PN_ActionOfficer").prop("disabled", false);

        $("#progressNoteForm").find(".has-error").removeClass("has-error");
        $("#progressNoteForm").find(".has-success").removeClass("has-success");

        commonViewModel.removeSelectFieldValidation("#PN_ActionOfficer", "#PN_ActionOfficerDiv");

        progressnoteviewmodel.isForConfirmation = false;
        progressnoteviewmodel.isDirty = false;
        progressnoteviewmodel.attachmentHasChanges = false;
        progressnoteviewmodel.forReply = false;
        progressnoteviewmodel.id = 0;

        $("#savePNBtn").button('reset');
        $("#savePNBtn").prop("disabled", true);
    },
    setFormIsDirty: function(){
        progressnoteviewmodel.isDirty = true;
        $("#savePNBtn").prop("disabled", false);
    },
    editData: function(elem){
        progressnoteviewmodel.loadDataForm(elem, false);
    },
    replyData: function (elem) {
        progressnoteviewmodel.loadDataForm(elem, true);
    },
    loadDataForm: function (elem, forReply) {
        progressnoteviewmodel.forReply = forReply;
        progressnoteviewmodel.id = parseInt($(elem).data("id"));
        var isReply = $(elem).data("reply");

        $.getJSON(baseUrl + "api/edatsdocument/getprogressnotebyid/" + progressnoteviewmodel.id, function (data) {
            $("#progressNoteModal .modal-title").text("Progress Note");
            $("#progressNoteModal").modal();

            var actionOfficerId = forReply ? data.createdById :
                data.actionOfficerId == null || data.actionOfficerId == undefined ? "" : data.actionOfficerId

            commonViewModel.loadList("PN_ActionOfficer", baseUrl + "api/edatsdocument/getactionofficerlist", actionOfficerId.toString(), "");

            if (!forReply) {
                $("#PN_ProgressNote").val(data.note);
                $("#PN_DocumentCode").html($("#documentCode").val());

                $("#PN_filesList").empty();

                // Display the file names
                for (var i = 0; i < data.attachments.length; i++) {
                    $("#PN_filesList").append("<li><i class='fa fa-file'></i>&nbsp;&nbsp;" + data.attachments[i] + "</li>");
                }
            }

            $("#PN_ActionOfficer").prop("disabled", forReply || isReply);

            progressnoteviewmodel.isDirty = false;
            $("#savePNBtn").prop("disabled", true);
        });
    },
    initializeFormValidation: function () {
        var form = $("#progressNoteForm");
        var error = $(".alert-danger", form);
        var success = $(".alert-success", form);

        form.validate({
            errorElement: "span", //default input error message container
            errorClass: "help-block help-block-error", // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",  // validate all fields including form hidden input
            rules: {
                PN_ProgressNote: {
                    required: true,
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
    }
}