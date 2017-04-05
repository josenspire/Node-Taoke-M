// get user detail information
$(".operationBtn #infoModify").each(function (index) {
    $(this).click(function (e) {
        var _id = $(this).attr("name")
        $.ajax({
            url: '/admin/information?_id=' + _id,
            type: 'GET',
            success: function (result) {
                $("#username").val(result.data.username)
                $("#password").val(result.data.password)
                $("#classify").val(result.data.classify)
                $("#pid").val(result.data.pid)
            }
        })
    })
})

// save user information modify opration
$("#modifySave").click(function (e) {
    var username = $("#username").val().trim()
    var password = $("#password").val().trim()
    var pid = $("#pid").val().trim()
    var classify = $("#classify").val().trim()

    if (password.length < 8 || password.length > 16) {
        $("#errorText").text("Password should be between 8-16.")
        return false
    } else if (username == null || username == "" || pid == null || pid == "" || classify == null || classify == "") {
        $("#errorText").text("All the input device are required. Please complete all the information.")
        return false
    } else {
        $.ajax({
            url: '/admin/modify',
            type: 'POST',
            data: {
                'username': username,
                'password': password,
                'pid': pid,
                'classify': classify
            },
            success: function (result) {
                $("#myDialog").modal('hide')
                if (result.message == 'SUCCESS') {
                    $("#confirm").click()
                    $("#confirmText").html("修改成功.")

                } else {
                    $("#confirmText").html("修改失败，请重试.")
                    $("#confirm").click()
                }
            }
        })
    }
})

// delete user
$(".operationBtn #deleteBtn").each(function (index) {
    $(this).click(function (e) {
        var username = $(this).attr("value")
        $("#delUsername").html(username)
    })
})

$("#delSave").click(function (e) {
    var username = $("#delUsername").text()
    console.log(username)
    $.ajax({
        url: '/admin/del?username=' + username,
        type: 'GET',
        success: function (result) {
            $("#delDialog").modal('hide')
            if (result.message == 'SUCCESS') {
                $("#confirmText").html("删除成功.")
                $("#confirm").click()
            } else {
                $("#confirmText").html("删除失败，请重试.")
                $("#confirm").click()
            }
        }
    })
})

$("#repage").click(function (e) {
    location.reload()
})