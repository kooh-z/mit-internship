
$(function () {

    try {
        // Webページのロード完了後に実行される処理を書いてください。

        try {
            getUserProfile()
                .done(function (data) {
                    $("h1 > em").text(data.profile.nickName);
                    $(".container > .row > .col-sm-12 > #heightCount").text(data.profile.height);
                    setNickName(data.profile.nickName);
                });
        } catch (e) {
            console.log(e);
            alert('エラーが発生しました。\nエラー内容はコンソール出力を確認してください。');
        }

        //日付取得
        todayDateData = getDate();

        //1日の体組成データを取得しエクササイズ方法を提供
        getExerciseData(todayDateData);

    } catch (e) {
        console.log(e);
        alert('エラーが発生しました。\nエラー内容はコンソール出力を確認してください。');
    }

    $("#get_button").click(function () {
        //日付取得
        todayDateData = getDate();

        //1日の体組成データを取得しエクササイズ方法を提供
        suggest(todayDateData);
    });

    $(".tooltip a").hover(function () {
        $(this).next("span").animate({ opacity: "show", top: "-75" }, "slow");
    }, function () {
        $(this).next("span").animate({ opacity: "hide", top: "-85" }, "fast");
    });
});

function setNickName(name) {
    $(".nickname > em").text(name);
}

function getDate() {
    today = new Date();

    todayYear = today.getFullYear() + "";
    todayMonth = today.getMonth() + 1 + "";
    todayDate = today.getDate() + "";

    $(".date > em").text(todayYear + "年" + todayMonth + "月" + todayDate + "日");

    if (todayMonth < 10) {
        return todayYear + "0" + todayMonth + todayDate;
    }
    else {
        return todayYear + todayMonth + todayDate;
    }
}

function showDonutGraph(totalUsedCharories) {

    var intakeCal = 2200;   //摂取カロリー　今回は摂取カロリーについての情報が取れないので決め打ち
    var percent = Math.round(totalUsedCharories / (less1DayKcal + intakeCal) * 100);
    var leaveCal = intakeCal + less1DayKcal - totalUsedCharories;
    leaveCal.toFixed(1);
    if(percent > 100){
        percent = 100;
        leaveCal = 0;
    }
    $(".count > em").text(percent+"%");


    //消費カロリーと目標カロリー比較グラフ（ドーナツグラフ）
    data = [
        {
            value: totalUsedCharories,
            color: "#fff"
        },
        {
            //きめうち！消費すべきカロリーを後で修正すべき
            value: leaveCal,
            // Draw with background color
            color: "#EB6841"
        }
    ]
    var ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx).Doughnut(data, {
        segmentShowStroke: false,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 1,
        percentageInnerCutout: 80, // **** Border width
        animation: true,
        animationSteps: 100,
        animationEasing: "easeOutBounce",
        animateRotate: true,
        animateScale: false,
        onAnimationComplete: null
    });
}

function getExerciseData(todayDateData) {
    //本日の消費カロリーを取得
    getActivity(todayDateData, todayDateData)
        .done(function (kcalData) {

            //データを取得していなかった場合のエラー処理
            try {

                //カラダデータ取得
                getBodyComp(todayDateData, todayDateData)
                .done(function (karadaData) {
                    weight = karadaData.results[0].weight;
                    try {

                        //プロフィール取得
                        getUserProfile()
                        .done(function (userData) {

                            try {
                                var height = userData.profile.height;
                                var idealWeight = (height / 100) * (height / 100) * 22;
                                $("#goalWeightCount").text(idealWeight.toFixed(1));
                                less1DayKcal = lose1DayKcal(180, Math.round(weight),
                                    height, Math.round(karadaData.results[0].bmi), karadaData.results[0].basalMetabolism);  //1日に"余分に"消費すべきカロリー
                                
                                var selectVal = $("#select_test").val() * 1 - 1;
                                var s = "";
                                
                               
                                        $("#flex-caption1").text("ジョギングなら" + loseKcalByJog(less1DayKcal, weight).toFixed(1) + "km走ればok!");
                                     
                                        $("#flex-caption2").text("ウォーキングなら" + loseKcalByWalk(less1DayKcal, weight).toFixed(1) + "km歩けばok!");
                                   
                                        $("#flex-caption3").text("サイクリングなら" + loseKcalByCyc(less1DayKcal, weight).toFixed(1) + "時間走ればok!");
                                   
                                        $("#flex-caption4").text("クロールなら" + loseKcalByCrawlSwim(less1DayKcal, weight).toFixed(1) + "分泳げばok!");
                                      
                                        $("#flex-caption5").text("平泳ぎなら"+loseKcalByBreSwim(less1DayKcal, weight).toFixed(1) + "分泳げばok!");
                                        
                                        $("#flex-caption6").text("ヨガなら"+loseKcalByYoga(less1DayKcal, weight).toFixed(1) + "分やればok!");
                                       
                                        $("#flex-caption7").text("なわとびなら" + loseKcalByJumpLope(less1DayKcal, weight).toFixed(1) + "分やればok!");
                                      
                                        $("#flex-caption8").text("カラオケなら" + Math.ceil(loseKcalByKaraoke(less1DayKcal)) + "曲歌えばok!");
                                  
                                        $("#flex-caption9").text( "ボーリングなら" + Math.ceil(loseKcalByBowling(less1DayKcal, weight)) + "分やればok");
                              
                                        
                                $(".flex-caption").text(s);
                                showDonutGraph(kcalData.results[0].totalUsedCalories);
                            }
                            catch (e) {
                                console.log(e);
                                alert("プロフィールが取得できません。設定してください");
                            }

                        });
                    }
                    catch (e) {
                        alert("カラダデータが取得できません。KaradaScanを行ってください。");
                    }

                });
            }
            catch (e) {
                $(".count > em").text("取得失敗");
                alert("本日の消費カロリーデータが取得できません。KaradaScanを行ってください。");
            }
        });
}

function suggest(todayDateData) {
                                var selectVal = $("#select_test").val() * 1 - 1;
                                console.log(selectVal);
                                var s = "";
                                switch (selectVal) {
                                    case 0:
                                        s = "ジョギングなら" + loseKcalByJog(less1DayKcal, weight).toFixed(1) + "km走ればok!";
                                        break;
                                    case 1:
                                        s = "ウォーキングなら" + loseKcalByWalk(less1DayKcal, weight).toFixed(1) + "km歩けばok!"
                                        break;
                                    case 2:
                                        s = "サイクリングなら" + loseKcalByCyc(less1DayKcal, weight).toFixed(1) + "時間走ればok!"
                                        break;
                                    case 3:
                                        s = "クロールなら" + loseKcalByCrawlSwim(less1DayKcal, weight).toFixed(1) + "分泳げばok!"
                                        break;
                                    case 4:
                                        s = "平泳ぎなら" + loseKcalByBreSwim(less1DayKcal, weight).toFixed(1) + "分泳げばok!"
                                        break;
                                    case 5:
                                        s = "ヨガなら" + loseKcalByYoga(less1DayKcal, weight).toFixed(1) + "分やればok!"
                                        break;
                                    case 6:
                                        s = "なわとびなら" + loseKcalByJumpLope(less1DayKcal, weight).toFixed(1) + "分やればok!"
                                        break;
                                    case 7:
                                        s = "カラオケなら" + Math.ceil(loseKcalByKaraoke(less1DayKcal)) + "曲歌えばok!"
                                        break;
                                    case 8:
                                        s = "ボーリングなら" + Math.ceil(loseKcalByBowling(less1DayKcal, weight)) + "分やればok!"
                                        break;
                                    default:
                                        s = "ジョギングなら" + loseKcalByJog(less1DayKcal, weight).toFixed(1) + "km走ればok!";
                                        break;
                                }
                                console.log(s);
                                $(".flex-caption").text(s);
}
$(window).load(function () {
    $('.flexslider').flexslider({
        slideshowSpeed: 10000,
        mousewheel: true,
    });
});

$(window).on('load', function () {//DOM要素の準備が完了した時に呼び出される
    $(".flex-img").each(function () {
        var originalWidth = $(this).width();
        var originalHeight = $(this).height();
        $(this).height(300);
        $(this).width(originalWidth * ($(this).height() / originalHeight));
    });
});