/**
 * Created by 26371 on 2017/4/19.
 */
//require(["less","jquery","bootstrap","bootstrapValidator"],function () {
$(document).ready(function () {

    var _url = 'http://bus.weiwuu.com';
    //点击导航切换内容
    $("#changeContent .content").eq(0).show().siblings().hide();//开始时候的选项卡内容
    var $bar_li = $("#nav_bar li");
    $bar_li.on("click", function () {
        $(this).addClass("red").siblings().removeClass("red");
        var index = $(this).index();
        $("#changeContent .content").eq(index).show().siblings().hide();
    });


    //时间控件
    //项目创建时的起止时间(datetimepicker)
    function proAddDatetimepicker() {
        $("#pro_openedAt").datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            minView: 0,
            language: 'cn',
            autoclose: true,
            startDate: new Date()
        }).off("changeDate").on('changeDate', function (ev) {
            var starttime = $("#pro_openedAt").val();

            $("#pro_closedAt").datetimepicker('setStartDate', starttime);
            $("#pro_openedAt").datetimepicker('hide');
        });

        $("#pro_closedAt").datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            minView: 'hour',
            language: 'cn',
            autoclose: true,
            startDate: new Date()
        }).off("changeDate").on('changeDate', function (ev) {
            var endtime = $("#pro_closedAt").val();
            $("#pro_openedAt").datetimepicker('setEndDate', endtime);
            $("#pro_closedAt").datetimepicker('hide');
        }, function () {
            $("#pro_openedAt").datetimepicker('setEndDate', "3000-12-29 23:59:59");
        });
    }

    proAddDatetimepicker();

    function proUpdatedatetimepicker() {
        //项目更新时的起止时间(datetimepicker)
        $("#pro_openedAt_detail").datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            minView: 'hour',
            language: 'cn',
            autoclose: true,
            startDate: new Date()
        }).off("changeDate").on('changeDate', function () {

            var starttime = $("#pro_openedAt_detail").val();
            $("#pro_closedAt_detail").datetimepicker('setStartDate', starttime);
            $("#pro_openedAt_detail").datetimepicker('hide');
        });

        $("#pro_closedAt_detail").datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            minView: 'hour',
            language: 'cn',
            autoclose: true,
            startDate: new Date()
        }).off("changeDate").on('changeDate', function (ev) {

            var endtime = $("#pro_closedAt_detail").val();
            $("#pro_openedAt_detail").datetimepicker('setEndDate', endtime);
            $("#pro_closedAt_detail").datetimepicker('hide');

        }, function () {
            $("#pro_openedAt_detail").datetimepicker('setEndDate', "3000-12-29 23:59:59");
        });
    }

    proUpdatedatetimepicker();

    function _click() {
        //点击“委托人”隐藏其他
        $("#client").click(function () {
            $("#project").css("display", "none");
            $("#bonus").css("display", "none");
            $("#journal").css("display", "none");
            $("#pagination_cli").css("display", "block");
            $("#pagination_pro").css("display", "none");
            $("#pagination_bon").css("display", "none");
            $("#pagination_jou").css("display", "none");
        });

        //点击“项目”隐藏其他
        $("#project").click(function () {
            $("#bonus").css("display", "none");
            $("#journal").css("display", "none");
            $("#report").css("display", "none");
            $("#pagination_cli").css("display", "none");
            $("#pagination_pro").css("display", "block");
            $("#pagination_bon").css("display", "none");
            $("#pagination_jou").css("display", "none");
        });

    }

    //动态加载委托人列表
    function getClientList(index, size, callBack) {
        http('GET', _url + '/clients?index=' + index + '&size=' + size, 'arraybuffer', function (xhr) {
            var arrayBuffer = xhr.response;             //返回数据
            var byteArray = new Uint8Array(arrayBuffer);//编译数组
            protobuf.load("./dist/proto/client.proto", function (err, root) {
                if (err)
                    throw err;
                // Obtain a message type
                var ClientList = root.lookupType("com.weiwuu.bonus.meta.ClientList");
                // Decode an Uint8Array (browser) or Buffer (node) to a message
                var message = ClientList.decode(byteArray);
                var _data = message.client;
                callBack(index, size, _data);

                //委托人删除
                $(".cli_del").off("click").click(function () {
                    var _this = $(this);
                    var _con = confirm("确认删除该条数据吗？")
                    if (_con == true) {
                        _this.parent().parent().remove();
                        var _id = _this.parent().parent()[0].id;
                        $.ajax({
                            type: "DELETE",
                            url: _url + "/client/" + _id,
                            data: {},
                            dataType: 'json',
                            success: function () {

                            }
                        })
                    } else {

                    }
                });

                //委托人增加
                $("#cli_add").off("click").click(function () {
                    $(".modal-body input").val("");
                    $("#cli_type").val(0);

                    //检测名称
                    $("#cli_name").blur(function () {
                        if ($(this).val() == "") {
                            $(".err_cli_name").css("display", "inline-block");
                        } else {
                            $(".err_cli_name").css("display", "none");
                        }
                    });

                    //检测联系人姓名
                    $("#cli_con_name").blur(function () {
                        if ($(this).val() == "") {
                            $(".err_cli_con_name").css("display", "inline-block");
                        } else {
                            $(".err_cli_con_name").css("display", "none");
                        }
                    });

                    //检测手机号
                    $("#cli_con_phone").blur(function () {

                        if (!(/^1(3|4|5|7|8)\d{9}$/.test($(this).val()))) {
                            $(".err_cli_con_phone").css("display", "inline-block");
                        } else {
                            $(".err_cli_con_phone").css("display", "none");
                        }
                    });

                    //检测邮箱
                    $("#cli_con_mail").blur(function () {

                        if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test($(this).val()))) {
                            $(".err_cli_con_mail").css("display", "inline-block");
                        } else {
                            $(".err_cli_con_mail").css("display", "none");
                        }
                    });

                    //提交委托人信息
                    $("#cli_sub").off("click").click(function () {

                        //判断是否可以进行提交
                        if (($("#cli_name").val() != "") &&
                            ($("#cli_con_name").val() != "") &&
                            (/^1(3|4|5|7|8)\d{9}$/.test($("#cli_con_phone").val())) &&
                            (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test($("#cli_con_mail").val()))
                        ) {

                            //进行数据提交
                            http('GET', _url + '/id', 'arraybuffer', function (xhr) {
                                var arrayBuffer = xhr.response;
                                var byteArray = new Uint8Array(arrayBuffer);
                                protobuf.load("./dist/proto/feedback.proto", function (err, root) {
                                    if (err)
                                        throw err;
                                    // Obtain a message type
                                    var Feedback = root.lookupType("com.weiwuu.krpano.meta.Feedback");
                                    // Decode an Uint8Array (browser) or Buffer (node) to a message
                                    var message = Feedback.decode(byteArray);
                                    var _id = message.longValue;

                                    var jsonData = {
                                        "name": $("#cli_name").val(),
                                        "type": $("#cli_type option:selected").val(),
                                        "contact_name": $("#cli_con_name").val(),
                                        "contact_phone": $("#cli_con_phone").val(),
                                        "contact_email": $("#cli_con_mail").val(),
                                        "notes": $("#cli_con_notes").val(),
                                        "home_page": $("#cli_con_home_page").val(),
                                        "remain_reserve": 0,
                                        "total_expenses": 0,
                                        "bonus_count": 0,
                                        "action_count": 0,
                                        "enabled": true,
                                        "created_at": parseInt(new Date().getTime() / 1000)
                                    };
                                    $.ajax({
                                        type: "POST",
                                        contentType: "application/json;charset=utf-8",
                                        url: _url + "/client/" + _id,
                                        data: JSON.stringify(jsonData),
                                        dataType: "json",
                                        success: function (data) {

                                        },
                                        error: function (res) {
                                            if (res.status == 200) {
                                                var tr = '<tr id="' + _id + '">' +
                                                    '<td class="cli_type">' + $("#cli_type option:selected").text() + '</td>' +
                                                    '<td class="cli_name">' + $("#cli_name").val() + '</td>' +
                                                    '<td class="cli_con_name">' + $("#cli_con_name").val() + '</td>' +
                                                    '<td class="cli_con_phone">' + $("#cli_con_phone").val() + '</td>' +
                                                    '<td class="cli_con_mail">' + $("#cli_con_mail").val() + '</td>' +
                                                    '<td class="cli_remain_reserve">' + 0 + '</td>' +
                                                    '<td class="cli_total_expenses">' + 0 + '</td>' +
                                                    '<td class="cli_bonus_count">' + 0 + '</td>' +
                                                    '<td class="cli_action_count">' + 0 + '</td>' +
                                                    '<td class="cli_enable">' + "是" + '</td>' +
                                                    '<td class="cli_op">' +
                                                    '<input class="cli_del btn btn-danger" style="margin-right:4px;" type="button" value="删除"/>' +
                                                    '<input class="cli_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail" value="详情"/>' +
                                                    '<input class="cli_project btn btn-success" style="margin-left:4px;" type="button" value="项目"/>' +
                                                    '</td>' +
                                                    '</tr>';
                                                $("#table_info_tby").append(tr);

                                                //增加委托人后删除
                                                $(".cli_del").off("click").click(function () {
                                                    var _this = $(this);
                                                    var _con = confirm("确认删除该条数据吗？")
                                                    if (_con == true) {
                                                        _this.parent().parent().remove();
                                                        var _id = _this.parent().parent()[0].id;
                                                        $.ajax({
                                                            type: "DELETE",
                                                            url: _url + "/client/" + _id,
                                                            data: {},
                                                            dataType: 'json',
                                                            success: function () {

                                                            }
                                                        })
                                                    } else {

                                                    }
                                                });

                                                //增加委托人后详情
                                                $(".cli_info").off("click").click(function () {

                                                    //检测名称
                                                    $("#cli_name_detail").blur(function () {
                                                        if ($(this).val() == "") {
                                                            $(".err_cli_name_detail").css("display", "inline-block");
                                                        } else {
                                                            $(".err_cli_name_detail").css("display", "none");
                                                        }
                                                    });
                                                    //检测联系人姓名
                                                    $("#cli_con_name_detail").blur(function () {
                                                        if ($(this).val() == "") {
                                                            $(".err_cli_con_name_detail").css("display", "inline-block");
                                                        } else {
                                                            $(".err_cli_con_name_detail").css("display", "none");
                                                        }
                                                    });

                                                    //检测手机号
                                                    $("#cli_con_phone_detail").blur(function () {

                                                        if (!(/^1(3|4|5|7|8)\d{9}$/.test($(this).val()))) {
                                                            $(".err_cli_con_phone_detail").css("display", "inline-block");
                                                        } else {
                                                            $(".err_cli_con_phone_detail").css("display", "none");
                                                        }
                                                    });

                                                    //检测邮箱
                                                    $("#cli_con_mail_detail").blur(function () {

                                                        if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test($(this).val()))) {
                                                            $(".err_cli_con_mail_detail").css("display", "inline-block");
                                                        } else {
                                                            $(".err_cli_con_mail_detail").css("display", "none");
                                                        }
                                                    });
                                                    var _this = $(this);

                                                    //将表中原有的内容传入要修改的信息中
                                                    http('GET', _url + '/client/' + _this.parent().parent()[0].id, 'arraybuffer', function (xhr) {
                                                        var arrayBuffer = xhr.response;
                                                        var byteArray = new Uint8Array(arrayBuffer);

                                                        protobuf.load("./dist/proto/client.proto", function (err, root) {
                                                            if (err)
                                                                throw err;
                                                            var Client = root.lookupType("com.weiwuu.bonus.meta.Client");
                                                            var _data = Client.decode(byteArray);

                                                            if (_this.parent().parent()[0].children[0].innerText == "开发商") {

                                                                $("#cli_type_detail").val(0);
                                                            } else if (_this.parent().parent()[0].children[0].innerText == "媒体") {

                                                                $("#cli_type_detail").val(1)
                                                            } else if (_this.parent().parent()[0].children[0].innerText == "中介") {

                                                                $("#cli_type_detail").val(2)
                                                            } else if (_this.parent().parent()[0].children[0].innerText == "其它类型") {

                                                                $("#cli_type_detail").val(9)
                                                            }
                                                            $("#cli_name_detail")[0].value = _data.name;
                                                            $("#cli_con_name_detail")[0].value = _data.contactName;
                                                            $("#cli_con_phone_detail")[0].value = _data.contactPhone;
                                                            $("#cli_con_mail_detail")[0].value = _data.contactEmail;
                                                            $("#cli_enable_detail")[0].value = _data.enabled;
                                                        })
                                                    });

                                                    //点击修改按钮
                                                    $("#cli_change").off("click").click(function () {

                                                        if (
                                                            ($("#cli_name_detail").val() != "") &&
                                                            ($("#cli_con_name_detail").val() != "") &&
                                                            (/^1(3|4|5|7|8)\d{9}$/.test($("#cli_con_phone_detail").val())) &&
                                                            (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test($("#cli_con_mail_detail").val()))
                                                        ) {
                                                            var jsonData = {
                                                                "name": $("#cli_name_detail")[0].value,
                                                                "contact_name": $("#cli_con_name_detail")[0].value,
                                                                "contact_phone": $("#cli_con_phone_detail")[0].value,
                                                                "contact_email": $("#cli_con_mail_detail")[0].value,
                                                                "notes": $("#cli_con_notes_detail").val(),
                                                                "home_page": $("#cli_con_home_page_detail").val(),
                                                                "enabled": $("#cli_enable_detail option:selected").val() === "true"
                                                            };
                                                            $.ajax({
                                                                type: "PUT",
                                                                url: _url + "/client/" + _this.parent().parent()[0].id,
                                                                data: JSON.stringify(jsonData),
                                                                success: function () {

                                                                },
                                                                error: function (res) {
                                                                    if (res.status == 200) {
                                                                        _this.parent().parent()[0].children[1].innerText = $("#cli_name_detail")[0].value;
                                                                        _this.parent().parent()[0].children[2].innerText = $("#cli_con_name_detail")[0].value;
                                                                        _this.parent().parent()[0].children[3].innerText = $("#cli_con_phone_detail")[0].value;
                                                                        _this.parent().parent()[0].children[4].innerText = $("#cli_con_mail_detail")[0].value;
                                                                        _this.parent().parent()[0].children[9].innerText = $("#cli_enable_detail option:selected").text();
                                                                    }
                                                                }
                                                            });
                                                        } else {
                                                            alert("请填写正确的信息")
                                                        }

                                                    });
                                                });

                                                //增加委托人后项目
                                                $(".cli_project").off("click").click(function () {
                                                    $("#pagination_cli").css("display", "none");
                                                    $("#pagination_pro").css("display", "block");
                                                    $("#pagination_jou").css("display", "none");
                                                    $("#pagination_bon").css("display", "none");
                                                    $("#pro_table_info_tby").html("");

                                                    var _id = $(this).parent().parent()[0].id;
                                                    var _name = $(this).parent().parent().children()[1].innerText;
                                                    var cli_type = $(this).parent().parent().children()[0].innerText;
                                                    $(".pro_cli_type").text('('+cli_type+'类型)');

                                                    $("#project").css("display", "block");
                                                    $("#bonus").css("display", "none");
                                                    $("#journal").css("display", "none");
                                                    $("#report").css("display", "none");

                                                    $("#project").addClass("red").siblings().removeClass("red");
                                                    $("#changeContent .content").eq(1).show().siblings().hide();

                                                    //动态加载项目列表
                                                    function getProjectList(index_p, size_p, proCallBack) {
                                                        http('GET', _url + '/client/' + _id + '/projects?index=' + index_p + '&size=' + size_p, 'arraybuffer', function (xhr) {
                                                            var arrayBuffer = xhr.response;
                                                            var byteArray = new Uint8Array(arrayBuffer);
                                                            protobuf.load("./dist/proto/project.proto", function (err, root) {
                                                                if (err)
                                                                    throw err;

                                                                var ProjectList = root.lookupType("com.weiwuu.bonus.meta.ProjectList");
                                                                var message = ProjectList.decode(byteArray);
                                                                var _data = message.project;

                                                                proCallBack(index, size, _data);
                                                                $(".pro_cli_name").text(_name);

                                                                //查询项目信息
                                                                $("#pro_content").keyup(function () {
                                                                    var _text = $("#pro_content").val();
                                                                    $("#pro_table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                                                                }).keyup();

                                                                //增加项目信息
                                                                $("#pro_add").off("click").click(function () {

                                                                    $(".modal-body input").val("");
                                                                    $(".modal-body textarea").val("");
                                                                    proAddDatetimepicker();
                                                                    //检测类型
                                                                    $("#pro_type").off("change").on("change", function () {
                                                                        var _typeNum = $("#pro_type option:selected").val();

                                                                        if (_typeNum == 3) {
                                                                            //分享有礼
                                                                            $("#myModal_pro form div")[6].style.display = "none";
                                                                            $("#myModal_pro form div")[7].style.display = "inline-block";
                                                                            $("#myModal_pro form div")[8].style.display = "inline-block";
                                                                            $("#myModal_pro form div")[9].style.display = "inline-block";
                                                                            $("#myModal_pro form div")[15].style.display = "none";
                                                                            $("#myModal_pro form div")[16].style.display = "none";
                                                                            $("#myModal_pro form div")[17].style.display = "none";
                                                                            $("#myModal_pro form div")[18].style.display = "none";
                                                                            $("#myModal_pro form div")[19].style.display = "none";
                                                                            $("#myModal_pro form div")[20].style.display = "none";
                                                                            $("#myModal_pro form div")[21].style.display = "none";

                                                                        } else if (_typeNum == 2) {
                                                                            //抽奖类型
                                                                            $("#myModal_pro form div")[6].style.display = "none";
                                                                            $("#myModal_pro form div")[7].style.display = "inline-block";
                                                                            $("#myModal_pro form div")[8].style.display = "none";
                                                                            $("#myModal_pro form div")[9].style.display = "none";
                                                                            $("#myModal_pro form div")[15].style.display = "none";
                                                                            $("#myModal_pro form div")[16].style.display = "none";
                                                                            $("#myModal_pro form div")[17].style.display = "none";
                                                                            $("#myModal_pro form div")[18].style.display = "none";
                                                                            $("#myModal_pro form div")[19].style.display = "none";
                                                                            $("#myModal_pro form div")[20].style.display = "none";
                                                                            $("#myModal_pro form div")[21].style.display = "none";

                                                                        } else if (_typeNum == 1) {
                                                                            //实物类型
                                                                            $("#myModal_pro form div")[6].style.display = "none";
                                                                            $("#myModal_pro form div")[7].style.display = "inline-block";
                                                                            $("#myModal_pro form div")[8].style.display = "none";
                                                                            $("#myModal_pro form div")[9].style.display = "none";
                                                                            $("#myModal_pro form div")[15].style.display = "none";
                                                                            $("#myModal_pro form div")[16].style.display = "none";
                                                                            $("#myModal_pro form div")[17].style.display = "none";
                                                                            $("#myModal_pro form div")[18].style.display = "none";
                                                                            $("#myModal_pro form div")[19].style.display = "none";
                                                                            $("#myModal_pro form div")[20].style.display = "none";
                                                                            $("#myModal_pro form div")[21].style.display = "none";

                                                                        } else if (_typeNum == 0) {
                                                                            //标准类型
                                                                            $("#myModal_pro form div")[6].style.display = "inline-block";
                                                                            $("#myModal_pro form div")[7].style.display = "inline-block";
                                                                            $("#myModal_pro form div")[8].style.display = "none";
                                                                            $("#myModal_pro form div")[9].style.display = "none";
                                                                            $("#myModal_pro form div")[15].style.display = "inline-block";
                                                                            $("#myModal_pro form div")[16].style.display = "inline-block";
                                                                            if($("#pro_useCabin").val() == "true"){
                                                                                $(".cabin").css("display","inline-block");
                                                                            }else{
                                                                                $(".cabin").css("display","none");
                                                                            }
                                                                        }

                                                                    });


                                                                    //对用户输入的内容进行提示
                                                                    //名称
                                                                    $("#pro_name").blur(function () {
                                                                        if ($("#pro_name").val() == "") {
                                                                            $(".err_pro_name").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_name").css("display", "none");
                                                                        }
                                                                    });

                                                                    //标题
                                                                    $("#pro_caption").blur(function () {
                                                                        if ($("#pro_caption").val() == "") {
                                                                            $(".err_pro_caption").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_caption").css("display", "none");
                                                                        }
                                                                    });

                                                                    //分享内容
                                                                    $("#pro_explication").blur(function () {
                                                                        if ($("#pro_explication").val() == "") {
                                                                            $(".err_pro_explication").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_explication").css("display", "none");
                                                                        }
                                                                    });

                                                                    //检测分享URL地址
                                                                    $("#pro_relatedUrl").blur(function () {
                                                                        if ($("#pro_relatedUrl").val() != "") {
                                                                            $(".err_pro_relatedUrl").css("display", "none");
                                                                        } else {
                                                                            $(".err_pro_relatedUrl").css("display", "inline-block");
                                                                        }
                                                                    });

                                                                    //检测红包金额
                                                                    $("#pro_remainAmount").blur(function () {
                                                                        if (Number($("#pro_remainAmount").val()) < 100) {
                                                                            $(".err_pro_remainAmount").css("display", "inline-block");
                                                                        } else {
                                                                            console.log(Number($("#pro_totalBonus").val()));
                                                                            if(Number($("#pro_totalBonus").val()) == 0){
                                                                                $(".err_pro_remainAmount").css("display", "none");
                                                                            }else{
                                                                                if( (Number($("#pro_totalBonus").val()) * 100) > (Number($("#pro_remainAmount").val()) )){
                                                                                    var ra_limit = Math.ceil(Number($("#pro_totalBonus").val()) * 100);
                                                                                    $(".err_pro_remainAmount").html("请输入不小于"+ra_limit+"的整数");
                                                                                    $(".err_pro_remainAmount").css("display", "inline-block");
                                                                                }else{
                                                                                    $(".err_pro_remainAmount").css("display", "none");
                                                                                }
                                                                            }
                                                                        }
                                                                    });

                                                                    //检测红包数量
                                                                    $("#pro_totalBonus").blur(function () {

                                                                        if (/^\w+$/.test($("#pro_totalBonus").val())) {
                                                                            if (Number($("#pro_totalBonus").val()) < 1) {
                                                                                $(".err_pro_totalBonus").css("display", "inline-block");
                                                                                if((Number($("#pro_remainAmount").val())) == 0){
                                                                                    $(".err_pro_totalBonus").css("display", "none");
                                                                                }else{
                                                                                    if((Number($("#pro_remainAmount").val()))/100 < (Number($("#pro_totalBonus").val()))){
                                                                                        var tb_limit = Math.floor((Number($("#pro_remainAmount").val()))/100);
                                                                                        $(".err_pro_totalBonus").html("请输入不大于"+tb_limit+"且不小于1的整数");
                                                                                        $(".err_pro_totalBonus").css("display", "inline-block");
                                                                                    }else{
                                                                                        $(".err_pro_totalBonus").css("display", "none");
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                if((Number($("#pro_remainAmount").val())) == 0){
                                                                                    $(".err_pro_totalBonus").css("display", "none");
                                                                                }else{
                                                                                    if((Number($("#pro_remainAmount").val()))/100 < (Number($("#pro_totalBonus").val()))){
                                                                                        var tb_limit = Math.floor((Number($("#pro_remainAmount").val()))/100);
                                                                                        $(".err_pro_totalBonus").html("请输入不大于"+tb_limit+"且不小于1的整数");
                                                                                        $(".err_pro_totalBonus").css("display", "inline-block");
                                                                                    }else{
                                                                                        $(".err_pro_totalBonus").css("display", "none");
                                                                                    }
                                                                                }
                                                                            }
                                                                        } else {
                                                                            $(".err_pro_totalBonus").css("display", "inline-block");
                                                                        }
                                                                    });

                                                                    //检测等待时间
                                                                    $("#pro_waitingTime").blur(function () {


                                                                        if (Number($("#pro_waitingTime").val()) >= 0) {
                                                                            $(".err_pro_waitingTime").css("display", "none");
                                                                        } else {
                                                                            $(".err_pro_waitingTime").css("display", "inline-block");
                                                                        }
                                                                    });

                                                                    //检测分享次数
                                                                    $("#pro_shareLimit").blur(function () {

                                                                        if (Number($("#pro_shareLimit").val()) > 0) {
                                                                            $(".err_pro_shareLimit").css("display", "none");
                                                                        } else {
                                                                            $(".err_pro_shareLimit").css("display", "inline-block");
                                                                        }
                                                                    });

                                                                    //检测方差
                                                                    $("#pro_varianceRatio").blur(function(){
                                                                        if(Number($("#pro_varianceRatio").val()) >= 10 && Number($("#pro_varianceRatio").val()) <= 500){
                                                                            $(".err_pro_varianceRatio").css("display","none");
                                                                        }else{
                                                                            $(".err_pro_varianceRatio").css("display","block");
                                                                        }
                                                                    });

                                                                    //控制分仓
                                                                    $("#pro_useCabin").change(function(){
                                                                        if($("#pro_useCabin").val() == "true"){
                                                                            $(".cabin").css("display","inline-block");
                                                                            $("#myModal_pro form div")[6].style.display = "none";
                                                                            $("#myModal_pro form div")[7].style.display = "none";
                                                                            $("#myModal_pro form div")[15].style.display = "none";
                                                                            //仓库一判断
                                                                            $("#pro_cabin1_price").blur(function(){
                                                                                if(Number($("#pro_cabin1_count").val()) != 0){
                                                                                    if(Number($("#pro_cabin1_price").val()) >=100 && Number($("#pro_cabin1_count").val()) >= 1){
                                                                                        $(".err_pro_cabin1").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin1").css("display","inline-block")
                                                                                    }
                                                                                }else{
                                                                                    if(Number($("#pro_cabin1_price").val()) == 0){
                                                                                        $(".err_pro_cabin1").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin1").css("display","inline-block")
                                                                                    }
                                                                                }

                                                                            });
                                                                            $("#pro_cabin1_count").blur(function(){
                                                                                if(Number($("#pro_cabin1_price").val()) != 0){
                                                                                    if(Number($("#pro_cabin1_count").val()) >= 1 && Number($("#pro_cabin1_price").val()) >=100){
                                                                                        $(".err_pro_cabin1").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin1").css("display","inline-block")
                                                                                    }
                                                                                }else{
                                                                                    if((Number($("#pro_cabin1_count").val()) == 0)){
                                                                                        $(".err_pro_cabin1").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin1").css("display","inline-block")
                                                                                    }
                                                                                }

                                                                            })
                                                                            //仓库二判断
                                                                            $("#pro_cabin2_price").blur(function(){
                                                                                if(Number($("#pro_cabin2_count").val()) != 0){
                                                                                    if(Number($("#pro_cabin2_price").val()) >=100 && Number($("#pro_cabin2_count").val()) >= 1){
                                                                                        $(".err_pro_cabin2").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin2").css("display","inline-block")
                                                                                    }
                                                                                }else{
                                                                                    if((Number($("#pro_cabin2_price").val()) == 0)){
                                                                                        $(".err_pro_cabin2").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin2").css("display","inline-block")
                                                                                    }
                                                                                }

                                                                            });
                                                                            $("#pro_cabin2_count").blur(function(){
                                                                                if(Number($("#pro_cabin2_price").val()) != 0){
                                                                                    if(Number($("#pro_cabin2_count").val()) >= 1 && Number($("#pro_cabin2_price").val()) >=100){
                                                                                        $(".err_pro_cabin2").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin2").css("display","inline-block")
                                                                                    }
                                                                                }else{
                                                                                    if((Number($("#pro_cabin2_count").val()) == 0)){
                                                                                        $(".err_pro_cabin2").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin2").css("display","inline-block")
                                                                                    }
                                                                                }

                                                                            })
                                                                            //仓库三判断
                                                                            $("#pro_cabin3_price").blur(function(){
                                                                                if(Number($("#pro_cabin3_count").val()) != 0){
                                                                                    if(Number($("#pro_cabin3_price").val()) >=100 && Number($("#pro_cabin3_count").val()) >= 1){
                                                                                        $(".err_pro_cabin3").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin3").css("display","inline-block")
                                                                                    }
                                                                                }else{
                                                                                    if((Number($("#pro_cabin3_price").val()) == 0)){
                                                                                        $(".err_pro_cabin3").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin3").css("display","inline-block")
                                                                                    }
                                                                                }

                                                                            });
                                                                            $("#pro_cabin3_count").blur(function(){
                                                                                if(Number($("#pro_cabin3_price").val()) != 0){
                                                                                    if(Number($("#pro_cabin3_count").val()) >= 1 && Number($("#pro_cabin3_price").val()) >=100){
                                                                                        $(".err_pro_cabin3").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin3").css("display","inline-block")
                                                                                    }
                                                                                }else{
                                                                                    if((Number($("#pro_cabin3_count").val()) == 0)){
                                                                                        $(".err_pro_cabin3").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin3").css("display","inline-block")
                                                                                    }
                                                                                }

                                                                            })
                                                                            //仓库四判断
                                                                            $("#pro_cabin4_price").blur(function(){
                                                                                if(Number($("#pro_cabin4_count").val()) != 0){
                                                                                    if(Number($("#pro_cabin4_price").val()) >=100 && Number($("#pro_cabin4_count").val()) >= 1){
                                                                                        $(".err_pro_cabin4").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin4").css("display","inline-block")
                                                                                    }
                                                                                }else{
                                                                                    if((Number($("#pro_cabin4_price").val()) == 0) ){
                                                                                        $(".err_pro_cabin4").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin4").css("display","inline-block")
                                                                                    }
                                                                                }

                                                                            });
                                                                            $("#pro_cabin4_count").blur(function(){
                                                                                if(Number($("#pro_cabin4_price").val()) != 0){
                                                                                    if(Number($("#pro_cabin4_count").val()) >= 1 && Number($("#pro_cabin4_price").val()) >=100){
                                                                                        $(".err_pro_cabin4").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin4").css("display","inline-block")
                                                                                    }
                                                                                }else{
                                                                                    if((Number($("#pro_cabin4_count").val()) == 0)){
                                                                                        $(".err_pro_cabin4").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin4").css("display","inline-block")
                                                                                    }
                                                                                }

                                                                            })
                                                                            //仓库五判断
                                                                            $("#pro_cabin5_price").blur(function(){
                                                                                if(Number($("#pro_cabin5_count").val()) != 0){
                                                                                    if(Number($("#pro_cabin5_price").val()) >=100 && Number($("#pro_cabin5_count").val()) >= 1){
                                                                                        $(".err_pro_cabin5").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin5").css("display","inline-block")
                                                                                    }
                                                                                }else{
                                                                                    if((Number($("#pro_cabin5_price").val()) == 0)){
                                                                                        $(".err_pro_cabin5").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin5").css("display","inline-block")
                                                                                    }
                                                                                }

                                                                            });
                                                                            $("#pro_cabin5_count").blur(function(){
                                                                                if(Number($("#pro_cabin5_price").val()) != 0){
                                                                                    if(Number($("#pro_cabin5_count").val()) >= 1 && Number($("#pro_cabin5_price").val()) >=100){
                                                                                        $(".err_pro_cabin5").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin5").css("display","inline-block")
                                                                                    }
                                                                                }else{
                                                                                    if((Number($("#pro_cabin5_count").val()) == 0)){
                                                                                        $(".err_pro_cabin5").css("display","none")
                                                                                    }else{
                                                                                        $(".err_pro_cabin5").css("display","inline-block")
                                                                                    }
                                                                                }

                                                                            })
                                                                        }else{
                                                                            $(".cabin").css("display","none");
                                                                            $("#myModal_pro form div")[6].style.display = "inline-block";
                                                                            $("#myModal_pro form div")[7].style.display = "inline-block";
                                                                            $("#myModal_pro form div")[15].style.display = "inline-block";
                                                                        }
                                                                    });



                                                                    //增加信息提交
                                                                    $("#pro_sub").off("click").click(function () {
                                                                        var _typeNum = $("#pro_type option:selected").val();

                                                                        if (
                                                                            ($("#pro_name").val() != "") &&
                                                                            ($("#pro_caption").val() != "") &&
                                                                            ($("#pro_explication").val() != "") &&
                                                                            ($("#pro_relatedUrl").val() != "") &&
                                                                            (((Number($("#pro_totalBonus").val()) * 100) <= (Number($("#pro_remainAmount").val()))) || _typeNum == 1 ||_typeNum == 2 || _typeNum == 3 || ($("#pro_useCabin").val() == "true")) &&
                                                                            (((Number($("#pro_remainAmount").val()))/100 >= (Number($("#pro_totalBonus").val()))) || _typeNum == 1 ||_typeNum == 2 || _typeNum == 3 || ($("#pro_useCabin").val() == "true")) &&
                                                                            (Number($("#pro_waitingTime").val()) >= 0) &&
                                                                            (Number($("#pro_shareLimit").val()) >= 0) &&
                                                                            ((Number($("#pro_varianceRatio").val()) >= 10 && Number($("#pro_varianceRatio").val()) <= 500) || ($("#pro_useCabin").val() == "true") || (Number($("#pro_varianceRatio").val())==0)) &&
                                                                            ((Number($("#pro_cabin1_count").val()) == 0 && Number($("#pro_cabin1_price").val()) == 0) || (Number($("#pro_cabin1_count").val()) >= 1 && Number($("#pro_cabin1_price").val()) >= 100) || ($("#pro_useCabin").val() == "false")) &&
                                                                            ((Number($("#pro_cabin2_count").val()) == 0 && Number($("#pro_cabin2_price").val()) == 0) || (Number($("#pro_cabin2_count").val()) >= 1 && Number($("#pro_cabin2_price").val()) >= 100)|| ($("#pro_useCabin").val() == "false")) &&
                                                                            ((Number($("#pro_cabin3_count").val()) == 0 && Number($("#pro_cabin3_price").val()) == 0) || (Number($("#pro_cabin3_count").val()) >= 1 && Number($("#pro_cabin3_price").val()) >= 100)|| ($("#pro_useCabin").val() == "false")) &&
                                                                            ((Number($("#pro_cabin4_count").val()) == 0 && Number($("#pro_cabin4_price").val()) == 0) || (Number($("#pro_cabin4_count").val()) >= 1 && Number($("#pro_cabin4_price").val()) >= 100)|| ($("#pro_useCabin").val() == "false")) &&
                                                                            ((Number($("#pro_cabin5_count").val()) == 0 && Number($("#pro_cabin5_price").val()) == 0) || (Number($("#pro_cabin5_count").val()) >= 1 && Number($("#pro_cabin5_price").val()) >= 100)|| ($("#pro_useCabin").val() == "false"))
                                                                        ) {
                                                                            http('GET', _url + '/id', 'arraybuffer', function (xhr) {
                                                                                var arrayBuffer = xhr.response;
                                                                                var byteArray = new Uint8Array(arrayBuffer);
                                                                                protobuf.load("./dist/proto/feedback.proto", function (err, root) {
                                                                                    if (err)
                                                                                        throw err;
                                                                                    // Obtain a message type
                                                                                    var Feedback = root.lookupType("com.weiwuu.krpano.meta.Feedback");
                                                                                    // Decode an Uint8Array (browser) or Buffer (node) to a message
                                                                                    var message = Feedback.decode(byteArray);
                                                                                    var _pid = message.longValue;


                                                                                    //将时间变为时间戳

                                                                                    var open_at = $("#pro_openedAt").val();
                                                                                    var open_at_date = Date.parse(new Date(open_at));
                                                                                    var open_at_long = open_at_date / 1000;

                                                                                    var close_at = $("#pro_closedAt").val();
                                                                                    var close_at_date = Date.parse(new Date(close_at));
                                                                                    var close_at_long = close_at_date / 1000;
                                                                                    var jsonData = {
                                                                                        "type": Number($("#pro_type option:selected").val()),
                                                                                        "name": $("#pro_name").val(),
                                                                                        "notes": $("#pro_notes").val(),
                                                                                        "caption": $("#pro_caption").val(),
                                                                                        "remain_amount": Number($("#pro_remainAmount").val()),
                                                                                        "total_bonus": Number($("#pro_totalBonus").val()),
                                                                                        "share_limit": Number($("#pro_shareLimit").val()),
                                                                                        "share_vtour_id": Number($("#pro_shareVtourId").val()),
                                                                                        "explication": $("#pro_explication").val(),
                                                                                        "related_url": $("#pro_relatedUrl").val(),
                                                                                        "opened_at": open_at_long,
                                                                                        "closed_at": close_at_long,
                                                                                        "waiting_time": Number($("#pro_waitingTime").val()),
                                                                                        "only_city": $("#pro_onlyCity").val(),
                                                                                        "only_weixin": true,
                                                                                        "variance_ratio": 100,
                                                                                        "use_cabin": $("#pro_useCabin").val() == "true",
                                                                                        "cabin1_price": Number($("#pro_cabin1_price").val()),
                                                                                        "cabin1_count": Number($("#pro_cabin1_count").val()),
                                                                                        "cabin2_price": Number($("#pro_cabin2_price").val()),
                                                                                        "cabin2_count": Number($("#pro_cabin2_count").val()),
                                                                                        "cabin3_price": Number($("#pro_cabin3_price").val()),
                                                                                        "cabin3_count": Number($("#pro_cabin3_count").val()),
                                                                                        "cabin4_price": Number($("#pro_cabin4_price").val()),
                                                                                        "cabin4_count": Number($("#pro_cabin4_count").val()),
                                                                                        "cabin5_price": Number($("#pro_cabin5_price").val()),
                                                                                        "cabin5_count": Number($("#pro_cabin5_count").val())
                                                                                    };

                                                                                    console.log(jsonData);
                                                                                    $.ajax({
                                                                                        type: 'POST',
                                                                                        url: _url + '/client/' + _id + '/project/' + _pid,
                                                                                        data: JSON.stringify(jsonData),
                                                                                        success: function () {

                                                                                        },
                                                                                        error: function (res) {
                                                                                            if (res.status == 200) {

                                                                                                //新增信息
                                                                                                var tr = '<tr id="' + _pid + '">' +
                                                                                                    '<td class="pro_type">' + $("#pro_type option:selected").text() + '</td>' +
                                                                                                    '<td class="pro_name">' + $("#pro_name").val() + '</td>' +
                                                                                                    '<td class="pro_notes">' + $("#pro_notes").val() + '</td>' +
                                                                                                    '<td class="pro_caption">' + $("#pro_caption").val() + '</td>' +
                                                                                                    '<td class="pro_totalBonus">' + Number($("#pro_totalBonus").val()) + '</td>' +
                                                                                                    '<td class="pro_openedAt">' + $("#pro_openedAt").val() + '</td>' +
                                                                                                    '<td class="pro_closedAt">' + $("#pro_closedAt").val() + '</td>' +
                                                                                                    '<td class="pro_enable">' + "是" + '</td>' +
                                                                                                    '<td class="pro_op">' +
                                                                                                    '<input class="pro_del btn btn-danger" style="margin-right:4px;" type="button" value="删除"/>' +
                                                                                                    '<input class="pro_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_pro" value="详情"/>' +
                                                                                                    '<input class="pro_bonus btn btn-primary" style="margin-left:4px;" type="button" value="红包"/>' +
                                                                                                    '<input class="pro_journal btn btn-primary" style="margin-left:4px;" type="button" value="日志"/>' +
                                                                                                    '<input class="pro_report btn btn-primary" style="margin-left:4px;" type="button" value="报告"/>' +
                                                                                                    '</td>' +
                                                                                                    '</tr>';
                                                                                                $("#pro_table_info_tby").append(tr);

                                                                                                //查询项目信息
                                                                                                $("#pro_content").keyup(function () {
                                                                                                    var _text = $("#pro_content").val();
                                                                                                    $("#pro_table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                                                                                                }).keyup();

                                                                                                //删除项目信息
                                                                                                $(".pro_del").off("click").click(function () {
                                                                                                    var _this = $(this);
                                                                                                    var _con = confirm("确认删除该条数据？");
                                                                                                    if (_con) {
                                                                                                        _this.parent().parent().remove();
                                                                                                        $.ajax({
                                                                                                            type: "DELETE",
                                                                                                            url: _url + "/client/" + _id + "/project/" + _this.parent().parent()[0].id,
                                                                                                            data: {},
                                                                                                            success: function () {

                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                });

                                                                                                //修改项目信息
                                                                                                $(".pro_info").off("click").click(function () {

                                                                                                    var _this = $(this);
                                                                                                    var _pid = _this.parent().parent()[0].id;
                                                                                                    proUpdatedatetimepicker();

                                                                                                    //检测类型
                                                                                                    if (_this.parent().parent().children()[0].innerText == "分享有礼") {
                                                                                                        $("#myModal_detail_pro .form-group")[12].style.display = "none";
                                                                                                        $("#myModal_detail_pro .form-group")[13].style.display = "none";
                                                                                                        $("#myModal_detail_pro .form-group")[14].style.display = "none";
                                                                                                        $("#myModal_detail_pro .form-group")[15].style.display = "none";
                                                                                                        $("#myModal_detail_pro .form-group")[16].style.display = "inline-block";
                                                                                                        $("#myModal_detail_pro .form-group")[17].style.display = "inline-block";
                                                                                                        $("#myModal_detail_pro form div")[24].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[25].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[26].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[27].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[28].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[29].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[30].style.display = "none";
                                                                                                    } else if (_this.parent().parent().children()[0].innerText == "抽奖类型") {
                                                                                                        $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                                                                        $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                                                                        $("#myModal_detail_pro .form-group")[14].style.display = "none";
                                                                                                        $("#myModal_detail_pro .form-group")[15].style.display = "none";
                                                                                                        $("#myModal_detail_pro .form-group")[16].style.display = "none";
                                                                                                        $("#myModal_detail_pro .form-group")[17].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[24].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[25].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[26].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[27].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[28].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[29].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[30].style.display = "none";
                                                                                                    } else if (_this.parent().parent().children()[0].innerText == "实物类型") {
                                                                                                        $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                                                                        $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                                                                        $("#myModal_detail_pro .form-group")[14].style.display = "none";
                                                                                                        $("#myModal_detail_pro .form-group")[15].style.display = "none";
                                                                                                        $("#myModal_detail_pro .form-group")[16].style.display = "none";
                                                                                                        $("#myModal_detail_pro .form-group")[17].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[24].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[25].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[26].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[27].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[28].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[29].style.display = "none";
                                                                                                        $("#myModal_detail_pro form div")[30].style.display = "none";
                                                                                                    } else if (_this.parent().parent().children()[0].innerText == "标准类型") {
                                                                                                        $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                                                                        $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                                                                        $("#myModal_detail_pro .form-group")[14].style.display = "inline-block";
                                                                                                        $("#myModal_detail_pro .form-group")[15].style.display = "inline-block";
                                                                                                        $("#myModal_detail_pro .form-group")[16].style.display = "none";
                                                                                                        $("#myModal_detail_pro .form-group")[17].style.display = "none";
                                                                                                        if($("#pro_useCabin_detail").val() == "true"){
                                                                                                            $(".cabin_detail").css("display","inline-block");
                                                                                                        }else{
                                                                                                            $(".cabin_detail").css("display","none");
                                                                                                        }
                                                                                                    }

                                                                                                    //对用户修改信息进行提示

                                                                                                    //修改委托人名称
                                                                                                    $("#pro_name_detail").blur(function () {
                                                                                                        if ($(this).val() == "") {
                                                                                                            $(".err_pro_name_detail").css("display", "inline-block");
                                                                                                        } else {
                                                                                                            $(".err_pro_name_detail").css("display", "none");
                                                                                                        }
                                                                                                    });

                                                                                                    //修改微信分享内容标题
                                                                                                    $("#pro_caption_detail").blur(function () {
                                                                                                        if ($(this).val() == "") {
                                                                                                            $(".err_pro_caption_detail").css("display", "inline-block");
                                                                                                        } else {
                                                                                                            $(".err_pro_caption_detail").css("display", "none");
                                                                                                        }
                                                                                                    });

                                                                                                    //修改微信分享内容说明
                                                                                                    $("#pro_explication_detail").blur(function () {
                                                                                                        if ($(this).val() == "") {
                                                                                                            $(".err_pro_explication_detail").css("display", "inline-block");
                                                                                                        } else {
                                                                                                            $(".err_pro_explication_detail").css("display", "none");
                                                                                                        }
                                                                                                    });

                                                                                                    //修改微信分享关联地址
                                                                                                    $("#pro_relatedUrl_detail").blur(function () {
                                                                                                        if ($(this).val() == "") {
                                                                                                            $(".err_pro_relatedUrl_detail").css("display", "inline-block");
                                                                                                        } else {
                                                                                                            $(".err_pro_relatedUrl_detail").css("display", "none");
                                                                                                        }
                                                                                                    });

                                                                                                    //修改红包数量
                                                                                                    $("#pro_totalBonus_detail").blur(function () {
                                                                                                        if (Number($(this).val()) <= 0) {
                                                                                                            $(".err_pro_totalBonus_detail").css("display", "inline-block");
                                                                                                        } else {
                                                                                                            $(".err_pro_totalBonus_detail").css("display", "none");
                                                                                                        }
                                                                                                    });

                                                                                                    //修改资金限制
                                                                                                    $("#pro_remainAmount_detail").blur(function () {
                                                                                                        if (Number($(this).val()) <= 0) {
                                                                                                            $(".err_pro_remainAmount_detail").css("display", "inline-block");
                                                                                                        } else {
                                                                                                            $(".err_pro_remainAmount_detail").css("display", "none");
                                                                                                        }
                                                                                                    });

                                                                                                    //修改等待时间
                                                                                                    $("#pro_waitingTime_detail").blur(function () {
                                                                                                        if (Number($(this).val()) <= 0) {
                                                                                                            $(".err_pro_waitingTime_detail").css("display", "inline-block");
                                                                                                        } else {
                                                                                                            $(".err_pro_waitingTime_detail").css("display", "none");
                                                                                                        }
                                                                                                    });

                                                                                                    //剩余个数
                                                                                                    $("#pro_remainBonus_detail").blur(function () {
                                                                                                        if (Number($(this).val()) <= 0) {
                                                                                                            $(".err_pro_remainBonus_detail").css("display", "inline_block");
                                                                                                        } else {
                                                                                                            $(".err_pro_remainBonus_detail").css("display", "none");
                                                                                                        }
                                                                                                    });

                                                                                                    //分享次数限制
                                                                                                    $("#pro_shareLimit_detail").blur(function () {
                                                                                                        if (Number($(this).val()) <= 0) {
                                                                                                            $(".err_pro_shareLimit_detail").css("display", "inline_block");
                                                                                                        } else {
                                                                                                            $(".err_pro_shareLimit_detail").css("display", "none");
                                                                                                        }
                                                                                                    });

                                                                                                    //检测方差
                                                                                                    $("#pro_varianceRatio_detail").blur(function(){
                                                                                                        if(Number($("#pro_varianceRatio_detail").val()) >= 10 && Number($("#pro_varianceRatio_detail").val()) <= 500){
                                                                                                            $(".err_pro_varianceRatio_detail").css("display","none");
                                                                                                        }else{
                                                                                                            $(".err_pro_varianceRatio_detail").css("display","block");
                                                                                                        }
                                                                                                    });

                                                                                                    //控制分仓
                                                                                                    $("#pro_useCabin_detail").change(function(){
                                                                                                        if($("#pro_useCabin_detail").val() == "true"){
                                                                                                            $(".cabin_detail").css("display","inline-block");
                                                                                                            $("#myModal_detail_pro .form-group")[12].style.display = "none";
                                                                                                            $("#myModal_detail_pro .form-group")[13].style.display = "none";
                                                                                                            $("#myModal_detail_pro .form-group")[24].style.display = "none";

                                                                                                        }else{
                                                                                                            $(".cabin_detail").css("display","none");
                                                                                                            $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                                                                            $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                                                                            $("#myModal_detail_pro .form-group")[24].style.display = "inline-block";
                                                                                                        }
                                                                                                    });

                                                                                                    //将表中原有的内容传入要修改的信息中
                                                                                                    http('GET', _url + '/client/' + _id + '/project/' + _pid, 'arraybuffer', function (xhr) {
                                                                                                        var arrayBuffer = xhr.response;
                                                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                                                        protobuf.load("./dist/proto/project.proto", function (err, root) {
                                                                                                            if (err)
                                                                                                                throw err;
                                                                                                            var Project = root.lookupType("com.weiwuu.bonus.meta.Project");
                                                                                                            var _data = Project.decode(byteArray);

                                                                                                            //时间转化
                                                                                                            var open_date = new Date(_data.openedAt * 1000);
                                                                                                            var open_y = open_date.getFullYear() + "-";
                                                                                                            var open_M = ((open_date.getMonth() + 1) < 10 ? "0" + (open_date.getMonth() + 1) : (open_date.getMonth() + 1)) + "-";
                                                                                                            var open_d = (open_date.getDate() < 10 ? "0" + open_date.getDate() : open_date.getDate()) + " ";
                                                                                                            var open_h = (open_date.getHours() < 10 ? "0" + open_date.getHours() : open_date.getHours()) + ":";
                                                                                                            var open_m = (open_date.getMinutes() < 10 ? "0" + open_date.getMinutes() : open_date.getMinutes()) + "";
                                                                                                            var open_s = (open_date.getSeconds() < 10 ? "0" + open_date.getSeconds() : open_date.getSeconds());
                                                                                                            //结束时间
                                                                                                            var close_date = new Date(_data.closedAt * 1000);
                                                                                                            var close_y = close_date.getFullYear() + "-";
                                                                                                            var close_M = ((close_date.getMonth() + 1) < 10 ? "0" + (close_date.getMonth() + 1) : (close_date.getMonth() + 1)) + "-";
                                                                                                            var close_d = (close_date.getDate() < 10 ? "0" + close_date.getDate() : close_date.getDate()) + " ";
                                                                                                            var close_h = (close_date.getHours() < 10 ? "0" + close_date.getHours() : close_date.getHours()) + ":";
                                                                                                            var close_m = (close_date.getMinutes() < 10 ? "0" + close_date.getMinutes() : close_date.getMinutes()) + "";
                                                                                                            var close_s = (close_date.getSeconds() < 10 ? "0" + close_date.getSeconds() : close_date.getSeconds());

                                                                                                            $("#pro_name_detail")[0].value = _data.caption;
                                                                                                            $("#pro_notes_detail")[0].value = _data.notes;
                                                                                                            $("#pro_caption_detail")[0].value = _data.caption;
                                                                                                            $("#pro_explication_detail")[0].value = _data.explication;
                                                                                                            $("#pro_relatedUrl_detail")[0].value = _data.relatedUrl;
                                                                                                            $("#pro_masterUrl_detail")[0].value = _data.masterUrl;
                                                                                                            $("#pro_detailUrl_detail")[0].value = _data.detailUrl;
                                                                                                            $("#pro_thanksUrl_detail")[0].value = _data.thanksUrl;
                                                                                                            $("#pro_successUrl_detail")[0].value = _data.successUrl;
                                                                                                            $("#pro_failureUrl_detail")[0].value = _data.failureUrl;
                                                                                                            $("#pro_waitingUrl_detail")[0].value = _data.waitingUrl;
                                                                                                            $("#pro_finishedUrl_detail")[0].value = _data.finishedUrl;
                                                                                                            $("#pro_remainAmount_detail")[0].value = _data.remainAmount;
                                                                                                            $("#pro_payoutAmount_detail")[0].value = _data.payoutAmount;
                                                                                                            $("#pro_totalBonus_detail")[0].value = _data.totalBonus;
                                                                                                            $("#pro_remainBonus_detail")[0].value = _data.remainBonus;
                                                                                                            $("#pro_shareLimit_detail")[0].value = _data.shareLimit;
                                                                                                            $("#pro_shareVtourId_detail")[0].value = _data.shareVtourId;
                                                                                                            $("#pro_openedAt_detail")[0].value = open_y + open_M + open_d + open_h + open_m ;
                                                                                                            $("#pro_closedAt_detail")[0].value = close_y + close_M + close_d + close_h + close_m;
                                                                                                            $("#pro_waitingTime_detail")[0].value = _data.waitingTime;
                                                                                                            $("#pro_onlyCity_detail")[0].value = _data.onlyCity;
                                                                                                            $("#pro_onlyWeixin_detail")[0].value = _data.onlyWeixin;
                                                                                                            $("#pro_enable_detail")[0].value = true;
                                                                                                            $("#pro_varianceRatio_detail")[0].value = _data.varianceRatio;
                                                                                                            $("#pro_useCabin_detail")[0].value = _data.useCabin?"true":"false";
                                                                                                            $("#pro_cabin1_price_detail")[0].value = _data.cabin1Price;
                                                                                                            $("#pro_cabin1_count_detail")[0].value = _data.cabin1Count;
                                                                                                            $("#pro_cabin2_price_detail")[0].value = _data.cabin2Price;
                                                                                                            $("#pro_cabin2_count_detail")[0].value = _data.cabin2Count;
                                                                                                            $("#pro_cabin3_price_detail")[0].value = _data.cabin3Price;
                                                                                                            $("#pro_cabin3_count_detail")[0].value = _data.cabin3Count;
                                                                                                            $("#pro_cabin4_price_detail")[0].value = _data.cabin4Price;
                                                                                                            $("#pro_cabin4_count_detail")[0].value = _data.cabin4Count;
                                                                                                            $("#pro_cabin5_price_detail")[0].value = _data.cabin5Price;
                                                                                                            $("#pro_cabin5_count_detail")[0].value = _data.cabin5Count;

                                                                                                            //检测分仓是否有
                                                                                                            if($("#pro_useCabin_detail").val() == "true"){
                                                                                                                $(".cabin_detail").css("display","inline-block");
                                                                                                                $("#myModal_detail_pro .form-group")[12].style.display = "none";
                                                                                                                $("#myModal_detail_pro .form-group")[13].style.display = "none";
                                                                                                                $("#myModal_detail_pro .form-group")[24].style.display = "none";
                                                                                                                //仓库一判断
                                                                                                                $("#pro_cabin1_price_detail").blur(function(){
                                                                                                                    if(Number($("#pro_cabin1_count_detail").val()) != 0){
                                                                                                                        if(Number($("#pro_cabin1_price_detail").val()) >=100 && Number($("#pro_cabin1_count_detail").val()) >= 1){
                                                                                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }else{
                                                                                                                        if(Number($("#pro_cabin1_price_detail").val()) == 0){
                                                                                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }

                                                                                                                });
                                                                                                                $("#pro_cabin1_count_detail").blur(function(){
                                                                                                                    if(Number($("#pro_cabin1_price_detail").val()) != 0){
                                                                                                                        if(Number($("#pro_cabin1_count_detail").val()) >= 1 && Number($("#pro_cabin1_price_detail").val()) >=100){
                                                                                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }else{
                                                                                                                        if((Number($("#pro_cabin1_count_detail").val()) == 0)){
                                                                                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }

                                                                                                                })
                                                                                                                //仓库二判断
                                                                                                                $("#pro_cabin2_price_detail").blur(function(){
                                                                                                                    if(Number($("#pro_cabin2_count_detail").val()) != 0){
                                                                                                                        if(Number($("#pro_cabin2_price_detail").val()) >=100 && Number($("#pro_cabin2_count_detail").val()) >= 1){
                                                                                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }else{
                                                                                                                        if((Number($("#pro_cabin2_price_detail").val()) == 0)){
                                                                                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }

                                                                                                                });
                                                                                                                $("#pro_cabin2_count_detail").blur(function(){
                                                                                                                    if(Number($("#pro_cabin2_price_detail").val()) != 0){
                                                                                                                        if(Number($("#pro_cabin2_count_detail").val()) >= 1 && Number($("#pro_cabin2_price_detail").val()) >=100){
                                                                                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }else{
                                                                                                                        if((Number($("#pro_cabin2_count_detail").val()) == 0)){
                                                                                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }

                                                                                                                })
                                                                                                                //仓库三判断
                                                                                                                $("#pro_cabin3_price_detail").blur(function(){
                                                                                                                    if(Number($("#pro_cabin3_count_detail").val()) != 0){
                                                                                                                        if(Number($("#pro_cabin3_price_detail").val()) >=100 && Number($("#pro_cabin3_count_detail").val()) >= 1){
                                                                                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }else{
                                                                                                                        if((Number($("#pro_cabin3_price_detail").val()) == 0)){
                                                                                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }

                                                                                                                });
                                                                                                                $("#pro_cabin3_count_detail").blur(function(){
                                                                                                                    if(Number($("#pro_cabin3_price_detail").val()) != 0){
                                                                                                                        if(Number($("#pro_cabin3_count_detail").val()) >= 1 && Number($("#pro_cabin3_price_detail").val()) >=100){
                                                                                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }else{
                                                                                                                        if((Number($("#pro_cabin3_count_detail").val()) == 0)){
                                                                                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }

                                                                                                                })
                                                                                                                //仓库四判断
                                                                                                                $("#pro_cabin4_price_detail").blur(function(){
                                                                                                                    if(Number($("#pro_cabin4_count_detail").val()) != 0){
                                                                                                                        if(Number($("#pro_cabin4_price_detail").val()) >=100 && Number($("#pro_cabin4_count_detail").val()) >= 1){
                                                                                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }else{
                                                                                                                        if((Number($("#pro_cabin4_price_detail").val()) == 0) ){
                                                                                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }

                                                                                                                });
                                                                                                                $("#pro_cabin4_count_detail").blur(function(){
                                                                                                                    if(Number($("#pro_cabin4_price_detail").val()) != 0){
                                                                                                                        if(Number($("#pro_cabin4_count_detail").val()) >= 1 && Number($("#pro_cabin4_price_detail").val()) >=100){
                                                                                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }else{
                                                                                                                        if((Number($("#pro_cabin4_count_detail").val()) == 0)){
                                                                                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }

                                                                                                                })
                                                                                                                //仓库五判断
                                                                                                                $("#pro_cabin5_price_detail").blur(function(){
                                                                                                                    if(Number($("#pro_cabin5_count_detail").val()) != 0){
                                                                                                                        if(Number($("#pro_cabin5_price_detail").val()) >=100 && Number($("#pro_cabin5_count_detail").val()) >= 1){
                                                                                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }else{
                                                                                                                        if((Number($("#pro_cabin5_price_detail").val()) == 0)){
                                                                                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }

                                                                                                                });
                                                                                                                $("#pro_cabin5_count_detail").blur(function(){
                                                                                                                    if(Number($("#pro_cabin5_price_detail").val()) != 0){
                                                                                                                        if(Number($("#pro_cabin5_count_detail").val()) >= 1 && Number($("#pro_cabin5_price_detail").val()) >=100){
                                                                                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }else{
                                                                                                                        if((Number($("#pro_cabin5_count_detail").val()) == 0)){
                                                                                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                                                                                        }else{
                                                                                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                                                                                        }
                                                                                                                    }

                                                                                                                })
                                                                                                            }else{
                                                                                                                $(".cabin_detail").css("display","none");
                                                                                                                $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                                                                                $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                                                                                $("#myModal_detail_pro .form-group")[24].style.display = "inline-block";
                                                                                                            }

                                                                                                            // 设置二维码
                                                                                                            var url = 'http://wx.weiwuu.com/static/bonus.html?cid=' + _id + '&pid=' + _data.id;
                                                                                                            $("#pro_getBonus_detail").text(url);
                                                                                                            $('#pro_qrcode').html("");
                                                                                                            $('#pro_qrcode').qrcode({
                                                                                                                width: 200,
                                                                                                                height: 200,
                                                                                                                text: url,
                                                                                                                background: "#ffffff",
                                                                                                                foreground: "#2cb5a9"
                                                                                                            });

                                                                                                        })
                                                                                                    });

                                                                                                    //点击修改按钮提交信息
                                                                                                    $("#pro_change").off("click").click(function () {
                                                                                                        if (
                                                                                                            ($("#pro_name_detail").val() != "") &&
                                                                                                            ($("#pro_caption_detail").val() != "") &&
                                                                                                            ($("#pro_explication_detail").val() != "") &&
                                                                                                            ($("#pro_relatedUrl_detail").val() != "") &&
                                                                                                            (Number($("#pro_totalBonus_detail").val()) >= 0 ||($("#pro_useCabin_detail").val() == "true")) &&
                                                                                                            (Number($("#pro_remainAmount_detail").val()) >= 0 || ($("#pro_useCabin_detail").val() == "true")) &&
                                                                                                            (Number($("#pro_waitingTime_detail").val()) >= 0) &&
                                                                                                            (Number($("#pro_remainBonus_detail").val()) >= 0) &&
                                                                                                            (Number($("#pro_shareLimit_detail").val()) >= 0) &&
                                                                                                            ((Number($("#pro_varianceRatio_detail").val()) >= 10 && Number($("#pro_varianceRatio_detail").val()) <= 500)|| ($("#pro_useCabin_detail").val() == "true")|| (Number($("#pro_varianceRatio_detail").val())==0))
                                                                                                            &&
                                                                                                            ((Number($("#pro_cabin1_count_detail").val()) == 0 && Number($("#pro_cabin1_price_detail").val()) == 0) || (Number($("#pro_cabin1_count_detail").val()) >= 1 && Number($("#pro_cabin1_price_detail").val()) >= 100) || ($("#pro_useCabin_detail").val() == "false")) &&
                                                                                                            ((Number($("#pro_cabin2_count_detail").val()) == 0 && Number($("#pro_cabin2_price_detail").val()) == 0) || (Number($("#pro_cabin2_count_detail").val()) >= 1 && Number($("#pro_cabin2_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false")) &&
                                                                                                            ((Number($("#pro_cabin3_count_detail").val()) == 0 && Number($("#pro_cabin3_price_detail").val()) == 0) || (Number($("#pro_cabin3_count_detail").val()) >= 1 && Number($("#pro_cabin3_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false")) &&
                                                                                                            ((Number($("#pro_cabin4_count_detail").val()) == 0 && Number($("#pro_cabin4_price_detail").val()) == 0) || (Number($("#pro_cabin4_count_detail").val()) >= 1 && Number($("#pro_cabin4_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false")) &&
                                                                                                            ((Number($("#pro_cabin5_count_detail").val()) == 0 && Number($("#pro_cabin5_price_detail").val()) == 0) || (Number($("#pro_cabin5_count_detail").val()) >= 1 && Number($("#pro_cabin5_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false"))
                                                                                                        ) {
                                                                                                            //将时间变成时间戳
                                                                                                            var open_at = $("#pro_openedAt_detail").val();
                                                                                                            var open_at_date = Date.parse(new Date(open_at));
                                                                                                            var open_at_long = open_at_date / 1000;

                                                                                                            var close_at = $("#pro_closedAt_detail").val();
                                                                                                            var close_at_date = Date.parse(new Date(close_at));
                                                                                                            var close_at_long = close_at_date / 1000;

                                                                                                            var jsonData = {
                                                                                                                "name": $("#pro_name_detail")[0].value,
                                                                                                                "notes": $("#pro_notes_detail")[0].value,
                                                                                                                "caption": $("#pro_name_detail")[0].value,
                                                                                                                "explication": $("#pro_explication_detail")[0].value,
                                                                                                                "related_url": $("#pro_relatedUrl_detail")[0].value,
                                                                                                                "master_url": $("#pro_masterUrl_detail")[0].value,
                                                                                                                "opened_at": open_at_long,
                                                                                                                "closed_at": close_at_long,
                                                                                                                "detail_url": $("#pro_detailUrl_detail")[0].value,
                                                                                                                "thanks_url": $("#pro_thanksUrl_detail")[0].value,
                                                                                                                "success_url": $("#pro_successUrl_detail")[0].value,
                                                                                                                "failure_url": $("#pro_failureUrl_detail")[0].value,
                                                                                                                "waiting_url": $("#pro_waitingUrl_detail")[0].value,
                                                                                                                "finished_url": $("#pro_finishedUrl_detail")[0].value,
                                                                                                                "remain_amount": Number($("#pro_remainAmount_detail")[0].value),
                                                                                                                "total_bonus": Number($("#pro_totalBonus_detail")[0].value),
                                                                                                                "share_limit": Number($("#pro_shareLimit_detail")[0].value),
                                                                                                                "share_vtour_id": Number($("#pro_shareVtourId_detail")[0].value),
                                                                                                                "remain_bonus": Number($("#pro_remainBonus_detail")[0].value),
                                                                                                                "waiting_time": Number($("#pro_waitingTime_detail")[0].value),
                                                                                                                "only_city": $("#pro_onlyCity_detail")[0].value,
                                                                                                                "only_weixin": $("#pro_onlyWeixin_detail option:selected").val() === "true",
                                                                                                                "enabled": $("#pro_enable_detail option:selected").val() === "true",
                                                                                                                "variance_ratio":Number($("#pro_varianceRatio_detail").val()),
                                                                                                                "use_cabin":$("#pro_useCabin_detail").val() === "true",
                                                                                                                "cabin1_price":Number($("#pro_cabin1_price_detail")[0].value),
                                                                                                                "cabin1_count":Number($("#pro_cabin1_count_detail")[0].value),
                                                                                                                "cabin2_price":Number($("#pro_cabin2_price_detail")[0].value),
                                                                                                                "cabin2_count":Number($("#pro_cabin2_count_detail")[0].value),
                                                                                                                "cabin3_price":Number($("#pro_cabin3_price_detail")[0].value),
                                                                                                                "cabin3_count":Number($("#pro_cabin3_count_detail")[0].value),
                                                                                                                "cabin4_price":Number($("#pro_cabin4_price_detail")[0].value),
                                                                                                                "cabin4_count":Number($("#pro_cabin4_count_detail")[0].value),
                                                                                                                "cabin5_price":Number($("#pro_cabin5_price_detail")[0].value),
                                                                                                                "cabin5_count":Number($("#pro_cabin5_count_detail")[0].value)

                                                                                                            };

                                                                                                            console.log(jsonData);
                                                                                                            $.ajax({
                                                                                                                type: "PUT",
                                                                                                                url: _url + "/client/" + _id + "/project/" + _this.parent().parent()[0].id,
                                                                                                                data: JSON.stringify(jsonData),
                                                                                                                success: function () {

                                                                                                                },
                                                                                                                error: function (res) {
                                                                                                                    if (res.status == 200) {
                                                                                                                        var pro_tr = _this.parent().parent()[0];
                                                                                                                        pro_tr.children[1].innerText = $("#pro_name_detail")[0].value;
                                                                                                                        pro_tr.children[2].innerText = $("#pro_notes_detail")[0].value;
                                                                                                                        pro_tr.children[3].innerText = $("#pro_caption_detail")[0].value;
                                                                                                                        pro_tr.children[4].innerText = $("#pro_totalBonus_detail")[0].value;
                                                                                                                        pro_tr.children[5].innerText = $("#pro_openedAt_detail")[0].value;
                                                                                                                        pro_tr.children[6].innerText = $("#pro_closedAt_detail")[0].value;
                                                                                                                        pro_tr.children[7].innerText = ($("#pro_onlyWeixin_detail")[0].value == "true") ? "是" : "否";
                                                                                                                    } else {
                                                                                                                        console.log(res.status)
                                                                                                                    }
                                                                                                                }
                                                                                                            });
                                                                                                        } else {
                                                                                                            alert("您所修改的信息有误！请重新修改")
                                                                                                        }
                                                                                                    });
                                                                                                });

                                                                                                //红包信息
                                                                                                $(".pro_bonus").off("click").click(function () {
                                                                                                    //将分页按钮隐藏/增加
                                                                                                    $("#pagination_cli").css("display", "none");
                                                                                                    $("#pagination_pro").css("display", "none");
                                                                                                    $("#pagination_bon").css("display", "block");
                                                                                                    $("#pagination_jou").css("display", "block");

                                                                                                    var _this = $(this).parent().parent();
                                                                                                    var _pid = $(this).parent().parent()[0].id;
                                                                                                    var _name = $(this).parent().parent().children()[1].innerText;//项目名称
                                                                                                    var _type = $(this).parent().parent().children()[0].innerText;//项目类型

                                                                                                    $(".bon_pro_name").text(_name+"的");
                                                                                                    $(".bon_pro_type").text('('+_type+')');


                                                                                                    $("#bonus").css("display", "block");
                                                                                                    $("#journal").css("display", "none");
                                                                                                    $("#report").css("display", "none");

                                                                                                    $("#changeContent .content").eq(2).show().siblings().hide();
                                                                                                    $("#bonus").addClass("red").siblings().removeClass("red");

                                                                                                    if (_this[0].children[0].innerText == "标准类型") {
                                                                                                        $(".bon_cash").css("display", "table-cell");
                                                                                                        $(".bon_lucky_code").css("display", "none");
                                                                                                        $(".bon_lottery_id").css("display", "none");
                                                                                                    } else if (_this[0].children[0].innerText == "实物类型") {
                                                                                                        $(".bon_cash").css("display", "none");
                                                                                                        $(".bon_lucky_code").css("display", "table-cell");
                                                                                                        $(".bon_lottery_id").css("display", "none");
                                                                                                    } else if (_this[0].children[0].innerText == "抽奖类型") {
                                                                                                        $(".bon_cash").css("display", "none");
                                                                                                        $(".bon_lucky_code").css("display", "none");
                                                                                                        $(".bon_lottery_id").css("display", "table-cell");
                                                                                                    }else if (_this[0].children[0].innerText == "分享有礼") {
                                                                                                        $(".bon_cash").css("display", "none");
                                                                                                        $(".bon_lucky_code").css("display", "table-cell");
                                                                                                        $(".bon_lottery_id").css("display", "none");
                                                                                                    }

                                                                                                    //动态加载红包
                                                                                                    function getBonusList(index, size, bonCallBack) {
                                                                                                        http('GET', _url + '/project/' + _pid + '/bonuses?index=' + index + '&size=' + size, 'arraybuffer', function (xhr) {
                                                                                                            var arrayBuffer = xhr.response;
                                                                                                            var byteArray = new Uint8Array(arrayBuffer);
                                                                                                            protobuf.load('./dist/proto/bonus.proto', function (err, root) {
                                                                                                                if (err)
                                                                                                                    throw err;
                                                                                                                var BonusList = root.lookupType('com.weiwuu.bonus.meta.BonusList');
                                                                                                                var message = BonusList.decode(byteArray);
                                                                                                                var _data = message.bonus;

                                                                                                                //红包回调函数
                                                                                                                bonCallBack(index, size, _data);

                                                                                                                //信息查询
                                                                                                                $("#bon_content").keyup(function () {
                                                                                                                    var _text = $("#bon_content").val();
                                                                                                                    $("#bon_table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                                                                                                                }).keyup();

                                                                                                                //点击详情
                                                                                                                $(".bon_info").click(function () {


                                                                                                                    var _bid = $(this).parent().parent()[0].id;

                                                                                                                    http('GET', _url + '/project/' + _pid + '/bonus/' + _bid, 'arraybuffer', function (xhr) {
                                                                                                                        var arrayBuffer = xhr.response;
                                                                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                                                                        protobuf.load('./dist/proto/bonus.proto', function (err, root) {
                                                                                                                            if (err)
                                                                                                                                throw err;
                                                                                                                            var Bonus = root.lookupType('com.weiwuu.bonus.meta.Bonus');
                                                                                                                            var _data = Bonus.decode(byteArray);
                                                                                                                            console.log(_data)
                                                                                                                            //定义日期格式
                                                                                                                            //开始时间
                                                                                                                            var create_date = new Date(_data.createdAt * 1000);
                                                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());

                                                                                                                            $("#bon_name")[0].value = _data.name;
                                                                                                                            $("#bon_notes")[0].value = _data.notes;
                                                                                                                            $("#bon_wx_name")[0].value = _data.wxName;
                                                                                                                            $("#bon_mobile")[0].value = _data.mobile;
                                                                                                                            $("#bon_wx_avatar")[0].innerHTML = '<img style="display: block;height:20px;margin:0 auto;" src="' + _data.wxAvatar + '"/>';
                                                                                                                            $("#bon_create_at")[0].value = create_y + create_M + create_d + create_h + create_m;
                                                                                                                            $("#bon_caption")[0].value = _data.caption;
                                                                                                                            $("#bon_explication")[0].value = _data.explication;
                                                                                                                            $("#bon_related_url")[0].value = _data.relatedUrl;
                                                                                                                            $("#bon_cash")[0].value = _data.bonusCash || "";
                                                                                                                            $("#bon_lucky_code")[0].value = _data.luckyCode || "";
                                                                                                                            $("#bon_lottery_id")[0].value = _data.lotteryId || "";
                                                                                                                            $("#bon_from_city")[0].value = _data.fromCity;
                                                                                                                            $("#bon_enable")[0].value = _data.enabled ? "是" : "否";
                                                                                                                        })
                                                                                                                    })
                                                                                                                })
                                                                                                            });
                                                                                                        });
                                                                                                    }

                                                                                                    http('GET', _url + '/project/' + _this[0].id + '/bonuses?index=0&size=10', 'arraybuffer', function (xhr) {
                                                                                                        var arrayBuffer = xhr.response;
                                                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                                                        protobuf.load('./dist/proto/bonus.proto', function (err, root) {
                                                                                                            if (err)
                                                                                                                throw err;
                                                                                                            var BonusList = root.lookupType('com.weiwuu.bonus.meta.BonusList');

                                                                                                            var message = BonusList.decode(byteArray);
                                                                                                            var _lineCount = message.lineCount;

//分页部分
                                                                                                            $("#pagination_bon").pagination(_lineCount, {
                                                                                                                num_edge_entries: 2,
                                                                                                                num_display_entries: 4,
                                                                                                                callback: bonPageselectCallback,
                                                                                                                items_per_page: 10
                                                                                                            });
                                                                                                            function bonPageselectCallback(current_page) {
                                                                                                                getBonusList(current_page, 10, function (index_b, size_b, _data) {


                                                                                                                    $("#bon_table_info_tby").html("");
                                                                                                                    for (var i = 0; i < _data.length; i++) {
                                                                                                                        //开始时间
                                                                                                                        var create_date = new Date(_data[i].createdAt * 1000);
                                                                                                                        var create_y = create_date.getFullYear() + "-";

                                                                                                                        var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                                        var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                                        var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                                        var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                                                        var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                                        var tr = '<tr id="' + _data[i].id + '">' +
                                                                                                                            '<td class="bon_name">' + _data[i].name + '</td>' +
                                                                                                                            '<td class="bon_created_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                                                                                            '<td class="bon_wx_name">' + _data[i].wxName + '</td>' +
                                                                                                                            '<td class="bon_mobile">' + _data[i].mobile + '</td>' +
                                                                                                                            '<td class="bon_wx_avatar"><img style="display: block;height:40px;margin:0 auto;" src="' + _data[i].wxAvatar + '"</td>' +
                                                                                                                            '<td class="bon_cash">' + _data[i].bonusCash + '</td>' +
                                                                                                                            '<td class="bon_from_city">' + _data[i].fromCity + '</td>' +
                                                                                                                            '<td class="bon_op">' +
                                                                                                                            '<input class="bon_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_bon"' +
                                                                                                                            'value="详情"/>' +
                                                                                                                            '</td>' +
                                                                                                                            '</tr>';
                                                                                                                        $("#bon_table_info_tby").append(tr);
                                                                                                                    }
                                                                                                                })
                                                                                                            }

                                                                                                            $("#bon_table_info_tby").html("");
                                                                                                        })
                                                                                                    })

                                                                                                });

                                                                                                //日志信息
                                                                                                $(".pro_journal").off("click").click(function () {

                                                                                                    var _pid = $(this).parent().parent()[0].id;

                                                                                                    $("#bonus").css("display", "none");
                                                                                                    $("#journal").css("display", "block");
                                                                                                    $("#report").css("display", "none");

                                                                                                    $("#pagination_pro").css("display", "none");
                                                                                                    $("#pagination_cli").css("display", "none");
                                                                                                    $("#pagination_bon").css("display", "none");
                                                                                                    $("#pagination_jou").css("display", "block");

                                                                                                    var _name = $(this).parent().parent().children()[1].innerText
                                                                                                    $(".bon_pro_name").text(_name);

                                                                                                    $("#changeContent .content").eq(3).show().siblings().hide();
                                                                                                    $("#journal").addClass("red").siblings().removeClass("red");


                                                                                                    function getJournalList(index, size, jouCallBack) {
                                                                                                        http('GET', _url + '/project/' + _pid + '/journals?index=' + index + '&size=' + size, 'arraybuffer', function (xhr) {
                                                                                                            var arrayBuffer = xhr.response;
                                                                                                            var byteArray = new Uint8Array(arrayBuffer);
                                                                                                            protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                                                                if (err)
                                                                                                                    throw err;
                                                                                                                var JournalList = root.lookupType('com.weiwuu.bonus.meta.JournalList');

                                                                                                                var message = JournalList.decode(byteArray);
                                                                                                                var _data = message.journal;

                                                                                                                //红包回调函数
                                                                                                                jouCallBack(index, size, _data);

                                                                                                                //信息查询
                                                                                                                $("#jou_content").keyup(function () {
                                                                                                                    var _text = $("#jou_content").val();
                                                                                                                    $("#jou_table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                                                                                                                }).keyup();

                                                                                                                //点击详情
                                                                                                                $(".jou_info").click(function () {
                                                                                                                    var _jid = $(this).parent().parent()[0].id;
                                                                                                                    http('GET', _url + '/project/' + _pid + '/journal/' + _jid, 'arraybuffer', function (xhr) {
                                                                                                                        var arrayBuffer = xhr.response;
                                                                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                                                                        protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                                                                            if (err)
                                                                                                                                throw(err);
                                                                                                                            var Journal = root.lookupType('com.weiwuu.bonus.meta.Journal');
                                                                                                                            var _data = Journal.decode(byteArray);


                                                                                                                            var create_date = new Date(_data.createdAt * 1000);
                                                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                                            //将信息填充到日志详情中

                                                                                                                            $("#jou_from_city")[0].value = _data.fromCity;
                                                                                                                            $("#jou_bonus_cash")[0].value = _data.bonusCash || "";
                                                                                                                            $("#jou_lottery_id")[0].value = _data.lotteryId || "";
                                                                                                                            $("#jou_lucky_code")[0].value = _data.luckyCode || "";
                                                                                                                            $("#jou_wx_name")[0].value = _data.wxName;
                                                                                                                            $("#jou_wx_avatar").html('<img style="display:block;width:20px;" src="' + _data.wxAvatar + '"/>')
                                                                                                                            $("#jou_action")[0].value = _data.action;
                                                                                                                            $("#jou_description")[0].value = _data.description;
                                                                                                                            $("#jou_created_at")[0].value = create_y + create_M + create_d + create_h + create_m

                                                                                                                        })
                                                                                                                    })
                                                                                                                })

                                                                                                            });
                                                                                                        });
                                                                                                    }

                                                                                                    http('GET', _url + '/project/' + _pid + '/journals?index=0&size=10', 'arraybuffer', function (xhr) {
                                                                                                        var arrayBuffer = xhr.response;
                                                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                                                        protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                                                            if (err)
                                                                                                                throw err;
                                                                                                            var JournalList = root.lookupType('com.weiwuu.bonus.meta.JournalList');
                                                                                                            var message = JournalList.decode(byteArray);

                                                                                                            var _lineCount = message.lineCount;
                                                                                                            var _data = message.journal;


                                                                                                            $("#pagination_jou").pagination(_lineCount, {
                                                                                                                num_edge_entries: 2,
                                                                                                                num_display_entries: 4,
                                                                                                                callback: jouPageselectCallback,
                                                                                                                items_per_page: 10
                                                                                                            });
                                                                                                            function jouPageselectCallback(current_page) {
                                                                                                                getJournalList(current_page, 10, function (index, size, _data) {
                                                                                                                    $("#jou_table_info_tby").html("");
                                                                                                                    for (var i = 0; i < _data.length; i++) {
                                                                                                                        //开始时间
                                                                                                                        var create_date = new Date(_data[i].createdAt * 1000);
                                                                                                                        var create_y = create_date.getFullYear() + "-";

                                                                                                                        var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                                        var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                                        var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                                        var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                                                        var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                                        var tr = '<tr id="' + _data[i].id + '">' +
                                                                                                                            '<td class="jou_created_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                                                                                            '<td class="jou_wx_name">' + _data[i].wxName + '</td>' +
                                                                                                                            '<td class="jou_wx_avatar"> <img style="display:block;width:50px;" src="' + _data[i].wxAvatar + '"/></td>' +
                                                                                                                            '<td class="jou_action">' + _data[i].action + '</td>' +
                                                                                                                            '<td class="jou_description">' + _data[i].description + '</td>' +
                                                                                                                            '<td class="jou_op">' +
                                                                                                                            '<input class="jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_jou"' +
                                                                                                                            'value="详情"/>' +
                                                                                                                            '</td>' +
                                                                                                                            '</tr>';
                                                                                                                        $("#jou_table_info_tby").append(tr);
                                                                                                                    }
                                                                                                                })
                                                                                                            }

                                                                                                            $("#jou_table_info_tby").html("");
                                                                                                        })
                                                                                                    })
                                                                                                });

                                                                                                //报告信息
                                                                                                $(".pro_report").off("click").click(function () {

                                                                                                    var _name = $(this).parent().parent().children()[1].innerText
                                                                                                    $(".bon_pro_name").text(_name);

                                                                                                    var _pid = $(this).parent().parent()[0].id;

                                                                                                    $("#bonus").css("display", "none");
                                                                                                    $("#journal").css("display", "none");
                                                                                                    $("#report").css("display", "block");

                                                                                                    $("#pagination_pro").css("display", "none");
                                                                                                    $("#pagination_rep").css("display", "block");

                                                                                                    $("#changeContent .content").eq(5).show().siblings().hide();
                                                                                                    $("#report").addClass("red").siblings().removeClass("red");

                                                                                                    //    点击按钮切换内容
                                                                                                    $(".report_include").eq(0).show().siblings().hide();

                                                                                                    $("#rep_btn li").off("click").click(function () {
                                                                                                        var _index = $(this).index();
                                                                                                        $(".report_include").eq(_index).show().siblings().hide();
                                                                                                    })

                                                                                                    http('GET', _url + '/project/' + _pid + '/report', 'arraybuffer', function (xhr) {
                                                                                                        var arrayBuffer = xhr.response;
                                                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                                                        protobuf.load('./dist/proto/report.proto', function (err, root) {
                                                                                                            if (err)
                                                                                                                throw err;
                                                                                                            var Report = root.lookupType('com.weiwuu.bonus.meta.Report');
                                                                                                            var _data = Report.decode(byteArray);

                                                                                                            var _metrics = _data.metrics;
                                                                                                            var _journal = _data.journal;
                                                                                                            var _visit = _data.visit;


                                                                                                            if (_metrics == null) {
                                                                                                                //日志部分
                                                                                                                $("#pagination_rep_jou").pagination(_journal.length, {
                                                                                                                    num_edge_entries: 2,
                                                                                                                    num_display_entries: 4,
                                                                                                                    callback: repJouPageselectCallback,
                                                                                                                    items_per_page: 10
                                                                                                                });

                                                                                                                function repJouPageselectCallback(current_page) {

                                                                                                                    if ((current_page + 1) * 10 > _journal.length) {
                                                                                                                        $("#rep_jou_table_info_tby").html("");
                                                                                                                        for (var i = current_page * 10; i < _journal.length; i++) {

                                                                                                                            //开始时间
                                                                                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                                                                                '<td class="rep_jou_op">' +
                                                                                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                                                                                'value="详情"/>' +
                                                                                                                                '</td>'
                                                                                                                            '</tr>';
                                                                                                                            $("#rep_jou_table_info_tby").append(tr);
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        $("#rep_jou_table_info_tby").html("");
                                                                                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                                                                                            //开始时间
                                                                                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                                                                                '<td class="rep_jou_op">' +
                                                                                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                                                                                'value="详情"/>' +
                                                                                                                                '</td>' +
                                                                                                                                '</tr>';
                                                                                                                            $("#rep_jou_table_info_tby").append(tr);
                                                                                                                        }
                                                                                                                    }
                                                                                                                    $(".rep_jou_info").click(function () {
                                                                                                                        var _jid = $(this).parent().parent()[0].id

                                                                                                                        http('GET', _url + '/project/' + _pid + '/journal/' + _jid, 'arraybuffer', function (xhr) {
                                                                                                                            var arrayBuffer = xhr.response;
                                                                                                                            var byteArray = new Uint8Array(arrayBuffer);
                                                                                                                            protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                                                                                if (err)
                                                                                                                                    throw err;
                                                                                                                                var Journal = root.lookupType('com.weiwuu.bonus.meta.Journal');
                                                                                                                                var _data = Journal.decode(byteArray);


                                                                                                                                var create_date = new Date(_data.createdAt * 1000);
                                                                                                                                var create_y = create_date.getFullYear() + "-";

                                                                                                                                var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                                                var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                                                var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                                                var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                                                                                var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                                                //将信息填充到日志详情中

                                                                                                                                $("#rep_jou_from_city")[0].value = _data.fromCity;
                                                                                                                                $("#rep_jou_bonus_cash")[0].value = _data.bonusCash || "";
                                                                                                                                $("#rep_jou_lottery_id")[0].value = _data.lotteryId || "";
                                                                                                                                $("#rep_jou_lucky_code")[0].value = _data.luckyCode || "";
                                                                                                                                $("#rep_jou_wx_name")[0].value = _data.wxName;
                                                                                                                                $("#rep_jou_wx_avatar").html('<img style="display:block;width:20px;" src="' + _data.wxAvatar + '"/>')
                                                                                                                                $("#rep_jou_action")[0].value = _data.action;
                                                                                                                                $("#rep_jou_description")[0].value = _data.description;
                                                                                                                                $("#rep_jou_created_at")[0].value = create_y + create_M + create_d + create_h + create_m + create_s
                                                                                                                            })
                                                                                                                        })
                                                                                                                    })
                                                                                                                }

                                                                                                                //访问部分
                                                                                                                $("#pagination_vis_jou").pagination(_visit.length, {
                                                                                                                    num_edge_entries: 2,
                                                                                                                    num_display_entries: 4,
                                                                                                                    callback: repVisPageselectCallback,
                                                                                                                    items_per_page: 10
                                                                                                                });

                                                                                                                function repVisPageselectCallback(current_page) {
                                                                                                                    if ((current_page + 1) * 10 > _visit.length) {
                                                                                                                        $("#rep_vis_table_info_tby").html("");
                                                                                                                        for (var i = current_page * 10; i < _visit.length; i++) {

                                                                                                                            //开始时间
                                                                                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                                            //更新时间
                                                                                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                                                                                            var update_y = update_date.getFullYear() + "-";

                                                                                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                                                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                                                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                                                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + ":";
                                                                                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                                                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                                                                                '<td>' + update_y + update_M + update_d + update_h + update_m + update_s + '</td>' +
                                                                                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                                                                                '<td>' + _visit[i].description + '</td>' +
                                                                                                                                '</tr>';
                                                                                                                            $("#rep_vis_table_info_tby").append(tr);
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        $("#rep_vis_table_info_tby").html("");
                                                                                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                                                                                            //开始时间
                                                                                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                                            //更新时间
                                                                                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                                                                                            var update_y = update_date.getFullYear() + "-";

                                                                                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                                                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                                                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                                                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + ":";
                                                                                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                                                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                                                                                '<td>' + update_y + update_M + update_d + update_h + update_m + update_s + '</td>' +
                                                                                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                                                                                '<td>' + _visit[i].description + '</td>' +
                                                                                                                                '</tr>';
                                                                                                                            $("#rep_vis_table_info_tby").append(tr);
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            } else {
                                                                                                                var create_date = new Date(_metrics.createdAt * 1000);
                                                                                                                var create_y = create_date.getFullYear() + "-";

                                                                                                                var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                                var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                                var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                                var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                                                var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());

                                                                                                                //结束时间
                                                                                                                var updated_date = new Date(_metrics.createdAt * 1000);
                                                                                                                var updated_y = updated_date.getFullYear() + "-";

                                                                                                                var updated_M = ((updated_date.getMonth() + 1) < 10 ? "0" + (updated_date.getMonth() + 1) : (updated_date.getMonth() + 1)) + "-";
                                                                                                                var updated_d = (updated_date.getDate() < 10 ? "0" + updated_date.getDate() : updated_date.getDate()) + " ";
                                                                                                                var updated_h = (updated_date.getHours() < 10 ? "0" + updated_date.getHours() : updated_date.getHours()) + ":";
                                                                                                                var updated_m = (updated_date.getMinutes() < 10 ? "0" + updated_date.getMinutes() : updated_date.getMinutes()) + "";
                                                                                                                var updated_s = (updated_date.getSeconds() < 10 ? "0" + updated_date.getSeconds() : updated_date.getSeconds());
                                                                                                                $('.met_view_count').text(_metrics.viewCount);
                                                                                                                $('.met_drawing_count').text(_metrics.drawingCount);
                                                                                                                $('.met_share_count').text(_metrics.shareCount);
                                                                                                                $('.met_comment_count').text(_metrics.commentCount);
                                                                                                                $(".met_apply_count").text(_metrics.applyCount);
                                                                                                                $(".met_click_count").text(_metrics.clickCount);
                                                                                                                $(".met_obtain_count").text(_metrics.obtainCount);
                                                                                                                $(".met_created_at").text(create_y + create_M + create_d + create_h + create_m );
                                                                                                                $(".met_updated_at").text(updated_y + updated_M + updated_d + updated_h + updated_m );

                                                                                                                //日志部分
                                                                                                                $("#pagination_rep_jou").pagination(_journal.length, {
                                                                                                                    num_edge_entries: 2,
                                                                                                                    num_display_entries: 4,
                                                                                                                    callback: repJouPageselectCallback,
                                                                                                                    items_per_page: 10
                                                                                                                });

                                                                                                                function repJouPageselectCallback(current_page) {

                                                                                                                    if ((current_page + 1) * 10 > _journal.length) {
                                                                                                                        $("#rep_jou_table_info_tby").html("");
                                                                                                                        for (var i = current_page * 10; i < _journal.length; i++) {

                                                                                                                            //开始时间
                                                                                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                                                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                                                                                '<td class="rep_jou_op">' +
                                                                                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                                                                                'value="详情"/>' +
                                                                                                                                '</td>'
                                                                                                                            '</tr>';
                                                                                                                            $("#rep_jou_table_info_tby").append(tr);
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        $("#rep_jou_table_info_tby").html("");
                                                                                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                                                                                            //开始时间
                                                                                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m +  '</td>' +
                                                                                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                                                                                '<td class="rep_jou_op">' +
                                                                                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                                                                                'value="详情"/>' +
                                                                                                                                '</td>' +
                                                                                                                                '</tr>';
                                                                                                                            $("#rep_jou_table_info_tby").append(tr);
                                                                                                                        }
                                                                                                                    }
                                                                                                                    $(".rep_jou_info").click(function () {
                                                                                                                        var _jid = $(this).parent().parent()[0].id

                                                                                                                        http('GET', _url + '/project/' + _pid + '/journal/' + _jid, 'arraybuffer', function (xhr) {
                                                                                                                            var arrayBuffer = xhr.response;
                                                                                                                            var byteArray = new Uint8Array(arrayBuffer);
                                                                                                                            protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                                                                                if (err)
                                                                                                                                    throw err;
                                                                                                                                var Journal = root.lookupType('com.weiwuu.bonus.meta.Journal');
                                                                                                                                var _data = Journal.decode(byteArray);

                                                                                                                                var create_date = new Date(_data.createdAt * 1000);
                                                                                                                                var create_y = create_date.getFullYear() + "-";

                                                                                                                                var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                                                var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                                                var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                                                var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                                                                var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                                                //将信息填充到日志详情中

                                                                                                                                $("#rep_jou_from_city")[0].value = _data.fromCity;
                                                                                                                                $("#rep_jou_bonus_cash")[0].value = _data.bonusCash || "";
                                                                                                                                $("#rep_jou_lottery_id")[0].value = _data.lotteryId || "";
                                                                                                                                $("#rep_jou_lucky_code")[0].value = _data.luckyCode || "";
                                                                                                                                $("#rep_jou_wx_name")[0].value = _data.wxName;
                                                                                                                                $("#rep_jou_wx_avatar").html('<img style="display:block;width:20px;" src="' + _data.wxAvatar + '"/>')
                                                                                                                                $("#rep_jou_action")[0].value = _data.action;
                                                                                                                                $("#rep_jou_description")[0].value = _data.description;
                                                                                                                                $("#rep_jou_created_at")[0].value = create_y + create_M + create_d + create_h + create_m
                                                                                                                            })
                                                                                                                        })
                                                                                                                    })
                                                                                                                }

                                                                                                                //访问部分
                                                                                                                $("#pagination_vis_jou").pagination(_visit.length, {
                                                                                                                    num_edge_entries: 2,
                                                                                                                    num_display_entries: 4,
                                                                                                                    callback: repVisPageselectCallback,
                                                                                                                    items_per_page: 10
                                                                                                                });

                                                                                                                function repVisPageselectCallback(current_page) {
                                                                                                                    if ((current_page + 1) * 10 > _visit.length) {
                                                                                                                        $("#rep_vis_table_info_tby").html("");
                                                                                                                        for (var i = current_page * 10; i < _visit.length; i++) {

                                                                                                                            //开始时间
                                                                                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                                            //更新时间
                                                                                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                                                                                            var update_y = update_date.getFullYear() + "-";

                                                                                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                                                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                                                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                                                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + "";
                                                                                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                                                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m +  '</td>' +
                                                                                                                                '<td>' + update_y + update_M + update_d + update_h + update_m  + '</td>' +
                                                                                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                                                                                '<td>' + _visit[i].description + '</td>' +
                                                                                                                                '</tr>';
                                                                                                                            $("#rep_vis_table_info_tby").append(tr);
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        $("#rep_vis_table_info_tby").html("");
                                                                                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                                                                                            //开始时间
                                                                                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                                            //更新时间
                                                                                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                                                                                            var update_y = update_date.getFullYear() + "-";

                                                                                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                                                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                                                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                                                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + "";
                                                                                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                                                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                                                                                                '<td>' + update_y + update_M + update_d + update_h + update_m +  '</td>' +
                                                                                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                                                                                '<td>' + _visit[i].description + '</td>' +
                                                                                                                                '</tr>';
                                                                                                                            $("#rep_vis_table_info_tby").append(tr);
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        })
                                                                                                    })
                                                                                                })
                                                                                            }
                                                                                        }
                                                                                    })
                                                                                })
                                                                            });
                                                                        } else {
                                                                            alert("填写数据错误!")
                                                                        }

                                                                    });
                                                                });

                                                                //删除项目信息
                                                                $(".pro_del").off("click").click(function () {
                                                                    var _this = $(this);
                                                                    var _con = confirm("确认删除该条数据？");
                                                                    if (_con) {
                                                                        _this.parent().parent().remove();
                                                                        $.ajax({
                                                                            type: "DELETE",
                                                                            url: _url + "/client/" + _id + "/project/" + _this.parent().parent()[0].id,
                                                                            data: {},
                                                                            success: function () {

                                                                            }
                                                                        });
                                                                    }
                                                                });

                                                                //修改项目信息
                                                                $(".pro_info").off("click").click(function () {

                                                                    var _this = $(this);
                                                                    var _pid = _this.parent().parent()[0].id;
                                                                    proUpdatedatetimepicker();

                                                                    //检测类型
                                                                    if (_this.parent().parent().children()[0].innerText == "分享有礼") {
                                                                        $("#myModal_detail_pro .form-group")[12].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[13].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[14].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[15].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[16].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[17].style.display = "inline-block";
                                                                        $("#myModal_detail_pro form div")[24].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[25].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[26].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[27].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[28].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[29].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[30].style.display = "none";
                                                                    } else if (_this.parent().parent().children()[0].innerText == "抽奖类型") {
                                                                        $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[14].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[15].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[16].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[17].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[24].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[25].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[26].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[27].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[28].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[29].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[30].style.display = "none";
                                                                    } else if (_this.parent().parent().children()[0].innerText == "实物类型") {
                                                                        $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[14].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[15].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[16].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[17].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[24].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[25].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[26].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[27].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[28].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[29].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[30].style.display = "none";
                                                                    } else if (_this.parent().parent().children()[0].innerText == "标准类型") {
                                                                        $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[14].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[15].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[16].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[17].style.display = "none";
                                                                        if($("#pro_useCabin_detail").val() == "true"){
                                                                            $(".cabin_detail").css("display","inline-block");
                                                                        }else{
                                                                            $(".cabin_detail").css("display","none");
                                                                        }
                                                                    }

                                                                    //对用户修改信息进行提示

                                                                    //修改委托人名称
                                                                    $("#pro_name_detail").blur(function () {
                                                                        if ($(this).val() == "") {
                                                                            $(".err_pro_name_detail").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_name_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //修改微信分享内容标题
                                                                    $("#pro_caption_detail").blur(function () {
                                                                        if ($(this).val() == "") {
                                                                            $(".err_pro_caption_detail").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_caption_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //修改微信分享内容说明
                                                                    $("#pro_explication_detail").blur(function () {
                                                                        if ($(this).val() == "") {
                                                                            $(".err_pro_explication_detail").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_explication_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //修改微信分享关联地址
                                                                    $("#pro_relatedUrl_detail").blur(function () {
                                                                        if ($(this).val() == "") {
                                                                            $(".err_pro_relatedUrl_detail").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_relatedUrl_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //修改红包数量
                                                                    $("#pro_totalBonus_detail").blur(function () {
                                                                        if (Number($(this).val()) <= 0) {
                                                                            $(".err_pro_totalBonus_detail").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_totalBonus_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //修改资金限制
                                                                    $("#pro_remainAmount_detail").blur(function () {
                                                                        if (Number($(this).val()) <= 0) {
                                                                            $(".err_pro_remainAmount_detail").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_remainAmount_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //修改等待时间
                                                                    $("#pro_waitingTime_detail").blur(function () {
                                                                        if (Number($(this).val()) <= 0) {
                                                                            $(".err_pro_waitingTime_detail").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_waitingTime_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //剩余个数
                                                                    $("#pro_remainBonus_detail").blur(function () {
                                                                        if (Number($(this).val()) <= 0) {
                                                                            $(".err_pro_remainBonus_detail").css("display", "inline_block");
                                                                        } else {
                                                                            $(".err_pro_remainBonus_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //分享次数限制
                                                                    $("#pro_shareLimit_detail").blur(function () {
                                                                        if (Number($(this).val()) <= 0) {
                                                                            $(".err_pro_shareLimit_detail").css("display", "inline_block");
                                                                        } else {
                                                                            $(".err_pro_shareLimit_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //检测方差
                                                                    $("#pro_varianceRatio_detail").blur(function(){
                                                                        if(Number($("#pro_varianceRatio_detail").val()) >= 10 && Number($("#pro_varianceRatio_detail").val()) <= 500){
                                                                            $(".err_pro_varianceRatio_detail").css("display","none");
                                                                        }else{
                                                                            $(".err_pro_varianceRatio_detail").css("display","block");
                                                                        }
                                                                    });

                                                                    //控制分仓
                                                                    $("#pro_useCabin_detail").change(function(){
                                                                        if($("#pro_useCabin_detail").val() == "true"){
                                                                            $(".cabin_detail").css("display","inline-block");
                                                                            $("#myModal_detail_pro .form-group")[12].style.display = "none";
                                                                            $("#myModal_detail_pro .form-group")[13].style.display = "none";
                                                                            $("#myModal_detail_pro .form-group")[24].style.display = "none";

                                                                        }else{
                                                                            $(".cabin_detail").css("display","none");
                                                                            $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                                            $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                                            $("#myModal_detail_pro .form-group")[24].style.display = "inline-block";
                                                                        }
                                                                    });

                                                                    //将表中原有的内容传入要修改的信息中
                                                                    http('GET', _url + '/client/' + _id + '/project/' + _pid, 'arraybuffer', function (xhr) {
                                                                        var arrayBuffer = xhr.response;
                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                        protobuf.load("./dist/proto/project.proto", function (err, root) {
                                                                            if (err)
                                                                                throw err;
                                                                            var Project = root.lookupType("com.weiwuu.bonus.meta.Project");
                                                                            var _data = Project.decode(byteArray);

                                                                            //时间转化
                                                                            var open_date = new Date(_data.openedAt * 1000);
                                                                            var open_y = open_date.getFullYear() + "-";
                                                                            var open_M = ((open_date.getMonth() + 1) < 10 ? "0" + (open_date.getMonth() + 1) : (open_date.getMonth() + 1)) + "-";
                                                                            var open_d = (open_date.getDate() < 10 ? "0" + open_date.getDate() : open_date.getDate()) + " ";
                                                                            var open_h = (open_date.getHours() < 10 ? "0" + open_date.getHours() : open_date.getHours()) + ":";
                                                                            var open_m = (open_date.getMinutes() < 10 ? "0" + open_date.getMinutes() : open_date.getMinutes()) + "";
                                                                            var open_s = (open_date.getSeconds() < 10 ? "0" + open_date.getSeconds() : open_date.getSeconds());
                                                                            //结束时间
                                                                            var close_date = new Date(_data.closedAt * 1000);
                                                                            var close_y = close_date.getFullYear() + "-";
                                                                            var close_M = ((close_date.getMonth() + 1) < 10 ? "0" + (close_date.getMonth() + 1) : (close_date.getMonth() + 1)) + "-";
                                                                            var close_d = (close_date.getDate() < 10 ? "0" + close_date.getDate() : close_date.getDate()) + " ";
                                                                            var close_h = (close_date.getHours() < 10 ? "0" + close_date.getHours() : close_date.getHours()) + ":";
                                                                            var close_m = (close_date.getMinutes() < 10 ? "0" + close_date.getMinutes() : close_date.getMinutes()) + "";
                                                                            var close_s = (close_date.getSeconds() < 10 ? "0" + close_date.getSeconds() : close_date.getSeconds());

                                                                            $("#pro_name_detail")[0].value = _data.caption;
                                                                            $("#pro_notes_detail")[0].value = _data.notes;
                                                                            $("#pro_caption_detail")[0].value = _data.caption;
                                                                            $("#pro_explication_detail")[0].value = _data.explication;
                                                                            $("#pro_relatedUrl_detail")[0].value = _data.relatedUrl;
                                                                            $("#pro_masterUrl_detail")[0].value = _data.masterUrl;
                                                                            $("#pro_detailUrl_detail")[0].value = _data.detailUrl;
                                                                            $("#pro_thanksUrl_detail")[0].value = _data.thanksUrl;
                                                                            $("#pro_successUrl_detail")[0].value = _data.successUrl;
                                                                            $("#pro_failureUrl_detail")[0].value = _data.failureUrl;
                                                                            $("#pro_waitingUrl_detail")[0].value = _data.waitingUrl;
                                                                            $("#pro_finishedUrl_detail")[0].value = _data.finishedUrl;
                                                                            $("#pro_remainAmount_detail")[0].value = _data.remainAmount;
                                                                            $("#pro_payoutAmount_detail")[0].value = _data.payoutAmount;
                                                                            $("#pro_totalBonus_detail")[0].value = _data.totalBonus;
                                                                            $("#pro_remainBonus_detail")[0].value = _data.remainBonus;
                                                                            $("#pro_shareLimit_detail")[0].value = _data.shareLimit;
                                                                            $("#pro_shareVtourId_detail")[0].value = _data.shareVtourId;
                                                                            $("#pro_openedAt_detail")[0].value = open_y + open_M + open_d + open_h + open_m ;
                                                                            $("#pro_closedAt_detail")[0].value = close_y + close_M + close_d + close_h + close_m;
                                                                            $("#pro_waitingTime_detail")[0].value = _data.waitingTime;
                                                                            $("#pro_onlyCity_detail")[0].value = _data.onlyCity;
                                                                            $("#pro_onlyWeixin_detail")[0].value = _data.onlyWeixin;
                                                                            $("#pro_enable_detail")[0].value = true;
                                                                            $("#pro_varianceRatio_detail")[0].value = _data.varianceRatio;
                                                                            $("#pro_useCabin_detail")[0].value = _data.useCabin?"true":"false";
                                                                            $("#pro_cabin1_price_detail")[0].value = _data.cabin1Price;
                                                                            $("#pro_cabin1_count_detail")[0].value = _data.cabin1Count;
                                                                            $("#pro_cabin2_price_detail")[0].value = _data.cabin2Price;
                                                                            $("#pro_cabin2_count_detail")[0].value = _data.cabin2Count;
                                                                            $("#pro_cabin3_price_detail")[0].value = _data.cabin3Price;
                                                                            $("#pro_cabin3_count_detail")[0].value = _data.cabin3Count;
                                                                            $("#pro_cabin4_price_detail")[0].value = _data.cabin4Price;
                                                                            $("#pro_cabin4_count_detail")[0].value = _data.cabin4Count;
                                                                            $("#pro_cabin5_price_detail")[0].value = _data.cabin5Price;
                                                                            $("#pro_cabin5_count_detail")[0].value = _data.cabin5Count;

                                                                            //检测分仓是否有
                                                                            if($("#pro_useCabin_detail").val() == "true"){
                                                                                $(".cabin_detail").css("display","inline-block");
                                                                                $("#myModal_detail_pro .form-group")[12].style.display = "none";
                                                                                $("#myModal_detail_pro .form-group")[13].style.display = "none";
                                                                                $("#myModal_detail_pro .form-group")[24].style.display = "none";
                                                                                //仓库一判断
                                                                                $("#pro_cabin1_price_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin1_count_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin1_price_detail").val()) >=100 && Number($("#pro_cabin1_count_detail").val()) >= 1){
                                                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if(Number($("#pro_cabin1_price_detail").val()) == 0){
                                                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                });
                                                                                $("#pro_cabin1_count_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin1_price_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin1_count_detail").val()) >= 1 && Number($("#pro_cabin1_price_detail").val()) >=100){
                                                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin1_count_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                })
                                                                                //仓库二判断
                                                                                $("#pro_cabin2_price_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin2_count_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin2_price_detail").val()) >=100 && Number($("#pro_cabin2_count_detail").val()) >= 1){
                                                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin2_price_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                });
                                                                                $("#pro_cabin2_count_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin2_price_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin2_count_detail").val()) >= 1 && Number($("#pro_cabin2_price_detail").val()) >=100){
                                                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin2_count_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                })
                                                                                //仓库三判断
                                                                                $("#pro_cabin3_price_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin3_count_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin3_price_detail").val()) >=100 && Number($("#pro_cabin3_count_detail").val()) >= 1){
                                                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin3_price_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                });
                                                                                $("#pro_cabin3_count_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin3_price_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin3_count_detail").val()) >= 1 && Number($("#pro_cabin3_price_detail").val()) >=100){
                                                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin3_count_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                })
                                                                                //仓库四判断
                                                                                $("#pro_cabin4_price_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin4_count_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin4_price_detail").val()) >=100 && Number($("#pro_cabin4_count_detail").val()) >= 1){
                                                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin4_price_detail").val()) == 0) ){
                                                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                });
                                                                                $("#pro_cabin4_count_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin4_price_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin4_count_detail").val()) >= 1 && Number($("#pro_cabin4_price_detail").val()) >=100){
                                                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin4_count_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                })
                                                                                //仓库五判断
                                                                                $("#pro_cabin5_price_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin5_count_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin5_price_detail").val()) >=100 && Number($("#pro_cabin5_count_detail").val()) >= 1){
                                                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin5_price_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                });
                                                                                $("#pro_cabin5_count_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin5_price_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin5_count_detail").val()) >= 1 && Number($("#pro_cabin5_price_detail").val()) >=100){
                                                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin5_count_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                })
                                                                            }else{
                                                                                $(".cabin_detail").css("display","none");
                                                                                $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                                                $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                                                $("#myModal_detail_pro .form-group")[24].style.display = "inline-block";
                                                                            }

                                                                            // 设置二维码
                                                                            var url = 'http://wx.weiwuu.com/static/bonus.html?cid=' + _id + '&pid=' + _data.id;
                                                                            $("#pro_getBonus_detail").text(url);
                                                                            $('#pro_qrcode').html("");
                                                                            $('#pro_qrcode').qrcode({
                                                                                width: 200,
                                                                                height: 200,
                                                                                text: url,
                                                                                background: "#ffffff",
                                                                                foreground: "#2cb5a9"
                                                                            });

                                                                        })
                                                                    });

                                                                    //点击修改按钮提交信息
                                                                    $("#pro_change").off("click").click(function () {
                                                                        if (
                                                                            ($("#pro_name_detail").val() != "") &&
                                                                            ($("#pro_caption_detail").val() != "") &&
                                                                            ($("#pro_explication_detail").val() != "") &&
                                                                            ($("#pro_relatedUrl_detail").val() != "") &&
                                                                            (Number($("#pro_totalBonus_detail").val()) >= 0 ||($("#pro_useCabin_detail").val() == "true")) &&
                                                                            (Number($("#pro_remainAmount_detail").val()) >= 0 || ($("#pro_useCabin_detail").val() == "true")) &&
                                                                            (Number($("#pro_waitingTime_detail").val()) >= 0) &&
                                                                            (Number($("#pro_remainBonus_detail").val()) >= 0) &&
                                                                            (Number($("#pro_shareLimit_detail").val()) >= 0) &&
                                                                            ((Number($("#pro_varianceRatio_detail").val()) >= 10 && Number($("#pro_varianceRatio_detail").val()) <= 500)|| ($("#pro_useCabin_detail").val() == "true")|| (Number($("#pro_varianceRatio_detail").val())==0))
                                                                            &&
                                                                            ((Number($("#pro_cabin1_count_detail").val()) == 0 && Number($("#pro_cabin1_price_detail").val()) == 0) || (Number($("#pro_cabin1_count_detail").val()) >= 1 && Number($("#pro_cabin1_price_detail").val()) >= 100) || ($("#pro_useCabin_detail").val() == "false")) &&
                                                                            ((Number($("#pro_cabin2_count_detail").val()) == 0 && Number($("#pro_cabin2_price_detail").val()) == 0) || (Number($("#pro_cabin2_count_detail").val()) >= 1 && Number($("#pro_cabin2_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false")) &&
                                                                            ((Number($("#pro_cabin3_count_detail").val()) == 0 && Number($("#pro_cabin3_price_detail").val()) == 0) || (Number($("#pro_cabin3_count_detail").val()) >= 1 && Number($("#pro_cabin3_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false")) &&
                                                                            ((Number($("#pro_cabin4_count_detail").val()) == 0 && Number($("#pro_cabin4_price_detail").val()) == 0) || (Number($("#pro_cabin4_count_detail").val()) >= 1 && Number($("#pro_cabin4_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false")) &&
                                                                            ((Number($("#pro_cabin5_count_detail").val()) == 0 && Number($("#pro_cabin5_price_detail").val()) == 0) || (Number($("#pro_cabin5_count_detail").val()) >= 1 && Number($("#pro_cabin5_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false"))
                                                                        ) {
                                                                            //将时间变成时间戳

                                                                            var open_at = $("#pro_openedAt_detail").val();
                                                                            var open_at_date = Date.parse(new Date(open_at));
                                                                            var open_at_long = open_at_date / 1000;

                                                                            var close_at = $("#pro_closedAt_detail").val();
                                                                            var close_at_date = Date.parse(new Date(close_at));
                                                                            var close_at_long = close_at_date / 1000;

                                                                            var jsonData = {
                                                                                "name": $("#pro_name_detail")[0].value,
                                                                                "notes": $("#pro_notes_detail")[0].value,
                                                                                "caption": $("#pro_name_detail")[0].value,
                                                                                "explication": $("#pro_explication_detail")[0].value,
                                                                                "related_url": $("#pro_relatedUrl_detail")[0].value,
                                                                                "master_url": $("#pro_masterUrl_detail")[0].value,
                                                                                "opened_at": open_at_long,
                                                                                "closed_at": close_at_long,
                                                                                "detail_url": $("#pro_detailUrl_detail")[0].value,
                                                                                "thanks_url": $("#pro_thanksUrl_detail")[0].value,
                                                                                "success_url": $("#pro_successUrl_detail")[0].value,
                                                                                "failure_url": $("#pro_failureUrl_detail")[0].value,
                                                                                "waiting_url": $("#pro_waitingUrl_detail")[0].value,
                                                                                "finished_url": $("#pro_finishedUrl_detail")[0].value,
                                                                                "remain_amount": Number($("#pro_remainAmount_detail")[0].value),
                                                                                "total_bonus": Number($("#pro_totalBonus_detail")[0].value),
                                                                                "share_limit": Number($("#pro_shareLimit_detail")[0].value),
                                                                                "share_vtour_id": Number($("#pro_shareVtourId_detail")[0].value),
                                                                                "remain_bonus": Number($("#pro_remainBonus_detail")[0].value),
                                                                                "waiting_time": Number($("#pro_waitingTime_detail")[0].value),
                                                                                "only_city": $("#pro_onlyCity_detail")[0].value,
                                                                                "only_weixin": $("#pro_onlyWeixin_detail option:selected").val() === "true",
                                                                                "enabled": $("#pro_enable_detail option:selected").val() === "true",
                                                                                "variance_ratio":Number($("#pro_varianceRatio_detail").val()),
                                                                                "use_cabin":$("#pro_useCabin_detail").val() === "true",
                                                                                "cabin1_price":Number($("#pro_cabin1_price_detail")[0].value),
                                                                                "cabin1_count":Number($("#pro_cabin1_count_detail")[0].value),
                                                                                "cabin2_price":Number($("#pro_cabin2_price_detail")[0].value),
                                                                                "cabin2_count":Number($("#pro_cabin2_count_detail")[0].value),
                                                                                "cabin3_price":Number($("#pro_cabin3_price_detail")[0].value),
                                                                                "cabin3_count":Number($("#pro_cabin3_count_detail")[0].value),
                                                                                "cabin4_price":Number($("#pro_cabin4_price_detail")[0].value),
                                                                                "cabin4_count":Number($("#pro_cabin4_count_detail")[0].value),
                                                                                "cabin5_price":Number($("#pro_cabin5_price_detail")[0].value),
                                                                                "cabin5_count":Number($("#pro_cabin5_count_detail")[0].value)

                                                                            };

                                                                            console.log(jsonData);
                                                                            $.ajax({
                                                                                type: "PUT",
                                                                                url: _url + "/client/" + _id + "/project/" + _this.parent().parent()[0].id,
                                                                                data: JSON.stringify(jsonData),
                                                                                success: function () {

                                                                                },
                                                                                error: function (res) {
                                                                                    if (res.status == 200) {
                                                                                        var pro_tr = _this.parent().parent()[0];
                                                                                        pro_tr.children[1].innerText = $("#pro_name_detail")[0].value;
                                                                                        pro_tr.children[2].innerText = $("#pro_notes_detail")[0].value;
                                                                                        pro_tr.children[3].innerText = $("#pro_caption_detail")[0].value;
                                                                                        pro_tr.children[4].innerText = $("#pro_totalBonus_detail")[0].value;
                                                                                        pro_tr.children[5].innerText = $("#pro_openedAt_detail")[0].value;
                                                                                        pro_tr.children[6].innerText = $("#pro_closedAt_detail")[0].value;
                                                                                        pro_tr.children[7].innerText = ($("#pro_onlyWeixin_detail")[0].value == "true") ? "是" : "否";
                                                                                    } else {
                                                                                        console.log(res.status)
                                                                                    }
                                                                                }
                                                                            });
                                                                        } else {
                                                                            alert("您所修改的信息有误！请重新修改")
                                                                        }
                                                                    });
                                                                });

                                                                //红包信息
                                                                $(".pro_bonus").off("click").click(function () {
                                                                    //将分页按钮隐藏/增加
                                                                    $("#pagination_cli").css("display", "none");
                                                                    $("#pagination_pro").css("display", "none");
                                                                    $("#pagination_bon").css("display", "block");
                                                                    $("#pagination_jou").css("display", "block");

                                                                    var _this = $(this).parent().parent();
                                                                    var _pid = $(this).parent().parent()[0].id;
                                                                    var _name = $(this).parent().parent().children()[1].innerText;//项目名称
                                                                    var _type = $(this).parent().parent().children()[0].innerText;//项目类型

                                                                    $(".bon_pro_name").text(_name+"的");
                                                                    $(".bon_pro_type").text('('+_type+')');


                                                                    $("#bonus").css("display", "block");
                                                                    $("#journal").css("display", "none");
                                                                    $("#report").css("display", "none");

                                                                    $("#changeContent .content").eq(2).show().siblings().hide();
                                                                    $("#bonus").addClass("red").siblings().removeClass("red");

                                                                    if (_this[0].children[0].innerText == "标准类型") {
                                                                        $(".bon_cash").css("display", "table-cell");
                                                                        $(".bon_lucky_code").css("display", "none");
                                                                        $(".bon_lottery_id").css("display", "none");
                                                                    } else if (_this[0].children[0].innerText == "实物类型") {
                                                                        $(".bon_cash").css("display", "none");
                                                                        $(".bon_lucky_code").css("display", "table-cell");
                                                                        $(".bon_lottery_id").css("display", "none");
                                                                    } else if (_this[0].children[0].innerText == "抽奖类型") {
                                                                        $(".bon_cash").css("display", "none");
                                                                        $(".bon_lucky_code").css("display", "none");
                                                                        $(".bon_lottery_id").css("display", "table-cell");
                                                                    }else if (_this[0].children[0].innerText == "分享有礼") {
                                                                        $(".bon_cash").css("display", "none");
                                                                        $(".bon_lucky_code").css("display", "table-cell");
                                                                        $(".bon_lottery_id").css("display", "none");
                                                                    }

                                                                    //动态加载红包
                                                                    function getBonusList(index, size, bonCallBack) {
                                                                        http('GET', _url + '/project/' + _pid + '/bonuses?index=' + index + '&size=' + size, 'arraybuffer', function (xhr) {
                                                                            var arrayBuffer = xhr.response;
                                                                            var byteArray = new Uint8Array(arrayBuffer);
                                                                            protobuf.load('./dist/proto/bonus.proto', function (err, root) {
                                                                                if (err)
                                                                                    throw err;
                                                                                var BonusList = root.lookupType('com.weiwuu.bonus.meta.BonusList');
                                                                                var message = BonusList.decode(byteArray);
                                                                                var _data = message.bonus;

                                                                                //红包回调函数
                                                                                bonCallBack(index, size, _data);

                                                                                //信息查询
                                                                                $("#bon_content").keyup(function () {
                                                                                    var _text = $("#bon_content").val();
                                                                                    $("#bon_table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                                                                                }).keyup();

                                                                                //点击详情
                                                                                $(".bon_info").click(function () {


                                                                                    var _bid = $(this).parent().parent()[0].id;

                                                                                    http('GET', _url + '/project/' + _pid + '/bonus/' + _bid, 'arraybuffer', function (xhr) {
                                                                                        var arrayBuffer = xhr.response;
                                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                                        protobuf.load('./dist/proto/bonus.proto', function (err, root) {
                                                                                            if (err)
                                                                                                throw err;
                                                                                            var Bonus = root.lookupType('com.weiwuu.bonus.meta.Bonus');
                                                                                            var _data = Bonus.decode(byteArray);
                                                                                            console.log(_data)
                                                                                            //定义日期格式
                                                                                            //开始时间
                                                                                            var create_date = new Date(_data.createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());

                                                                                            $("#bon_name")[0].value = _data.name;
                                                                                            $("#bon_notes")[0].value = _data.notes;
                                                                                            $("#bon_wx_name")[0].value = _data.wxName;
                                                                                            $("#bon_mobile")[0].value = _data.mobile;
                                                                                            $("#bon_wx_avatar")[0].innerHTML = '<img style="display: block;height:20px;margin:0 auto;" src="' + _data.wxAvatar + '"/>';
                                                                                            $("#bon_create_at")[0].value = create_y + create_M + create_d + create_h + create_m;
                                                                                            $("#bon_caption")[0].value = _data.caption;
                                                                                            $("#bon_explication")[0].value = _data.explication;
                                                                                            $("#bon_related_url")[0].value = _data.relatedUrl;
                                                                                            $("#bon_cash")[0].value = _data.bonusCash || "";
                                                                                            $("#bon_lucky_code")[0].value = _data.luckyCode || "";
                                                                                            $("#bon_lottery_id")[0].value = _data.lotteryId || "";
                                                                                            $("#bon_from_city")[0].value = _data.fromCity;
                                                                                            $("#bon_enable")[0].value = _data.enabled ? "是" : "否";
                                                                                        })
                                                                                    })
                                                                                })
                                                                            });
                                                                        });
                                                                    }

                                                                    http('GET', _url + '/project/' + _this[0].id + '/bonuses?index=0&size=10', 'arraybuffer', function (xhr) {
                                                                        var arrayBuffer = xhr.response;
                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                        protobuf.load('./dist/proto/bonus.proto', function (err, root) {
                                                                            if (err)
                                                                                throw err;
                                                                            var BonusList = root.lookupType('com.weiwuu.bonus.meta.BonusList');

                                                                            var message = BonusList.decode(byteArray);
                                                                            var _lineCount = message.lineCount;

//分页部分
                                                                            $("#pagination_bon").pagination(_lineCount, {
                                                                                num_edge_entries: 2,
                                                                                num_display_entries: 4,
                                                                                callback: bonPageselectCallback,
                                                                                items_per_page: 10
                                                                            });
                                                                            function bonPageselectCallback(current_page) {
                                                                                getBonusList(current_page, 10, function (index_b, size_b, _data) {


                                                                                    $("#bon_table_info_tby").html("");
                                                                                    for (var i = 0; i < _data.length; i++) {
                                                                                        //开始时间
                                                                                        var create_date = new Date(_data[i].createdAt * 1000);
                                                                                        var create_y = create_date.getFullYear() + "-";

                                                                                        var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                        var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                        var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                        var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                        var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                        var tr = '<tr id="' + _data[i].id + '">' +
                                                                                            '<td class="bon_name">' + _data[i].name + '</td>' +
                                                                                            '<td class="bon_created_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                                                            '<td class="bon_wx_name">' + _data[i].wxName + '</td>' +
                                                                                            '<td class="bon_mobile">' + _data[i].mobile + '</td>' +
                                                                                            '<td class="bon_wx_avatar"><img style="display: block;height:40px;margin:0 auto;" src="' + _data[i].wxAvatar + '"</td>' +
                                                                                            '<td class="bon_cash">' + _data[i].bonusCash + '</td>' +
                                                                                            '<td class="bon_from_city">' + _data[i].fromCity + '</td>' +
                                                                                            '<td class="bon_op">' +
                                                                                            '<input class="bon_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_bon"' +
                                                                                            'value="详情"/>' +
                                                                                            '</td>' +
                                                                                            '</tr>';
                                                                                        $("#bon_table_info_tby").append(tr);
                                                                                    }
                                                                                })
                                                                            }

                                                                            $("#bon_table_info_tby").html("");
                                                                        })
                                                                    })

                                                                });

                                                                //日志信息
                                                                $(".pro_journal").off("click").click(function () {

                                                                    var _pid = $(this).parent().parent()[0].id;

                                                                    $("#bonus").css("display", "none");
                                                                    $("#journal").css("display", "block");
                                                                    $("#report").css("display", "none");

                                                                    $("#pagination_pro").css("display", "none");
                                                                    $("#pagination_cli").css("display", "none");
                                                                    $("#pagination_bon").css("display", "none");
                                                                    $("#pagination_jou").css("display", "block");

                                                                    var _name = $(this).parent().parent().children()[1].innerText
                                                                    $(".bon_pro_name").text(_name);

                                                                    $("#changeContent .content").eq(3).show().siblings().hide();
                                                                    $("#journal").addClass("red").siblings().removeClass("red");


                                                                    function getJournalList(index, size, jouCallBack) {
                                                                        http('GET', _url + '/project/' + _pid + '/journals?index=' + index + '&size=' + size, 'arraybuffer', function (xhr) {
                                                                            var arrayBuffer = xhr.response;
                                                                            var byteArray = new Uint8Array(arrayBuffer);
                                                                            protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                                if (err)
                                                                                    throw err;
                                                                                var JournalList = root.lookupType('com.weiwuu.bonus.meta.JournalList');

                                                                                var message = JournalList.decode(byteArray);
                                                                                var _data = message.journal;

                                                                                //红包回调函数
                                                                                jouCallBack(index, size, _data);

                                                                                //信息查询
                                                                                $("#jou_content").keyup(function () {
                                                                                    var _text = $("#jou_content").val();
                                                                                    $("#jou_table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                                                                                }).keyup();

                                                                                //点击详情
                                                                                $(".jou_info").click(function () {
                                                                                    var _jid = $(this).parent().parent()[0].id;
                                                                                    http('GET', _url + '/project/' + _pid + '/journal/' + _jid, 'arraybuffer', function (xhr) {
                                                                                        var arrayBuffer = xhr.response;
                                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                                        protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                                            if (err)
                                                                                                throw(err);
                                                                                            var Journal = root.lookupType('com.weiwuu.bonus.meta.Journal');
                                                                                            var _data = Journal.decode(byteArray);

                                                                                            var create_date = new Date(_data.createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            //将信息填充到日志详情中

                                                                                            $("#jou_from_city")[0].value = _data.fromCity;
                                                                                            $("#jou_bonus_cash")[0].value = _data.bonusCash || "";
                                                                                            $("#jou_lottery_id")[0].value = _data.lotteryId || "";
                                                                                            $("#jou_lucky_code")[0].value = _data.luckyCode || "";
                                                                                            $("#jou_wx_name")[0].value = _data.wxName;
                                                                                            $("#jou_wx_avatar").html('<img style="display:block;width:20px;" src="' + _data.wxAvatar + '"/>')
                                                                                            $("#jou_action")[0].value = _data.action;
                                                                                            $("#jou_description")[0].value = _data.description;
                                                                                            $("#jou_created_at")[0].value = create_y + create_M + create_d + create_h + create_m

                                                                                        })
                                                                                    })
                                                                                })

                                                                            });
                                                                        });
                                                                    }

                                                                    http('GET', _url + '/project/' + _pid + '/journals?index=0&size=10', 'arraybuffer', function (xhr) {
                                                                        var arrayBuffer = xhr.response;
                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                        protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                            if (err)
                                                                                throw err;
                                                                            var JournalList = root.lookupType('com.weiwuu.bonus.meta.JournalList');
                                                                            var message = JournalList.decode(byteArray);

                                                                            var _lineCount = message.lineCount;
                                                                            var _data = message.journal;


                                                                            $("#pagination_jou").pagination(_lineCount, {
                                                                                num_edge_entries: 2,
                                                                                num_display_entries: 4,
                                                                                callback: jouPageselectCallback,
                                                                                items_per_page: 10
                                                                            });
                                                                            function jouPageselectCallback(current_page) {
                                                                                getJournalList(current_page, 10, function (index, size, _data) {
                                                                                    $("#jou_table_info_tby").html("");
                                                                                    for (var i = 0; i < _data.length; i++) {
                                                                                        //开始时间
                                                                                        var create_date = new Date(_data[i].createdAt * 1000);
                                                                                        var create_y = create_date.getFullYear() + "-";

                                                                                        var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                        var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                        var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                        var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                        var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                        var tr = '<tr id="' + _data[i].id + '">' +
                                                                                            '<td class="jou_created_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                                                            '<td class="jou_wx_name">' + _data[i].wxName + '</td>' +
                                                                                            '<td class="jou_wx_avatar"> <img style="display:block;width:50px;" src="' + _data[i].wxAvatar + '"/></td>' +
                                                                                            '<td class="jou_action">' + _data[i].action + '</td>' +
                                                                                            '<td class="jou_description">' + _data[i].description + '</td>' +
                                                                                            '<td class="jou_op">' +
                                                                                            '<input class="jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_jou"' +
                                                                                            'value="详情"/>' +
                                                                                            '</td>' +
                                                                                            '</tr>';
                                                                                        $("#jou_table_info_tby").append(tr);
                                                                                    }
                                                                                })
                                                                            }

                                                                            $("#jou_table_info_tby").html("");
                                                                        })
                                                                    })
                                                                });

                                                                //报告信息
                                                                $(".pro_report").off("click").click(function () {

                                                                    var _name = $(this).parent().parent().children()[1].innerText
                                                                    $(".bon_pro_name").text(_name);

                                                                    var _pid = $(this).parent().parent()[0].id;

                                                                    $("#bonus").css("display", "none");
                                                                    $("#journal").css("display", "none");
                                                                    $("#report").css("display", "block");

                                                                    $("#pagination_pro").css("display", "none");
                                                                    $("#pagination_rep").css("display", "block");

                                                                    $("#changeContent .content").eq(5).show().siblings().hide();
                                                                    $("#report").addClass("red").siblings().removeClass("red");

                                                                    //    点击按钮切换内容
                                                                    $(".report_include").eq(0).show().siblings().hide();

                                                                    $("#rep_btn li").off("click").click(function () {
                                                                        var _index = $(this).index();
                                                                        $(".report_include").eq(_index).show().siblings().hide();
                                                                    })

                                                                    http('GET', _url + '/project/' + _pid + '/report', 'arraybuffer', function (xhr) {
                                                                        var arrayBuffer = xhr.response;
                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                        protobuf.load('./dist/proto/report.proto', function (err, root) {
                                                                            if (err)
                                                                                throw err;
                                                                            var Report = root.lookupType('com.weiwuu.bonus.meta.Report');
                                                                            var _data = Report.decode(byteArray);

                                                                            var _metrics = _data.metrics;
                                                                            var _journal = _data.journal;
                                                                            var _visit = _data.visit;


                                                                            if (_metrics == null) {
                                                                                //日志部分
                                                                                $("#pagination_rep_jou").pagination(_journal.length, {
                                                                                    num_edge_entries: 2,
                                                                                    num_display_entries: 4,
                                                                                    callback: repJouPageselectCallback,
                                                                                    items_per_page: 10
                                                                                });

                                                                                function repJouPageselectCallback(current_page) {

                                                                                    if ((current_page + 1) * 10 > _journal.length) {
                                                                                        $("#rep_jou_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < _journal.length; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                                                '<td class="rep_jou_op">' +
                                                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                                                'value="详情"/>' +
                                                                                                '</td>'
                                                                                            '</tr>';
                                                                                            $("#rep_jou_table_info_tby").append(tr);
                                                                                        }
                                                                                    } else {
                                                                                        $("#rep_jou_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                                                '<td class="rep_jou_op">' +
                                                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                                                'value="详情"/>' +
                                                                                                '</td>' +
                                                                                                '</tr>';
                                                                                            $("#rep_jou_table_info_tby").append(tr);
                                                                                        }
                                                                                    }
                                                                                    $(".rep_jou_info").click(function () {
                                                                                        var _jid = $(this).parent().parent()[0].id

                                                                                        http('GET', _url + '/project/' + _pid + '/journal/' + _jid, 'arraybuffer', function (xhr) {
                                                                                            var arrayBuffer = xhr.response;
                                                                                            var byteArray = new Uint8Array(arrayBuffer);
                                                                                            protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                                                if (err)
                                                                                                    throw err;
                                                                                                var Journal = root.lookupType('com.weiwuu.bonus.meta.Journal');
                                                                                                var _data = Journal.decode(byteArray);

                                                                                                var create_date = new Date(_data.createdAt * 1000);
                                                                                                var create_y = create_date.getFullYear() + "-";

                                                                                                var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                                                var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                //将信息填充到日志详情中

                                                                                                $("#rep_jou_from_city")[0].value = _data.fromCity;
                                                                                                $("#rep_jou_bonus_cash")[0].value = _data.bonusCash || "";
                                                                                                $("#rep_jou_lottery_id")[0].value = _data.lotteryId || "";
                                                                                                $("#rep_jou_lucky_code")[0].value = _data.luckyCode || "";
                                                                                                $("#rep_jou_wx_name")[0].value = _data.wxName;
                                                                                                $("#rep_jou_wx_avatar").html('<img style="display:block;width:20px;" src="' + _data.wxAvatar + '"/>')
                                                                                                $("#rep_jou_action")[0].value = _data.action;
                                                                                                $("#rep_jou_description")[0].value = _data.description;
                                                                                                $("#rep_jou_created_at")[0].value = create_y + create_M + create_d + create_h + create_m + create_s
                                                                                            })
                                                                                        })
                                                                                    })
                                                                                }

                                                                                //访问部分
                                                                                $("#pagination_vis_jou").pagination(_visit.length, {
                                                                                    num_edge_entries: 2,
                                                                                    num_display_entries: 4,
                                                                                    callback: repVisPageselectCallback,
                                                                                    items_per_page: 10
                                                                                });

                                                                                function repVisPageselectCallback(current_page) {
                                                                                    if ((current_page + 1) * 10 > _visit.length) {
                                                                                        $("#rep_vis_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < _visit.length; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            //更新时间
                                                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                                                            var update_y = update_date.getFullYear() + "-";

                                                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + ":";
                                                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                                                '<td>' + update_y + update_M + update_d + update_h + update_m + update_s + '</td>' +
                                                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                                                '<td>' + _visit[i].description + '</td>' +
                                                                                                '</tr>';
                                                                                            $("#rep_vis_table_info_tby").append(tr);
                                                                                        }
                                                                                    } else {
                                                                                        $("#rep_vis_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            //更新时间
                                                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                                                            var update_y = update_date.getFullYear() + "-";

                                                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + ":";
                                                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                                                '<td>' + update_y + update_M + update_d + update_h + update_m + update_s + '</td>' +
                                                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                                                '<td>' + _visit[i].description + '</td>' +
                                                                                                '</tr>';
                                                                                            $("#rep_vis_table_info_tby").append(tr);
                                                                                        }
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                var create_date = new Date(_metrics.createdAt * 1000);
                                                                                var create_y = create_date.getFullYear() + "-";

                                                                                var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());

                                                                                //结束时间
                                                                                var updated_date = new Date(_metrics.createdAt * 1000);
                                                                                var updated_y = updated_date.getFullYear() + "-";

                                                                                var updated_M = ((updated_date.getMonth() + 1) < 10 ? "0" + (updated_date.getMonth() + 1) : (updated_date.getMonth() + 1)) + "-";
                                                                                var updated_d = (updated_date.getDate() < 10 ? "0" + updated_date.getDate() : updated_date.getDate()) + " ";
                                                                                var updated_h = (updated_date.getHours() < 10 ? "0" + updated_date.getHours() : updated_date.getHours()) + ":";
                                                                                var updated_m = (updated_date.getMinutes() < 10 ? "0" + updated_date.getMinutes() : updated_date.getMinutes()) + "";
                                                                                var updated_s = (updated_date.getSeconds() < 10 ? "0" + updated_date.getSeconds() : updated_date.getSeconds());
                                                                                $('.met_view_count').text(_metrics.viewCount);
                                                                                $('.met_drawing_count').text(_metrics.drawingCount);
                                                                                $('.met_share_count').text(_metrics.shareCount);
                                                                                $('.met_comment_count').text(_metrics.commentCount);
                                                                                $(".met_apply_count").text(_metrics.applyCount);
                                                                                $(".met_click_count").text(_metrics.clickCount);
                                                                                $(".met_obtain_count").text(_metrics.obtainCount);
                                                                                $(".met_created_at").text(create_y + create_M + create_d + create_h + create_m );
                                                                                $(".met_updated_at").text(updated_y + updated_M + updated_d + updated_h + updated_m );

                                                                                //日志部分
                                                                                $("#pagination_rep_jou").pagination(_journal.length, {
                                                                                    num_edge_entries: 2,
                                                                                    num_display_entries: 4,
                                                                                    callback: repJouPageselectCallback,
                                                                                    items_per_page: 10
                                                                                });

                                                                                function repJouPageselectCallback(current_page) {

                                                                                    if ((current_page + 1) * 10 > _journal.length) {
                                                                                        $("#rep_jou_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < _journal.length; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                                                '<td class="rep_jou_op">' +
                                                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                                                'value="详情"/>' +
                                                                                                '</td>'
                                                                                            '</tr>';
                                                                                            $("#rep_jou_table_info_tby").append(tr);
                                                                                        }
                                                                                    } else {
                                                                                        $("#rep_jou_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m +  '</td>' +
                                                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                                                '<td class="rep_jou_op">' +
                                                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                                                'value="详情"/>' +
                                                                                                '</td>' +
                                                                                                '</tr>';
                                                                                            $("#rep_jou_table_info_tby").append(tr);
                                                                                        }
                                                                                    }
                                                                                    $(".rep_jou_info").click(function () {
                                                                                        var _jid = $(this).parent().parent()[0].id

                                                                                        http('GET', _url + '/project/' + _pid + '/journal/' + _jid, 'arraybuffer', function (xhr) {
                                                                                            var arrayBuffer = xhr.response;
                                                                                            var byteArray = new Uint8Array(arrayBuffer);
                                                                                            protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                                                if (err)
                                                                                                    throw err;
                                                                                                var Journal = root.lookupType('com.weiwuu.bonus.meta.Journal');
                                                                                                var _data = Journal.decode(byteArray);


                                                                                                var create_date = new Date(_data.createdAt * 1000);
                                                                                                var create_y = create_date.getFullYear() + "-";

                                                                                                var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                                var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                //将信息填充到日志详情中

                                                                                                $("#rep_jou_from_city")[0].value = _data.fromCity;
                                                                                                $("#rep_jou_bonus_cash")[0].value = _data.bonusCash || "";
                                                                                                $("#rep_jou_lottery_id")[0].value = _data.lotteryId || "";
                                                                                                $("#rep_jou_lucky_code")[0].value = _data.luckyCode || "";
                                                                                                $("#rep_jou_wx_name")[0].value = _data.wxName;
                                                                                                $("#rep_jou_wx_avatar").html('<img style="display:block;width:20px;" src="' + _data.wxAvatar + '"/>')
                                                                                                $("#rep_jou_action")[0].value = _data.action;
                                                                                                $("#rep_jou_description")[0].value = _data.description;
                                                                                                $("#rep_jou_created_at")[0].value = create_y + create_M + create_d + create_h + create_m
                                                                                            })
                                                                                        })
                                                                                    })
                                                                                }

                                                                                //访问部分
                                                                                $("#pagination_vis_jou").pagination(_visit.length, {
                                                                                    num_edge_entries: 2,
                                                                                    num_display_entries: 4,
                                                                                    callback: repVisPageselectCallback,
                                                                                    items_per_page: 10
                                                                                });

                                                                                function repVisPageselectCallback(current_page) {
                                                                                    if ((current_page + 1) * 10 > _visit.length) {
                                                                                        $("#rep_vis_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < _visit.length; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            //更新时间
                                                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                                                            var update_y = update_date.getFullYear() + "-";

                                                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + "";
                                                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m +  '</td>' +
                                                                                                '<td>' + update_y + update_M + update_d + update_h + update_m  + '</td>' +
                                                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                                                '<td>' + _visit[i].description + '</td>' +
                                                                                                '</tr>';
                                                                                            $("#rep_vis_table_info_tby").append(tr);
                                                                                        }
                                                                                    } else {
                                                                                        $("#rep_vis_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            //更新时间
                                                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                                                            var update_y = update_date.getFullYear() + "-";

                                                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + "";
                                                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                                                                '<td>' + update_y + update_M + update_d + update_h + update_m +  '</td>' +
                                                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                                                '<td>' + _visit[i].description + '</td>' +
                                                                                                '</tr>';
                                                                                            $("#rep_vis_table_info_tby").append(tr);
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    })
                                                                })
                                                            });
                                                        });
                                                    }

                                                    http('GET', _url + '/client/' + _id + '/projects?index=0&size=10', 'arraybuffer', function (xhr) {
                                                        var arrayBuffer = xhr.response;
                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                        protobuf.load("./dist/proto/project.proto", function (err, root) {
                                                            if (err)
                                                                throw err;

                                                            var ProjectList = root.lookupType("com.weiwuu.bonus.meta.ProjectList");
                                                            var message = ProjectList.decode(byteArray);
                                                            var _lineCount = message.lineCount;
                                                            var _pageCount = message.pageCount;
                                                            var _data = message.project;


                                                            var projectArr = ["标准类型", "实物类型", "抽奖类型", "分享有礼"];

                                                            //分页部分
                                                            $("#pagination_pro").pagination(_lineCount, {
                                                                num_edge_entries: 2,
                                                                num_display_entries: 4,
                                                                callback: proPageselectCallback,
                                                                items_per_page: 10
                                                            });

                                                            function proPageselectCallback(current_page) {
                                                                getProjectList(current_page, 10, function (index_p, size_p, _data) {
                                                                    $("#pro_table_info_tby").html("");
                                                                    //将该项目信息展示出来
                                                                    for (var i = 0; i < _data.length; i++) {

                                                                        //定义日期格式
                                                                        //开始时间
                                                                        var open_date = new Date(_data[i].openedAt * 1000);
                                                                        var open_y = open_date.getFullYear() + "-";
                                                                        var open_M = ((open_date.getMonth() + 1) < 10 ? "0" + (open_date.getMonth() + 1) : (open_date.getMonth() + 1)) + "-";
                                                                        var open_d = (open_date.getDate() < 10 ? "0" + open_date.getDate() : open_date.getDate()) + " ";
                                                                        var open_h = (open_date.getHours() < 10 ? "0" + open_date.getHours() : open_date.getHours()) + ":";
                                                                        var open_m = (open_date.getMinutes() < 10 ? "0" + open_date.getMinutes() : open_date.getMinutes()) + "";
                                                                        var open_s = (open_date.getSeconds() < 10 ? "0" + open_date.getSeconds() : open_date.getSeconds());

                                                                        //结束时间
                                                                        var close_date = new Date(_data[i].closedAt * 1000);
                                                                        var close_y = close_date.getFullYear() + "-";
                                                                        var close_M = ((close_date.getMonth() + 1) < 10 ? "0" + (close_date.getMonth() + 1) : (close_date.getMonth() + 1)) + "-";
                                                                        var close_d = (close_date.getDate() < 10 ? "0" + close_date.getDate() : close_date.getDate()) + " ";
                                                                        var close_h = (close_date.getHours() < 10 ? "0" + close_date.getHours() : close_date.getHours()) + ":";
                                                                        var close_m = (close_date.getMinutes() < 10 ? "0" + close_date.getMinutes() : close_date.getMinutes()) + "";
                                                                        var close_s = (close_date.getSeconds() < 10 ? "0" + close_date.getSeconds() : close_date.getSeconds());
                                                                        //将项目的信息展示出来
                                                                        var tr = '<tr id="' + _data[i].id + '">' +
                                                                            '<td class="pro_type">' + projectArr[_data[i].type] + '</td>' +
                                                                            '<td class="pro_name">' + _data[i].name + '</td>' +
                                                                            '<td class="pro_notes">' + _data[i].notes + '</td>' +
                                                                            '<td class="pro_caption">' + _data[i].caption + '</td>' +
                                                                            '<td class="pro_totalBonus">' + _data[i].totalBonus + '</td>' +
                                                                            '<td class="pro_openedAt">' + open_y + open_M + open_d + open_h + open_m +'</td>' +
                                                                            '<td class="pro_closedAt">' + close_y + close_M + close_d + close_h + close_m +  '</td>' +
                                                                            '<td class="pro_enable">' + (_data[i].onlyWeixin ? "是" : "否") + '</td>' +
                                                                            '<td class="pro_op">' +
                                                                            '<input class="pro_del btn btn-danger" type="button" style="margin-right:4px;" value="删除"/>' +
                                                                            '<input class="pro_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_pro"' +
                                                                            'value="详情"/>' +
                                                                            '<input class="pro_bonus btn btn-primary" type="button" style="margin-left:4px;" value="红包">' +
                                                                            '<input class="pro_journal btn btn-primary" style="margin-left:4px;" type="button" value="日志"/>' +
                                                                            '<input class="pro_report btn btn-primary" style="margin-left:4px;" type="button" value="报告"/>' +
                                                                            '</td>' +
                                                                            '</tr>';
                                                                        $("#pro_table_info_tby").append(tr);
                                                                    }
                                                                })
                                                                $("#pro_table_info_tby").html("");
                                                            }

                                                            $("#pro_table_info_tby").html("");
                                                        })
                                                    })
                                                });

                                                //增加委托人后查询
                                                $("#cli_content").keyup(function () {
                                                    var _text = $("#cli_content").val();
                                                    $("#table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                                                }).keyup();

                                            } else {

                                            }
                                        }
                                    });
                                });
                            });
                        } else {
                            alert("请填写完整信息!");
                        }
                    });
                });

                //委托人详情
                $(".cli_info").off("click").click(function () {

                    //检测名称
                    $("#cli_name_detail").blur(function () {
                        if ($(this).val() == "") {
                            $(".err_cli_name_detail").css("display", "inline-block");
                        } else {
                            $(".err_cli_name_detail").css("display", "none");
                        }
                    });
                    //检测联系人姓名
                    $("#cli_con_name_detail").blur(function () {
                        if ($(this).val() == "") {
                            $(".err_cli_con_name_detail").css("display", "inline-block");
                        } else {
                            $(".err_cli_con_name_detail").css("display", "none");
                        }
                    });

                    //检测手机号
                    $("#cli_con_phone_detail").blur(function () {

                        if (!(/^1(3|4|5|7|8)\d{9}$/.test($(this).val()))) {
                            $(".err_cli_con_phone_detail").css("display", "inline-block");
                        } else {
                            $(".err_cli_con_phone_detail").css("display", "none");
                        }
                    });

                    //检测邮箱
                    $("#cli_con_mail_detail").blur(function () {

                        if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test($(this).val()))) {
                            $(".err_cli_con_mail_detail").css("display", "inline-block");
                        } else {
                            $(".err_cli_con_mail_detail").css("display", "none");
                        }
                    });
                    var _this = $(this);

                    //将表中原有的内容传入要修改的信息中
                    http('GET', _url + '/client/' + _this.parent().parent()[0].id, 'arraybuffer', function (xhr) {
                        var arrayBuffer = xhr.response;
                        var byteArray = new Uint8Array(arrayBuffer);

                        protobuf.load("./dist/proto/client.proto", function (err, root) {
                            if (err)
                                throw err;
                            var Client = root.lookupType("com.weiwuu.bonus.meta.Client");
                            var _data = Client.decode(byteArray);

                            if (_this.parent().parent()[0].children[0].innerText == "开发商") {

                                $("#cli_type_detail").val(0);
                            } else if (_this.parent().parent()[0].children[0].innerText == "媒体") {

                                $("#cli_type_detail").val(1)
                            } else if (_this.parent().parent()[0].children[0].innerText == "中介") {

                                $("#cli_type_detail").val(2)
                            } else if (_this.parent().parent()[0].children[0].innerText == "其它类型") {

                                $("#cli_type_detail").val(9)
                            }
                            $("#cli_name_detail")[0].value = _data.name;
                            $("#cli_con_name_detail")[0].value = _data.contactName;
                            $("#cli_con_phone_detail")[0].value = _data.contactPhone;
                            $("#cli_con_mail_detail")[0].value = _data.contactEmail;
                            $("#cli_enable_detail")[0].value = _data.enabled;
                        })
                    });

                    //点击修改按钮
                    $("#cli_change").off("click").click(function () {

                        if (
                            ($("#cli_name_detail").val() != "") &&
                            ($("#cli_con_name_detail").val() != "") &&
                            (/^1(3|4|5|7|8)\d{9}$/.test($("#cli_con_phone_detail").val())) &&
                            (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test($("#cli_con_mail_detail").val()))
                        ) {
                            var jsonData = {
                                "name": $("#cli_name_detail")[0].value,
                                "contact_name": $("#cli_con_name_detail")[0].value,
                                "contact_phone": $("#cli_con_phone_detail")[0].value,
                                "contact_email": $("#cli_con_mail_detail")[0].value,
                                "notes": $("#cli_con_notes_detail").val(),
                                "home_page": $("#cli_con_home_page_detail").val(),
                                "enabled": $("#cli_enable_detail option:selected").val() === "true"
                            };
                            $.ajax({
                                type: "PUT",
                                url: _url + "/client/" + _this.parent().parent()[0].id,
                                data: JSON.stringify(jsonData),
                                success: function () {

                                },
                                error: function (res) {
                                    if (res.status == 200) {
                                        _this.parent().parent()[0].children[1].innerText = $("#cli_name_detail")[0].value;
                                        _this.parent().parent()[0].children[2].innerText = $("#cli_con_name_detail")[0].value;
                                        _this.parent().parent()[0].children[3].innerText = $("#cli_con_phone_detail")[0].value;
                                        _this.parent().parent()[0].children[4].innerText = $("#cli_con_mail_detail")[0].value;
                                        _this.parent().parent()[0].children[9].innerText = $("#cli_enable_detail option:selected").text();
                                    }
                                }
                            });
                        } else {
                            alert("请填写正确的信息")
                        }

                    });
                });

                //委托人查询
                $("#cli_content").keyup(function () {
                    var _text = $("#cli_content").val();
                    $("#table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                }).keyup();

                //委托人项目
                $(".cli_project").off("click").click(function () {
                    $("#pagination_cli").css("display", "none");
                    $("#pagination_pro").css("display", "block");
                    $("#pagination_jou").css("display", "none");
                    $("#pagination_bon").css("display", "none");
                    $("#pro_table_info_tby").html("");

                    var _id = $(this).parent().parent()[0].id;
                    var _name = $(this).parent().parent().children()[1].innerText;
                    var cli_type = $(this).parent().parent().children()[0].innerText;
                    $(".pro_cli_type").text('('+cli_type+'类型)');

                    $("#project").css("display", "block");
                    $("#bonus").css("display", "none");
                    $("#journal").css("display", "none");
                    $("#report").css("display", "none");

                    $("#project").addClass("red").siblings().removeClass("red");
                    $("#changeContent .content").eq(1).show().siblings().hide();

                    //动态加载项目列表
                    function getProjectList(index_p, size_p, proCallBack) {
                        http('GET', _url + '/client/' + _id + '/projects?index=' + index_p + '&size=' + size_p, 'arraybuffer', function (xhr) {
                            var arrayBuffer = xhr.response;
                            var byteArray = new Uint8Array(arrayBuffer);
                            protobuf.load("./dist/proto/project.proto", function (err, root) {
                                if (err)
                                    throw err;

                                var ProjectList = root.lookupType("com.weiwuu.bonus.meta.ProjectList");
                                var message = ProjectList.decode(byteArray);
                                var _data = message.project;

                                proCallBack(index, size, _data);
                                $(".pro_cli_name").text(_name);

                                //查询项目信息
                                $("#pro_content").keyup(function () {
                                    var _text = $("#pro_content").val();
                                    $("#pro_table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                                }).keyup();

                                //增加项目信息
                                $("#pro_add").off("click").click(function () {

                                    $(".modal-body input").val("");
                                    $(".modal-body textarea").val("");
                                    proAddDatetimepicker();
                                    //检测类型
                                    $("#pro_type").off("change").on("change", function () {
                                        var _typeNum = $("#pro_type option:selected").val();

                                        if (_typeNum == 3) {
                                            //分享有礼
                                            $("#myModal_pro form div")[6].style.display = "none";
                                            $("#myModal_pro form div")[7].style.display = "inline-block";
                                            $("#myModal_pro form div")[8].style.display = "inline-block";
                                            $("#myModal_pro form div")[9].style.display = "inline-block";
                                            $("#myModal_pro form div")[15].style.display = "none";
                                            $("#myModal_pro form div")[16].style.display = "none";
                                            $("#myModal_pro form div")[17].style.display = "none";
                                            $("#myModal_pro form div")[18].style.display = "none";
                                            $("#myModal_pro form div")[19].style.display = "none";
                                            $("#myModal_pro form div")[20].style.display = "none";
                                            $("#myModal_pro form div")[21].style.display = "none";

                                        } else if (_typeNum == 2) {
                                            //抽奖类型
                                            $("#myModal_pro form div")[6].style.display = "none";
                                            $("#myModal_pro form div")[7].style.display = "inline-block";
                                            $("#myModal_pro form div")[8].style.display = "none";
                                            $("#myModal_pro form div")[9].style.display = "none";
                                            $("#myModal_pro form div")[15].style.display = "none";
                                            $("#myModal_pro form div")[16].style.display = "none";
                                            $("#myModal_pro form div")[17].style.display = "none";
                                            $("#myModal_pro form div")[18].style.display = "none";
                                            $("#myModal_pro form div")[19].style.display = "none";
                                            $("#myModal_pro form div")[20].style.display = "none";
                                            $("#myModal_pro form div")[21].style.display = "none";

                                        } else if (_typeNum == 1) {
                                            //实物类型
                                            $("#myModal_pro form div")[6].style.display = "none";
                                            $("#myModal_pro form div")[7].style.display = "inline-block";
                                            $("#myModal_pro form div")[8].style.display = "none";
                                            $("#myModal_pro form div")[9].style.display = "none";
                                            $("#myModal_pro form div")[15].style.display = "none";
                                            $("#myModal_pro form div")[16].style.display = "none";
                                            $("#myModal_pro form div")[17].style.display = "none";
                                            $("#myModal_pro form div")[18].style.display = "none";
                                            $("#myModal_pro form div")[19].style.display = "none";
                                            $("#myModal_pro form div")[20].style.display = "none";
                                            $("#myModal_pro form div")[21].style.display = "none";

                                        } else if (_typeNum == 0) {
                                            //标准类型
                                            $("#myModal_pro form div")[6].style.display = "inline-block";
                                            $("#myModal_pro form div")[7].style.display = "inline-block";
                                            $("#myModal_pro form div")[8].style.display = "none";
                                            $("#myModal_pro form div")[9].style.display = "none";
                                            $("#myModal_pro form div")[15].style.display = "inline-block";
                                            $("#myModal_pro form div")[16].style.display = "inline-block";
                                            if($("#pro_useCabin").val() == "true"){
                                                $(".cabin").css("display","inline-block");
                                            }else{
                                                $(".cabin").css("display","none");
                                            }
                                        }

                                    });


                                    //对用户输入的内容进行提示
                                    //名称
                                    $("#pro_name").blur(function () {
                                        if ($("#pro_name").val() == "") {
                                            $(".err_pro_name").css("display", "inline-block");
                                        } else {
                                            $(".err_pro_name").css("display", "none");
                                        }
                                    });

                                    //标题
                                    $("#pro_caption").blur(function () {
                                        if ($("#pro_caption").val() == "") {
                                            $(".err_pro_caption").css("display", "inline-block");
                                        } else {
                                            $(".err_pro_caption").css("display", "none");
                                        }
                                    });

                                    //分享内容
                                    $("#pro_explication").blur(function () {
                                        if ($("#pro_explication").val() == "") {
                                            $(".err_pro_explication").css("display", "inline-block");
                                        } else {
                                            $(".err_pro_explication").css("display", "none");
                                        }
                                    });

                                    //检测分享URL地址
                                    $("#pro_relatedUrl").blur(function () {
                                        if ($("#pro_relatedUrl").val() != "") {
                                            $(".err_pro_relatedUrl").css("display", "none");
                                        } else {
                                            $(".err_pro_relatedUrl").css("display", "inline-block");
                                        }
                                    });

                                    //检测红包金额
                                    $("#pro_remainAmount").blur(function () {
                                        if (Number($("#pro_remainAmount").val()) < 100) {
                                            $(".err_pro_remainAmount").css("display", "inline-block");
                                        } else {
                                            console.log(Number($("#pro_totalBonus").val()));
                                            if(Number($("#pro_totalBonus").val()) == 0){
                                                $(".err_pro_remainAmount").css("display", "none");
                                            }else{
                                                if( (Number($("#pro_totalBonus").val()) * 100) > (Number($("#pro_remainAmount").val()) )){
                                                    var ra_limit = Math.ceil(Number($("#pro_totalBonus").val()) * 100);
                                                    $(".err_pro_remainAmount").html("请输入不小于"+ra_limit+"的整数");
                                                    $(".err_pro_remainAmount").css("display", "inline-block");
                                                }else{
                                                    $(".err_pro_remainAmount").css("display", "none");
                                                }
                                            }
                                        }
                                    });

                                    //检测红包数量
                                    $("#pro_totalBonus").blur(function () {

                                        if (/^\w+$/.test($("#pro_totalBonus").val())) {
                                            if (Number($("#pro_totalBonus").val()) < 1) {
                                                $(".err_pro_totalBonus").css("display", "inline-block");
                                                if((Number($("#pro_remainAmount").val())) == 0){
                                                    $(".err_pro_totalBonus").css("display", "none");
                                                }else{
                                                    if((Number($("#pro_remainAmount").val()))/100 < (Number($("#pro_totalBonus").val()))){
                                                        var tb_limit = Math.floor((Number($("#pro_remainAmount").val()))/100);
                                                        $(".err_pro_totalBonus").html("请输入不大于"+tb_limit+"且不小于1的整数");
                                                        $(".err_pro_totalBonus").css("display", "inline-block");
                                                    }else{
                                                        $(".err_pro_totalBonus").css("display", "none");
                                                    }
                                                }
                                            } else {
                                                if((Number($("#pro_remainAmount").val())) == 0){
                                                    $(".err_pro_totalBonus").css("display", "none");
                                                }else{
                                                    if((Number($("#pro_remainAmount").val()))/100 < (Number($("#pro_totalBonus").val()))){
                                                        var tb_limit = Math.floor((Number($("#pro_remainAmount").val()))/100);
                                                        $(".err_pro_totalBonus").html("请输入不大于"+tb_limit+"且不小于1的整数");
                                                        $(".err_pro_totalBonus").css("display", "inline-block");
                                                    }else{
                                                        $(".err_pro_totalBonus").css("display", "none");
                                                    }
                                                }
                                            }
                                        } else {
                                            $(".err_pro_totalBonus").css("display", "inline-block");
                                        }
                                    });

                                    //检测等待时间
                                    $("#pro_waitingTime").blur(function () {


                                        if (Number($("#pro_waitingTime").val()) >= 0) {
                                            $(".err_pro_waitingTime").css("display", "none");
                                        } else {
                                            $(".err_pro_waitingTime").css("display", "inline-block");
                                        }
                                    });

                                    //检测分享次数
                                    $("#pro_shareLimit").blur(function () {

                                        if (Number($("#pro_shareLimit").val()) > 0) {
                                            $(".err_pro_shareLimit").css("display", "none");
                                        } else {
                                            $(".err_pro_shareLimit").css("display", "inline-block");
                                        }
                                    });

                                    //检测方差
                                    $("#pro_varianceRatio").blur(function(){
                                        if(Number($("#pro_varianceRatio").val()) >= 10 && Number($("#pro_varianceRatio").val()) <= 500){
                                            $(".err_pro_varianceRatio").css("display","none");
                                        }else{
                                            $(".err_pro_varianceRatio").css("display","block");
                                        }
                                    });

                                    //控制分仓
                                    $("#pro_useCabin").change(function(){
                                        if($("#pro_useCabin").val() == "true"){
                                            $(".cabin").css("display","inline-block");
                                            $("#myModal_pro form div")[6].style.display = "none";
                                            $("#myModal_pro form div")[7].style.display = "none";
                                            $("#myModal_pro form div")[15].style.display = "none";
                                            //仓库一判断
                                            $("#pro_cabin1_price").blur(function(){
                                                if(Number($("#pro_cabin1_count").val()) != 0){
                                                    if(Number($("#pro_cabin1_price").val()) >=100 && Number($("#pro_cabin1_count").val()) >= 1){
                                                        $(".err_pro_cabin1").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin1").css("display","inline-block")
                                                    }
                                                }else{
                                                    if(Number($("#pro_cabin1_price").val()) == 0){
                                                        $(".err_pro_cabin1").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin1").css("display","inline-block")
                                                    }
                                                }

                                            });
                                            $("#pro_cabin1_count").blur(function(){
                                                if(Number($("#pro_cabin1_price").val()) != 0){
                                                    if(Number($("#pro_cabin1_count").val()) >= 1 && Number($("#pro_cabin1_price").val()) >=100){
                                                        $(".err_pro_cabin1").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin1").css("display","inline-block")
                                                    }
                                                }else{
                                                    if((Number($("#pro_cabin1_count").val()) == 0)){
                                                        $(".err_pro_cabin1").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin1").css("display","inline-block")
                                                    }
                                                }

                                            })
                                            //仓库二判断
                                            $("#pro_cabin2_price").blur(function(){
                                                if(Number($("#pro_cabin2_count").val()) != 0){
                                                    if(Number($("#pro_cabin2_price").val()) >=100 && Number($("#pro_cabin2_count").val()) >= 1){
                                                        $(".err_pro_cabin2").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin2").css("display","inline-block")
                                                    }
                                                }else{
                                                    if((Number($("#pro_cabin2_price").val()) == 0)){
                                                        $(".err_pro_cabin2").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin2").css("display","inline-block")
                                                    }
                                                }

                                            });
                                            $("#pro_cabin2_count").blur(function(){
                                                if(Number($("#pro_cabin2_price").val()) != 0){
                                                    if(Number($("#pro_cabin2_count").val()) >= 1 && Number($("#pro_cabin2_price").val()) >=100){
                                                        $(".err_pro_cabin2").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin2").css("display","inline-block")
                                                    }
                                                }else{
                                                    if((Number($("#pro_cabin2_count").val()) == 0)){
                                                        $(".err_pro_cabin2").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin2").css("display","inline-block")
                                                    }
                                                }

                                            })
                                            //仓库三判断
                                            $("#pro_cabin3_price").blur(function(){
                                                if(Number($("#pro_cabin3_count").val()) != 0){
                                                    if(Number($("#pro_cabin3_price").val()) >=100 && Number($("#pro_cabin3_count").val()) >= 1){
                                                        $(".err_pro_cabin3").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin3").css("display","inline-block")
                                                    }
                                                }else{
                                                    if((Number($("#pro_cabin3_price").val()) == 0)){
                                                        $(".err_pro_cabin3").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin3").css("display","inline-block")
                                                    }
                                                }

                                            });
                                            $("#pro_cabin3_count").blur(function(){
                                                if(Number($("#pro_cabin3_price").val()) != 0){
                                                    if(Number($("#pro_cabin3_count").val()) >= 1 && Number($("#pro_cabin3_price").val()) >=100){
                                                        $(".err_pro_cabin3").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin3").css("display","inline-block")
                                                    }
                                                }else{
                                                    if((Number($("#pro_cabin3_count").val()) == 0)){
                                                        $(".err_pro_cabin3").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin3").css("display","inline-block")
                                                    }
                                                }

                                            })
                                            //仓库四判断
                                            $("#pro_cabin4_price").blur(function(){
                                                if(Number($("#pro_cabin4_count").val()) != 0){
                                                    if(Number($("#pro_cabin4_price").val()) >=100 && Number($("#pro_cabin4_count").val()) >= 1){
                                                        $(".err_pro_cabin4").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin4").css("display","inline-block")
                                                    }
                                                }else{
                                                    if((Number($("#pro_cabin4_price").val()) == 0) ){
                                                        $(".err_pro_cabin4").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin4").css("display","inline-block")
                                                    }
                                                }

                                            });
                                            $("#pro_cabin4_count").blur(function(){
                                                if(Number($("#pro_cabin4_price").val()) != 0){
                                                    if(Number($("#pro_cabin4_count").val()) >= 1 && Number($("#pro_cabin4_price").val()) >=100){
                                                        $(".err_pro_cabin4").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin4").css("display","inline-block")
                                                    }
                                                }else{
                                                    if((Number($("#pro_cabin4_count").val()) == 0)){
                                                        $(".err_pro_cabin4").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin4").css("display","inline-block")
                                                    }
                                                }

                                            })
                                            //仓库五判断
                                            $("#pro_cabin5_price").blur(function(){
                                                if(Number($("#pro_cabin5_count").val()) != 0){
                                                    if(Number($("#pro_cabin5_price").val()) >=100 && Number($("#pro_cabin5_count").val()) >= 1){
                                                        $(".err_pro_cabin5").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin5").css("display","inline-block")
                                                    }
                                                }else{
                                                    if((Number($("#pro_cabin5_price").val()) == 0)){
                                                        $(".err_pro_cabin5").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin5").css("display","inline-block")
                                                    }
                                                }

                                            });
                                            $("#pro_cabin5_count").blur(function(){
                                                if(Number($("#pro_cabin5_price").val()) != 0){
                                                    if(Number($("#pro_cabin5_count").val()) >= 1 && Number($("#pro_cabin5_price").val()) >=100){
                                                        $(".err_pro_cabin5").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin5").css("display","inline-block")
                                                    }
                                                }else{
                                                    if((Number($("#pro_cabin5_count").val()) == 0)){
                                                        $(".err_pro_cabin5").css("display","none")
                                                    }else{
                                                        $(".err_pro_cabin5").css("display","inline-block")
                                                    }
                                                }

                                            })
                                        }else{
                                            $(".cabin").css("display","none");
                                            $("#myModal_pro form div")[6].style.display = "inline-block";
                                            $("#myModal_pro form div")[7].style.display = "inline-block";
                                            $("#myModal_pro form div")[15].style.display = "inline-block";
                                        }
                                    });



                                    //增加信息提交
                                    $("#pro_sub").off("click").click(function () {
                                        var _typeNum = $("#pro_type option:selected").val();

                                        if (
                                            ($("#pro_name").val() != "") &&
                                            ($("#pro_caption").val() != "") &&
                                            ($("#pro_explication").val() != "") &&
                                            ($("#pro_relatedUrl").val() != "") &&
                                            (((Number($("#pro_totalBonus").val()) * 100) <= (Number($("#pro_remainAmount").val()))) || _typeNum == 1 ||_typeNum == 2 || _typeNum == 3 || ($("#pro_useCabin").val() == "true")) &&
                                            (((Number($("#pro_remainAmount").val()))/100 >= (Number($("#pro_totalBonus").val()))) || _typeNum == 1 ||_typeNum == 2 || _typeNum == 3 || ($("#pro_useCabin").val() == "true")) &&
                                            (Number($("#pro_waitingTime").val()) >= 0) &&
                                            (Number($("#pro_shareLimit").val()) >= 0) &&
                                            ((Number($("#pro_varianceRatio").val()) >= 10 && Number($("#pro_varianceRatio").val()) <= 500) || ($("#pro_useCabin").val() == "true") || (Number($("#pro_varianceRatio").val())==0)) &&
                                            ((Number($("#pro_cabin1_count").val()) == 0 && Number($("#pro_cabin1_price").val()) == 0) || (Number($("#pro_cabin1_count").val()) >= 1 && Number($("#pro_cabin1_price").val()) >= 100) || ($("#pro_useCabin").val() == "false")) &&
                                            ((Number($("#pro_cabin2_count").val()) == 0 && Number($("#pro_cabin2_price").val()) == 0) || (Number($("#pro_cabin2_count").val()) >= 1 && Number($("#pro_cabin2_price").val()) >= 100)|| ($("#pro_useCabin").val() == "false")) &&
                                            ((Number($("#pro_cabin3_count").val()) == 0 && Number($("#pro_cabin3_price").val()) == 0) || (Number($("#pro_cabin3_count").val()) >= 1 && Number($("#pro_cabin3_price").val()) >= 100)|| ($("#pro_useCabin").val() == "false")) &&
                                            ((Number($("#pro_cabin4_count").val()) == 0 && Number($("#pro_cabin4_price").val()) == 0) || (Number($("#pro_cabin4_count").val()) >= 1 && Number($("#pro_cabin4_price").val()) >= 100)|| ($("#pro_useCabin").val() == "false")) &&
                                            ((Number($("#pro_cabin5_count").val()) == 0 && Number($("#pro_cabin5_price").val()) == 0) || (Number($("#pro_cabin5_count").val()) >= 1 && Number($("#pro_cabin5_price").val()) >= 100)|| ($("#pro_useCabin").val() == "false"))
                                        ) {
                                            http('GET', _url + '/id', 'arraybuffer', function (xhr) {
                                                var arrayBuffer = xhr.response;
                                                var byteArray = new Uint8Array(arrayBuffer);
                                                protobuf.load("./dist/proto/feedback.proto", function (err, root) {
                                                    if (err)
                                                        throw err;
                                                    // Obtain a message type
                                                    var Feedback = root.lookupType("com.weiwuu.krpano.meta.Feedback");
                                                    // Decode an Uint8Array (browser) or Buffer (node) to a message
                                                    var message = Feedback.decode(byteArray);
                                                    var _pid = message.longValue;


                                                    //将时间变为时间戳

                                                    var open_at = $("#pro_openedAt").val();
                                                    var open_at_date = Date.parse(new Date(open_at));
                                                    var open_at_long = open_at_date / 1000;

                                                    var close_at = $("#pro_closedAt").val();
                                                    var close_at_date = Date.parse(new Date(close_at));
                                                    var close_at_long = close_at_date / 1000;
                                                    var jsonData = {
                                                        "type": Number($("#pro_type option:selected").val()),
                                                        "name": $("#pro_name").val(),
                                                        "notes": $("#pro_notes").val(),
                                                        "caption": $("#pro_caption").val(),
                                                        "remain_amount": Number($("#pro_remainAmount").val()),
                                                        "total_bonus": Number($("#pro_totalBonus").val()),
                                                        "share_limit": Number($("#pro_shareLimit").val()),
                                                        "share_vtour_id": Number($("#pro_shareVtourId").val()),
                                                        "explication": $("#pro_explication").val(),
                                                        "related_url": $("#pro_relatedUrl").val(),
                                                        "opened_at": open_at_long,
                                                        "closed_at": close_at_long,
                                                        "waiting_time": Number($("#pro_waitingTime").val()),
                                                        "only_city": $("#pro_onlyCity").val(),
                                                        "only_weixin": true,
                                                        "variance_ratio": 100,
                                                        "use_cabin": $("#pro_useCabin").val() == "true",
                                                        "cabin1_price": Number($("#pro_cabin1_price").val()),
                                                        "cabin1_count": Number($("#pro_cabin1_count").val()),
                                                        "cabin2_price": Number($("#pro_cabin2_price").val()),
                                                        "cabin2_count": Number($("#pro_cabin2_count").val()),
                                                        "cabin3_price": Number($("#pro_cabin3_price").val()),
                                                        "cabin3_count": Number($("#pro_cabin3_count").val()),
                                                        "cabin4_price": Number($("#pro_cabin4_price").val()),
                                                        "cabin4_count": Number($("#pro_cabin4_count").val()),
                                                        "cabin5_price": Number($("#pro_cabin5_price").val()),
                                                        "cabin5_count": Number($("#pro_cabin5_count").val())
                                                    };

                                                    console.log(jsonData);
                                                    $.ajax({
                                                        type: 'POST',
                                                        url: _url + '/client/' + _id + '/project/' + _pid,
                                                        data: JSON.stringify(jsonData),
                                                        success: function () {

                                                        },
                                                        error: function (res) {
                                                            if (res.status == 200) {

                                                                //新增信息
                                                                var tr = '<tr id="' + _pid + '">' +
                                                                    '<td class="pro_type">' + $("#pro_type option:selected").text() + '</td>' +
                                                                    '<td class="pro_name">' + $("#pro_name").val() + '</td>' +
                                                                    '<td class="pro_notes">' + $("#pro_notes").val() + '</td>' +
                                                                    '<td class="pro_caption">' + $("#pro_caption").val() + '</td>' +
                                                                    '<td class="pro_totalBonus">' + Number($("#pro_totalBonus").val()) + '</td>' +
                                                                    '<td class="pro_openedAt">' + $("#pro_openedAt").val() + '</td>' +
                                                                    '<td class="pro_closedAt">' + $("#pro_closedAt").val() + '</td>' +
                                                                    '<td class="pro_enable">' + "是" + '</td>' +
                                                                    '<td class="pro_op">' +
                                                                    '<input class="pro_del btn btn-danger" style="margin-right:4px;" type="button" value="删除"/>' +
                                                                    '<input class="pro_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_pro" value="详情"/>' +
                                                                    '<input class="pro_bonus btn btn-primary" style="margin-left:4px;" type="button" value="红包"/>' +
                                                                    '<input class="pro_journal btn btn-primary" style="margin-left:4px;" type="button" value="日志"/>' +
                                                                    '<input class="pro_report btn btn-primary" style="margin-left:4px;" type="button" value="报告"/>' +
                                                                    '</td>' +
                                                                    '</tr>';
                                                                $("#pro_table_info_tby").append(tr);

                                                                //查询项目信息
                                                                $("#pro_content").keyup(function () {
                                                                    var _text = $("#pro_content").val();
                                                                    $("#pro_table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                                                                }).keyup();

                                                                //删除项目信息
                                                                $(".pro_del").off("click").click(function () {
                                                                    var _this = $(this);
                                                                    var _con = confirm("确认删除该条数据？");
                                                                    if (_con) {
                                                                        _this.parent().parent().remove();
                                                                        $.ajax({
                                                                            type: "DELETE",
                                                                            url: _url + "/client/" + _id + "/project/" + _this.parent().parent()[0].id,
                                                                            data: {},
                                                                            success: function () {

                                                                            }
                                                                        });
                                                                    }
                                                                });

                                                                //修改项目信息
                                                                $(".pro_info").off("click").click(function () {

                                                                    var _this = $(this);
                                                                    var _pid = _this.parent().parent()[0].id;
                                                                    proUpdatedatetimepicker();

                                                                    //检测类型
                                                                    if (_this.parent().parent().children()[0].innerText == "分享有礼") {
                                                                        $("#myModal_detail_pro .form-group")[12].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[13].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[14].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[15].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[16].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[17].style.display = "inline-block";
                                                                        $("#myModal_detail_pro form div")[24].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[25].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[26].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[27].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[28].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[29].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[30].style.display = "none";
                                                                    } else if (_this.parent().parent().children()[0].innerText == "抽奖类型") {
                                                                        $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[14].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[15].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[16].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[17].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[24].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[25].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[26].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[27].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[28].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[29].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[30].style.display = "none";
                                                                    } else if (_this.parent().parent().children()[0].innerText == "实物类型") {
                                                                        $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[14].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[15].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[16].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[17].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[24].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[25].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[26].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[27].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[28].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[29].style.display = "none";
                                                                        $("#myModal_detail_pro form div")[30].style.display = "none";
                                                                    } else if (_this.parent().parent().children()[0].innerText == "标准类型") {
                                                                        $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[14].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[15].style.display = "inline-block";
                                                                        $("#myModal_detail_pro .form-group")[16].style.display = "none";
                                                                        $("#myModal_detail_pro .form-group")[17].style.display = "none";
                                                                        if($("#pro_useCabin_detail").val() == "true"){
                                                                            $(".cabin_detail").css("display","inline-block");
                                                                        }else{
                                                                            $(".cabin_detail").css("display","none");
                                                                        }
                                                                    }

                                                                    //对用户修改信息进行提示

                                                                    //修改委托人名称
                                                                    $("#pro_name_detail").blur(function () {
                                                                        if ($(this).val() == "") {
                                                                            $(".err_pro_name_detail").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_name_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //修改微信分享内容标题
                                                                    $("#pro_caption_detail").blur(function () {
                                                                        if ($(this).val() == "") {
                                                                            $(".err_pro_caption_detail").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_caption_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //修改微信分享内容说明
                                                                    $("#pro_explication_detail").blur(function () {
                                                                        if ($(this).val() == "") {
                                                                            $(".err_pro_explication_detail").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_explication_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //修改微信分享关联地址
                                                                    $("#pro_relatedUrl_detail").blur(function () {
                                                                        if ($(this).val() == "") {
                                                                            $(".err_pro_relatedUrl_detail").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_relatedUrl_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //修改红包数量
                                                                    $("#pro_totalBonus_detail").blur(function () {
                                                                        if (Number($(this).val()) <= 0) {
                                                                            $(".err_pro_totalBonus_detail").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_totalBonus_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //修改资金限制
                                                                    $("#pro_remainAmount_detail").blur(function () {
                                                                        if (Number($(this).val()) <= 0) {
                                                                            $(".err_pro_remainAmount_detail").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_remainAmount_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //修改等待时间
                                                                    $("#pro_waitingTime_detail").blur(function () {
                                                                        if (Number($(this).val()) <= 0) {
                                                                            $(".err_pro_waitingTime_detail").css("display", "inline-block");
                                                                        } else {
                                                                            $(".err_pro_waitingTime_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //剩余个数
                                                                    $("#pro_remainBonus_detail").blur(function () {
                                                                        if (Number($(this).val()) <= 0) {
                                                                            $(".err_pro_remainBonus_detail").css("display", "inline_block");
                                                                        } else {
                                                                            $(".err_pro_remainBonus_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //分享次数限制
                                                                    $("#pro_shareLimit_detail").blur(function () {
                                                                        if (Number($(this).val()) <= 0) {
                                                                            $(".err_pro_shareLimit_detail").css("display", "inline_block");
                                                                        } else {
                                                                            $(".err_pro_shareLimit_detail").css("display", "none");
                                                                        }
                                                                    });

                                                                    //检测方差
                                                                    $("#pro_varianceRatio_detail").blur(function(){
                                                                        if(Number($("#pro_varianceRatio_detail").val()) >= 10 && Number($("#pro_varianceRatio_detail").val()) <= 500){
                                                                            $(".err_pro_varianceRatio_detail").css("display","none");
                                                                        }else{
                                                                            $(".err_pro_varianceRatio_detail").css("display","block");
                                                                        }
                                                                    });

                                                                    //控制分仓
                                                                    $("#pro_useCabin_detail").change(function(){
                                                                        if($("#pro_useCabin_detail").val() == "true"){
                                                                            $(".cabin_detail").css("display","inline-block");
                                                                            $("#myModal_detail_pro .form-group")[12].style.display = "none";
                                                                            $("#myModal_detail_pro .form-group")[13].style.display = "none";
                                                                            $("#myModal_detail_pro .form-group")[24].style.display = "none";

                                                                        }else{
                                                                            $(".cabin_detail").css("display","none");
                                                                            $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                                            $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                                            $("#myModal_detail_pro .form-group")[24].style.display = "inline-block";
                                                                        }
                                                                    });

                                                                    //将表中原有的内容传入要修改的信息中
                                                                    http('GET', _url + '/client/' + _id + '/project/' + _pid, 'arraybuffer', function (xhr) {
                                                                        var arrayBuffer = xhr.response;
                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                        protobuf.load("./dist/proto/project.proto", function (err, root) {
                                                                            if (err)
                                                                                throw err;
                                                                            var Project = root.lookupType("com.weiwuu.bonus.meta.Project");
                                                                            var _data = Project.decode(byteArray);

                                                                            //时间转化
                                                                            var open_date = new Date(_data.openedAt * 1000);
                                                                            var open_y = open_date.getFullYear() + "-";
                                                                            var open_M = ((open_date.getMonth() + 1) < 10 ? "0" + (open_date.getMonth() + 1) : (open_date.getMonth() + 1)) + "-";
                                                                            var open_d = (open_date.getDate() < 10 ? "0" + open_date.getDate() : open_date.getDate()) + " ";
                                                                            var open_h = (open_date.getHours() < 10 ? "0" + open_date.getHours() : open_date.getHours()) + ":";
                                                                            var open_m = (open_date.getMinutes() < 10 ? "0" + open_date.getMinutes() : open_date.getMinutes()) + "";
                                                                            var open_s = (open_date.getSeconds() < 10 ? "0" + open_date.getSeconds() : open_date.getSeconds());
                                                                            //结束时间
                                                                            var close_date = new Date(_data.closedAt * 1000);
                                                                            var close_y = close_date.getFullYear() + "-";
                                                                            var close_M = ((close_date.getMonth() + 1) < 10 ? "0" + (close_date.getMonth() + 1) : (close_date.getMonth() + 1)) + "-";
                                                                            var close_d = (close_date.getDate() < 10 ? "0" + close_date.getDate() : close_date.getDate()) + " ";
                                                                            var close_h = (close_date.getHours() < 10 ? "0" + close_date.getHours() : close_date.getHours()) + ":";
                                                                            var close_m = (close_date.getMinutes() < 10 ? "0" + close_date.getMinutes() : close_date.getMinutes()) + "";
                                                                            var close_s = (close_date.getSeconds() < 10 ? "0" + close_date.getSeconds() : close_date.getSeconds());

                                                                            $("#pro_name_detail")[0].value = _data.caption;
                                                                            $("#pro_notes_detail")[0].value = _data.notes;
                                                                            $("#pro_caption_detail")[0].value = _data.caption;
                                                                            $("#pro_explication_detail")[0].value = _data.explication;
                                                                            $("#pro_relatedUrl_detail")[0].value = _data.relatedUrl;
                                                                            $("#pro_masterUrl_detail")[0].value = _data.masterUrl;
                                                                            $("#pro_detailUrl_detail")[0].value = _data.detailUrl;
                                                                            $("#pro_thanksUrl_detail")[0].value = _data.thanksUrl;
                                                                            $("#pro_successUrl_detail")[0].value = _data.successUrl;
                                                                            $("#pro_failureUrl_detail")[0].value = _data.failureUrl;
                                                                            $("#pro_waitingUrl_detail")[0].value = _data.waitingUrl;
                                                                            $("#pro_finishedUrl_detail")[0].value = _data.finishedUrl;
                                                                            $("#pro_remainAmount_detail")[0].value = _data.remainAmount;
                                                                            $("#pro_payoutAmount_detail")[0].value = _data.payoutAmount;
                                                                            $("#pro_totalBonus_detail")[0].value = _data.totalBonus;
                                                                            $("#pro_remainBonus_detail")[0].value = _data.remainBonus;
                                                                            $("#pro_shareLimit_detail")[0].value = _data.shareLimit;
                                                                            $("#pro_shareVtourId_detail")[0].value = _data.shareVtourId;
                                                                            $("#pro_openedAt_detail")[0].value = open_y + open_M + open_d + open_h + open_m ;
                                                                            $("#pro_closedAt_detail")[0].value = close_y + close_M + close_d + close_h + close_m;
                                                                            $("#pro_waitingTime_detail")[0].value = _data.waitingTime;
                                                                            $("#pro_onlyCity_detail")[0].value = _data.onlyCity;
                                                                            $("#pro_onlyWeixin_detail")[0].value = _data.onlyWeixin;
                                                                            $("#pro_enable_detail")[0].value = true;
                                                                            $("#pro_varianceRatio_detail")[0].value = _data.varianceRatio;
                                                                            $("#pro_useCabin_detail")[0].value = _data.useCabin?"true":"false";
                                                                            $("#pro_cabin1_price_detail")[0].value = _data.cabin1Price;
                                                                            $("#pro_cabin1_count_detail")[0].value = _data.cabin1Count;
                                                                            $("#pro_cabin2_price_detail")[0].value = _data.cabin2Price;
                                                                            $("#pro_cabin2_count_detail")[0].value = _data.cabin2Count;
                                                                            $("#pro_cabin3_price_detail")[0].value = _data.cabin3Price;
                                                                            $("#pro_cabin3_count_detail")[0].value = _data.cabin3Count;
                                                                            $("#pro_cabin4_price_detail")[0].value = _data.cabin4Price;
                                                                            $("#pro_cabin4_count_detail")[0].value = _data.cabin4Count;
                                                                            $("#pro_cabin5_price_detail")[0].value = _data.cabin5Price;
                                                                            $("#pro_cabin5_count_detail")[0].value = _data.cabin5Count;

                                                                            //检测分仓是否有
                                                                            if($("#pro_useCabin_detail").val() == "true"){
                                                                                $(".cabin_detail").css("display","inline-block");
                                                                                $("#myModal_detail_pro .form-group")[12].style.display = "none";
                                                                                $("#myModal_detail_pro .form-group")[13].style.display = "none";
                                                                                $("#myModal_detail_pro .form-group")[24].style.display = "none";
                                                                                //仓库一判断
                                                                                $("#pro_cabin1_price_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin1_count_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin1_price_detail").val()) >=100 && Number($("#pro_cabin1_count_detail").val()) >= 1){
                                                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if(Number($("#pro_cabin1_price_detail").val()) == 0){
                                                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                });
                                                                                $("#pro_cabin1_count_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin1_price_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin1_count_detail").val()) >= 1 && Number($("#pro_cabin1_price_detail").val()) >=100){
                                                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin1_count_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                })
                                                                                //仓库二判断
                                                                                $("#pro_cabin2_price_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin2_count_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin2_price_detail").val()) >=100 && Number($("#pro_cabin2_count_detail").val()) >= 1){
                                                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin2_price_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                });
                                                                                $("#pro_cabin2_count_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin2_price_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin2_count_detail").val()) >= 1 && Number($("#pro_cabin2_price_detail").val()) >=100){
                                                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin2_count_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                })
                                                                                //仓库三判断
                                                                                $("#pro_cabin3_price_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin3_count_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin3_price_detail").val()) >=100 && Number($("#pro_cabin3_count_detail").val()) >= 1){
                                                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin3_price_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                });
                                                                                $("#pro_cabin3_count_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin3_price_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin3_count_detail").val()) >= 1 && Number($("#pro_cabin3_price_detail").val()) >=100){
                                                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin3_count_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                })
                                                                                //仓库四判断
                                                                                $("#pro_cabin4_price_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin4_count_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin4_price_detail").val()) >=100 && Number($("#pro_cabin4_count_detail").val()) >= 1){
                                                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin4_price_detail").val()) == 0) ){
                                                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                });
                                                                                $("#pro_cabin4_count_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin4_price_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin4_count_detail").val()) >= 1 && Number($("#pro_cabin4_price_detail").val()) >=100){
                                                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin4_count_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                })
                                                                                //仓库五判断
                                                                                $("#pro_cabin5_price_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin5_count_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin5_price_detail").val()) >=100 && Number($("#pro_cabin5_count_detail").val()) >= 1){
                                                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin5_price_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                });
                                                                                $("#pro_cabin5_count_detail").blur(function(){
                                                                                    if(Number($("#pro_cabin5_price_detail").val()) != 0){
                                                                                        if(Number($("#pro_cabin5_count_detail").val()) >= 1 && Number($("#pro_cabin5_price_detail").val()) >=100){
                                                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                                                        }
                                                                                    }else{
                                                                                        if((Number($("#pro_cabin5_count_detail").val()) == 0)){
                                                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                                                        }else{
                                                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                                                        }
                                                                                    }

                                                                                })
                                                                            }else{
                                                                                $(".cabin_detail").css("display","none");
                                                                                $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                                                $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                                                $("#myModal_detail_pro .form-group")[24].style.display = "inline-block";
                                                                            }

                                                                            // 设置二维码
                                                                            var url = 'http://wx.weiwuu.com/static/bonus.html?cid=' + _id + '&pid=' + _data.id;
                                                                            $("#pro_getBonus_detail").text(url);
                                                                            $('#pro_qrcode').html("");
                                                                            $('#pro_qrcode').qrcode({
                                                                                width: 200,
                                                                                height: 200,
                                                                                text: url,
                                                                                background: "#ffffff",
                                                                                foreground: "#2cb5a9"
                                                                            });

                                                                        })
                                                                    });

                                                                    //点击修改按钮提交信息
                                                                    $("#pro_change").off("click").click(function () {
                                                                        if (
                                                                            ($("#pro_name_detail").val() != "") &&
                                                                            ($("#pro_caption_detail").val() != "") &&
                                                                            ($("#pro_explication_detail").val() != "") &&
                                                                            ($("#pro_relatedUrl_detail").val() != "") &&
                                                                            (Number($("#pro_totalBonus_detail").val()) >= 0 ||($("#pro_useCabin_detail").val() == "true")) &&
                                                                            (Number($("#pro_remainAmount_detail").val()) >= 0 || ($("#pro_useCabin_detail").val() == "true")) &&
                                                                            (Number($("#pro_waitingTime_detail").val()) >= 0) &&
                                                                            (Number($("#pro_remainBonus_detail").val()) >= 0) &&
                                                                            (Number($("#pro_shareLimit_detail").val()) >= 0) &&
                                                                            ((Number($("#pro_varianceRatio_detail").val()) >= 10 && Number($("#pro_varianceRatio_detail").val()) <= 500)|| ($("#pro_useCabin_detail").val() == "true")|| (Number($("#pro_varianceRatio_detail").val())==0))
                                                                            &&
                                                                            ((Number($("#pro_cabin1_count_detail").val()) == 0 && Number($("#pro_cabin1_price_detail").val()) == 0) || (Number($("#pro_cabin1_count_detail").val()) >= 1 && Number($("#pro_cabin1_price_detail").val()) >= 100) || ($("#pro_useCabin_detail").val() == "false")) &&
                                                                            ((Number($("#pro_cabin2_count_detail").val()) == 0 && Number($("#pro_cabin2_price_detail").val()) == 0) || (Number($("#pro_cabin2_count_detail").val()) >= 1 && Number($("#pro_cabin2_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false")) &&
                                                                            ((Number($("#pro_cabin3_count_detail").val()) == 0 && Number($("#pro_cabin3_price_detail").val()) == 0) || (Number($("#pro_cabin3_count_detail").val()) >= 1 && Number($("#pro_cabin3_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false")) &&
                                                                            ((Number($("#pro_cabin4_count_detail").val()) == 0 && Number($("#pro_cabin4_price_detail").val()) == 0) || (Number($("#pro_cabin4_count_detail").val()) >= 1 && Number($("#pro_cabin4_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false")) &&
                                                                            ((Number($("#pro_cabin5_count_detail").val()) == 0 && Number($("#pro_cabin5_price_detail").val()) == 0) || (Number($("#pro_cabin5_count_detail").val()) >= 1 && Number($("#pro_cabin5_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false"))
                                                                        ) {
                                                                            //将时间变成时间戳
                                                                            var open_at = $("#pro_openedAt_detail").val();
                                                                            var open_at_date = Date.parse(new Date(open_at));
                                                                            var open_at_long = open_at_date / 1000;

                                                                            var close_at = $("#pro_closedAt_detail").val();
                                                                            var close_at_date = Date.parse(new Date(close_at));
                                                                            var close_at_long = close_at_date / 1000;

                                                                            var jsonData = {
                                                                                "name": $("#pro_name_detail")[0].value,
                                                                                "notes": $("#pro_notes_detail")[0].value,
                                                                                "caption": $("#pro_name_detail")[0].value,
                                                                                "explication": $("#pro_explication_detail")[0].value,
                                                                                "related_url": $("#pro_relatedUrl_detail")[0].value,
                                                                                "master_url": $("#pro_masterUrl_detail")[0].value,
                                                                                "opened_at": open_at_long,
                                                                                "closed_at": close_at_long,
                                                                                "detail_url": $("#pro_detailUrl_detail")[0].value,
                                                                                "thanks_url": $("#pro_thanksUrl_detail")[0].value,
                                                                                "success_url": $("#pro_successUrl_detail")[0].value,
                                                                                "failure_url": $("#pro_failureUrl_detail")[0].value,
                                                                                "waiting_url": $("#pro_waitingUrl_detail")[0].value,
                                                                                "finished_url": $("#pro_finishedUrl_detail")[0].value,
                                                                                "remain_amount": Number($("#pro_remainAmount_detail")[0].value),
                                                                                "total_bonus": Number($("#pro_totalBonus_detail")[0].value),
                                                                                "share_limit": Number($("#pro_shareLimit_detail")[0].value),
                                                                                "share_vtour_id": Number($("#pro_shareVtourId_detail")[0].value),
                                                                                "remain_bonus": Number($("#pro_remainBonus_detail")[0].value),
                                                                                "waiting_time": Number($("#pro_waitingTime_detail")[0].value),
                                                                                "only_city": $("#pro_onlyCity_detail")[0].value,
                                                                                "only_weixin": $("#pro_onlyWeixin_detail option:selected").val() === "true",
                                                                                "enabled": $("#pro_enable_detail option:selected").val() === "true",
                                                                                "variance_ratio":Number($("#pro_varianceRatio_detail").val()),
                                                                                "use_cabin":$("#pro_useCabin_detail").val() === "true",
                                                                                "cabin1_price":Number($("#pro_cabin1_price_detail")[0].value),
                                                                                "cabin1_count":Number($("#pro_cabin1_count_detail")[0].value),
                                                                                "cabin2_price":Number($("#pro_cabin2_price_detail")[0].value),
                                                                                "cabin2_count":Number($("#pro_cabin2_count_detail")[0].value),
                                                                                "cabin3_price":Number($("#pro_cabin3_price_detail")[0].value),
                                                                                "cabin3_count":Number($("#pro_cabin3_count_detail")[0].value),
                                                                                "cabin4_price":Number($("#pro_cabin4_price_detail")[0].value),
                                                                                "cabin4_count":Number($("#pro_cabin4_count_detail")[0].value),
                                                                                "cabin5_price":Number($("#pro_cabin5_price_detail")[0].value),
                                                                                "cabin5_count":Number($("#pro_cabin5_count_detail")[0].value)

                                                                            };

                                                                            console.log(jsonData);
                                                                            $.ajax({
                                                                                type: "PUT",
                                                                                url: _url + "/client/" + _id + "/project/" + _this.parent().parent()[0].id,
                                                                                data: JSON.stringify(jsonData),
                                                                                success: function () {

                                                                                },
                                                                                error: function (res) {
                                                                                    if (res.status == 200) {
                                                                                        var pro_tr = _this.parent().parent()[0];
                                                                                        pro_tr.children[1].innerText = $("#pro_name_detail")[0].value;
                                                                                        pro_tr.children[2].innerText = $("#pro_notes_detail")[0].value;
                                                                                        pro_tr.children[3].innerText = $("#pro_caption_detail")[0].value;
                                                                                        pro_tr.children[4].innerText = $("#pro_totalBonus_detail")[0].value;
                                                                                        pro_tr.children[5].innerText = $("#pro_openedAt_detail")[0].value;
                                                                                        pro_tr.children[6].innerText = $("#pro_closedAt_detail")[0].value;
                                                                                        pro_tr.children[7].innerText = ($("#pro_onlyWeixin_detail")[0].value == "true") ? "是" : "否";
                                                                                    } else {
                                                                                        console.log(res.status)
                                                                                    }
                                                                                }
                                                                            });
                                                                        } else {
                                                                            alert("您所修改的信息有误！请重新修改")
                                                                        }
                                                                    });
                                                                });

                                                                //红包信息
                                                                $(".pro_bonus").off("click").click(function () {
                                                                    //将分页按钮隐藏/增加
                                                                    $("#pagination_cli").css("display", "none");
                                                                    $("#pagination_pro").css("display", "none");
                                                                    $("#pagination_bon").css("display", "block");
                                                                    $("#pagination_jou").css("display", "block");

                                                                    var _this = $(this).parent().parent();
                                                                    var _pid = $(this).parent().parent()[0].id;
                                                                    var _name = $(this).parent().parent().children()[1].innerText;//项目名称
                                                                    var _type = $(this).parent().parent().children()[0].innerText;//项目类型

                                                                    $(".bon_pro_name").text(_name+"的");
                                                                    $(".bon_pro_type").text('('+_type+')');


                                                                    $("#bonus").css("display", "block");
                                                                    $("#journal").css("display", "none");
                                                                    $("#report").css("display", "none");

                                                                    $("#changeContent .content").eq(2).show().siblings().hide();
                                                                    $("#bonus").addClass("red").siblings().removeClass("red");

                                                                    if (_this[0].children[0].innerText == "标准类型") {
                                                                        $(".bon_cash").css("display", "table-cell");
                                                                        $(".bon_lucky_code").css("display", "none");
                                                                        $(".bon_lottery_id").css("display", "none");
                                                                    } else if (_this[0].children[0].innerText == "实物类型") {
                                                                        $(".bon_cash").css("display", "none");
                                                                        $(".bon_lucky_code").css("display", "table-cell");
                                                                        $(".bon_lottery_id").css("display", "none");
                                                                    } else if (_this[0].children[0].innerText == "抽奖类型") {
                                                                        $(".bon_cash").css("display", "none");
                                                                        $(".bon_lucky_code").css("display", "none");
                                                                        $(".bon_lottery_id").css("display", "table-cell");
                                                                    }else if (_this[0].children[0].innerText == "分享有礼") {
                                                                        $(".bon_cash").css("display", "none");
                                                                        $(".bon_lucky_code").css("display", "table-cell");
                                                                        $(".bon_lottery_id").css("display", "none");
                                                                    }

                                                                    //动态加载红包
                                                                    function getBonusList(index, size, bonCallBack) {
                                                                        http('GET', _url + '/project/' + _pid + '/bonuses?index=' + index + '&size=' + size, 'arraybuffer', function (xhr) {
                                                                            var arrayBuffer = xhr.response;
                                                                            var byteArray = new Uint8Array(arrayBuffer);
                                                                            protobuf.load('./dist/proto/bonus.proto', function (err, root) {
                                                                                if (err)
                                                                                    throw err;
                                                                                var BonusList = root.lookupType('com.weiwuu.bonus.meta.BonusList');
                                                                                var message = BonusList.decode(byteArray);
                                                                                var _data = message.bonus;

                                                                                //红包回调函数
                                                                                bonCallBack(index, size, _data);

                                                                                //信息查询
                                                                                $("#bon_content").keyup(function () {
                                                                                    var _text = $("#bon_content").val();
                                                                                    $("#bon_table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                                                                                }).keyup();

                                                                                //点击详情
                                                                                $(".bon_info").click(function () {


                                                                                    var _bid = $(this).parent().parent()[0].id;

                                                                                    http('GET', _url + '/project/' + _pid + '/bonus/' + _bid, 'arraybuffer', function (xhr) {
                                                                                        var arrayBuffer = xhr.response;
                                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                                        protobuf.load('./dist/proto/bonus.proto', function (err, root) {
                                                                                            if (err)
                                                                                                throw err;
                                                                                            var Bonus = root.lookupType('com.weiwuu.bonus.meta.Bonus');
                                                                                            var _data = Bonus.decode(byteArray);
                                                                                            console.log(_data)
                                                                                            //定义日期格式
                                                                                            //开始时间
                                                                                            var create_date = new Date(_data.createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());

                                                                                            $("#bon_name")[0].value = _data.name;
                                                                                            $("#bon_notes")[0].value = _data.notes;
                                                                                            $("#bon_wx_name")[0].value = _data.wxName;
                                                                                            $("#bon_mobile")[0].value = _data.mobile;
                                                                                            $("#bon_wx_avatar")[0].innerHTML = '<img style="display: block;height:20px;margin:0 auto;" src="' + _data.wxAvatar + '"/>';
                                                                                            $("#bon_create_at")[0].value = create_y + create_M + create_d + create_h + create_m;
                                                                                            $("#bon_caption")[0].value = _data.caption;
                                                                                            $("#bon_explication")[0].value = _data.explication;
                                                                                            $("#bon_related_url")[0].value = _data.relatedUrl;
                                                                                            $("#bon_cash")[0].value = _data.bonusCash || "";
                                                                                            $("#bon_lucky_code")[0].value = _data.luckyCode || "";
                                                                                            $("#bon_lottery_id")[0].value = _data.lotteryId || "";
                                                                                            $("#bon_from_city")[0].value = _data.fromCity;
                                                                                            $("#bon_enable")[0].value = _data.enabled ? "是" : "否";
                                                                                        })
                                                                                    })
                                                                                })
                                                                            });
                                                                        });
                                                                    }

                                                                    http('GET', _url + '/project/' + _this[0].id + '/bonuses?index=0&size=10', 'arraybuffer', function (xhr) {
                                                                        var arrayBuffer = xhr.response;
                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                        protobuf.load('./dist/proto/bonus.proto', function (err, root) {
                                                                            if (err)
                                                                                throw err;
                                                                            var BonusList = root.lookupType('com.weiwuu.bonus.meta.BonusList');

                                                                            var message = BonusList.decode(byteArray);
                                                                            var _lineCount = message.lineCount;

//分页部分
                                                                            $("#pagination_bon").pagination(_lineCount, {
                                                                                num_edge_entries: 2,
                                                                                num_display_entries: 4,
                                                                                callback: bonPageselectCallback,
                                                                                items_per_page: 500
                                                                            });
                                                                            function bonPageselectCallback(current_page) {
                                                                                getBonusList(current_page, 500, function (index_b, size_b, _data) {


                                                                                    $("#bon_table_info_tby").html("");
                                                                                    for (var i = 0; i < _data.length; i++) {
                                                                                        //开始时间
                                                                                        var create_date = new Date(_data[i].createdAt * 1000);
                                                                                        var create_y = create_date.getFullYear() + "-";

                                                                                        var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                        var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                        var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                        var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                        var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                        var tr = '<tr id="' + _data[i].id + '">' +
                                                                                            '<td class="bon_name">' + _data[i].name + '</td>' +
                                                                                            '<td class="bon_created_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                                                            '<td class="bon_wx_name">' + _data[i].wxName + '</td>' +
                                                                                            '<td class="bon_mobile">' + _data[i].mobile + '</td>' +
                                                                                            '<td class="bon_wx_avatar"><img style="display: block;height:40px;margin:0 auto;" src="' + _data[i].wxAvatar + '"</td>' +
                                                                                            '<td class="bon_cash">' + _data[i].bonusCash + '</td>' +
                                                                                            '<td class="bon_from_city">' + _data[i].fromCity + '</td>' +
                                                                                            '<td class="bon_op">' +
                                                                                            '<input class="bon_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_bon"' +
                                                                                            'value="详情"/>' +
                                                                                            '</td>' +
                                                                                            '</tr>';
                                                                                        $("#bon_table_info_tby").append(tr);
                                                                                    }
                                                                                })
                                                                            }

                                                                            $("#bon_table_info_tby").html("");
                                                                        })
                                                                    })

                                                                });

                                                                //日志信息
                                                                $(".pro_journal").off("click").click(function () {

                                                                    var _pid = $(this).parent().parent()[0].id;

                                                                    $("#bonus").css("display", "none");
                                                                    $("#journal").css("display", "block");
                                                                    $("#report").css("display", "none");

                                                                    $("#pagination_pro").css("display", "none");
                                                                    $("#pagination_cli").css("display", "none");
                                                                    $("#pagination_bon").css("display", "none");
                                                                    $("#pagination_jou").css("display", "block");

                                                                    var _name = $(this).parent().parent().children()[1].innerText
                                                                    $(".bon_pro_name").text(_name);

                                                                    $("#changeContent .content").eq(3).show().siblings().hide();
                                                                    $("#journal").addClass("red").siblings().removeClass("red");


                                                                    function getJournalList(index, size, jouCallBack) {
                                                                        http('GET', _url + '/project/' + _pid + '/journals?index=' + index + '&size=' + size, 'arraybuffer', function (xhr) {
                                                                            var arrayBuffer = xhr.response;
                                                                            var byteArray = new Uint8Array(arrayBuffer);
                                                                            protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                                if (err)
                                                                                    throw err;
                                                                                var JournalList = root.lookupType('com.weiwuu.bonus.meta.JournalList');

                                                                                var message = JournalList.decode(byteArray);
                                                                                var _data = message.journal;

                                                                                //红包回调函数
                                                                                jouCallBack(index, size, _data);

                                                                                //信息查询
                                                                                $("#jou_content").keyup(function () {
                                                                                    var _text = $("#jou_content").val();
                                                                                    $("#jou_table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                                                                                }).keyup();

                                                                                //点击详情
                                                                                $(".jou_info").click(function () {
                                                                                    var _jid = $(this).parent().parent()[0].id;
                                                                                    http('GET', _url + '/project/' + _pid + '/journal/' + _jid, 'arraybuffer', function (xhr) {
                                                                                        var arrayBuffer = xhr.response;
                                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                                        protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                                            if (err)
                                                                                                throw(err);
                                                                                            var Journal = root.lookupType('com.weiwuu.bonus.meta.Journal');
                                                                                            var _data = Journal.decode(byteArray);


                                                                                            var create_date = new Date(_data.createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            //将信息填充到日志详情中

                                                                                            $("#jou_from_city")[0].value = _data.fromCity;
                                                                                            $("#jou_bonus_cash")[0].value = _data.bonusCash || "";
                                                                                            $("#jou_lottery_id")[0].value = _data.lotteryId || "";
                                                                                            $("#jou_lucky_code")[0].value = _data.luckyCode || "";
                                                                                            $("#jou_wx_name")[0].value = _data.wxName;
                                                                                            $("#jou_wx_avatar").html('<img style="display:block;width:20px;" src="' + _data.wxAvatar + '"/>')
                                                                                            $("#jou_action")[0].value = _data.action;
                                                                                            $("#jou_description")[0].value = _data.description;
                                                                                            $("#jou_created_at")[0].value = create_y + create_M + create_d + create_h + create_m

                                                                                        })
                                                                                    })
                                                                                })

                                                                            });
                                                                        });
                                                                    }

                                                                    http('GET', _url + '/project/' + _pid + '/journals?index=0&size=10', 'arraybuffer', function (xhr) {
                                                                        var arrayBuffer = xhr.response;
                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                        protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                            if (err)
                                                                                throw err;
                                                                            var JournalList = root.lookupType('com.weiwuu.bonus.meta.JournalList');
                                                                            var message = JournalList.decode(byteArray);

                                                                            var _lineCount = message.lineCount;
                                                                            var _data = message.journal;


                                                                            $("#pagination_jou").pagination(_lineCount, {
                                                                                num_edge_entries: 2,
                                                                                num_display_entries: 4,
                                                                                callback: jouPageselectCallback,
                                                                                items_per_page: 10
                                                                            });
                                                                            function jouPageselectCallback(current_page) {
                                                                                getJournalList(current_page, 10, function (index, size, _data) {
                                                                                    $("#jou_table_info_tby").html("");
                                                                                    for (var i = 0; i < _data.length; i++) {
                                                                                        //开始时间
                                                                                        var create_date = new Date(_data[i].createdAt * 1000);
                                                                                        var create_y = create_date.getFullYear() + "-";

                                                                                        var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                        var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                        var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                        var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                        var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                        var tr = '<tr id="' + _data[i].id + '">' +
                                                                                            '<td class="jou_created_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                                                            '<td class="jou_wx_name">' + _data[i].wxName + '</td>' +
                                                                                            '<td class="jou_wx_avatar"> <img style="display:block;width:50px;" src="' + _data[i].wxAvatar + '"/></td>' +
                                                                                            '<td class="jou_action">' + _data[i].action + '</td>' +
                                                                                            '<td class="jou_description">' + _data[i].description + '</td>' +
                                                                                            '<td class="jou_op">' +
                                                                                            '<input class="jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_jou"' +
                                                                                            'value="详情"/>' +
                                                                                            '</td>' +
                                                                                            '</tr>';
                                                                                        $("#jou_table_info_tby").append(tr);
                                                                                    }
                                                                                })
                                                                            }

                                                                            $("#jou_table_info_tby").html("");
                                                                        })
                                                                    })
                                                                });

                                                                //报告信息
                                                                $(".pro_report").off("click").click(function () {

                                                                    var _name = $(this).parent().parent().children()[1].innerText
                                                                    $(".bon_pro_name").text(_name);

                                                                    var _pid = $(this).parent().parent()[0].id;

                                                                    $("#bonus").css("display", "none");
                                                                    $("#journal").css("display", "none");
                                                                    $("#report").css("display", "block");

                                                                    $("#pagination_pro").css("display", "none");
                                                                    $("#pagination_rep").css("display", "block");

                                                                    $("#changeContent .content").eq(5).show().siblings().hide();
                                                                    $("#report").addClass("red").siblings().removeClass("red");

                                                                    //    点击按钮切换内容
                                                                    $(".report_include").eq(0).show().siblings().hide();

                                                                    $("#rep_btn li").off("click").click(function () {
                                                                        var _index = $(this).index();
                                                                        $(".report_include").eq(_index).show().siblings().hide();
                                                                    })

                                                                    http('GET', _url + '/project/' + _pid + '/report', 'arraybuffer', function (xhr) {
                                                                        var arrayBuffer = xhr.response;
                                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                                        protobuf.load('./dist/proto/report.proto', function (err, root) {
                                                                            if (err)
                                                                                throw err;
                                                                            var Report = root.lookupType('com.weiwuu.bonus.meta.Report');
                                                                            var _data = Report.decode(byteArray);

                                                                            var _metrics = _data.metrics;
                                                                            var _journal = _data.journal;
                                                                            var _visit = _data.visit;


                                                                            if (_metrics == null) {
                                                                                //日志部分
                                                                                $("#pagination_rep_jou").pagination(_journal.length, {
                                                                                    num_edge_entries: 2,
                                                                                    num_display_entries: 4,
                                                                                    callback: repJouPageselectCallback,
                                                                                    items_per_page: 10
                                                                                });

                                                                                function repJouPageselectCallback(current_page) {

                                                                                    if ((current_page + 1) * 10 > _journal.length) {
                                                                                        $("#rep_jou_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < _journal.length; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                                                '<td class="rep_jou_op">' +
                                                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                                                'value="详情"/>' +
                                                                                                '</td>'
                                                                                            '</tr>';
                                                                                            $("#rep_jou_table_info_tby").append(tr);
                                                                                        }
                                                                                    } else {
                                                                                        $("#rep_jou_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                                                '<td class="rep_jou_op">' +
                                                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                                                'value="详情"/>' +
                                                                                                '</td>' +
                                                                                                '</tr>';
                                                                                            $("#rep_jou_table_info_tby").append(tr);
                                                                                        }
                                                                                    }
                                                                                    $(".rep_jou_info").click(function () {
                                                                                        var _jid = $(this).parent().parent()[0].id

                                                                                        http('GET', _url + '/project/' + _pid + '/journal/' + _jid, 'arraybuffer', function (xhr) {
                                                                                            var arrayBuffer = xhr.response;
                                                                                            var byteArray = new Uint8Array(arrayBuffer);
                                                                                            protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                                                if (err)
                                                                                                    throw err;
                                                                                                var Journal = root.lookupType('com.weiwuu.bonus.meta.Journal');
                                                                                                var _data = Journal.decode(byteArray);


                                                                                                var create_date = new Date(_data.createdAt * 1000);
                                                                                                var create_y = create_date.getFullYear() + "-";

                                                                                                var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                                                var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                //将信息填充到日志详情中

                                                                                                $("#rep_jou_from_city")[0].value = _data.fromCity;
                                                                                                $("#rep_jou_bonus_cash")[0].value = _data.bonusCash || "";
                                                                                                $("#rep_jou_lottery_id")[0].value = _data.lotteryId || "";
                                                                                                $("#rep_jou_lucky_code")[0].value = _data.luckyCode || "";
                                                                                                $("#rep_jou_wx_name")[0].value = _data.wxName;
                                                                                                $("#rep_jou_wx_avatar").html('<img style="display:block;width:20px;" src="' + _data.wxAvatar + '"/>')
                                                                                                $("#rep_jou_action")[0].value = _data.action;
                                                                                                $("#rep_jou_description")[0].value = _data.description;
                                                                                                $("#rep_jou_created_at")[0].value = create_y + create_M + create_d + create_h + create_m + create_s
                                                                                            })
                                                                                        })
                                                                                    })
                                                                                }

                                                                                //访问部分
                                                                                $("#pagination_vis_jou").pagination(_visit.length, {
                                                                                    num_edge_entries: 2,
                                                                                    num_display_entries: 4,
                                                                                    callback: repVisPageselectCallback,
                                                                                    items_per_page: 10
                                                                                });

                                                                                function repVisPageselectCallback(current_page) {
                                                                                    if ((current_page + 1) * 10 > _visit.length) {
                                                                                        $("#rep_vis_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < _visit.length; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            //更新时间
                                                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                                                            var update_y = update_date.getFullYear() + "-";

                                                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + ":";
                                                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                                                '<td>' + update_y + update_M + update_d + update_h + update_m + update_s + '</td>' +
                                                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                                                '<td>' + _visit[i].description + '</td>' +
                                                                                                '</tr>';
                                                                                            $("#rep_vis_table_info_tby").append(tr);
                                                                                        }
                                                                                    } else {
                                                                                        $("#rep_vis_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            //更新时间
                                                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                                                            var update_y = update_date.getFullYear() + "-";

                                                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + ":";
                                                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                                                '<td>' + update_y + update_M + update_d + update_h + update_m + update_s + '</td>' +
                                                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                                                '<td>' + _visit[i].description + '</td>' +
                                                                                                '</tr>';
                                                                                            $("#rep_vis_table_info_tby").append(tr);
                                                                                        }
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                var create_date = new Date(_metrics.createdAt * 1000);
                                                                                var create_y = create_date.getFullYear() + "-";

                                                                                var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());

                                                                                //结束时间
                                                                                var updated_date = new Date(_metrics.createdAt * 1000);
                                                                                var updated_y = updated_date.getFullYear() + "-";

                                                                                var updated_M = ((updated_date.getMonth() + 1) < 10 ? "0" + (updated_date.getMonth() + 1) : (updated_date.getMonth() + 1)) + "-";
                                                                                var updated_d = (updated_date.getDate() < 10 ? "0" + updated_date.getDate() : updated_date.getDate()) + " ";
                                                                                var updated_h = (updated_date.getHours() < 10 ? "0" + updated_date.getHours() : updated_date.getHours()) + ":";
                                                                                var updated_m = (updated_date.getMinutes() < 10 ? "0" + updated_date.getMinutes() : updated_date.getMinutes()) + "";
                                                                                var updated_s = (updated_date.getSeconds() < 10 ? "0" + updated_date.getSeconds() : updated_date.getSeconds());
                                                                                $('.met_view_count').text(_metrics.viewCount);
                                                                                $('.met_drawing_count').text(_metrics.drawingCount);
                                                                                $('.met_share_count').text(_metrics.shareCount);
                                                                                $('.met_comment_count').text(_metrics.commentCount);
                                                                                $(".met_apply_count").text(_metrics.applyCount);
                                                                                $(".met_click_count").text(_metrics.clickCount);
                                                                                $(".met_obtain_count").text(_metrics.obtainCount);
                                                                                $(".met_created_at").text(create_y + create_M + create_d + create_h + create_m );
                                                                                $(".met_updated_at").text(updated_y + updated_M + updated_d + updated_h + updated_m );

                                                                                //日志部分
                                                                                $("#pagination_rep_jou").pagination(_journal.length, {
                                                                                    num_edge_entries: 2,
                                                                                    num_display_entries: 4,
                                                                                    callback: repJouPageselectCallback,
                                                                                    items_per_page: 10
                                                                                });

                                                                                function repJouPageselectCallback(current_page) {

                                                                                    if ((current_page + 1) * 10 > _journal.length) {
                                                                                        $("#rep_jou_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < _journal.length; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                                                '<td class="rep_jou_op">' +
                                                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                                                'value="详情"/>' +
                                                                                                '</td>'
                                                                                            '</tr>';
                                                                                            $("#rep_jou_table_info_tby").append(tr);
                                                                                        }
                                                                                    } else {
                                                                                        $("#rep_jou_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m +  '</td>' +
                                                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                                                '<td class="rep_jou_op">' +
                                                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                                                'value="详情"/>' +
                                                                                                '</td>' +
                                                                                                '</tr>';
                                                                                            $("#rep_jou_table_info_tby").append(tr);
                                                                                        }
                                                                                    }
                                                                                    $(".rep_jou_info").click(function () {
                                                                                        var _jid = $(this).parent().parent()[0].id

                                                                                        http('GET', _url + '/project/' + _pid + '/journal/' + _jid, 'arraybuffer', function (xhr) {
                                                                                            var arrayBuffer = xhr.response;
                                                                                            var byteArray = new Uint8Array(arrayBuffer);
                                                                                            protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                                                if (err)
                                                                                                    throw err;
                                                                                                var Journal = root.lookupType('com.weiwuu.bonus.meta.Journal');
                                                                                                var _data = Journal.decode(byteArray);

                                                                                                var create_date = new Date(_data.createdAt * 1000);
                                                                                                var create_y = create_date.getFullYear() + "-";

                                                                                                var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                                var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                                var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                                var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                                var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                                //将信息填充到日志详情中

                                                                                                $("#rep_jou_from_city")[0].value = _data.fromCity;
                                                                                                $("#rep_jou_bonus_cash")[0].value = _data.bonusCash || "";
                                                                                                $("#rep_jou_lottery_id")[0].value = _data.lotteryId || "";
                                                                                                $("#rep_jou_lucky_code")[0].value = _data.luckyCode || "";
                                                                                                $("#rep_jou_wx_name")[0].value = _data.wxName;
                                                                                                $("#rep_jou_wx_avatar").html('<img style="display:block;width:20px;" src="' + _data.wxAvatar + '"/>')
                                                                                                $("#rep_jou_action")[0].value = _data.action;
                                                                                                $("#rep_jou_description")[0].value = _data.description;
                                                                                                $("#rep_jou_created_at")[0].value = create_y + create_M + create_d + create_h + create_m
                                                                                            })
                                                                                        })
                                                                                    })
                                                                                }

                                                                                //访问部分
                                                                                $("#pagination_vis_jou").pagination(_visit.length, {
                                                                                    num_edge_entries: 2,
                                                                                    num_display_entries: 4,
                                                                                    callback: repVisPageselectCallback,
                                                                                    items_per_page: 10
                                                                                });

                                                                                function repVisPageselectCallback(current_page) {
                                                                                    if ((current_page + 1) * 10 > _visit.length) {
                                                                                        $("#rep_vis_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < _visit.length; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            //更新时间
                                                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                                                            var update_y = update_date.getFullYear() + "-";

                                                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + "";
                                                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m +  '</td>' +
                                                                                                '<td>' + update_y + update_M + update_d + update_h + update_m  + '</td>' +
                                                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                                                '<td>' + _visit[i].description + '</td>' +
                                                                                                '</tr>';
                                                                                            $("#rep_vis_table_info_tby").append(tr);
                                                                                        }
                                                                                    } else {
                                                                                        $("#rep_vis_table_info_tby").html("");
                                                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                                                            //开始时间
                                                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                                                            var create_y = create_date.getFullYear() + "-";

                                                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                                            //更新时间
                                                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                                                            var update_y = update_date.getFullYear() + "-";

                                                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + "";
                                                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                                                                '<td>' + update_y + update_M + update_d + update_h + update_m +  '</td>' +
                                                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                                                '<td>' + _visit[i].description + '</td>' +
                                                                                                '</tr>';
                                                                                            $("#rep_vis_table_info_tby").append(tr);
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    })
                                                                })
                                                            }
                                                        }
                                                    })
                                                })
                                            });
                                        } else {
                                            alert("填写数据错误!")
                                        }

                                    });
                                });

                                //删除项目信息
                                $(".pro_del").off("click").click(function () {
                                    var _this = $(this);
                                    var _con = confirm("确认删除该条数据？");
                                    if (_con) {
                                        _this.parent().parent().remove();
                                        $.ajax({
                                            type: "DELETE",
                                            url: _url + "/client/" + _id + "/project/" + _this.parent().parent()[0].id,
                                            data: {},
                                            success: function () {

                                            }
                                        });
                                    }
                                });

                                //修改项目信息
                                $(".pro_info").off("click").click(function () {

                                    var _this = $(this);
                                    var _pid = _this.parent().parent()[0].id;
                                    proUpdatedatetimepicker();

                                    //检测类型
                                    if (_this.parent().parent().children()[0].innerText == "分享有礼") {
                                        $("#myModal_detail_pro .form-group")[12].style.display = "none";
                                        $("#myModal_detail_pro .form-group")[13].style.display = "none";
                                        $("#myModal_detail_pro .form-group")[14].style.display = "none";
                                        $("#myModal_detail_pro .form-group")[15].style.display = "none";
                                        $("#myModal_detail_pro .form-group")[16].style.display = "inline-block";
                                        $("#myModal_detail_pro .form-group")[17].style.display = "inline-block";
                                        $("#myModal_detail_pro form div")[24].style.display = "none";
                                        $("#myModal_detail_pro form div")[25].style.display = "none";
                                        $("#myModal_detail_pro form div")[26].style.display = "none";
                                        $("#myModal_detail_pro form div")[27].style.display = "none";
                                        $("#myModal_detail_pro form div")[28].style.display = "none";
                                        $("#myModal_detail_pro form div")[29].style.display = "none";
                                        $("#myModal_detail_pro form div")[30].style.display = "none";
                                    } else if (_this.parent().parent().children()[0].innerText == "抽奖类型") {
                                        $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                        $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                        $("#myModal_detail_pro .form-group")[14].style.display = "none";
                                        $("#myModal_detail_pro .form-group")[15].style.display = "none";
                                        $("#myModal_detail_pro .form-group")[16].style.display = "none";
                                        $("#myModal_detail_pro .form-group")[17].style.display = "none";
                                        $("#myModal_detail_pro form div")[24].style.display = "none";
                                        $("#myModal_detail_pro form div")[25].style.display = "none";
                                        $("#myModal_detail_pro form div")[26].style.display = "none";
                                        $("#myModal_detail_pro form div")[27].style.display = "none";
                                        $("#myModal_detail_pro form div")[28].style.display = "none";
                                        $("#myModal_detail_pro form div")[29].style.display = "none";
                                        $("#myModal_detail_pro form div")[30].style.display = "none";
                                    } else if (_this.parent().parent().children()[0].innerText == "实物类型") {
                                        $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                        $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                        $("#myModal_detail_pro .form-group")[14].style.display = "none";
                                        $("#myModal_detail_pro .form-group")[15].style.display = "none";
                                        $("#myModal_detail_pro .form-group")[16].style.display = "none";
                                        $("#myModal_detail_pro .form-group")[17].style.display = "none";
                                        $("#myModal_detail_pro form div")[24].style.display = "none";
                                        $("#myModal_detail_pro form div")[25].style.display = "none";
                                        $("#myModal_detail_pro form div")[26].style.display = "none";
                                        $("#myModal_detail_pro form div")[27].style.display = "none";
                                        $("#myModal_detail_pro form div")[28].style.display = "none";
                                        $("#myModal_detail_pro form div")[29].style.display = "none";
                                        $("#myModal_detail_pro form div")[30].style.display = "none";
                                    } else if (_this.parent().parent().children()[0].innerText == "标准类型") {
                                        $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                        $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                        $("#myModal_detail_pro .form-group")[14].style.display = "inline-block";
                                        $("#myModal_detail_pro .form-group")[15].style.display = "inline-block";
                                        $("#myModal_detail_pro .form-group")[16].style.display = "none";
                                        $("#myModal_detail_pro .form-group")[17].style.display = "none";
                                        if($("#pro_useCabin_detail").val() == "true"){
                                            $(".cabin_detail").css("display","inline-block");
                                        }else{
                                            $(".cabin_detail").css("display","none");
                                        }
                                    }

                                    //对用户修改信息进行提示

                                    //修改委托人名称
                                    $("#pro_name_detail").blur(function () {
                                        if ($(this).val() == "") {
                                            $(".err_pro_name_detail").css("display", "inline-block");
                                        } else {
                                            $(".err_pro_name_detail").css("display", "none");
                                        }
                                    });

                                    //修改微信分享内容标题
                                    $("#pro_caption_detail").blur(function () {
                                        if ($(this).val() == "") {
                                            $(".err_pro_caption_detail").css("display", "inline-block");
                                        } else {
                                            $(".err_pro_caption_detail").css("display", "none");
                                        }
                                    });

                                    //修改微信分享内容说明
                                    $("#pro_explication_detail").blur(function () {
                                        if ($(this).val() == "") {
                                            $(".err_pro_explication_detail").css("display", "inline-block");
                                        } else {
                                            $(".err_pro_explication_detail").css("display", "none");
                                        }
                                    });

                                    //修改微信分享关联地址
                                    $("#pro_relatedUrl_detail").blur(function () {
                                        if ($(this).val() == "") {
                                            $(".err_pro_relatedUrl_detail").css("display", "inline-block");
                                        } else {
                                            $(".err_pro_relatedUrl_detail").css("display", "none");
                                        }
                                    });

                                    //修改红包数量
                                    $("#pro_totalBonus_detail").blur(function () {
                                        if (Number($(this).val()) <= 0) {
                                            $(".err_pro_totalBonus_detail").css("display", "inline-block");
                                        } else {
                                            $(".err_pro_totalBonus_detail").css("display", "none");
                                        }
                                    });

                                    //修改资金限制
                                    $("#pro_remainAmount_detail").blur(function () {
                                        if (Number($(this).val()) <= 0) {
                                            $(".err_pro_remainAmount_detail").css("display", "inline-block");
                                        } else {
                                            $(".err_pro_remainAmount_detail").css("display", "none");
                                        }
                                    });

                                    //修改等待时间
                                    $("#pro_waitingTime_detail").blur(function () {
                                        if (Number($(this).val()) <= 0) {
                                            $(".err_pro_waitingTime_detail").css("display", "inline-block");
                                        } else {
                                            $(".err_pro_waitingTime_detail").css("display", "none");
                                        }
                                    });

                                    //剩余个数
                                    $("#pro_remainBonus_detail").blur(function () {
                                        if (Number($(this).val()) <= 0) {
                                            $(".err_pro_remainBonus_detail").css("display", "inline_block");
                                        } else {
                                            $(".err_pro_remainBonus_detail").css("display", "none");
                                        }
                                    });

                                    //分享次数限制
                                    $("#pro_shareLimit_detail").blur(function () {
                                        if (Number($(this).val()) <= 0) {
                                            $(".err_pro_shareLimit_detail").css("display", "inline_block");
                                        } else {
                                            $(".err_pro_shareLimit_detail").css("display", "none");
                                        }
                                    });

                                    //检测方差
                                    $("#pro_varianceRatio_detail").blur(function(){
                                        if(Number($("#pro_varianceRatio_detail").val()) >= 10 && Number($("#pro_varianceRatio_detail").val()) <= 500){
                                            $(".err_pro_varianceRatio_detail").css("display","none");
                                        }else{
                                            $(".err_pro_varianceRatio_detail").css("display","block");
                                        }
                                    });

                                    //控制分仓
                                    $("#pro_useCabin_detail").change(function(){
                                        if($("#pro_useCabin_detail").val() == "true"){
                                            $(".cabin_detail").css("display","inline-block");
                                            $("#myModal_detail_pro .form-group")[12].style.display = "none";
                                            $("#myModal_detail_pro .form-group")[13].style.display = "none";
                                            $("#myModal_detail_pro .form-group")[24].style.display = "none";

                                        }else{
                                            $(".cabin_detail").css("display","none");
                                            $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                            $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                            $("#myModal_detail_pro .form-group")[24].style.display = "inline-block";
                                        }
                                    });

                                    //将表中原有的内容传入要修改的信息中
                                    http('GET', _url + '/client/' + _id + '/project/' + _pid, 'arraybuffer', function (xhr) {
                                        var arrayBuffer = xhr.response;
                                        var byteArray = new Uint8Array(arrayBuffer);
                                        protobuf.load("./dist/proto/project.proto", function (err, root) {
                                            if (err)
                                                throw err;
                                            var Project = root.lookupType("com.weiwuu.bonus.meta.Project");
                                            var _data = Project.decode(byteArray);

                                            //时间转化
                                            var open_date = new Date(_data.openedAt * 1000);
                                            var open_y = open_date.getFullYear() + "-";
                                            var open_M = ((open_date.getMonth() + 1) < 10 ? "0" + (open_date.getMonth() + 1) : (open_date.getMonth() + 1)) + "-";
                                            var open_d = (open_date.getDate() < 10 ? "0" + open_date.getDate() : open_date.getDate()) + " ";
                                            var open_h = (open_date.getHours() < 10 ? "0" + open_date.getHours() : open_date.getHours()) + ":";
                                            var open_m = (open_date.getMinutes() < 10 ? "0" + open_date.getMinutes() : open_date.getMinutes()) + "";
                                            var open_s = (open_date.getSeconds() < 10 ? "0" + open_date.getSeconds() : open_date.getSeconds());
                                            //结束时间
                                            var close_date = new Date(_data.closedAt * 1000);
                                            var close_y = close_date.getFullYear() + "-";
                                            var close_M = ((close_date.getMonth() + 1) < 10 ? "0" + (close_date.getMonth() + 1) : (close_date.getMonth() + 1)) + "-";
                                            var close_d = (close_date.getDate() < 10 ? "0" + close_date.getDate() : close_date.getDate()) + " ";
                                            var close_h = (close_date.getHours() < 10 ? "0" + close_date.getHours() : close_date.getHours()) + ":";
                                            var close_m = (close_date.getMinutes() < 10 ? "0" + close_date.getMinutes() : close_date.getMinutes()) + "";
                                            var close_s = (close_date.getSeconds() < 10 ? "0" + close_date.getSeconds() : close_date.getSeconds());

                                            $("#pro_name_detail")[0].value = _data.caption;
                                            $("#pro_notes_detail")[0].value = _data.notes;
                                            $("#pro_caption_detail")[0].value = _data.caption;
                                            $("#pro_explication_detail")[0].value = _data.explication;
                                            $("#pro_relatedUrl_detail")[0].value = _data.relatedUrl;
                                            $("#pro_masterUrl_detail")[0].value = _data.masterUrl;
                                            $("#pro_detailUrl_detail")[0].value = _data.detailUrl;
                                            $("#pro_thanksUrl_detail")[0].value = _data.thanksUrl;
                                            $("#pro_successUrl_detail")[0].value = _data.successUrl;
                                            $("#pro_failureUrl_detail")[0].value = _data.failureUrl;
                                            $("#pro_waitingUrl_detail")[0].value = _data.waitingUrl;
                                            $("#pro_finishedUrl_detail")[0].value = _data.finishedUrl;
                                            $("#pro_remainAmount_detail")[0].value = _data.remainAmount;
                                            $("#pro_payoutAmount_detail")[0].value = _data.payoutAmount;
                                            $("#pro_totalBonus_detail")[0].value = _data.totalBonus;
                                            $("#pro_remainBonus_detail")[0].value = _data.remainBonus;
                                            $("#pro_shareLimit_detail")[0].value = _data.shareLimit;
                                            $("#pro_shareVtourId_detail")[0].value = _data.shareVtourId;
                                            $("#pro_openedAt_detail")[0].value = open_y + open_M + open_d + open_h + open_m ;
                                            $("#pro_closedAt_detail")[0].value = close_y + close_M + close_d + close_h + close_m;
                                            $("#pro_waitingTime_detail")[0].value = _data.waitingTime;
                                            $("#pro_onlyCity_detail")[0].value = _data.onlyCity;
                                            $("#pro_onlyWeixin_detail")[0].value = _data.onlyWeixin;
                                            $("#pro_enable_detail")[0].value = true;
                                            $("#pro_varianceRatio_detail")[0].value = _data.varianceRatio;
                                            $("#pro_useCabin_detail")[0].value = _data.useCabin?"true":"false";
                                            $("#pro_cabin1_price_detail")[0].value = _data.cabin1Price;
                                            $("#pro_cabin1_count_detail")[0].value = _data.cabin1Count;
                                            $("#pro_cabin2_price_detail")[0].value = _data.cabin2Price;
                                            $("#pro_cabin2_count_detail")[0].value = _data.cabin2Count;
                                            $("#pro_cabin3_price_detail")[0].value = _data.cabin3Price;
                                            $("#pro_cabin3_count_detail")[0].value = _data.cabin3Count;
                                            $("#pro_cabin4_price_detail")[0].value = _data.cabin4Price;
                                            $("#pro_cabin4_count_detail")[0].value = _data.cabin4Count;
                                            $("#pro_cabin5_price_detail")[0].value = _data.cabin5Price;
                                            $("#pro_cabin5_count_detail")[0].value = _data.cabin5Count;

                                            //检测分仓是否有
                                            if($("#pro_useCabin_detail").val() == "true"){
                                                $(".cabin_detail").css("display","inline-block");
                                                $("#myModal_detail_pro .form-group")[12].style.display = "none";
                                                $("#myModal_detail_pro .form-group")[13].style.display = "none";
                                                $("#myModal_detail_pro .form-group")[24].style.display = "none";
                                                //仓库一判断
                                                $("#pro_cabin1_price_detail").blur(function(){
                                                    if(Number($("#pro_cabin1_count_detail").val()) != 0){
                                                        if(Number($("#pro_cabin1_price_detail").val()) >=100 && Number($("#pro_cabin1_count_detail").val()) >= 1){
                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                        }
                                                    }else{
                                                        if(Number($("#pro_cabin1_price_detail").val()) == 0){
                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                        }
                                                    }

                                                });
                                                $("#pro_cabin1_count_detail").blur(function(){
                                                    if(Number($("#pro_cabin1_price_detail").val()) != 0){
                                                        if(Number($("#pro_cabin1_count_detail").val()) >= 1 && Number($("#pro_cabin1_price_detail").val()) >=100){
                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                        }
                                                    }else{
                                                        if((Number($("#pro_cabin1_count_detail").val()) == 0)){
                                                            $(".err_pro_cabin1_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin1_detail").css("display","inline-block")
                                                        }
                                                    }

                                                })
                                                //仓库二判断
                                                $("#pro_cabin2_price_detail").blur(function(){
                                                    if(Number($("#pro_cabin2_count_detail").val()) != 0){
                                                        if(Number($("#pro_cabin2_price_detail").val()) >=100 && Number($("#pro_cabin2_count_detail").val()) >= 1){
                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                        }
                                                    }else{
                                                        if((Number($("#pro_cabin2_price_detail").val()) == 0)){
                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                        }
                                                    }

                                                });
                                                $("#pro_cabin2_count_detail").blur(function(){
                                                    if(Number($("#pro_cabin2_price_detail").val()) != 0){
                                                        if(Number($("#pro_cabin2_count_detail").val()) >= 1 && Number($("#pro_cabin2_price_detail").val()) >=100){
                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                        }
                                                    }else{
                                                        if((Number($("#pro_cabin2_count_detail").val()) == 0)){
                                                            $(".err_pro_cabin2_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin2_detail").css("display","inline-block")
                                                        }
                                                    }

                                                })
                                                //仓库三判断
                                                $("#pro_cabin3_price_detail").blur(function(){
                                                    if(Number($("#pro_cabin3_count_detail").val()) != 0){
                                                        if(Number($("#pro_cabin3_price_detail").val()) >=100 && Number($("#pro_cabin3_count_detail").val()) >= 1){
                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                        }
                                                    }else{
                                                        if((Number($("#pro_cabin3_price_detail").val()) == 0)){
                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                        }
                                                    }

                                                });
                                                $("#pro_cabin3_count_detail").blur(function(){
                                                    if(Number($("#pro_cabin3_price_detail").val()) != 0){
                                                        if(Number($("#pro_cabin3_count_detail").val()) >= 1 && Number($("#pro_cabin3_price_detail").val()) >=100){
                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                        }
                                                    }else{
                                                        if((Number($("#pro_cabin3_count_detail").val()) == 0)){
                                                            $(".err_pro_cabin3_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin3_detail").css("display","inline-block")
                                                        }
                                                    }

                                                })
                                                //仓库四判断
                                                $("#pro_cabin4_price_detail").blur(function(){
                                                    if(Number($("#pro_cabin4_count_detail").val()) != 0){
                                                        if(Number($("#pro_cabin4_price_detail").val()) >=100 && Number($("#pro_cabin4_count_detail").val()) >= 1){
                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                        }
                                                    }else{
                                                        if((Number($("#pro_cabin4_price_detail").val()) == 0) ){
                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                        }
                                                    }

                                                });
                                                $("#pro_cabin4_count_detail").blur(function(){
                                                    if(Number($("#pro_cabin4_price_detail").val()) != 0){
                                                        if(Number($("#pro_cabin4_count_detail").val()) >= 1 && Number($("#pro_cabin4_price_detail").val()) >=100){
                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                        }
                                                    }else{
                                                        if((Number($("#pro_cabin4_count_detail").val()) == 0)){
                                                            $(".err_pro_cabin4_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin4_detail").css("display","inline-block")
                                                        }
                                                    }

                                                })
                                                //仓库五判断
                                                $("#pro_cabin5_price_detail").blur(function(){
                                                    if(Number($("#pro_cabin5_count_detail").val()) != 0){
                                                        if(Number($("#pro_cabin5_price_detail").val()) >=100 && Number($("#pro_cabin5_count_detail").val()) >= 1){
                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                        }
                                                    }else{
                                                        if((Number($("#pro_cabin5_price_detail").val()) == 0)){
                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                        }
                                                    }

                                                });
                                                $("#pro_cabin5_count_detail").blur(function(){
                                                    if(Number($("#pro_cabin5_price_detail").val()) != 0){
                                                        if(Number($("#pro_cabin5_count_detail").val()) >= 1 && Number($("#pro_cabin5_price_detail").val()) >=100){
                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                        }
                                                    }else{
                                                        if((Number($("#pro_cabin5_count_detail").val()) == 0)){
                                                            $(".err_pro_cabin5_detail").css("display","none")
                                                        }else{
                                                            $(".err_pro_cabin5_detail").css("display","inline-block")
                                                        }
                                                    }

                                                })
                                            }else{
                                                $(".cabin_detail").css("display","none");
                                                $("#myModal_detail_pro .form-group")[12].style.display = "inline-block";
                                                $("#myModal_detail_pro .form-group")[13].style.display = "inline-block";
                                                $("#myModal_detail_pro .form-group")[24].style.display = "inline-block";
                                            }

                                            // 设置二维码
                                            var url = 'http://wx.weiwuu.com/static/bonus.html?cid=' + _id + '&pid=' + _data.id;
                                            $("#pro_getBonus_detail").text(url);
                                                $('#pro_qrcode').html("");
                                            $('#pro_qrcode').qrcode({
                                                width: 200,
                                                height: 200,
                                                text: url,
                                                background: "#ffffff",
                                                foreground: "#2cb5a9"
                                            });

                                        })
                                    });

                                    //点击修改按钮提交信息
                                    $("#pro_change").off("click").click(function () {
                                        if (
                                            ($("#pro_name_detail").val() != "") &&
                                            ($("#pro_caption_detail").val() != "") &&
                                            ($("#pro_explication_detail").val() != "") &&
                                            ($("#pro_relatedUrl_detail").val() != "") &&
                                            (Number($("#pro_totalBonus_detail").val()) >= 0 ||($("#pro_useCabin_detail").val() == "true")) &&
                                            (Number($("#pro_remainAmount_detail").val()) >= 0 || ($("#pro_useCabin_detail").val() == "true")) &&
                                            (Number($("#pro_waitingTime_detail").val()) >= 0) &&
                                            (Number($("#pro_remainBonus_detail").val()) >= 0) &&
                                            (Number($("#pro_shareLimit_detail").val()) >= 0) &&
                                            ((Number($("#pro_varianceRatio_detail").val()) >= 10 && Number($("#pro_varianceRatio_detail").val()) <= 500)|| ($("#pro_useCabin_detail").val() == "true")|| (Number($("#pro_varianceRatio_detail").val())==0))
                                            &&
                                            ((Number($("#pro_cabin1_count_detail").val()) == 0 && Number($("#pro_cabin1_price_detail").val()) == 0) || (Number($("#pro_cabin1_count_detail").val()) >= 1 && Number($("#pro_cabin1_price_detail").val()) >= 100) || ($("#pro_useCabin_detail").val() == "false")) &&
                                            ((Number($("#pro_cabin2_count_detail").val()) == 0 && Number($("#pro_cabin2_price_detail").val()) == 0) || (Number($("#pro_cabin2_count_detail").val()) >= 1 && Number($("#pro_cabin2_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false")) &&
                                            ((Number($("#pro_cabin3_count_detail").val()) == 0 && Number($("#pro_cabin3_price_detail").val()) == 0) || (Number($("#pro_cabin3_count_detail").val()) >= 1 && Number($("#pro_cabin3_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false")) &&
                                            ((Number($("#pro_cabin4_count_detail").val()) == 0 && Number($("#pro_cabin4_price_detail").val()) == 0) || (Number($("#pro_cabin4_count_detail").val()) >= 1 && Number($("#pro_cabin4_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false")) &&
                                            ((Number($("#pro_cabin5_count_detail").val()) == 0 && Number($("#pro_cabin5_price_detail").val()) == 0) || (Number($("#pro_cabin5_count_detail").val()) >= 1 && Number($("#pro_cabin5_price_detail").val()) >= 100)|| ($("#pro_useCabin_detail").val() == "false"))
                                        ) {
                                            //将时间变成时间戳

                                            var open_at = $("#pro_openedAt_detail").val();
                                            var open_at_date = Date.parse(new Date(open_at));
                                            var open_at_long = open_at_date / 1000;

                                            var close_at = $("#pro_closedAt_detail").val();
                                            var close_at_date = Date.parse(new Date(close_at));
                                            var close_at_long = close_at_date / 1000;

                                            var jsonData = {
                                                "name": $("#pro_name_detail")[0].value,
                                                "notes": $("#pro_notes_detail")[0].value,
                                                "caption": $("#pro_name_detail")[0].value,
                                                "explication": $("#pro_explication_detail")[0].value,
                                                "related_url": $("#pro_relatedUrl_detail")[0].value,
                                                "master_url": $("#pro_masterUrl_detail")[0].value,
                                                "opened_at": open_at_long,
                                                "closed_at": close_at_long,
                                                "detail_url": $("#pro_detailUrl_detail")[0].value,
                                                "thanks_url": $("#pro_thanksUrl_detail")[0].value,
                                                "success_url": $("#pro_successUrl_detail")[0].value,
                                                "failure_url": $("#pro_failureUrl_detail")[0].value,
                                                "waiting_url": $("#pro_waitingUrl_detail")[0].value,
                                                "finished_url": $("#pro_finishedUrl_detail")[0].value,
                                                "remain_amount": Number($("#pro_remainAmount_detail")[0].value),
                                                "total_bonus": Number($("#pro_totalBonus_detail")[0].value),
                                                "share_limit": Number($("#pro_shareLimit_detail")[0].value),
                                                "share_vtour_id": Number($("#pro_shareVtourId_detail")[0].value),
                                                "remain_bonus": Number($("#pro_remainBonus_detail")[0].value),
                                                "waiting_time": Number($("#pro_waitingTime_detail")[0].value),
                                                "only_city": $("#pro_onlyCity_detail")[0].value,
                                                "only_weixin": $("#pro_onlyWeixin_detail option:selected").val() === "true",
                                                "enabled": $("#pro_enable_detail option:selected").val() === "true",
                                                "variance_ratio":Number($("#pro_varianceRatio_detail").val()),
                                                "use_cabin":$("#pro_useCabin_detail").val() === "true",
                                                "cabin1_price":Number($("#pro_cabin1_price_detail")[0].value),
                                                "cabin1_count":Number($("#pro_cabin1_count_detail")[0].value),
                                                "cabin2_price":Number($("#pro_cabin2_price_detail")[0].value),
                                                "cabin2_count":Number($("#pro_cabin2_count_detail")[0].value),
                                                "cabin3_price":Number($("#pro_cabin3_price_detail")[0].value),
                                                "cabin3_count":Number($("#pro_cabin3_count_detail")[0].value),
                                                "cabin4_price":Number($("#pro_cabin4_price_detail")[0].value),
                                                "cabin4_count":Number($("#pro_cabin4_count_detail")[0].value),
                                                "cabin5_price":Number($("#pro_cabin5_price_detail")[0].value),
                                                "cabin5_count":Number($("#pro_cabin5_count_detail")[0].value)

                                            };

                                            console.log(jsonData);
                                            $.ajax({
                                                type: "PUT",
                                                url: _url + "/client/" + _id + "/project/" + _this.parent().parent()[0].id,
                                                data: JSON.stringify(jsonData),
                                                success: function () {

                                                },
                                                error: function (res) {
                                                    if (res.status == 200) {
                                                        var pro_tr = _this.parent().parent()[0];
                                                        pro_tr.children[1].innerText = $("#pro_name_detail")[0].value;
                                                        pro_tr.children[2].innerText = $("#pro_notes_detail")[0].value;
                                                        pro_tr.children[3].innerText = $("#pro_caption_detail")[0].value;
                                                        pro_tr.children[4].innerText = $("#pro_totalBonus_detail")[0].value;
                                                        pro_tr.children[5].innerText = $("#pro_openedAt_detail")[0].value;
                                                        pro_tr.children[6].innerText = $("#pro_closedAt_detail")[0].value;
                                                        pro_tr.children[7].innerText = ($("#pro_onlyWeixin_detail")[0].value == "true") ? "是" : "否";
                                                    } else {
                                                        console.log(res.status)
                                                    }
                                                }
                                            });
                                        } else {
                                            alert("您所修改的信息有误！请重新修改")
                                        }
                                    });
                                });

                                //红包信息
                                $(".pro_bonus").off("click").click(function () {
                                    //将分页按钮隐藏/增加
                                    $("#pagination_cli").css("display", "none");
                                    $("#pagination_pro").css("display", "none");
                                    $("#pagination_bon").css("display", "block");
                                    $("#pagination_jou").css("display", "block");

                                    var _this = $(this).parent().parent();
                                    var _pid = $(this).parent().parent()[0].id;
                                    var _name = $(this).parent().parent().children()[1].innerText;//项目名称
                                    var _type = $(this).parent().parent().children()[0].innerText;//项目类型

                                    $(".bon_pro_name").text(_name+"的");
                                    $(".bon_pro_type").text('('+_type+')');


                                    $("#bonus").css("display", "block");
                                    $("#journal").css("display", "none");
                                    $("#report").css("display", "none");

                                    $("#changeContent .content").eq(2).show().siblings().hide();
                                    $("#bonus").addClass("red").siblings().removeClass("red");

                                    if (_this[0].children[0].innerText == "标准类型") {
                                        $(".bon_cash").css("display", "table-cell");
                                        $(".bon_lucky_code").css("display", "none");
                                        $(".bon_lottery_id").css("display", "none");
                                    } else if (_this[0].children[0].innerText == "实物类型") {
                                        $(".bon_cash").css("display", "none");
                                        $(".bon_lucky_code").css("display", "table-cell");
                                        $(".bon_lottery_id").css("display", "none");
                                    } else if (_this[0].children[0].innerText == "抽奖类型") {
                                        $(".bon_cash").css("display", "none");
                                        $(".bon_lucky_code").css("display", "none");
                                        $(".bon_lottery_id").css("display", "table-cell");
                                    }else if (_this[0].children[0].innerText == "分享有礼") {
                                        $(".bon_cash").css("display", "none");
                                        $(".bon_lucky_code").css("display", "table-cell");
                                        $(".bon_lottery_id").css("display", "none");
                                    }

                                    //动态加载红包
                                    function getBonusList(index, size, bonCallBack) {
                                        http('GET', _url + '/project/' + _pid + '/bonuses?index=' + index + '&size=' + size, 'arraybuffer', function (xhr) {
                                            var arrayBuffer = xhr.response;
                                            var byteArray = new Uint8Array(arrayBuffer);
                                            protobuf.load('./dist/proto/bonus.proto', function (err, root) {
                                                if (err)
                                                    throw err;
                                                var BonusList = root.lookupType('com.weiwuu.bonus.meta.BonusList');
                                                var message = BonusList.decode(byteArray);
                                                var _data = message.bonus;

                                                //红包回调函数
                                                bonCallBack(index, size, _data);

                                                //信息查询
                                                $("#bon_content").keyup(function () {
                                                    var _text = $("#bon_content").val();
                                                    $("#bon_table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                                                }).keyup();

                                                //点击详情
                                                $(".bon_info").click(function () {


                                                    var _bid = $(this).parent().parent()[0].id;

                                                    http('GET', _url + '/project/' + _pid + '/bonus/' + _bid, 'arraybuffer', function (xhr) {
                                                        var arrayBuffer = xhr.response;
                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                        protobuf.load('./dist/proto/bonus.proto', function (err, root) {
                                                            if (err)
                                                                throw err;
                                                            var Bonus = root.lookupType('com.weiwuu.bonus.meta.Bonus');
                                                            var _data = Bonus.decode(byteArray);
                                                            console.log(_data)
                                                            //定义日期格式
                                                            //开始时间
                                                            var create_date = new Date(_data.createdAt * 1000);
                                                            var create_y = create_date.getFullYear() + "-";

                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());

                                                            $("#bon_name")[0].value = _data.name;
                                                            $("#bon_notes")[0].value = _data.notes;
                                                            $("#bon_wx_name")[0].value = _data.wxName;
                                                            $("#bon_mobile")[0].value = _data.mobile;
                                                            $("#bon_wx_avatar")[0].innerHTML = '<img style="display: block;height:20px;margin:0 auto;" src="' + _data.wxAvatar + '"/>';
                                                            $("#bon_create_at")[0].value = create_y + create_M + create_d + create_h + create_m;
                                                            $("#bon_caption")[0].value = _data.caption;
                                                            $("#bon_explication")[0].value = _data.explication;
                                                            $("#bon_related_url")[0].value = _data.relatedUrl;
                                                            $("#bon_cash")[0].value = _data.bonusCash || "";
                                                            $("#bon_lucky_code")[0].value = _data.luckyCode || "";
                                                            $("#bon_lottery_id")[0].value = _data.lotteryId || "";
                                                            $("#bon_from_city")[0].value = _data.fromCity;
                                                            $("#bon_enable")[0].value = _data.enabled ? "是" : "否";
                                                        })
                                                    })
                                                })
                                            });
                                        });
                                    }

                                    http('GET', _url + '/project/' + _this[0].id + '/bonuses?index=0&size=10', 'arraybuffer', function (xhr) {
                                        var arrayBuffer = xhr.response;
                                        var byteArray = new Uint8Array(arrayBuffer);
                                        protobuf.load('./dist/proto/bonus.proto', function (err, root) {
                                            if (err)
                                                throw err;
                                            var BonusList = root.lookupType('com.weiwuu.bonus.meta.BonusList');

                                            var message = BonusList.decode(byteArray);
                                            var _lineCount = message.lineCount;

//分页部分
                                            $("#pagination_bon").pagination(_lineCount, {
                                                num_edge_entries: 2,
                                                num_display_entries: 4,
                                                callback: bonPageselectCallback,
                                                items_per_page: 500
                                            });
                                            function bonPageselectCallback(current_page) {
                                                getBonusList(current_page, 500, function (index_b, size_b, _data) {


                                                    $("#bon_table_info_tby").html("");
                                                    for (var i = 0; i < _data.length; i++) {
                                                        //开始时间
                                                        var create_date = new Date(_data[i].createdAt * 1000);
                                                        var create_y = create_date.getFullYear() + "-";

                                                        var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                        var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                        var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                        var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                        var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                        var tr = '<tr id="' + _data[i].id + '">' +
                                                            '<td class="bon_name">' + _data[i].name + '</td>' +
                                                            '<td class="bon_created_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                            '<td class="bon_wx_name">' + _data[i].wxName + '</td>' +
                                                            '<td class="bon_mobile">' + _data[i].mobile + '</td>' +
                                                            '<td class="bon_wx_avatar"><img style="display: block;height:40px;margin:0 auto;" src="' + _data[i].wxAvatar + '"</td>' +
                                                            '<td class="bon_cash">' + _data[i].bonusCash + '</td>' +
                                                            '<td class="bon_from_city">' + _data[i].fromCity + '</td>' +
                                                            '<td class="bon_op">' +
                                                            '<input class="bon_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_bon"' +
                                                            'value="详情"/>' +
                                                            '</td>' +
                                                            '</tr>';
                                                        $("#bon_table_info_tby").append(tr);
                                                    }
                                                })
                                            }

                                            $("#bon_table_info_tby").html("");
                                        })
                                    })

                                });

                                //日志信息
                                $(".pro_journal").off("click").click(function () {

                                    var _pid = $(this).parent().parent()[0].id;

                                    $("#bonus").css("display", "none");
                                    $("#journal").css("display", "block");
                                    $("#report").css("display", "none");

                                    $("#pagination_pro").css("display", "none");
                                    $("#pagination_cli").css("display", "none");
                                    $("#pagination_bon").css("display", "none");
                                    $("#pagination_jou").css("display", "block");

                                    var _name = $(this).parent().parent().children()[1].innerText
                                    $(".bon_pro_name").text(_name);

                                    $("#changeContent .content").eq(3).show().siblings().hide();
                                    $("#journal").addClass("red").siblings().removeClass("red");


                                    function getJournalList(index, size, jouCallBack) {
                                        http('GET', _url + '/project/' + _pid + '/journals?index=' + index + '&size=' + size, 'arraybuffer', function (xhr) {
                                            var arrayBuffer = xhr.response;
                                            var byteArray = new Uint8Array(arrayBuffer);
                                            protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                if (err)
                                                    throw err;
                                                var JournalList = root.lookupType('com.weiwuu.bonus.meta.JournalList');

                                                var message = JournalList.decode(byteArray);
                                                var _data = message.journal;

                                                //红包回调函数
                                                jouCallBack(index, size, _data);

                                                //信息查询
                                                $("#jou_content").keyup(function () {
                                                    var _text = $("#jou_content").val();
                                                    $("#jou_table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                                                }).keyup();

                                                //点击详情
                                                $(".jou_info").click(function () {
                                                    var _jid = $(this).parent().parent()[0].id;
                                                    http('GET', _url + '/project/' + _pid + '/journal/' + _jid, 'arraybuffer', function (xhr) {
                                                        var arrayBuffer = xhr.response;
                                                        var byteArray = new Uint8Array(arrayBuffer);
                                                        protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                            if (err)
                                                                throw(err);
                                                            var Journal = root.lookupType('com.weiwuu.bonus.meta.Journal');
                                                            var _data = Journal.decode(byteArray);

                                                            var create_date = new Date(_data.createdAt * 1000);
                                                            var create_y = create_date.getFullYear() + "-";

                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                            //将信息填充到日志详情中

                                                            $("#jou_from_city")[0].value = _data.fromCity;
                                                            $("#jou_bonus_cash")[0].value = _data.bonusCash || "";
                                                            $("#jou_lottery_id")[0].value = _data.lotteryId || "";
                                                            $("#jou_lucky_code")[0].value = _data.luckyCode || "";
                                                            $("#jou_wx_name")[0].value = _data.wxName;
                                                            $("#jou_wx_avatar").html('<img style="display:block;width:20px;" src="' + _data.wxAvatar + '"/>')
                                                            $("#jou_action")[0].value = _data.action;
                                                            $("#jou_description")[0].value = _data.description;
                                                            $("#jou_created_at")[0].value = create_y + create_M + create_d + create_h + create_m

                                                        })
                                                    })
                                                })

                                            });
                                        });
                                    }

                                    http('GET', _url + '/project/' + _pid + '/journals?index=0&size=10', 'arraybuffer', function (xhr) {
                                        var arrayBuffer = xhr.response;
                                        var byteArray = new Uint8Array(arrayBuffer);
                                        protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                            if (err)
                                                throw err;
                                            var JournalList = root.lookupType('com.weiwuu.bonus.meta.JournalList');
                                            var message = JournalList.decode(byteArray);

                                            var _lineCount = message.lineCount;
                                            var _data = message.journal;


                                            $("#pagination_jou").pagination(_lineCount, {
                                                num_edge_entries: 2,
                                                num_display_entries: 4,
                                                callback: jouPageselectCallback,
                                                items_per_page: 10
                                            });
                                            function jouPageselectCallback(current_page) {
                                                getJournalList(current_page, 10, function (index, size, _data) {
                                                    $("#jou_table_info_tby").html("");
                                                    for (var i = 0; i < _data.length; i++) {
                                                        //开始时间
                                                        var create_date = new Date(_data[i].createdAt * 1000);
                                                        var create_y = create_date.getFullYear() + "-";

                                                        var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                        var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                        var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                        var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                        var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                        var tr = '<tr id="' + _data[i].id + '">' +
                                                            '<td class="jou_created_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                            '<td class="jou_wx_name">' + _data[i].wxName + '</td>' +
                                                            '<td class="jou_wx_avatar"> <img style="display:block;width:50px;" src="' + _data[i].wxAvatar + '"/></td>' +
                                                            '<td class="jou_action">' + _data[i].action + '</td>' +
                                                            '<td class="jou_description">' + _data[i].description + '</td>' +
                                                            '<td class="jou_op">' +
                                                            '<input class="jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_jou"' +
                                                            'value="详情"/>' +
                                                            '</td>' +
                                                            '</tr>';
                                                        $("#jou_table_info_tby").append(tr);
                                                    }
                                                })
                                            }

                                            $("#jou_table_info_tby").html("");
                                        })
                                    })
                                });

                                //报告信息
                                $(".pro_report").off("click").click(function () {

                                    var _name = $(this).parent().parent().children()[1].innerText
                                    $(".bon_pro_name").text(_name);

                                    var _pid = $(this).parent().parent()[0].id;

                                    $("#bonus").css("display", "none");
                                    $("#journal").css("display", "none");
                                    $("#report").css("display", "block");

                                    $("#pagination_pro").css("display", "none");
                                    $("#pagination_rep").css("display", "block");

                                    $("#changeContent .content").eq(5).show().siblings().hide();
                                    $("#report").addClass("red").siblings().removeClass("red");

                                    //    点击按钮切换内容
                                    $(".report_include").eq(0).show().siblings().hide();

                                    $("#rep_btn li").off("click").click(function () {
                                        var _index = $(this).index();
                                        $(".report_include").eq(_index).show().siblings().hide();
                                    })

                                    http('GET', _url + '/project/' + _pid + '/report', 'arraybuffer', function (xhr) {
                                        var arrayBuffer = xhr.response;
                                        var byteArray = new Uint8Array(arrayBuffer);
                                        protobuf.load('./dist/proto/report.proto', function (err, root) {
                                            if (err)
                                                throw err;
                                            var Report = root.lookupType('com.weiwuu.bonus.meta.Report');
                                            var _data = Report.decode(byteArray);

                                            var _metrics = _data.metrics;
                                            var _journal = _data.journal;
                                            var _visit = _data.visit;


                                            if (_metrics == null) {
                                                //日志部分
                                                $("#pagination_rep_jou").pagination(_journal.length, {
                                                    num_edge_entries: 2,
                                                    num_display_entries: 4,
                                                    callback: repJouPageselectCallback,
                                                    items_per_page: 10
                                                });

                                                function repJouPageselectCallback(current_page) {

                                                    if ((current_page + 1) * 10 > _journal.length) {
                                                        $("#rep_jou_table_info_tby").html("");
                                                        for (var i = current_page * 10; i < _journal.length; i++) {

                                                            //开始时间
                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                            var create_y = create_date.getFullYear() + "-";

                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                '<td class="rep_jou_op">' +
                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                'value="详情"/>' +
                                                                '</td>'
                                                            '</tr>';
                                                            $("#rep_jou_table_info_tby").append(tr);
                                                        }
                                                    } else {
                                                        $("#rep_jou_table_info_tby").html("");
                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                            //开始时间
                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                            var create_y = create_date.getFullYear() + "-";

                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                '<td class="rep_jou_op">' +
                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                'value="详情"/>' +
                                                                '</td>' +
                                                                '</tr>';
                                                            $("#rep_jou_table_info_tby").append(tr);
                                                        }
                                                    }
                                                    $(".rep_jou_info").click(function () {
                                                        var _jid = $(this).parent().parent()[0].id

                                                        http('GET', _url + '/project/' + _pid + '/journal/' + _jid, 'arraybuffer', function (xhr) {
                                                            var arrayBuffer = xhr.response;
                                                            var byteArray = new Uint8Array(arrayBuffer);
                                                            protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                if (err)
                                                                    throw err;
                                                                var Journal = root.lookupType('com.weiwuu.bonus.meta.Journal');
                                                                var _data = Journal.decode(byteArray);

                                                                var create_date = new Date(_data.createdAt * 1000);
                                                                var create_y = create_date.getFullYear() + "-";

                                                                var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                                var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                //将信息填充到日志详情中

                                                                $("#rep_jou_from_city")[0].value = _data.fromCity;
                                                                $("#rep_jou_bonus_cash")[0].value = _data.bonusCash || "";
                                                                $("#rep_jou_lottery_id")[0].value = _data.lotteryId || "";
                                                                $("#rep_jou_lucky_code")[0].value = _data.luckyCode || "";
                                                                $("#rep_jou_wx_name")[0].value = _data.wxName;
                                                                $("#rep_jou_wx_avatar").html('<img style="display:block;width:20px;" src="' + _data.wxAvatar + '"/>')
                                                                $("#rep_jou_action")[0].value = _data.action;
                                                                $("#rep_jou_description")[0].value = _data.description;
                                                                $("#rep_jou_created_at")[0].value = create_y + create_M + create_d + create_h + create_m + create_s
                                                            })
                                                        })
                                                    })
                                                }

                                                //访问部分
                                                $("#pagination_vis_jou").pagination(_visit.length, {
                                                    num_edge_entries: 2,
                                                    num_display_entries: 4,
                                                    callback: repVisPageselectCallback,
                                                    items_per_page: 10
                                                });

                                                function repVisPageselectCallback(current_page) {
                                                    if ((current_page + 1) * 10 > _visit.length) {
                                                        $("#rep_vis_table_info_tby").html("");
                                                        for (var i = current_page * 10; i < _visit.length; i++) {

                                                            //开始时间
                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                            var create_y = create_date.getFullYear() + "-";

                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                            //更新时间
                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                            var update_y = update_date.getFullYear() + "-";

                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + ":";
                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                '<td>' + update_y + update_M + update_d + update_h + update_m + update_s + '</td>' +
                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                '<td>' + _visit[i].description + '</td>' +
                                                                '</tr>';
                                                            $("#rep_vis_table_info_tby").append(tr);
                                                        }
                                                    } else {
                                                        $("#rep_vis_table_info_tby").html("");
                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                            //开始时间
                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                            var create_y = create_date.getFullYear() + "-";

                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + ":";
                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                            //更新时间
                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                            var update_y = update_date.getFullYear() + "-";

                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + ":";
                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + create_s + '</td>' +
                                                                '<td>' + update_y + update_M + update_d + update_h + update_m + update_s + '</td>' +
                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                '<td>' + _visit[i].description + '</td>' +
                                                                '</tr>';
                                                            $("#rep_vis_table_info_tby").append(tr);
                                                        }
                                                    }
                                                }
                                            } else {
                                                var create_date = new Date(_metrics.createdAt * 1000);
                                                var create_y = create_date.getFullYear() + "-";

                                                var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());

                                                //结束时间
                                                var updated_date = new Date(_metrics.createdAt * 1000);
                                                var updated_y = updated_date.getFullYear() + "-";

                                                var updated_M = ((updated_date.getMonth() + 1) < 10 ? "0" + (updated_date.getMonth() + 1) : (updated_date.getMonth() + 1)) + "-";
                                                var updated_d = (updated_date.getDate() < 10 ? "0" + updated_date.getDate() : updated_date.getDate()) + " ";
                                                var updated_h = (updated_date.getHours() < 10 ? "0" + updated_date.getHours() : updated_date.getHours()) + ":";
                                                var updated_m = (updated_date.getMinutes() < 10 ? "0" + updated_date.getMinutes() : updated_date.getMinutes()) + "";
                                                var updated_s = (updated_date.getSeconds() < 10 ? "0" + updated_date.getSeconds() : updated_date.getSeconds());
                                                $('.met_view_count').text(_metrics.viewCount);
                                                $('.met_drawing_count').text(_metrics.drawingCount);
                                                $('.met_share_count').text(_metrics.shareCount);
                                                $('.met_comment_count').text(_metrics.commentCount);
                                                $(".met_apply_count").text(_metrics.applyCount);
                                                $(".met_click_count").text(_metrics.clickCount);
                                                $(".met_obtain_count").text(_metrics.obtainCount);
                                                $(".met_created_at").text(create_y + create_M + create_d + create_h + create_m );
                                                $(".met_updated_at").text(updated_y + updated_M + updated_d + updated_h + updated_m );

                                                //日志部分
                                                $("#pagination_rep_jou").pagination(_journal.length, {
                                                    num_edge_entries: 2,
                                                    num_display_entries: 4,
                                                    callback: repJouPageselectCallback,
                                                    items_per_page: 10
                                                });

                                                function repJouPageselectCallback(current_page) {

                                                    if ((current_page + 1) * 10 > _journal.length) {
                                                        $("#rep_jou_table_info_tby").html("");
                                                        for (var i = current_page * 10; i < _journal.length; i++) {

                                                            //开始时间
                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                            var create_y = create_date.getFullYear() + "-";

                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                '<td class="rep_jou_op">' +
                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                'value="详情"/>' +
                                                                '</td>'
                                                            '</tr>';
                                                            $("#rep_jou_table_info_tby").append(tr);
                                                        }
                                                    } else {
                                                        $("#rep_jou_table_info_tby").html("");
                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                            //开始时间
                                                            var create_date = new Date(_journal[i].createdAt * 1000);
                                                            var create_y = create_date.getFullYear() + "-";

                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                            var tr = '<tr id="' + _journal[i].id + '">' +
                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m +  '</td>' +
                                                                '<td class="rep_jou_wx_name">' + _journal[i].wxName + '</td>' +
                                                                '<td class="rep_jou_wx_avatar"><img style="display: block;width:50px;" src="' + _journal[i].wxAvatar + '"/></td>' +
                                                                '<td class="rep_jou_action">' + _journal[i].action + '</td>' +
                                                                '<td class="rep_jou_description">' + _journal[i].description + '</td>' +
                                                                '<td class="rep_jou_op">' +
                                                                '<input class="rep_jou_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_rep_jou"' +
                                                                'value="详情"/>' +
                                                                '</td>' +
                                                                '</tr>';
                                                            $("#rep_jou_table_info_tby").append(tr);
                                                        }
                                                    }
                                                    $(".rep_jou_info").click(function () {
                                                        var _jid = $(this).parent().parent()[0].id

                                                        http('GET', _url + '/project/' + _pid + '/journal/' + _jid, 'arraybuffer', function (xhr) {
                                                            var arrayBuffer = xhr.response;
                                                            var byteArray = new Uint8Array(arrayBuffer);
                                                            protobuf.load('./dist/proto/journal.proto', function (err, root) {
                                                                if (err)
                                                                    throw err;
                                                                var Journal = root.lookupType('com.weiwuu.bonus.meta.Journal');
                                                                var _data = Journal.decode(byteArray);


                                                                var create_date = new Date(_data.createdAt * 1000);
                                                                var create_y = create_date.getFullYear() + "-";

                                                                var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                                var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                                var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                                var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                                var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                                //将信息填充到日志详情中

                                                                $("#rep_jou_from_city")[0].value = _data.fromCity;
                                                                $("#rep_jou_bonus_cash")[0].value = _data.bonusCash || "";
                                                                $("#rep_jou_lottery_id")[0].value = _data.lotteryId || "";
                                                                $("#rep_jou_lucky_code")[0].value = _data.luckyCode || "";
                                                                $("#rep_jou_wx_name")[0].value = _data.wxName;
                                                                $("#rep_jou_wx_avatar").html('<img style="display:block;width:20px;" src="' + _data.wxAvatar + '"/>')
                                                                $("#rep_jou_action")[0].value = _data.action;
                                                                $("#rep_jou_description")[0].value = _data.description;
                                                                $("#rep_jou_created_at")[0].value = create_y + create_M + create_d + create_h + create_m
                                                            })
                                                        })
                                                    })
                                                }

                                                //访问部分
                                                $("#pagination_vis_jou").pagination(_visit.length, {
                                                    num_edge_entries: 2,
                                                    num_display_entries: 4,
                                                    callback: repVisPageselectCallback,
                                                    items_per_page: 10
                                                });

                                                function repVisPageselectCallback(current_page) {
                                                    if ((current_page + 1) * 10 > _visit.length) {
                                                        $("#rep_vis_table_info_tby").html("");
                                                        for (var i = current_page * 10; i < _visit.length; i++) {

                                                            //开始时间
                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                            var create_y = create_date.getFullYear() + "-";

                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                            //更新时间
                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                            var update_y = update_date.getFullYear() + "-";

                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + "";
                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m +  '</td>' +
                                                                '<td>' + update_y + update_M + update_d + update_h + update_m  + '</td>' +
                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                '<td>' + _visit[i].description + '</td>' +
                                                                '</tr>';
                                                            $("#rep_vis_table_info_tby").append(tr);
                                                        }
                                                    } else {
                                                        $("#rep_vis_table_info_tby").html("");
                                                        for (var i = current_page * 10; i < (current_page + 1) * 10; i++) {

                                                            //开始时间
                                                            var create_date = new Date(_visit[i].createdAt * 1000);
                                                            var create_y = create_date.getFullYear() + "-";

                                                            var create_M = ((create_date.getMonth() + 1) < 10 ? "0" + (create_date.getMonth() + 1) : (create_date.getMonth() + 1)) + "-";
                                                            var create_d = (create_date.getDate() < 10 ? "0" + create_date.getDate() : create_date.getDate()) + " ";
                                                            var create_h = (create_date.getHours() < 10 ? "0" + create_date.getHours() : create_date.getHours()) + ":";
                                                            var create_m = (create_date.getMinutes() < 10 ? "0" + create_date.getMinutes() : create_date.getMinutes()) + "";
                                                            var create_s = (create_date.getSeconds() < 10 ? "0" + create_date.getSeconds() : create_date.getSeconds());
                                                            //更新时间
                                                            var update_date = new Date(_visit[i].updatedAt * 1000);
                                                            var update_y = update_date.getFullYear() + "-";

                                                            var update_M = ((update_date.getMonth() + 1) < 10 ? "0" + (update_date.getMonth() + 1) : (update_date.getMonth() + 1)) + "-";
                                                            var update_d = (update_date.getDate() < 10 ? "0" + update_date.getDate() : update_date.getDate()) + " ";
                                                            var update_h = (update_date.getHours() < 10 ? "0" + update_date.getHours() : update_date.getHours()) + ":";
                                                            var update_m = (update_date.getMinutes() < 10 ? "0" + update_date.getMinutes() : update_date.getMinutes()) + "";
                                                            var update_s = (update_date.getSeconds() < 10 ? "0" + update_date.getSeconds() : update_date.getSeconds());
                                                            var tr = '<tr id="' + _visit[i].id + '">' +
                                                                '<td class="rep_jou_create_at">' + create_y + create_M + create_d + create_h + create_m + '</td>' +
                                                                '<td>' + update_y + update_M + update_d + update_h + update_m +  '</td>' +
                                                                '<td>' + _visit[i].ipAddress + '</td>' +
                                                                '<td>' + _visit[i].fromCity + '</td>' +
                                                                '<td>' + _visit[i].visitCount + '</td>' +
                                                                '<td>' + _visit[i].description + '</td>' +
                                                                '</tr>';
                                                            $("#rep_vis_table_info_tby").append(tr);
                                                        }
                                                    }
                                                }
                                            }
                                        })
                                    })
                                })
                            });
                        });
                    }

                    http('GET', _url + '/client/' + _id + '/projects?index=0&size=10', 'arraybuffer', function (xhr) {
                        var arrayBuffer = xhr.response;
                        var byteArray = new Uint8Array(arrayBuffer);
                        protobuf.load("./dist/proto/project.proto", function (err, root) {
                            if (err)
                                throw err;

                            var ProjectList = root.lookupType("com.weiwuu.bonus.meta.ProjectList");
                            var message = ProjectList.decode(byteArray);
                            var _lineCount = message.lineCount;
                            var _pageCount = message.pageCount;
                            var _data = message.project;


                            var projectArr = ["标准类型", "实物类型", "抽奖类型", "分享有礼"];

                            //分页部分
                            $("#pagination_pro").pagination(_lineCount, {
                                num_edge_entries: 2,
                                num_display_entries: 4,
                                callback: proPageselectCallback,
                                items_per_page: 10
                            });

                            function proPageselectCallback(current_page) {
                                getProjectList(current_page, 10, function (index_p, size_p, _data) {
                                    $("#pro_table_info_tby").html("");
                                    //将该项目信息展示出来
                                    for (var i = 0; i < _data.length; i++) {

                                        //定义日期格式
                                        //开始时间
                                        var open_date = new Date(_data[i].openedAt * 1000);
                                        var open_y = open_date.getFullYear() + "-";
                                        var open_M = ((open_date.getMonth() + 1) < 10 ? "0" + (open_date.getMonth() + 1) : (open_date.getMonth() + 1)) + "-";
                                        var open_d = (open_date.getDate() < 10 ? "0" + open_date.getDate() : open_date.getDate()) + " ";
                                        var open_h = (open_date.getHours() < 10 ? "0" + open_date.getHours() : open_date.getHours()) + ":";
                                        var open_m = (open_date.getMinutes() < 10 ? "0" + open_date.getMinutes() : open_date.getMinutes()) + "";
                                        var open_s = (open_date.getSeconds() < 10 ? "0" + open_date.getSeconds() : open_date.getSeconds());

                                        //结束时间
                                        var close_date = new Date(_data[i].closedAt * 1000);
                                        var close_y = close_date.getFullYear() + "-";
                                        var close_M = ((close_date.getMonth() + 1) < 10 ? "0" + (close_date.getMonth() + 1) : (close_date.getMonth() + 1)) + "-";
                                        var close_d = (close_date.getDate() < 10 ? "0" + close_date.getDate() : close_date.getDate()) + " ";
                                        var close_h = (close_date.getHours() < 10 ? "0" + close_date.getHours() : close_date.getHours()) + ":";
                                        var close_m = (close_date.getMinutes() < 10 ? "0" + close_date.getMinutes() : close_date.getMinutes()) + "";
                                        var close_s = (close_date.getSeconds() < 10 ? "0" + close_date.getSeconds() : close_date.getSeconds());
                                        //将项目的信息展示出来
                                        var tr = '<tr id="' + _data[i].id + '">' +
                                            '<td class="pro_type">' + projectArr[_data[i].type] + '</td>' +
                                            '<td class="pro_name">' + _data[i].name + '</td>' +
                                            '<td class="pro_notes">' + _data[i].notes + '</td>' +
                                            '<td class="pro_caption">' + _data[i].caption + '</td>' +
                                            '<td class="pro_totalBonus">' + _data[i].totalBonus + '</td>' +
                                            '<td class="pro_openedAt">' + open_y + open_M + open_d + open_h + open_m +'</td>' +
                                            '<td class="pro_closedAt">' + close_y + close_M + close_d + close_h + close_m +  '</td>' +
                                            '<td class="pro_enable">' + (_data[i].onlyWeixin ? "是" : "否") + '</td>' +
                                            '<td class="pro_op">' +
                                            '<input class="pro_del btn btn-danger" type="button" style="margin-right:4px;" value="删除"/>' +
                                            '<input class="pro_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail_pro"' +
                                            'value="详情"/>' +
                                            '<input class="pro_bonus btn btn-primary" type="button" style="margin-left:4px;" value="红包">' +
                                            '<input class="pro_journal btn btn-primary" style="margin-left:4px;" type="button" value="日志"/>' +
                                            '<input class="pro_report btn btn-primary" style="margin-left:4px;" type="button" value="报告"/>' +
                                            '</td>' +
                                            '</tr>';
                                        $("#pro_table_info_tby").append(tr);
                                    }
                                })
                                $("#pro_table_info_tby").html("");
                            }

                            $("#pro_table_info_tby").html("");
                        })
                    })
                });
                _click();
            });
        });
    };

    _click();

    //初始委托人加载信息
    http('GET', _url + '/clients?index=0&size=10', 'arraybuffer', function (xhr) {
        var arrayBuffer = xhr.response;             //返回数据
        var byteArray = new Uint8Array(arrayBuffer);//编译数组
        protobuf.load("./dist/proto/client.proto", function (err, root) {
            if (err)
                throw err;
            // Obtain a message type
            var ClientList = root.lookupType("com.weiwuu.bonus.meta.ClientList");
            // Decode an Uint8Array (browser) or Buffer (node) to a message
            var message = ClientList.decode(byteArray);
            var _lineCount = message.lineCount;//获取数据总条数


            //开发商类型数组
            var typeArr = ["开发商", "媒体", "中介", "", "", "", "", "", "", "其它类型"];

            $("#pagination_pro").css("display", "none");
            //分页部分
            $("#pagination_cli").pagination(_lineCount, {
                num_edge_entries: 2,
                num_display_entries: 4,
                callback: pageselectCallback,
                items_per_page: 10
            });

            function pageselectCallback(current_page) {

                getClientList(current_page, 10, function (index, size, _data) {

                    $("#table_info_tby").html("");

                    //初始情况下循环出列表内容
                    for (var i = 0; i < _data.length; i++) {
                        var tr = '<tr id="' + _data[i].id + '">' +
                            '<td class="cli_type">' + typeArr[_data[i].type] + '</td>' +
                            '<td class="cli_name">' + _data[i].name + '</td>' +
                            '<td class="cli_con_name">' + _data[i].contactName + '</td>' +
                            '<td class="cli_con_phone">' + _data[i].contactPhone + '</td>' +
                            '<td class="cli_con_mail">' + _data[i].contactEmail + '</td>' +
                            '<td class="cli_remain_reserve">' + _data[i].remainReserve + '</td>' +
                            '<td class="cli_total_expenses">' + _data[i].totalExpenses + '</td>' +
                            '<td class="cli_bonus_count">' + _data[i].bonusCount + '</td>' +
                            '<td class="cli_action_count">' + _data[i].actionCount + '</td>' +
                            '<td class="cli_enable">' + (_data[i].enabled ? "是" : "否") + '</td>' +
                            '<td class="cli_op">' +
                            '<input class="cli_del btn btn-danger" style="margin-right:4px;" type="button" value="删除"/>' +
                            '<input class="cli_info btn btn-warning" type="button" data-toggle="modal" data-target="#myModal_detail" value="详情"/>' +
                            '<input class="cli_project btn btn-success" style="margin-left:4px;" type="button" value="项目"/>' +
                            '</td>' +
                            '</tr>';
                        $("#table_info_tby").append(tr);
                    }
                    ;
                })
            }
        });
    });

    //拦截部分
    $("#block").click(function () {

        //对翻页按钮进行操作
        $("#pagination_cli").css("display", "none");
        $("#pagination_pro").css("display", "none");
        $("#pagination_bon").css("display", "none");

        $("#changeContent .content").eq(4).show().siblings().hide();
        $("#block").addClass("red").siblings().removeClass("red");

        function getBlockList(index, size, bloCallBack) {
            $.ajax({
                type:'GET',
                url:_url + '/blocks?index=' + index + '&size=' + size,
                dataType:'json',
                data:{},
                success:function (data) {
                    var data = data.body.data;
                    var _data = eval(data);
                    bloCallBack(index, size, _data);

                    //黑名单查询
                    $("#blo_content").keyup(function () {
                        var _text = $("#blo_content").val();
                        $("#blo_table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                    }).keyup();

                    //黑名单删除
                    $(".blo_del").off("click").click(function () {
                        var _this = $(this);
                        var _con = confirm("确认删除该条数据吗？")
                        if (_con == true) {
                            _this.parent().parent().remove();
                            var _id = _this.parent().parent()[0].id;
                            $.ajax({
                                type: "DELETE",
                                url: _url + "/block/" + _id,
                                data: {},
                                dataType: 'json',
                                success: function () {

                                }
                            })
                        } else {

                        }
                    });

                    //黑名单增加
                    $("#blo_add").off("click").click(function () {
                        $(".modal-body input").val("");

                        //检测ip地址
                        $("#blo_ipAddress").blur(function(){
                            if(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test($("#blo_ipAddress").val())){
                                $(".err_blo_ip_address").css('display','none');
                            }else{
                                $(".err_blo_ip_address").css('display','block');
                            }
                        })

                        //提交黑名单信息
                        $("#blo_sub").off("click").click(function () {

                            //判断是否可以进行提交
                            if(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test($("#blo_ipAddress").val())){

                                //进行数据提交
                                http('GET', _url + '/id', 'arraybuffer', function (xhr) {
                                    var arrayBuffer = xhr.response;
                                    var byteArray = new Uint8Array(arrayBuffer);
                                    protobuf.load("./dist/proto/feedback.proto", function (err, root) {
                                        if (err)
                                            throw err;
                                        // Obtain a message type
                                        var Feedback = root.lookupType("com.weiwuu.krpano.meta.Feedback");
                                        // Decode an Uint8Array (browser) or Buffer (node) to a message
                                        var message = Feedback.decode(byteArray);
                                        var _id = message.longValue;

                                        var jsonData = {
                                            'ip_address':$("#blo_ipAddress").val(),
                                            'description':$("#blo_description").val()
                                        }

                                        $.ajax({
                                            type: "POST",
                                            contentType: "application/json;charset=utf-8",
                                            url: _url + "/block/" + _id,
                                            data: JSON.stringify(jsonData),
                                            dataType: "json",
                                            success: function (data) {

                                            },
                                            error:function(res){
                                                if(res.status == 200){
                                                    var tr = '<tr id="' + _id + '">' +
                                                        '<td class="blo_ip_address">' + $("#blo_ipAddress").val() + '</td>' +
                                                        '<td class="blo_from_city">' + "" + '</td>' +
                                                        '<td class="blo_block_count">' + "" + '</td>' +
                                                        '<td class="blo_description">' + $("#blo_description").val() + '</td>' +
                                                        '<td class="blo_created_at">' + "" + '</td>' +
                                                        '<td class="blo_updated_at">' + "" + '</td>' +
                                                        '<td class="blo_op">' +
                                                        '<input class="blo_del btn btn-danger" style="margin-right:4px;" type="button" value="删除"/>' +
                                                        '</td>' +
                                                        '</tr>';
                                                    $("#blo_table_info_tby").append(tr);

                                                    //增加黑名单后查询
                                                    $("#blo_content").keyup(function () {
                                                        var _text = $("#blo_content").val();
                                                        $("#blo_table_info_tby tr").hide().filter(":contains('" + _text + "')").show();
                                                    }).keyup();

                                                    //增加黑名单后删除
                                                    $(".blo_del").off("click").click(function () {
                                                        var _this = $(this);
                                                        var _con = confirm("确认删除该条数据吗？")
                                                        if (_con == true) {
                                                            _this.parent().parent().remove();
                                                            var _id = _this.parent().parent()[0].id;
                                                            $.ajax({
                                                                type: "DELETE",
                                                                url: _url + "/block/" + _id,
                                                                data: {},
                                                                dataType: 'json',
                                                                success: function () {

                                                                }
                                                            })
                                                        } else {

                                                        }
                                                    });

                                                }else{
                                                    console.log(res.status);
                                                }
                                            }
                                        })
                                    })
                                })
                            }else{
                                console.log("提交失败")
                            }
                        })
                    })
                },
                error:function (res) {
                    console.log(res.status);
                }
            });
        }

        $.ajax({
            type:'GET',
            url:_url + '/blocks?index=0&size=10',
            dataType:'json',
            data:{

            },
            success:function(data){
                var _lineCount = data.body.data.length;
                $("#pagination_blo").pagination(_lineCount, {
                    num_edge_entries: 2,
                    num_display_entries: 4,
                    callback: bloPageselectCallback,
                    items_per_page: 10
                });
                function bloPageselectCallback(current_page) {
                    getBlockList(current_page, 10, function (index, size, _data) {
                        $("#blo_table_info_tby").html("");

                        //加载拦截数据
                        for (var i = 0; i < _data.length; i++) {
                            //时间转化
                            var created_date = new Date(_data[i].createdAt_ * 1000);
                            var create_y = created_date.getFullYear() + "-";
                            var create_M = ((created_date.getMonth() + 1) < 10 ? "0" + (created_date.getMonth() + 1) : (created_date.getMonth() + 1)) + "-";
                            var create_d = (created_date.getDate() < 10 ? "0" + created_date.getDate() : created_date.getDate()) + " ";
                            var create_h = (created_date.getHours() < 10 ? "0" + created_date.getHours() : created_date.getHours()) + ":";
                            var create_m = (created_date.getMinutes() < 10 ? "0" + created_date.getMinutes() : created_date.getMinutes()) + "";
                            var create_s = (created_date.getSeconds() < 10 ? "0" + created_date.getSeconds() : created_date.getSeconds());
                            //时间转化
                            var updated_date = new Date(_data[i].updatedAt_ * 1000);
                            var update_y = updated_date.getFullYear() + "-";
                            var update_M = ((updated_date.getMonth() + 1) < 10 ? "0" + (updated_date.getMonth() + 1) : (updated_date.getMonth() + 1)) + "-";
                            var update_d = (updated_date.getDate() < 10 ? "0" + updated_date.getDate() : updated_date.getDate()) + " ";
                            var update_h = (updated_date.getHours() < 10 ? "0" + updated_date.getHours() : updated_date.getHours()) + ":";
                            var update_m = (updated_date.getMinutes() < 10 ? "0" + updated_date.getMinutes() : updated_date.getMinutes()) + "";
                            var update_s = (updated_date.getSeconds() < 10 ? "0" + updated_date.getSeconds() : updated_date.getSeconds());
                            var tr = '<tr id = "' + _data[i].id_ + '">' +
                                '<td class="blo_ip_address">' + _data[i].ipAddress_ + '</td>' +
                                '<td class="blo_from_city">' + _data[i].fromCity_ + '</td>' +
                                '<td class="blo_block_count">' + _data[i].blockCount_ + '</td>' +
                                '<td class="blo_description">' + _data[i].description_ + '</td>' +
                                '<td class="blo_created_at">' + create_y + create_M + create_d + create_h + create_m  + '</td>' +
                                '<td class="blo_updated_at">' + update_y + update_M + update_d + update_h + update_m + '</td>' +
                                '<td class="blo_op">' +
                                '<input class="blo_del btn btn-danger" style="margin-right:4px;" type="button" value="删除"/>' +
                                '</td>' +
                                '</tr>';
                            $("#blo_table_info_tby").append(tr);
                        }
                    })
                }
            }
        })

    });

});