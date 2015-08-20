$(function () {
    try {
        getUserProfile()
            .done(function (data) {
                console.log(data.profile);
                console.log(data.profile.nickName);
                console.log(data.profile.height);
                $("h1 > em").text(data.profile.nickName);
                $("#heightCount").text(data.profile.height);
            });

        var today = new Date();
        var xday = new Date();
        var x = -7;
        xday.setDate(today.getDate() + x);
        var startDate = getDateformat(xday);
        var endDate = getDateformat(today);

        getBodyComp(startDate, endDate)
        .done(function (data) {
            for (var i = data.results.length - 1; i >= 0; i--) {
                var comp = data.results[i];
                if (comp !== null) {
                    console.log(comp.weight);
                    $("#weightCount").text(comp.weight.toFixed(1));
                    $("#percentCount").text(comp.bodyFatPercent.toFixed(1));
                    $("#bmiCount").text(comp.bmi.toFixed(1));
                    $("#metabo").text(comp.basalMetabolism);
                    $("#updateTime").text(comp.measurementDate);
                    break;
                }
            }
        });
        
    } catch (e) {
        console.log(e);
        alert('エラーが発生しました。\nエラー内容はコンソール出力を確認してください。');
    }
    $(".open").click(function () {
        $("#slideBox").slideToggle("slow");
    });
});
//Date型からyyyyMMddのような文字列を返す
function getDateformat(date) {
    var y = date.getFullYear()+"";
    var m = date.getMonth() + 1;
    var d = date.getDate()+"";
    if (m < 10) {
        m = "0" + m;
    }
    if (d < 10) {
        d = "0" + d;
    }
    return (y + m + d);
}