$('#signBtn').click(function (e) {
    $("#signBtn").attr("disabled", true)

    var username = $('#username').val()
    var classify = $('#classify').val()
    var password = $('#password').val()
    var confirm = $('#confirm').val()
    var pid = $('#pid').val()
    $.ajax({
        url: '/users/userSignup',
        cache: true,
        type: 'post',
        data: {
            'username': username,
            'classify': classify,
            'password': password,
            'confirm': confirm,
            'pid': pid,
        },
        success: function (data) {
            $("#signBtn").attr("disabled", false)
            $('#errorText').text("")

            if (data.status == 'SUCCESS') {
                window.location.href = '/users/signin'
                $('#signupPassword').val() = ''
                $('#signupPassword').val() = ''
                $('#confirmPassword').val() = ''
            } else if (data.status == 'ERROR') {
                switch (data.message) {
                    case 'SERVER_UNKNOW_ERROR':
                        $('#errorText').text('An unknown error occurred on the server, Please try again later.')
                        break
                    case 'INPUT_INFO_INVALID':
                        $('#errorText').text('Please complete all information.')
                        break
                    case 'PASSWORD_EQUAL_INVALID':
                        $('#errorText').text('Your confirm password doesn\'t same as password, please check it.')
                        break
                    case 'PARAMS_LENGTH_INVALID':
                        $('#errorText').text('Sorry, Password\'s length should be 8 to 16.')
                        break
                    case 'USERNAME_EXIST_INVALID':
                        $('#errorText').text('Sorry, your username is already exist.')
                        break
                }
            }
        },
        error: function (data) {
            $("#signBtn").attr("disabled", false)
            console.log('error', data)
            $('#errorText').text(data)
        }
    })
})