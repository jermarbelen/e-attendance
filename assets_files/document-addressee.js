$(document).ready(function () {
    addresseeviewmodel.initialize();
    addresseeviewmodel.loadTable();
});

var addresseeviewmodel = {
    id: 0,
    edatsdocumentid: 0,
    isDirty: false,
    isForConfirmation: false,
    forEdit: false,
    forEditnrow: null,
    forEditId: null,
    idCount: 1,
    initialize: function () {
        addresseeviewmodel.initializeFormValidation();

        $("#IsCCAddresee").select2({ minimumResultsForSearch: -1 });
        $("#IsCCAddresee").val('No').trigger('change');

        $("#AddresseeInternalId").select2();
        $("#M_AddresseeInternalId").select2({ closeOnSelect: false });

        commonViewModel.loadList("AddresseeInternalId", baseUrl + "api/office/getlist/", "", "");
        commonViewModel.loadList("M_AddresseeInternalId", baseUrl + "api/office/getlist/", "", "", false);

        $("#AddresseeExternalFieldOfficeId").select2();
        commonViewModel.loadList("AddresseeExternalFieldOfficeId", baseUrl + "api/externaloffice/getlist/", "", "");

        addresseeviewmodel.validateSender();

        $('#newRowAddresseeBtn').click(function (e) {
            if ($("#IsRoutedOffice").val() != 1) {

                $("#addresseeModal").modal();
                $("#M_AddresseeInternalIdDiv").show();
                $("#AddresseeInternalIdDiv").hide();
                $("#saveAddresseeBtn").prop("disabled", true);
                $("#saveAddresseeBtn").html("Add");
            }
        });

        $('.selectdataaddressee').change(function () {
            $("#addresseeForm").validate().element('#' + this.id);
            addresseeviewmodel.setFormIsDirty(true)
        });

        $('.inputdataaddressee').keyup(function () {
            $("#addresseeForm").validate().element('#' + this.id);
            addresseeviewmodel.setFormIsDirty(true)
        });

        $('input[type=radio][name=typeRadioAddressee]').change(function () {
            addresseeviewmodel.validateSender();
        });

        $('#AddresseeInternalId').change(function () {
            $("#addresseeForm").validate().element('#AddresseeInternalId');
            addresseeviewmodel.setFormIsDirty(true);

            var value = $('input[name=typeRadioAddressee]:checked').val();
            if ($('#AddresseeInternalId').val() == "" ||
                $('#AddresseeInternalId').val() == undefined ||
                $('#AddresseeInternalId').val() == null)
            {
                $("#AddresseeAddress").val("");
            }
            else {
                $.getJSON(baseUrl + "api/edatsdocument/getofficeaddress/" + $('#AddresseeInternalId').val() + "/" + value, function (data) {
                    $("#AddresseeAddress").val(data);
                    $("#addresseeForm").validate().element('#AddresseeAddress');
                });
            }
        });

        $('#M_AddresseeInternalId').change(function () {
            var value = $('input[name=typeRadioAddressee]:checked').val();
            if ($('#M_AddresseeInternalId').val() == "" ||
                $('#M_AddresseeInternalId').val() == undefined ||
                $('#M_AddresseeInternalId').val() == null) {
                $("#AddresseeAddress").val("");
            }
            else {
                let addresseeInternalId = $("#M_AddresseeInternalId").val()[0];
                $.getJSON(baseUrl + "api/edatsdocument/getofficeaddress/" + addresseeInternalId + "/" + value, function (data) {
                    $("#AddresseeAddress").val(data);
                    $("#addresseeForm").validate().element('#AddresseeAddress');
                });
            }

            $("#addresseeForm").validate().element('#M_AddresseeInternalId');
            addresseeviewmodel.setFormIsDirty(true);
        });

        $('#AddresseeExternalFieldOfficeId').change(function () {
            $("#addresseeForm").validate().element('#AddresseeExternalFieldOfficeId');
            addresseeviewmodel.setFormIsDirty(true);

            var value = $('input[name=typeRadioAddressee]:checked').val();
            if ($('#AddresseeExternalFieldOfficeId').val() == "" ||
                $('#AddresseeExternalFieldOfficeId').val() == undefined ||
                $('#AddresseeExternalFieldOfficeId').val() == null)
            {
                $("#AddresseeAddress").val("");
            }
            else {
                $.getJSON(baseUrl + "api/edatsdocument/getofficeaddress/" + $('#AddresseeExternalFieldOfficeId').val() + "/" + value, function (data) {
                    $("#AddresseeAddress").val(data);
                    $("#addresseeForm").validate().element('#AddresseeAddress');
                });
            }
        });

        $('#addresseeModal').on('shown.bs.modal', function (e) {
            $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
        });

        $('#addresseeModal').on('hidden.bs.modal', function (e) {
            if (!addresseeviewmodel.isForConfirmation) {
                addresseeviewmodel.resetModalForm();
            }
        });

        $("#saveAddresseeBtn").click(function (e) {
            if ($("#addresseeForm").valid()) {
                $("#saveAddresseeBtn").button('loading');

                addresseeviewmodel.addrecord();
                commonViewModel.scrollElement("", "#addresseeDiv");
            }
        });

        $("#releaseDocumentOnSaveChk").click(function (e) {
            addresseeviewmodel.setFormIsDirty(true);
        });

        //// Cancel Button
        $("#cancelAddresseeBtn").click(function () {
            if (addresseeviewmodel.isDirty) {

                addresseeviewmodel.isForConfirmation = true;
                $('#addresseeModal').modal('hide');

                notification.confirmCancelation(addresseeviewmodel.cancellationYes, addresseeviewmodel.cancellationNo);
            }
            else {
                $('#addresseeModal').modal('hide');
            }
        });
    },
    cancellationYes: function () {
        addresseeviewmodel.isForConfirmation = false;
        addresseeviewmodel.resetModalForm();
    },
    cancellationNo: function () {
        $('#addresseeModal').modal('show');
        addresseeviewmodel.isForConfirmation = false;
    },
    addrecord: function () {
        var addresseesdatas = addresseeviewmodel.filtertable.fnGetData();
        var hasDuplicateAddresee = false;
        var type = $('input[name=typeRadioAddressee]:checked').val();
        var addressee = "";
        var addresseeId = "0";
        var duplicateAddressee = [];
        var address = $("#AddresseeAddress").val();

        //// Validate Duplicate
        if (type == "Internal" && !addresseeviewmodel.forEdit) {
            $("#M_AddresseeInternalId option:selected").each(function () {
                var data = $(this)[0];
                $.each(addresseesdatas, function (i, item) {
                    if (item.AddresseeType == type && item.AddresseeId == data.value) {
                        duplicateAddressee.push(data.text)
                        hasDuplicateAddresee = true;
                    }
                });
            });
        }
        else {
            if (type == "Internal") {
                addressee = $("#AddresseeInternalId option:selected").text();
                addresseeId = $("#AddresseeInternalId").val();
            }

            else if (type == "External Field Office") {
                addressee = $("#AddresseeExternalFieldOfficeId option:selected").text();
                addresseeId = $("#AddresseeExternalFieldOfficeId").val();
            }

            else if (type == "External") {
                addressee = $("#AddresseeExternal").val();
            }

            $.each(addresseesdatas, function (i, item) {
                if (item.Id != addresseeviewmodel.forEditId) {
                    if (type == "Internal" || type == "External Field Office") {
                        if (item.AddresseeType == type &&
                            item.AddresseeId == addresseeId &&
                            !hasDuplicateAddresee) {
                            hasDuplicateAddresee = true;
                        }
                    }
                    else {
                        if (item.AddresseeType == type &&
                            item.Addressee == addressee &&
                            !hasDuplicateAddresee) {
                            hasDuplicateAddresee = true;
                        }
                    }
                }
            });
        }

        if (hasDuplicateAddresee) {
            var addressee = duplicateAddressee.length > 0 ? " [" +duplicateAddressee.join() + "] !" : "!";
            notification.warning("", "Duplicate Addressee" + addressee);
            $("#saveAddresseeBtn").button('reset');
            $("#saveAddresseeBtn").prop("disabled", false);
        }
        else {
            if (addresseeviewmodel.forEdit) {
                var nRow = addresseeviewmodel.forEditnrow;

                if ((type == "Internal" || type == "External Field Office") && $("#releaseDocumentOnSaveChk").is(':checked')) {
                    $.getJSON(baseUrl + "api/edatsroutinggroup/ValidateIfOfficeIsWithinTheCurrentUserOfficeRoutingGroup/" + addresseeId + "/" + type, function (result) {
                        var releaseDocumentOnSave = result ? "Yes" : "No"
                        addresseeviewmodel.filtertable.fnUpdate(addresseeId, nRow, 2, false);
                        addresseeviewmodel.filtertable.fnUpdate(addressee, nRow, 3, false);
                        addresseeviewmodel.filtertable.fnUpdate(type, nRow, 4, false);
                        addresseeviewmodel.filtertable.fnUpdate(address, nRow, 5, false);
                        addresseeviewmodel.filtertable.fnUpdate($("#IsCCAddresee").val(), nRow, 6, false);
                        addresseeviewmodel.filtertable.fnUpdate(releaseDocumentOnSave, nRow, 7, false);
                    });
                }
                else {
                    addresseeviewmodel.filtertable.fnUpdate(addresseeId, nRow, 2, false);
                    addresseeviewmodel.filtertable.fnUpdate(addressee, nRow, 3, false);
                    addresseeviewmodel.filtertable.fnUpdate(type, nRow, 4, false);
                    addresseeviewmodel.filtertable.fnUpdate(address, nRow, 5, false);
                    addresseeviewmodel.filtertable.fnUpdate($("#IsCCAddresee").val(), nRow, 6, false);
                    addresseeviewmodel.filtertable.fnUpdate($("#releaseDocumentOnSaveChk").is(':checked') ? "Yes" : "No", nRow, 7, false);
                }
            }
            else {
                if (type == "Internal") {
                    $("#M_AddresseeInternalId option:selected").each(function () {
                        var data = $(this)[0];

                        if ($("#releaseDocumentOnSaveChk").is(':checked')) {
                            $.getJSON(baseUrl + "api/edatsroutinggroup/ValidateIfOfficeIsWithinTheCurrentUserOfficeRoutingGroup/" + data.value + "/" + type, function (result) {
                                var releaseDocumentOnSave = result ? "Yes" : "No"
                                addresseeviewmodel.idCount = addresseeviewmodel.idCount - 1;
                                addresseeviewmodel.filtertable.fnAddData([{
                                    Id: addresseeviewmodel.idCount,
                                    AddresseeId: data.value,
                                    Addressee: data.text,
                                    AddresseeType: type,
                                    Address: address,
                                    CC: $("#IsCCAddresee").val(),
                                    ReleaseDocumentOnSave: releaseDocumentOnSave,
                                }]);
                            });
                        }
                        else {
                            addresseeviewmodel.idCount = addresseeviewmodel.idCount - 1;
                            addresseeviewmodel.filtertable.fnAddData([{
                                Id: addresseeviewmodel.idCount,
                                AddresseeId: data.value,
                                Addressee: data.text,
                                AddresseeType: type,
                                Address: address,
                                CC: $("#IsCCAddresee").val(),
                                ReleaseDocumentOnSave: "No",
                            }]);
                        }
                    });
                } else if (type == "External Field Office") {
                    if ($("#releaseDocumentOnSaveChk").is(':checked')) {
                        $.getJSON(baseUrl + "api/edatsroutinggroup/ValidateIfOfficeIsWithinTheCurrentUserOfficeRoutingGroup/" + data.value + "/" + type, function (result) {
                            var releaseDocumentOnSave = result ? "Yes" : "No"
                            addresseeviewmodel.idCount = addresseeviewmodel.idCount - 1;
                            addresseeviewmodel.filtertable.fnAddData([{
                                Id: addresseeviewmodel.idCount,
                                AddresseeId: addresseeId,
                                Addressee: addressee,
                                AddresseeType: type,
                                Address: address,
                                CC: $("#IsCCAddresee").val(),
                                ReleaseDocumentOnSave: releaseDocumentOnSave,
                            }]);
                        });
                    }
                    else {
                        addresseeviewmodel.idCount = addresseeviewmodel.idCount - 1;
                        addresseeviewmodel.filtertable.fnAddData([{
                            Id: addresseeviewmodel.idCount,
                            AddresseeId: addresseeId,
                            Addressee: addressee,
                            AddresseeType: type,
                            Address: address,
                            CC: $("#IsCCAddresee").val(),
                            ReleaseDocumentOnSave: "No",
                        }]);
                    }
                }
                else {
                    addresseeviewmodel.idCount = addresseeviewmodel.idCount - 1;
                    addresseeviewmodel.filtertable.fnAddData([{
                        Id: addresseeviewmodel.idCount,
                        AddresseeId: addresseeId,
                        Addressee: addressee,
                        AddresseeType: type,
                        Address: address,
                        CC: $("#IsCCAddresee").val(),
                        ReleaseDocumentOnSave: $("#releaseDocumentOnSaveChk").is(':checked') ? "Yes" : "No",
                    }]);
                }
            }

            addresseeviewmodel.forEditnrow = null;
            addresseeviewmodel.forEdit = false;
            addresseeviewmodel.isForConfirmation = false;
            $("#saveAddresseeBtn").button('reset');

            formmodel.setFormIsDirty(true);
            $("#addresseeModal").modal("hide");
        }
    },
    validateSender: function () {
        var value = $('input[name=typeRadioAddressee]:checked').val();
        $('#AddresseeInternalIdDiv').hide();
        $('#M_AddresseeInternalIdDiv').hide();
        $('#AddresseeExternalFieldOfficeIdDiv').hide();
        $('#AddresseeExternalDiv').hide();

        $("#AddresseeAddress").val('');
        $("#AddresseeInternalId").val('').trigger('change');
        $("#M_AddresseeInternalId").val('').trigger('change');
        $("#AddresseeExternalFieldOfficeId").val('').trigger('change');
        $("#AddresseeExternal").val('')

        $("#AddresseeInternalId").rules("remove");
        $("#M_AddresseeInternalId").rules("remove");
        $("#AddresseeExternalFieldOfficeId").rules("remove");
        $("#AddresseeExternal").rules("remove");

        $("#releaseDocumentOnSaveChk").prop("disabled", false);

        if (value == "Internal") {
            if (addresseeviewmodel.forEdit) {
                $('#AddresseeInternalIdDiv').show();
                $("#AddresseeInternalId").rules("add", {
                    required: true,
                });
            }
            else {
               
                $('#M_AddresseeInternalIdDiv').show();
                $("#M_AddresseeInternalId").rules("add", {
                    required: true,
                });
            }
        }

        else if (value == "External Field Office") {
            $('#AddresseeExternalFieldOfficeIdDiv').show();
            $("#AddresseeExternalFieldOfficeId").rules("add", {
                required: true,
            });
        }

        else if (value == "External") {
            $('#releaseDocumentOnSaveChk').prop('checked', false);
            $("#releaseDocumentOnSaveChk").prop("disabled", true);

            $('#AddresseeExternalDiv').show();
            $("#AddresseeExternal").rules("add", {
                required: true,
                maxlength: 250
            });
        }

        commonViewModel.removeInputFieldValidation("#AddresseeExternal", "#AddresseeInternalExternalDiv");
        commonViewModel.removeSelectFieldValidation("#AddresseeInternalId", "#AddresseeInternalExternalDiv");
        commonViewModel.removeSelectFieldValidation("#AddresseeExternalFieldOfficeId", "#AddresseeInternalExternalDiv");
    },
    resetModalForm: function () {
        $('#addresseeForm').trigger("reset");

        addresseeviewmodel.validateSender();

        $("#AddresseeInternalId").val('').trigger('change');
        $("#AddresseeExternalFieldOfficeId").val('').trigger('change');
        $("#IsCCAddresee").val('No').trigger('change');

        $("#addresseeForm").find(".has-error").removeClass("has-error");
        $("#addresseeForm").find(".has-success").removeClass("has-success");

        addresseeviewmodel.isForConfirmation = false;
        addresseeviewmodel.isDirty = false;

        addresseeviewmodel.forEditnrow = null;
        addresseeviewmodel.forEdit = false;
        addresseeviewmodel.forEditId = null;

        $("#saveAddresseeBtn").button('reset');
        $("#saveAddresseeBtn").prop("disabled", true);
    },
    setFormIsDirty: function(){
        addresseeviewmodel.isDirty = true;
        $("#saveAddresseeBtn").prop("disabled", false);
    },
    initializeFormValidation: function () {
        var form = $("#addresseeForm");
        var error = $(".alert-danger", form);
        var success = $(".alert-success", form);

        form.validate({
            errorElement: "span", //default input error message container
            errorClass: "help-block help-block-error", // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",  // validate all fields including form hidden input
            rules: {
                AddresseeAddress: {
                    required: true,
                    maxlength: 1000
                },
                IsCCAddresee: {
                    required: true,
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
    },
    loadTable: function () {
        var table = $('#dataTable-addressee');

        addresseeviewmodel.filtertable = $('#dataTable-addressee').dataTable({
            filter: false,
            orderCellsTop: true,
            stateSave: false,
            processing: true,
            serverSide: false,
            autoWidth: true,
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
                "url": edatsBaseUrl + "Document/GetAddressee",
                "type": "POST",
                "data": function (d) {
                    d.edatsdocumentid = $("#Id").val();
                }
            },
            columns: [
               {
                   "data": "Add",
                   "width": "5%",
                   "orderable": false,
                   "render": function (data, type, full, meta) {
                        return '';
                   }
               },
               { "data": "Id", "visible": false },
               { "data": "AddresseeId", "visible": false },
               { "data": "Addressee", "orderable": false, "width": "25%" },
               { "data": "AddresseeType", "orderable": false, "width": "15%" },
               { "data": "Address", "orderable": false, "width": "25%" },
               { "data": "CC", "orderable": false },
               { "data": "ReleaseDocumentOnSave", "orderable": false },
               {
                   "data": "Action",
                   "orderable": false,
                   "width": "10%",
                   "render": function (data, type, full, meta) {
                       if ($("#IsRoutedOffice").val() == 1 && formmodel.id > 0) {
                           return "";
                       }
                       var action = "<div class='btn-group pull-right'>" +
                         '<button type="button" class="btn green btn-sm btn-outline dropdown-toggle" id="actionsBtn" data-toggle="dropdown"> Actions<i class="fa fa-angle-down"></i></button>' +
                         "<ul class='dropdown-menu pull-right' role='menu'>";

                       action += "<li><a href='#' class='edit forEdit'>Edit</a></li>";
                       action += "<li><a href='#' class='delete forDelete'>Delete</a></li>";
                       action += "</ul></div>";

                       return action;
                   }
               }
            ],

            order: [[1, "asc"]],

            lengthMenu: [
                [5, 10, 15, 20, 30],
                [5, 10, 15, 20, 30] // change per page values here
            ],

            pageLength: 5,

            dom: "frtlip", // horizobtal scrollable datatable
        });

        datatableviewmodel.DropdownFilterDataCountBesideInfo();

        table.on('click', '.delete', function (e) {
            e.preventDefault();

            var nRow = $(this).parents('tr')[0];

            addresseeviewmodel.filtertable.fnDeleteRow(addresseeviewmodel.filtertable.fnGetPosition(nRow));
            formmodel.setFormIsDirty(true)
        });

        table.on('click', '.edit', function (e) {
            $("#addresseeModal").modal();
            $("#M_AddresseeInternalIdDiv").hide();
            $("#AddresseeInternalIdDiv").show();

            var nRow = $(this).parents('tr')[0];
            var data = addresseeviewmodel.filtertable.fnGetData(nRow);

            addresseeviewmodel.forEdit = true;
            addresseeviewmodel.forEditnrow = nRow;
            addresseeviewmodel.forEditId = data.Id;

            //$('#addresseeModal').modal('show');
            //$("#addresseeModal").modal();
            $("#saveAddresseeBtn").html("Update");

            if (data.AddresseeType.trim() == "Internal") {
                $('#typeRadioAddressee1').prop('checked', true);
            }
            else if (data.AddresseeType.trim() == "External Field Office") {
                $('#typeRadioAddressee2').prop('checked', true);
            }
            else if (data.AddresseeType.trim() == "External") {
                $('#typeRadioAddressee3').prop('checked', true);
            }

            addresseeviewmodel.validateSender();

            if (data.AddresseeType.trim() == "Internal") {
                $("#AddresseeInternalId").val(data.AddresseeId).trigger('change');
            }
            else if (data.AddresseeType.trim() == "External Field Office") {
                $("#AddresseeExternalFieldOfficeId").val(data.AddresseeId).trigger('change');
            }
            else if (data.AddresseeType.trim() == "External") {
                $("#AddresseeExternal").val(data.Addressee);
            }
          
            $("#IsCCAddresee").val(data.CC).trigger('change');

            setTimeout(function () {
                $("#AddresseeAddress").val(data.Address);
            }, 200);

            $('#releaseDocumentOnSaveChk').prop('checked', data.ReleaseDocumentOnSave == "Yes");

            addresseeviewmodel.isDirty = false;
            $("#saveAddresseeBtn").prop("disabled", true);
        });
    }
}