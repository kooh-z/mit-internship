//ログインボタンクリック時の処理
function onButtonClick() {

    //遷移先URL
    mypage = "main.html";

    //値取得
    target1 = document.getElementById("output1");
    target2 = document.getElementById("output2");
    target1.innerText = document.forms.form1.idTextBox1.value;
    target2.innerText = document.forms.form1.idTextBox2.value;
    $.getScript("/js/sha1.js", function () {

        //パスワードをハッシュ値に変換しcookieに保存
        $.cookie("pass", hex_sha1(target2.innerText));

        //トークン設定
        if (target1.innerText == "mikami" && $.cookie("pass") == "64bd1838d5106e7a2b2a7121d53e3596acf4256a") {
            $.cookie("ClientToken", "PyCUtW8se24UaqTBuzov8Pi0ERs1NH9xHDIQZgJt2dynRD60n9DlXyBOwsZPz4hxCQwDi-1C5R0QaHpOFMPvOCv6UyDmAybilv6pOoUoG7U6K9RlA8XM9A==");
            document.location.href = mypage;
        }
        else if (target1.innerText == "arai" && $.cookie("pass") == "e4955a5d7cefd890d5aace28bc74a199f0e31ace") {
            $.cookie("ClientToken", "8vXkD0tUrR225EaLE8EaB9T80Me94Lbey8U12cCFfV_ulDHZitNWk3B1XXPAR6kb4WSC8CcaZozDxsXoKvbIWJmosLEjQziqEYUUnQLSVVcomvJ33qOJcA==");
            document.location.href = mypage;
        }
    else if (target1.innerText == "yamanashi" && $.cookie("pass") == "a062f8a130c6b5bb1b6dc87c22cd5566fc72faa2") {
            $.cookie("ClientToken", "alhYo3qsZXdVbxQk3f-eNApkEgNt7MKLirm-fwL8d6HXQnEpyDvp1u3dc9aaHchq4SsEtyBNxs9N9IDALjZHpCndT9mdfKjCtlzsmpEhvtsYOWw9ebGQPg==");
            document.location.href = mypage;
        }
    else if (target1.innerText == "kanome" && $.cookie("pass") == "9280b7c1a30830556fc0536653710730dc0b233b") {
            $.cookie("ClientToken", "YX_bRWpawe665vy9Ak6DL7QBvZiN7gHtjqvO04ISmOo0Y4RdC50_vTpfHVPmHO2Aik4AkTZKCZ-Y1pkCjL7AymWS5O2Gn8YrIe4YWQbsTHbvAwrcPnVSuA==");
            document.location.href = mypage;
        }
        else {
            //ログイン名違う場合
            alert("このアカウント名は不正です");
            $.removeCookie("pass");
        }
    });
}