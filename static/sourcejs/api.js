var TEMPLATE_CACHE = {}
var API = (function() {
    var url = '/* @echo api */'
    return {
        init: function() {
            // @if local
            Cookies.set('token', '模拟token数据')
            // @endif
            $.ajaxSetup({
                dataType: 'json',
                data: {
                    // 自动带上 token 信息，也可放在 header 里
                    token: Cookies.get('token')
                },
                beforeSend: function(jqxhr, settings) {
                    // 此处可在请求提交前做 token 校验，如果失效则触发其它操作，比如跳转页面去登录
                    // if (new Date().getTime() > Cookies.get('tokentime') * 1000) {
                    //     MEMBER.logout()
                    //     MEMBER.checkLoginAndJump()
                    //     return false
                    // }
                }
            })
        },
        url: function() {
            return url
        },
        /**
         * 该方法通常在请求成功时先调用一次做数据校验
         * $.ajax().done(function(res){
         *     if(API.checkCallback(res)){
         *         ...
         *     }
         * })
         */
        checkCallback: function(data) {
            // var flag = true
            // if (data.error != '') {
            //     if (data.status == 1) {
            //         swal({
            //             icon: 'error',
            //             title: '操作失败',
            //             text: data.error,
            //             timer: 2000,
            //             button: false
            //         })
            //     } else {
            //         swal({
            //             icon: 'error',
            //             title: '系统提示',
            //             text: data.error,
            //             button: {
            //                 text: '去登录'
            //             }
            //         }).then(function() {
            //             MEMBER.logout()
            //             MEMBER.checkLoginAndJump()
            //         })
            //     }
            //     flag = false
            // }
            // return flag
        },
        // 获取 url 参数
        getParameter: function() {
            var url = location.search
            var parameter = new Object()
            if (url.indexOf('?') != -1) {
                var strs = url.substr(1).split('&')
                for (var i = 0; i < strs.length; i++) {
                    parameter[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1])
                }
            }
            return parameter
        },
        /**
         * 渲染模版文件，确保页面已经引入 art-template 插件，使用方法：
         * API.template('template目录下文件名', data)
         */
        template: function(file, data) {
            var html
            if (TEMPLATE_CACHE.hasOwnProperty(file)) {
                html = TEMPLATE_CACHE[file](data)
            } else {
                $.ajax({
                    type: 'GET',
                    url: location.origin + '/static/template/' + file + '.html',
                    dataType: 'text',
                    async: false
                }).done(function(cb) {
                    var render = template.compile(cb)
                    html = render(data)
                    TEMPLATE_CACHE[file] = render
                })
            }
            return html
        }
    }
})()
