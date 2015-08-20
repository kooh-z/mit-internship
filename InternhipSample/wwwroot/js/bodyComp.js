
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

        $(".lineChart").hide();
        loadTable();

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
});



// 体組成データを取得してテーブルを作成します。
function loadTable() {
    $('#loading').slideDown(100);   // 「ロード中...」の表示を出す。

    
    getBodyComp('20150805', '20150806')
        .done(function (data) {
            // APIリクエストが成功した時に実行されます。

            $('#loading').slideUp(100);   // 「ロード中...」の表示を隠す。

            var dateLabels = [];
            var bodyWeights = [];
            var table = $('#table');
            table.empty(); // テーブルを初期化。

            table.append($('<tr><th>計測日</th><th>体重</th><th>骨量</th><th>BMI</th><th>体脂肪率</th></tr>'));
            for (var i = 0; i < data.results.length; i++) {
                var bodyComp = data.results[i];
                var element = makeBodyCompRow(bodyComp);
                table.append(element);

                dateLabels.push(bodyComp.measurementDate);
                bodyWeights.push(bodyComp.weight);
            }


            var data = {
                labels: dateLabels,
                datasets: [
                  {
                      label: "bodyWeights",
                      fillColor: "rgba(255,107,107,0.2)",
                      strokeColor: "rgba(255,107,107,1)",
                      pointColor: "rgba(255,107,107,1)",
                      pointStrokeColor: "#fff",
                      pointHighlightFill: "#fff",
                      pointHighlightStroke: "rgba(220,220,220,1)",
                      data: bodyWeights
                  }
                ]
            };
            $("lineChart").show();
            var graph = new Chart(document.getElementById("bodyWeightGraph").
            getContext("2d")).Line(data);
        });
}

// 体組成のテーブルのカラム（行）のタグを作成します。
function makeBodyCompRow(bodyComp) {
    // "<tr><th>測定日</th><td>体重</td><td>骨量</td><td>BMT</td><td>体脂肪率</td></tr>" の様なHTML要素を作成する。
    var elem = $('<tr>');
    elem.append($('<th>').text(bodyComp.measurementDate));
    elem.append($('<td>').text(bodyComp.weight));
    elem.append($('<td>').text(bodyComp.boneWeight));
    elem.append($('<td>').text(bodyComp.bmi));
    elem.append($('<td>').text(bodyComp.bodyFatPercent));
    return elem;
}

