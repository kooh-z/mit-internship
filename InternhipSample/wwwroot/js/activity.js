$(function () {
    try {
        // Webページのロード完了後に実行される処理を書いてください。
        // 取得範囲を当日から20日までに設定する。
        var dateFormat = new DateFormat("yyyy-MM-dd");
        var start = new Date();
        start.setTime(start.getTime() - 86400000 * 19); // 86400000 -> 1日
        var end = new Date();
        $('[name=startDate]').val(dateFormat.format(start));
        $('[name=endDate]').val(dateFormat.format(end));

        $('[name=measurementDate').val(new DateFormat("yyyy/MM/dd").format(new Date()));

        loadTable(2);

        // id が 'btn-post'のタグがクリックされたときの処理。
        $('#btn-post').click(function () {
            // APIのI/F仕様に合わせてデータを作成する
            var data = {
                records: [
                    createFormObject("postForm")
                ]
            };
            //登録中のダイアログを出す
            $('#postProgress').slideDown(300);

            postBodyComp(JSON.stringify(data))
                .done(function (data) {
                    $('#postProgress').hide(); //登録中のダイアログを隠す
                    $('#postComplete').show().delay(2000).slideUp(500); //登録完了のダイアログを2秒間出してフェードアウトする。

                    loadTable();
                });

            return false;
        });

    } catch (e) {
        console.log(e);
        alert('エラーが発生しました。\nエラー内容はコンソール出力を確認してください。');
    }

    $("#day_button").click(function () {
        graph.destroy();
        makeHourCalChart();
    });
    $("#week_button").click(function () {
        graph.destroy();
        makeCalChart();
    });

});
$('.tooltip-tool').tooltip({
    selector: "a[data-toggle=tooltip]"
});
$("a[data-toggle=popover]").popover();

// 活動量データを取得してテーブルを作成します。
function loadTable(y) {
    $('#loading').slideDown(100);   // 「ロード中...」の表示を出す。
    var metabo = 1100; //基礎代謝　きめうち
    var myWeight = 80;  //いまの体重 きめうち
    var goalWeight;    //目標体重(kg)　きめうち
    var period = 180;    //設定期間(日)　きめうち
    var height = 168;   //きめうち
    var BMI = myWeight / (height / 100 * (height / 100));
    
    getUserProfile()
            .done(function (data) {
                height = data.profile.height;
            });

    var today = new Date();
    var xday = new Date();
    var x = -7;
    xday.setDate(today.getDate() + x);
    var startDate = getDateformat(xday);
    var endDate = getDateformat(today);


    getBodyComp(startDate, endDate)
        .done(function (data) {
            var weights = [];
            var dateLabels = [];
            var goalWeights = [];
            var idealWeight =  (height / 100) * (height / 100)*22;
            for (var i = 0; i < data.results.length; i++) {
                var bodyComp = data.results[i];
                weights.push(bodyComp.weight);
                goalWeights.push(idealWeight);
                dateLabels.push(bodyComp.measurementDate);

                metabo = bodyComp.basalMetabolism;
                myWeight = bodyComp.weight;
                BMI = bodyComp.bmi;
            }
            makeWeightChart(dateLabels, weights, goalWeights);

            if (y == 2) {

                getActivity(startDate, endDate)
                    .done(function (data) {
                        // APIリクエストが成功した時に実行されます。

                        $('#loading').slideUp(100);   // 「ロード中...」の表示を隠す。
                        console.log("aaaa");
                        var table = $('#table');
                        table.empty(); // テーブルを初期化。

                        table.append($('<tr><th>計測日</th><th>総消費カロリー</th><th>歩数</th><th>中強度運動時間</th></tr>'));
                        var usedColories = [];
                        var goalCalories = [];
                        var walkingStepses = [];
                        var dateLabels = [];
                        for (var i = 0; i < data.results.length; i++) {
                            var activity = data.results[i];
                            var element = makeActivityRow(activity);

                            usedColories.push(activity.totalUsedCalories);
                            goalCalories.push((metabo + lose1DayKcal(period, myWeight, height, BMI, metabo)).toFixed(1));
                            dateLabels.push(activity.measurementDate);
                            walkingStepses.push(activity.walkingSteps);
                            table.append(element);
                        }

                        makeChart(dateLabels, usedColories, goalCalories);
                        makeBarChart(dateLabels, walkingStepses);

                        makeTable(dateLabels, usedColories, goalCalories);
                        makeWalkingTable(dateLabels, walkingStepses);
                        makeWeightTable(dateLabels, weights);
                    });
            }
        });
    
}

function makeTable(days, calories, goalCalories) {
    $("#caloryTable > tbody *").remove();
    var totalCalory = 0;
    var totalGoalCalory = 0;
    for (var i = 0; i < days.length; i++) {
        $("#caloryTable tbody").append("<tr><td>" + days[i] + "</td><td>" + calories[i] + "</td><td>" + goalCalories[i] + "</td></tr>");
        totalCalory += calories[i];
        totalGoalCalory += goalCalories[i]*1;
    }
    $("#caloryTable tbody").append("<tr><td>合計</td><td>" + totalCalory.toFixed(1) + "</td><td>" + totalGoalCalory.toFixed(1) + "</td></tr>");
    $("#caloryTable tbody tr").each(function () {
        var calory = $("td", this).eq(1).text() * 1;
        var goalCalory = $("td", this).eq(2).text() * 1;
        if (calory < goalCalory) {
            $(this).addClass("warning");
        } else {
            $(this).addClass("success");
        }
    });
    $("#tab2").removeClass("in active");
    $("#tab3").removeClass("in active");
}

function makeWalkingTable(days, walkingSteps) {
    $("#walkingStepsTable > tbody *").remove();
    var totalWalkingStep = 0;
    for (var i = 0; i < days.length; i++) {
        $("#walkingStepsTable tbody").append("<tr><td>" + days[i] + "</td><td>" + walkingSteps[i] + "</td></tr>");
        totalWalkingStep += walkingSteps[i];
    }
    $("#walkingStepsTable tbody").append("<tr><td>合計</td><td>" + totalWalkingStep + "</td></tr>");
}
function makeWeightTable(days, weights) {
    $("#weightTable > tbody *").remove();
    for (var i = 0; i < days.length; i++) {
        if (weights[i] !== undefined) {
            $("#weightTable tbody").append("<tr><td>" + days[i] + "</td><td>" + weights[i] + "</td></tr>");
        }
    }
}

// 活動量のテーブルのカラム（行）のタグを作成します。
function makeActivityRow(activity) {
    // "<tr><th>計測日</th><td>カロリー<</td><td>歩数</td><td>中強度運動時間</td></tr>" の様なHTML要素を作成する。
    var elem = $('<tr>');
    elem.append($('<th>').text(activity.measurementDate));
    elem.append($('<td>').text(activity.totalUsedCalories));
    elem.append($('<td>').text(activity.walkingSteps));
    elem.append($('<td>').text(activity.moderateIntensityExerciseMinutes));
    return elem;
}
function makeCalChart() {
    var metabo = 1100; //基礎代謝　きめうち
    var myWeight = 80;  //いまの体重 きめうち
    var goalWeight;    //目標体重(kg)　きめうち
    var period = 180;    //設定期間(日)　きめうち
    var height = 168;   //きめうち
    var BMI = myWeight / (height / 100 * (height / 100));

    getUserProfile()
            .done(function (data) {
                height = data.profile.height;
            });

    var today = new Date();
    var xday = new Date();
    var x = -7;
    xday.setDate(today.getDate() + x);
    var startDate = getDateformat(xday);
    var endDate = getDateformat(today);


    getBodyComp(startDate, endDate)
        .done(function (data) {
            var weights = [];
            var dateLabels = [];
            var goalWeights = [];
            var idealWeight = (height / 100) * (height / 100) * 22;
            for (var i = 0; i < data.results.length; i++) {
                var bodyComp = data.results[i];
                weights.push(bodyComp.weight);
                goalWeights.push(idealWeight);
                dateLabels.push(bodyComp.measurementDate);

                metabo = bodyComp.basalMetabolism;
                myWeight = bodyComp.weight;
                BMI = bodyComp.bmi;
            }

                getActivity(startDate, endDate)
                    .done(function (data) {
                        // APIリクエストが成功した時に実行されます。
                        var usedColories = [];
                        var goalCalories = [];
                        var dateLabels = [];
                        for (var i = 0; i < data.results.length; i++) {
                            var activity = data.results[i];

                            usedColories.push(activity.totalUsedCalories);
                            goalCalories.push((metabo + lose1DayKcal(period, myWeight, height, BMI, metabo)).toFixed(1));
                            dateLabels.push(activity.measurementDate);
                        }

                        makeChart(dateLabels, usedColories, goalCalories);

                        makeTable(dateLabels, usedColories, goalCalories);
                    });
        });
}
function makeChart(days, calories, goalCalories) {
    var data = {
        labels: days,
        datasets: [
          {
              label: "消費カロリー",
              fillColor: "rgba(0,180,255,0.1)",
              strokeColor: "#66ccff",
              pointColor: "#66ccff",
              pointStrokeColor: "#fff",
              data: calories
          },
          {
              label: "目標消費カロリー",
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "rgba(151,187,205,1)",
              pointColor: "rgba(151,187,205,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data: goalCalories
          }
        ]
    };
    graph = new Chart(document.getElementById("cololyGraph").
            getContext("2d")).Line(data);
}

function makeHourCalChart() {
    var metabo = 1100; //基礎代謝　きめうち
    var myWeight = 80;  //いまの体重 きめうち
    var goalWeight;    //目標体重(kg)　きめうち
    var period = 180;    //設定期間(日)　きめうち
    var height = 168;   //きめうち
    var BMI = myWeight / ((height / 100) * (height / 100));
    getHoursActivity("2015080600", "2015080623")
            .done(function (data) {
                console.log(data);
                var usedColories = [];
                var goalCalories = [];
                var hourLabels = [];
                for (var i = 0; i < data.results.length; i++) {
                    var activity = data.results[i];
                    usedColories.push(activity.totalUsedCalories);
                    goalCalories.push(((metabo + lose1DayKcal(period, myWeight, height, BMI, metabo)) / 24).toFixed(1));
                    hourLabels.push(activity.measurementHour);
                }

                var data = {
                    labels: hourLabels,
                    datasets: [
                      {
                          label: "消費カロリー",
                          fillColor: "rgba(0,180,255,0.1)",
                          strokeColor: "#66ccff",
                          pointColor: "#66ccff",
                          pointStrokeColor: "#fff",
                          data: usedColories
                      },
                      {
                          label: "目標消費カロリー",
                          fillColor: "rgba(151,187,205,0.2)",
                          strokeColor: "rgba(151,187,205,1)",
                          pointColor: "rgba(151,187,205,1)",
                          pointStrokeColor: "#fff",
                          pointHighlightFill: "#fff",
                          pointHighlightStroke: "rgba(151,187,205,1)",
                          data: goalCalories
                      }
                    ]
                };
                graph = new Chart(document.getElementById("cololyGraph").
                        getContext("2d")).Line(data);
                makeTable(hourLabels, usedColories, goalCalories);
            });
    
}
function makeWeightChart(days, weights, goalWeights) {
    var data = {
        labels: days,
        datasets: [
          {
              label: "体重",
              fillColor: "rgba(0,180,255,0.1)",
              strokeColor: "#66ccff",
              pointColor: "#66ccff",
              pointStrokeColor: "#fff",
              data: weights
          },
          {
              label: "目標体重",
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "rgba(151,187,205,1)",
              pointColor: "rgba(151,187,205,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data: goalWeights
          }
        ]
    };
    var graph1 = new Chart(document.getElementById("weightGraph").
            getContext("2d")).Line(data);
}
function makeBarChart(days, walkingSteps) {
    //歩数推移グラフ（棒グラフ）
    data = {
        labels: days,
        datasets: [
          {
              label: "WalkingSteps",
              fillColor: "rgba(220,220,220,0.5)",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "rgba(220,220,220,0.75)",
              highlightStroke: "rgba(220,220,220,1)",
              data: walkingSteps
          }
        ]
    };
    var graph1 = new Chart(document.getElementById("walkingStepsGraph").
    getContext("2d")).Bar(data);
}
function getDateformat(date) {
    var y = date.getFullYear() + "";
    var m = date.getMonth() + 1;
    var d = date.getDate() + "";
    if (m < 10) {
        m = "0" + m;
    }
    if (d < 10) {
        d = "0" + d;
    }
    return (y + m + d);
}