/**
 * Created by dh on 2017/4/27.
 */
function http(methods, url, responseType, func){
    var _id = 0;//定义id
    //在页面初始的情况下获取id
    var xhr = new XMLHttpRequest();
    xhr.open(
        methods,
        url,
        true
    );
    xhr.responseType = responseType;
    xhr.onload = function (evt) {
        func(xhr)

    }
    xhr.send(null);
}