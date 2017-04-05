$('#username').val(localStorage.getItem("username"))
$('#password').val(localStorage.getItem("password"))

function Login() {
    var username = $('input[name="username"]').val()
    var password = $('input[name="password"]').val()
    $('.login-right input[type="submit"]').attr('disabled', true)
    $.ajax({
        url: '/users/userSignin',
        type: 'post',
        data: {
            'username': username,
            'password': password,
        },
        success: function (data) {
            $('.login-right input[type="submit"]').attr('disabled', false)
            if (data.status === 'SUCCESS') {
                $('#errorText').text("")
                // window.location.href = '/'
                window.self.location = document.referrer
            } else if (data.status == 'ERROR') {
                switch (data.message) {
                    case 'SERVER_UNKNOW_ERROR':
                        $('#errorText').text('服务器开小差啦，请稍后重试.')
                        break
                    case 'USER_USERNAME_UNEXIST':
                        $('#errorText').text('您的用户名不存在，请重新核对.')
                        break
                    case 'USER_PASSWORD_INCORRECT':
                        $('#errorText').text('您的用户密码不正确，请重新核对.')
                        break
                }
            }
        },
        error: function () {
            $('.login-right input[type="submit"]').attr('disabled', false)
            $('#errorText').text('请求出错了T T，请检查您的网络并稍后重试.')
        },
    })
}

function Register() {
    $('.register-but input[type="submit"]').attr('disabled', true)

    var username = $('input[name="username"]').val()
    var classify = $('input[name="classify"]').val()
    var password = $('input[name="password"]').val()
    var confirm = $('input[name="confirm"]').val()
    var pid = $('input[name="pid"]').val()
    var group = $('input[name="group"]').val()
    var referrer = $('input[name="referrer"]').val()
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
            $('.register-but input[type="submit"]').attr('disabled', false)
            
            $('#errorText').text("")
            if (data.status == 'SUCCESS') {
                window.location.href = '/users/signin'
            } else if (data.status == 'ERROR') {
                switch (data.message) {
                    case 'SERVER_UNKNOW_ERROR':
                        $('#errorText').text('服务器开小差啦，请稍后重试.')
                        break
                    case 'INPUT_INFO_INVALID':
                        $('#errorText').text('请完成带*号的所有信息.')
                        break
                    case 'PASSWORD_EQUAL_INVALID':
                        $('#errorText').text('您输入的确认密码不正确.')
                        break
                    case 'PARAMS_LENGTH_INVALID':
                        $('#errorText').text('密码长度必须是6-16位')
                        break
                    case 'USERNAME_EXIST_INVALID':
                        $('#errorText').text('您输入的用户名已存在.')
                        break
                }
            }
        },
        error: function () {
            $('.register-but input[type="submit"]').attr('disabled', false)
            
            $('#errorText').text('请求出错啦，请检查下您的网络并稍后重试.')
        }
    })
}