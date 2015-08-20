function logout() {
    $.removeCookie("ClientToken");
    $.removeCookie("pass");
    alert("ログアウトできました");
}