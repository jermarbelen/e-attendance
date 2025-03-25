$(document).ready(function () {
    input_helper.initialize();
});

input_helper = {
    telephone: function (arecode, number, div, isrequired) {
        input_helper.validateTelephone(arecode, number, div, isrequired);
    },
    capFirstChar: function (el, event) {
        var $t = $(el);
        if (el.selectionStart == 0 && event.keyCode >= 65 && event.keyCode <= 90 && !(event.shiftKey) && !(event.ctrlKey) && !(event.metaKey) && !(event.altKey)) {
            event.preventDefault();
            var char = String.fromCharCode(event.keyCode);
            $t.val(char + $t.val().slice(el.selectionEnd));
            el.setSelectionRange(1, 1);
        }
    },
    integerOnly: function (el, e) {
        var $t = $(el);
        var keyCode = (e.which) ? e.which : e.keyCode
        if ($.inArray(keyCode, [8, 9, 27, 13, 32, 45]) !== -1 ||
            // Allow: Ctrl+A
            (keyCode == 65 && e.ctrlKey === true) ||
            // Allow: home, end, left, right, down, up
            (keyCode >= 35 && keyCode <= 40) ||
            e.altKey) {

            return;
        }

        if (e.keyCode < 48 || e.keyCode > 57) {
            e.preventDefault();
        }
    },
    noSpace: function (el, event) {
        var $t = $(el);
        if (input_helper.nospace($t)) {
            event.preventDefault();
        }
    },
    removeSpecialChar: function (el) {
        $(el).val($(el).val().replace(/[^a-zA-Z0-9-]/g, ""));
    },
    removeChar: function (el) {
        $(el).val($(el).val().replace(/[^0-9-]/g, ""));
    },
    initialize: function () {
        $('.a-to-zed').keypress(function (e) {
            var keyCode = (e.which) ? e.which : e.keyCode
            if ($.inArray(keyCode, [45, 46, 8, 9, 27, 13, 110, 190, 32, 189, 173]) !== -1 ||
                // Allow: Ctrl+A
                (keyCode == 65 && e.ctrlKey === true)) {

                return;
            }

            if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && (keyCode != 241 && keyCode != 209)) {
                return false;
            }

            return true;
        });

        $('.a-to-zed').focusout(function () {
            this.value = this.value.trim();
            var hasInvalid = false;
            var result = this.value.split('');
            for (var i = 0; i < result.length; i++) {
                var keyCode = result[i].charCodeAt(0);
                if ($.inArray(keyCode, [45, 46, 8, 9, 27, 13, 110, 190, 32, 189, 173]) !== -1 ||
                    // Allow: Ctrl+A
                    (keyCode == 65 && keyCode.ctrlKey === true)) {
                } else {
                    if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && (keyCode != 241 && keyCode != 209)) {
                        hasInvalid = true;
                        break;
                    }
                }
            }

            if (hasInvalid) {
                this.value = '';
            } else {
                input_helper.strictCamel(this);
            }
        });

        $('.camel').keyup(function () {
            input_helper.strictCamel(this);
        });

        $('.capFirstChar').keydown(function (event) {
            var $t = $(this);
            if (this.selectionStart == 0 && event.keyCode >= 65 && event.keyCode <= 90 && !(event.shiftKey) && !(event.ctrlKey) && !(event.metaKey) && !(event.altKey)) {
                event.preventDefault();
                var char = String.fromCharCode(event.keyCode);
                $t.val(char + $t.val().slice(this.selectionEnd));
                this.setSelectionRange(1, 1);
            }
        });

        $('.capFirstChar').keyup(function (event) {
            var $t = $(this);
            if (input_helper.nospace($t)) {
                event.preventDefault();
            }
        });

        $('.noSpace').keyup(function (event) {
            var $t = $(this);
            if (input_helper.nospace($t)) {
                event.preventDefault();
            }
        });

        $('.integerOnly').keypress(function (e) {
            var keyCode = (e.which) ? e.which : e.keyCode
            if ($.inArray(keyCode, [8, 9, 27, 13, 32, 45]) !== -1 ||
                // Allow: Ctrl+A
                (keyCode == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right, down, up
                (keyCode >= 35 && keyCode <= 40) ||
                e.altKey) {

                return;
            }

            if (e.keyCode < 48 || e.keyCode > 57) {
                return false;
            }

            return true;
        });

        $('.alphaNumeric').keypress(function (e) {
            var code = e.keyCode ? e.keyCode : e.which; // Get the key code.
            var pressedKey = String.fromCharCode(code); // Find the key pressed.
            if (pressedKey.match(/[a-zA-Z0-9]/g)) // Check if it's a alpanumeric char or not.
            {
                return;
            } else if (e.keyCode == 32) {
                return;
            }
            return false;
        });

        $(".number").keypress(function (e) {
            var keyCode = (e.which) ? e.which : e.keyCode
            if ($.inArray(keyCode, [8, 9, 27, 13, 32]) !== -1 ||
                // Allow: Ctrl+A
                (keyCode == 65 && e.ctrlKey === true) ||
                 e.altKey) {

                return;
            }

            if (e.keyCode < 48 || e.keyCode > 57) {
                return false;
            }

            return true;
        });

        $(".currency-numeric").keydown(function (e) {
            var keyCode = (e.which) ? e.which : e.keyCode
            if (e.target.value.indexOf('.') > -1 && (keyCode == 190 || keyCode == 110)) {
                return false;
            } else {
                if ($.inArray(keyCode, [46, 8, 9, 27, 13, 110, 32, 190]) !== -1 ||
                    // Allow: Ctrl+A
                    ((e.keyCode == 65 || e.keyCode == 86 || e.keyCode == 67) && (e.ctrlKey === true || e.metaKey === true))) {

                    return;
                }

                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }

                return true;
            }
        });

        $(".currency-numeric").focusout(function () {
            var valueData = accounting.formatNumber(this.value, 2, '');
            this.value = parseFloat(valueData) > 0 ? valueData : "";
        });

        $(".thousandSeparator").focus(function () {
            this.value = this.value.toString().replace(/,/g, "");
        });

        $(".thousandSeparator").focusout(function () {
            var val = parseFloat(this.value) > 0 ? input_helper.thousandSeparator(this.value) : "";
            this.value = val;
        });

        $(".thousandSeparatorWithZero").focus(function () {
            this.value = this.value.toString().replace(/,/g, "");
        });

        $(".thousandSeparatorWithZero").focusout(function () {
            var val = parseFloat(this.value) > 0 ? input_helper.thousandSeparator(this.value) : "0.00";
            this.value = val;
        });

        $('input[type=date]').focus(function () {
            if (this.min == '') {
                this.min = '1900-1-1';
            }

            if (this.max == '') {
                this.max = '2099-12-31';
            }
        });

        $('input[type=date]').focusout(function () {
            if (this.value != '') {
                this.setCustomValidity('');
            }

            if (this.validationMessage != '') {
                this.value = '';
            }

            if (this.min == '') {
                this.min = '1900-1-1';
            }
            var minDate = new Date(this.min);
            var value = new Date(this.value);

            if (minDate > value) {
                this.value = '';
            }

            if (this.max == '') {
                this.max = '';
            }
            var maxDate = new Date(this.max);
            var value = new Date(this.value);

            if (maxDate < value) {
                this.value = '';
            }

        });

        $(':input.nameValidation').focusout(function () {
            var myObject = this.value;
            var removeDashPeriods = myObject.replace(/[-/.]/g, '');
            this.value = removeDashPeriods;
        });
    },

    strictCamel: function (obj) {
        var words = obj.value.split(' ');
        var name = '';
        for (i = 0; i < words.length; i++) {
            if (i > 0) {
                name += ' ';
            }
            var word = words[i];
            if ($.inArray(word.toUpperCase(), ['II', 'III', 'IV', 'VI', 'VII', 'VIII', 'IX']) >= 0) {
                name += word.toUpperCase();
            } else {
                word = word.toLowerCase();
                word = word.substr(0, 1).toUpperCase() + word.substr(1);
                name += word;
            }
        }
        obj.value = name;
    },

    currencyNumeric: function(e){
        var keyCode = (e.which) ? e.which : e.keyCode
        if (e.target.value.indexOf('.') > -1 && (keyCode == 190 || keyCode == 110)) {
            return false;
        } else {
            if ($.inArray(keyCode, [46, 8, 9, 27, 13, 110, 32, 190]) !== -1 ||
                // Allow: Ctrl+A
                ((e.keyCode == 65 || e.keyCode == 86 || e.keyCode == 67) && (e.ctrlKey === true || e.metaKey === true))) {

                return;
            }

            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }

            return true;
        }
    },
    thousandSeparatorFocus: function (elem) {
        elem.val(elem.val().toString().replace(/,/g, ""));
    },
    thousandSeparator: function (int) {
        var x = parseFloat(int).toFixed(2);
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    nospace: function (data) {
        if (data.val().trim().length === 0) {
            data.val("");
        }

        if (data.val().trim().length > 0 && data.val().charCodeAt(0) == 32) {
            data.val(data.val().substr(1));
        }

        if ((data.val().trim().length === 0 && event.which === 32) ||
            (data.val().trim().length > 0 && data.val().charCodeAt(0) == 32)) {
            return true;
        }

        return false;
    },
    validateTelephone: function (arecode, number, div, isRequired) {
        if ($("#" + arecode).val() != "" || $("#" + number).val() != "") {
            if (isRequired) {
                $("#" + arecode).rules("add", {
                    required: true,
                    maxlength: 10
                });

                $("#" + number).rules("add", {
                    required: true,
                    maxlength: 10
                });
            }
        }
        else {
            if (!isRequired) {
                $("#" + number).rules("remove");
                $("#" + arecode).rules("remove");

                $("#" + div).removeClass("has-error").removeClass("has-success");
                $("#" + arecode + "Input").removeClass("has-error").removeClass("has-success");
                $("#" + number + "Input").removeClass("has-error").removeClass("has-success");
                $("#" + number).attr("data-original-title", "");
                $("#" + arecode).attr("data-original-title", "");
            }
        }
    }
}

var g_mathHelper = {
    getInt: function (value) {
        return parseInt(accounting.formatNumber(value, 0, ''));
    },
    getMoney: function (value) {
        return parseFloat(accounting.formatNumber(value, 2, ''));
    },
    getFloat: function (value) {
        return parseFloat(accounting.formatNumber(value, 5, ''));
    }
}