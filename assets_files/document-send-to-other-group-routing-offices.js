$(document).ready(function () {
    sendtoothergrouproutingofficeviewmodel.initialize();
});

var sendtoothergrouproutingofficeviewmodel = {
    btnTxt: "",
    id: 0,
    isDirty: false,
    isForConfirmation: false,
    newRowId: 1,
    formMode: "",
    fileRowAddNew: false,
    fileRowIdForEdit: 0,
    officetype: "",
    isCentralOffice: false,
    initialize: function () {
    },
    validateRoutingGroup: function () {
        var hasError = false;

        if ($('#SOGG_RoutingGroupField').val() == "") {
            $("#SOGG_RoutingGroupField").closest("td").addClass("has-error");
            $('#SOGG_RoutingGroupField' + '+ span').tooltip({ 'disabled': false, 'trigger': 'hover', 'title': 'This is required.' });
            hasError = true;
        }
        else {
            var filerows = sendtoothergrouproutingofficeviewmodel.filtertableRow.fnGetData();
            var count = filerows.length;
            $.each(filerows, function (i, item) {
                if ((parseInt(item.Id) != parseInt(sendtoothergrouproutingofficeviewmodel.fileRowIdForEdit))) {
                    if (parseInt(item.RoutingGroupId) == parseInt($('#SOGG_RoutingGroupField').val())) {
                        hasError = true;
                    }
                }
            });

            if (!hasError) {
                $("#SOGG_RoutingGroupField").closest("td").removeClass("has-error");
                $("#SOGG_RoutingGroupField + span").tooltip("destroy");
            }
            else {
                $("#SOGG_RoutingGroupField").closest("td").addClass("has-error");
                $('#SOGG_RoutingGroupField' + '+ span').tooltip({ 'disabled': false, 'trigger': 'hover', 'title': 'Selected record already exist.' });
            }
        }

        return hasError;
    },
    validateRoutingOffice: function () {
        var hasError = false;

        if (($('#SOGG_OfficeField').val() == null || $('#SOGG_OfficeField').val().length <= 0) &&
            ($('#SOGG_ExternalOfficeField').val() == null || $('#SOGG_ExternalOfficeField').val().length <= 0))
        {
            $("#SOGG_OfficeField").closest("td").addClass("has-error");
            $('#SOGG_OfficeField' + '+ span').tooltip({ 'disabled': false, 'trigger': 'hover', 'title': 'This is required.' });
            hasError = true;
        }
        else {
            $("#SOGG_OfficeField").closest("td").removeClass("has-error");
            $("#SOGG_OfficeField + span").tooltip("destroy");

            if (sendtoothergrouproutingofficeviewmodel.isCentralOffice) {
                $("#SOGG_ExternalOfficeField").closest("td").removeClass("has-error");
                $("#SOGG_ExternalOfficeField + span").tooltip("destroy");
            }
        }

        return hasError;
    },
    validateExternalRoutingOffice: function () {
        var hasError = false;

        if (($('#SOGG_ExternalOfficeField').val() == null || $('#SOGG_ExternalOfficeField').val().length <= 0) &&
            ($('#SOGG_OfficeField').val() == null || $('#SOGG_OfficeField').val().length <= 0))
        {
            $("#SOGG_ExternalOfficeField").closest("td").addClass("has-error");
            $('#SOGG_ExternalOfficeField' + '+ span').tooltip({ 'disabled': false, 'trigger': 'hover', 'title': 'This is required.' });
            hasError = true;
        }
        else {
            $("#SOGG_ExternalOfficeField").closest("td").removeClass("has-error");
            $("#SOGG_ExternalOfficeField + span").tooltip("destroy");

            $("#SOGG_OfficeField").closest("td").removeClass("has-error");
            $("#SOGG_OfficeField + span").tooltip("destroy");
        }

        return hasError;
    },
    loadTable: function () {
        if ($.fn.DataTable.isDataTable('#dataTable-routing-offices')) {
            sendtoothergrouproutingofficeviewmodel.filtertableRow.fnDestroy();
        }

        function restoreRow(oTable, nRow) {
            if (nRow != undefined) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);
                
                oTable.fnUpdate(aData.RoutingGroupName, nRow, 1, false);
                oTable.fnUpdate(aData.OfficeName, nRow, 2, false);
                oTable.fnUpdate(aData.ExternalOfficeName, nRow, 3, false);
                oTable.fnUpdate(aData.RoutingGroupId, nRow, 5, false);
                oTable.fnUpdate(aData.OfficeId, nRow, 6, false);
                oTable.fnUpdate(aData.ExternalOfficeId, nRow, 7, false);
                oTable.fnUpdate('<button type="button" class="edit forEdit btn btn-xs btn-circle blue btn-outline">Edit</button><button type="button" onclick="sendtoothergrouproutingofficeviewmodel.deleteData($(this))" class="delete forDelete btn btn-xs btn-circle red btn-outline">Delete</button>', nRow, 8, false);
                oTable.fnDraw();

                $("#newRowRoutingBtn").focus();

                sendtoothergrouproutingofficeviewmodel.disabled_enabled_button(false);
            }
        }

        function editRow(oTable, nRow, forAdd) {
            if (nRow != undefined) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);

                sendtoothergrouproutingofficeviewmodel.fileRowIdForEdit = aData.Id;
                var routingGroupId = forAdd ? "" : aData.RoutingGroupId;
                var officeIds = forAdd ? "" : aData.OfficeIds.split(',');
                var externalofficeIds = forAdd ? "" : aData.ExternalOfficeIds.split(',');

                jqTds[1].innerHTML = '<div id="SOGG_RoutingGroupFieldDiv"><select id="SOGG_RoutingGroupField" name="SOGG_RoutingGroupField" class="form-control" style="width:100%"></select></div>';
                jqTds[2].innerHTML = '<div id="SOGG_OfficeFieldDiv"><select multiple id="SOGG_OfficeField" name="SOGG_OfficeField" class="form-control" style="width:100%"></select></div>';
                jqTds[3].innerHTML = '<div id="SOGG_ExternalOfficeFieldDiv"><select multiple id="SOGG_ExternalOfficeField" name="SOGG_ExternalOfficeField" class="form-control" style="width:100%" disabled></select></div>';
                jqTds[4].innerHTML = "<button type='button' class='btn btn-xs btn-circle blue btn-outline edit'>" + sendtoothergrouproutingofficeviewmodel.btnTxt + "</button>" +
                                     "<button type='button' class='btn btn-xs btn-circle red btn-outline cancel'>Cancel</button>";

                commonViewModel.loadList("SOGG_RoutingGroupField", baseUrl + "api/edatsroutinggroup/getallotherroutinggroup", routingGroupId, "", true);

                if (!forAdd) {
                    sendtoothergrouproutingofficeviewmodel.reloadInternal(routingGroupId, officeIds);

                    $.getJSON(baseUrl + "api/edatsroutinggroup/IsRoutingGroupCentralOffice/" + routingGroupId, function (result) {
                        sendtoothergrouproutingofficeviewmodel.isCentralOffice = result;

                        if (result) {
                            $("#SOGG_ExternalOfficeField").prop("disabled", false);
                            sendtoothergrouproutingofficeviewmodel.reloadExternal(routingGroupId, externalofficeIds);
                        }
                        else {
                            $("#SOGG_ExternalOfficeField").prop("disabled", true);
                            $("#SOGG_ExternalOfficeField").empty();
                        }
                    });
                }

                $("#SOGG_RoutingGroupField").focus();
                $('#SOGG_RoutingGroupField').select2()
                .change(function () {
                    var result = sendtoothergrouproutingofficeviewmodel.validateRoutingGroup();
                    if (!result) {
                        var officeIds = $("#SOGG_OfficeField").val() == null ? "" : $("#SOGG_OfficeField").val();
                        sendtoothergrouproutingofficeviewmodel.reloadInternal($('#SOGG_RoutingGroupField').val(), officeIds);

                        if ($('#SOGG_RoutingGroupField').val() != "") {
                            $.getJSON(baseUrl + "api/edatsroutinggroup/IsRoutingGroupCentralOffice/" + $('#SOGG_RoutingGroupField').val(), function (result) {
                                sendtoothergrouproutingofficeviewmodel.isCentralOffice = result;

                                if (result) {
                                    $("#SOGG_ExternalOfficeField").prop("disabled", false);
                                    var officeIds = $("#SOGG_ExternalOfficeField").val() == null ? "" : $("#SOGG_ExternalOfficeField").val();
                                    sendtoothergrouproutingofficeviewmodel.reloadExternal($('#SOGG_RoutingGroupField').val(), officeIds);
                                }
                                else {
                                    $("#SOGG_ExternalOfficeField").prop("disabled", true);
                                    $("#SOGG_ExternalOfficeField").empty();
                                }
                            });
                        }
                        else {
                            sendtoothergrouproutingofficeviewmodel.isCentralOffice = false;
                            $("#SOGG_ExternalOfficeField").prop("disabled", true);
                            $("#SOGG_ExternalOfficeField").empty();
                        }
                    }
                    else {
                        $('#SOGG_OfficeField').empty();
                    }
                })
                .click(function () {
                    sendtoothergrouproutingofficeviewmodel.validateRoutingGroup();
                });

                $('#SOGG_ExternalOfficeField').select2()
                .change(function () {
                    sendtoothergrouproutingofficeviewmodel.validateExternalRoutingOffice();
                })
                .click(function () {
                    sendtoothergrouproutingofficeviewmodel.validateExternalRoutingOffice();
                });

                $('#SOGG_OfficeField').select2({ closeOnSelect: false })
                .change(function () {
                    sendtoothergrouproutingofficeviewmodel.validateRoutingOffice();
                })
                .click(function () {
                    sendtoothergrouproutingofficeviewmodel.validateRoutingOffice();
                });

                sendtoothergrouproutingofficeviewmodel.disabled_enabled_button(true);
            }
        }

        function saveRow(oTable, nRow) {
            if (nRow != undefined) {
                var hasError = sendtoothergrouproutingofficeviewmodel.validateRoutingGroup();

                var internal = sendtoothergrouproutingofficeviewmodel.validateRoutingOffice();
                var external = sendtoothergrouproutingofficeviewmodel.validateExternalRoutingOffice();

                hasError = hasError ? hasError : internal || external;

                if (hasError) {
                    return true;
                }

                var routingGroupId = $("#SOGG_RoutingGroupField").val();

                var officeIds = $("#SOGG_OfficeField").val() != null
                    ? $("#SOGG_OfficeField").val().join()
                    : "";

                var externalofficeIds = $("#SOGG_ExternalOfficeField").val() != null
                    ? $("#SOGG_ExternalOfficeField").val().join()
                    : "";

                var officeNames = [];
                $("#SOGG_OfficeField option:selected").each(function () {
                    var $this = $(this);
                    if ($this.length) {
                        officeNames.push($this.text());
                    }
                });

                var externalofficeNames = [];
                $("#SOGG_ExternalOfficeField option:selected").each(function () {
                    var $this = $(this);
                    if ($this.length) {
                        externalofficeNames.push($this.text());
                    }
                });

                oTable.fnUpdate($("#SOGG_RoutingGroupField option:selected").text(), nRow, 1, false);
                oTable.fnUpdate(officeNames.join(), nRow, 2, false);
                oTable.fnUpdate(externalofficeNames.join(), nRow, 3, false);
                oTable.fnUpdate(routingGroupId, nRow, 5, false);
                oTable.fnUpdate(officeIds, nRow, 6, false);
                oTable.fnUpdate(externalofficeIds, nRow, 7, false);
                oTable.fnUpdate('<button type="button" class="edit r_forEdit btn btn-xs btn-circle blue btn-outline">Edit</button><button type="button" onclick="sendtoothergrouproutingofficeviewmodel.deleteData($(this))" class="delete r_forDelete btn btn-xs btn-circle red btn-outline">Delete</button>', nRow, 8, false);
                oTable.fnDraw();

                sendtoothergrouproutingofficeviewmodel.disabled_enabled_button(false);
                sendtoothergroupviewmodel.setFormIsDirty(true);

                sendtoothergrouproutingofficeviewmodel.fileRowIdForEdit = 0;
                sendtoothergrouproutingofficeviewmodel.fileRowAddNew = false;

                // reload to office
                if ($("#SOG_RoutingOfficeGroupField").val() != "") {

                    if ($("#SOG_OfficeField").val() != null && $("#SOG_OfficeField").val() != "") {
                        sendtoothergroupviewmodel.reloadInternal();
                    }

                    if (sendtoothergroupviewmodel.isCentralOffice && ($("#SOG_OfficeField").val() == "" || $("#SOG_OfficeField").val() == null))
                    {
                        if ($("#SOG_ExternalOfficeField").val() != null && $("#SOG_ExternalOfficeField").val() != "") {
                            sendtoothergroupviewmodel.reloadExternal();
                        }
                    }
                }

                $("#newRowRoutingBtn").focus();
                sendtoothergrouproutingofficeviewmodel.validateCCCount();
            }
            
            return false;
        }

        var table = $('#dataTable-routing-offices');

        datatableviewmodel.AddSearchColumn("dataTable-routing-offices", "routing");

        sendtoothergrouproutingofficeviewmodel.filtertableRow = $('#dataTable-routing-offices').dataTable({
            filter: true,
            orderCellsTop: true,
            stateSave: false,
            processing: true,
            serverSide: false,
            autoWidth: true,
            lengthChange: false,
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
                "url": edatsBaseUrl + "Document/GetAllRoutingOffice",
                "type": "POST",
                "data": function (d) {
                    d.routingId = parseInt($('#RoutedOffice').val())
                }
            },
            columns: [
                {
                    "data": "Add",
                    "width": "3px",
                    "orderable": false,
                    "render": function (data, type, full, meta) {
                        return "";
                    }
                },
                { "data": "RoutingGroupName", "orderable": true, "width": "25%" },
                { "data": "OfficeName", "orderable": true, "width": "40%" },
                { "data": "ExternalOfficeName", "orderable": true, "width": "20%" },
                { "data": "Id", "visible": false },
                { "data": "RoutingGroupId", "visible": false },
                { "data": "OfficeIds", "visible": false },
                { "data": "ExternalOfficeIds", "visible": false },
                {
                    "data": "Action",
                    "width": "15%",
                    "orderable": false,
                    "render": function (data, type, full, meta) {
                        return "<button type='button' class='btn btn-xs btn-circle blue btn-outline edit r_forEdit'>Edit</button>" +
                            "<button type='button' class='btn btn-xs btn-circle red btn-outline delete r_forDelete' onclick='sendtoothergrouproutingofficeviewmodel.deleteData($(this))'>Delete</button>";
                    }
                }
            ],

            order: [[1, "asc"]],

            lengthMenu: [
                [5],
                [5] // change per page values here
            ],

            pageLength: 5,

            dom: "frtlip" // horizobtal scrollable datatable
            
        });

        datatableviewmodel.InitializeEventsForSearchColumn("dataTable-routing-offices", sendtoothergrouproutingofficeviewmodel.filtertableRow, "routing");
        datatableviewmodel.DropdownFilterDataCountBesideInfo();
        $("#dataTable-routing-offices_filter").hide();

        var nEditing = null;
        var nNew = false;

        $('#newRowRoutingBtn').click(function (e) {
            sendtoothergrouproutingofficeviewmodel.btnTxt = "Add";
            sendtoothergrouproutingofficeviewmodel.formMode = "ADD";
            if (!sendtoothergrouproutingofficeviewmodel.fileRowAddNew) {
                e.preventDefault();

                sendtoothergrouproutingofficeviewmodel.newRowId -= 1;
                var aiNew = sendtoothergrouproutingofficeviewmodel.filtertableRow.fnAddData([
                {
                    Id: sendtoothergrouproutingofficeviewmodel.newRowId,
                    OfficeIds: "",
                    OfficeName: "",
                    ExternalOfficeIds: "",
                    ExternalOfficeName: "",
                    RoutingGroupId: "",
                    RoutingGroupName: ""
                }]);
                var nRow = sendtoothergrouproutingofficeviewmodel.filtertableRow.fnGetNodes(aiNew[0]);
                editRow(sendtoothergrouproutingofficeviewmodel.filtertableRow, nRow, true);
                nEditing = nRow;
                nNew = true;

                sendtoothergrouproutingofficeviewmodel.fileRowAddNew = true;
            }
        });

        table.on('click', '.cancel', function (e) {
            e.preventDefault();
            if (nNew) {
                sendtoothergrouproutingofficeviewmodel.filtertableRow.fnDeleteRow(nEditing);
                nEditing = null;
                nNew = false;
                sendtoothergrouproutingofficeviewmodel.disabled_enabled_button(false);
            } else {
                restoreRow(sendtoothergrouproutingofficeviewmodel.filtertableRow, nEditing);
                nEditing = null;
            }

            sendtoothergrouproutingofficeviewmodel.fileRowAddNew = false;
        });

        table.on('click', '.edit', function (e) {
            sendtoothergrouproutingofficeviewmodel.btnTxt = "Save";
            e.preventDefault();

            if (!sendtoothergrouproutingofficeviewmodel.fileRowAddNew) {
                nNew = false;
            }

            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];
            
            if (nEditing !== null && nEditing != nRow) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                restoreRow(sendtoothergrouproutingofficeviewmodel.filtertableRow, nEditing);
                editRow(sendtoothergrouproutingofficeviewmodel.filtertableRow, nRow, false);
                nEditing = nRow;
            } else if (nEditing == nRow &&
                (commonViewModel.convertToUpper(this.textContent) == commonViewModel.convertToUpper("Add") ||
                    commonViewModel.convertToUpper(this.textContent) == commonViewModel.convertToUpper("Save"))) {
                /* Editing this row and want to save it */
                var hasError = saveRow(sendtoothergrouproutingofficeviewmodel.filtertableRow, nEditing);
                if (!hasError) {
                    nEditing = null;
                }
            } else {
                /* No edit in progress - let's start one */
                editRow(sendtoothergrouproutingofficeviewmodel.filtertableRow, nRow, false);
                nEditing = nRow;
            }
        });
    },
    reloadInternal: function (routingGroupId, value) {
        var ccIds = [];
        if ($("#SOG_OfficeField").val() != "") {
            ccIds.push($("#SOG_OfficeField").val());
        }

        commonViewModel.loadList("SOGG_OfficeField", baseUrl + "api/edatsroutinggroup/getallroutinggroupofficesbyidandtype/" + routingGroupId + "/Internal", value, "", false, ccIds);
    },
    reloadExternal: function (routingGroupId, value) {
        var ccIds = [];
        if ($("#SOG_ExternalOfficeField").val() != "") {
            ccIds.push($("#SOG_ExternalOfficeField").val());
        }

        commonViewModel.loadList("SOGG_ExternalOfficeField", baseUrl + "api/edatsroutinggroup/getallroutinggroupofficesbyidandtype/" + routingGroupId + "/External", value, "", false, ccIds);
    },
    deleteData: function (data) {
        var nRow = data.parents('tr')[0];
        sendtoothergrouproutingofficeviewmodel.filtertableRow.fnDeleteRow(sendtoothergrouproutingofficeviewmodel.filtertableRow.fnGetPosition(nRow));
        sendtoothergroupviewmodel.setFormIsDirty(true);
        sendtoothergrouproutingofficeviewmodel.validateCCCount();
    },
    disabled_enabled_button: function (value) {
        $(".r_forEdit").prop("disabled", value);
        $(".r_forDelete").prop("disabled", value);
        $("#newRowRoutingBtn").prop("disabled", value);
        $("#cancelSendToOtherGroupBtn").prop("disabled", value);
        $("#SOG_RoutingOfficeGroupField").prop("disabled", value);

        if ($("#SOG_ExternalOfficeField").prop("disabled") || $("#SOG_ExternalOfficeField").val() == null) {
            $("#SOG_OfficeField").prop("disabled", value);
        }

        if ($("#SOG_OfficeField").prop("disabled") || $("#SOG_OfficeField").val() == null) {
            $("#SOG_ExternalOfficeField").prop("disabled", value);
        }

        $("#routing1").prop("disabled", value);
        $("#routing2").prop("disabled", value);
        $("#routing3").prop("disabled", value);

        if (sendtoothergroupviewmodel.isDirty) {
            $("#saveSendToOtherGroupBtn").prop("disabled", value);
        }

        $("select[name='dataTable-routing-offices_length']").prop("disabled", value);

        if (value) {
            commonViewModel.disabledDiv("#dataTable-routing-offices_paginate");
        }
        else {
            commonViewModel.enabledDiv("#dataTable-routing-offices_paginate");
        }
    },
    validateCCCount: function () {
        if (sendtoothergroupviewmodel.action == "RELEASE TO RMIS") {
            var cc = sendtoothergrouproutingofficeviewmodel.filtertableRow.fnGetData();
            if (cc.length > 0) {
                $("#SOG_RoutingOfficeGroupField").rules("add", {
                    required: true
                });
            }
            else {
                $("#SOG_RoutingOfficeGroupField").rules("remove");
                commonViewModel.removeSelectFieldValidation("#SOG_RoutingOfficeGroupField", "#SOG_RoutingOfficeGroupDiv");
            }
        }
    }
}