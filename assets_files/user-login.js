$(document).ready(function () {
    loginviewmodel.initialize();
});

var loginviewmodel = {
    initialize: function () {
        this.initBackgroundSlideImages();
        this.bindEvents();

        $("#btnActivate").button('reset');
        $("#btnLogin").button('reset');
        commonViewModel.enabledDiv(".form-body");

        this.initializeFormValidation();
    },
    bindEvents: function () {
        $('#btnActivate').click(function () {
            $("#btnActivate").button('loading');
            commonViewModel.disabledDiv(".form-body");
            loginviewmodel.submitForm(); 
        });

        $(".inputdata").on('keyup', function (e) {
            if (e.keyCode == 13) {
                $("#btnLogin").button('loading');
                commonViewModel.disabledDiv(".form-body");
                loginviewmodel.submitForm();
            }
        });

        $('#btnLogin').click(function () {
            $("#btnLogin").button('loading');
            commonViewModel.disabledDiv(".form-body");
            loginviewmodel.submitForm();
        });
    },

    submitForm: function(){
        if ($("#loginForm").valid()) {
            commonViewModel.disabledDiv("#page-wrap");
            $("#loginForm").submit();
        }
        else {
            $("#btnActivate").button('reset');
            $("#btnLogin").button('reset');
            commonViewModel.enabledDiv(".form-body");
        }
    },

    initializeFormValidation: function () {
        var form = $('#loginForm');
        var error1 = $('.alert-danger', form);
        var success1 = $('.alert-success', form);

        var isLogin = $("#Title").val().toUpperCase().search("Login".toUpperCase()) > -1;

        form.validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "", // validate all fields including form hidden input,

            rules: {
                UserName: {
                    required: isLogin,
                },
                Password: {
                    required: isLogin,
                },
                NewPassword: {
                    required: !isLogin,
                },
                ConfirmPassword: {
                    required: !isLogin,
                },
            },
            messages: {
                UserName: {
                    required: "Username is required.",
                },
                Password: {
                    required: "Password is required.",
                },
                NewPassword: {
                    required: "New Password is required.",
                },
                ConfirmPassword: {
                    required: "Confirm Password is required.",
                },
            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                success1.hide();
                error1.show();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element); // for other inputs, just perform default behavior
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.form-group').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label
                    .closest('.form-group').removeClass('has-error'); // set success class to the control group
            }
        });

    },

    initBackgroundSlideImages: function () {
        var sliderImg = [];

        $.ajax({
            url: baseUrl + "api/loginimages/getslideloginimages",
            type: "GET",
            success: (result) => {
                $.each(result, function (index, value) {
                    var path = baseUrl + "Content/img/login/" + value.fileName;
                    sliderImg.push("" + path);
                });

                if (sliderImg.length > 0) {
                    $('.login-bg').backstretch(sliderImg, {
                        fade: 1000,
                        duration: 8000
                    });
                }
            }
        });

    }
}