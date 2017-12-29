/**
 * Created by 26371 on 2017/5/10.
 */
$(document).ready(function () {
    //检查填写用户名是否规范
    $("#inputEmail3").keyup(function () {
        var log = /^\w+$/;
        if(!(log.test($("#inputEmail3").val()))){
            $(".err_login_userName").css("display","block");
            $('#login_login')[0].disabled = true;
        }else{
            $(".err_login_userName").css("display","none");
            if($("#inputPassword3").val() == ""){
                $('#login_login')[0].disabled = true;
            }else{
                $('#login_login')[0].disabled = false;
            }
        }
        $("#err_prompt_p").css('display',"none");
    });
    $("#inputPassword3").keyup(function () {
        if($(this).val() != ""){
            if($("#inputEmail3").val() == ""){
                $('#login_login')[0].disabled = true;
            }else{
                $('#login_login')[0].disabled = false;
            }
        }else{
            $('#login_login')[0].disabled = true;
        }
        $("#err_prompt_p").css('display',"none");
    });

    //点击登录按钮
    $("#login_login").click(function () {
        var loginData = {
            'username':$("#inputEmail3").val(),
            'password':$("#inputPassword3").val()
        };
        $.ajax({
            type:'GET',
            url:"test/login.json",
            dataType:'json',
            data:JSON.stringify(loginData),
            success:function (data) {
                console.log(data)
                if(($("#inputEmail3").val() == data.user[0].username) && $("#inputPassword3").val() == data.user[0].password){
                    sessionStorage.login = 1
                    window.location.href = 'index.html';
                    $("#err_prompt_p").css("display","none");
                }else{
                    window.location.href = '#';
                    $("#err_prompt_p").css("display","block");
                }
            }
        })
    })
});