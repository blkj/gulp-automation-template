var MEMBER = (function() {
    return {
        isLogin: function() {
            var flag = true
            if (Cookies.get('token') == undefined) {
                flag = false
            }
            return flag
        },
        login: function() {
            if (!MEMBER.isLogin()) {
                location.href = location.origin + '/login.html?redirect_url=' + encodeURIComponent(location.href)
                return false
            }
        },
        logout: function() {
            Cookies.remove('token')
            Cookies.remove('tokentime')
        }
    }
})()
