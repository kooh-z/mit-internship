// このファイルにはサイト全体で使用する関数を定義します。

// 体組成を取得します。
//   startDate 取得開始日(yyyyMMdd)
//   endDate 取得終了日(yyyyMMdd)
function getBodyComp(startDate, endDate) {
    var query = 'startDate=' + startDate + '&endDate=' + endDate;
    return request('/api/service/bodycomp/days?' + query, 'get');
};

// 体組成を登録します。
//   jsonData 体組成データ
function postBodyComp(jsonData) {
    return request('/api/service/bodycomp/days', 'post', jsonData);
};

// 活動量（日）を取得します。
//   startDate 取得開始日(yyyyMMdd)
//   endDate 取得終了日(yyyyMMdd)
function getActivity(startDate, endDate) {
    var query = 'startDate=' + startDate + '&endDate=' + endDate;
    return request('/api/service/activity/days?' + query, 'get');
};

// 活動量（時間）を取得します。
//   startDatetime 取得開始日(yyyyMMddHH)
//   endDatetime 取得終了日(yyyyMMddHH)
function getHoursActivity(startDatetime, endDatetime) {
    var query = 'startDatetime=' + startDatetime + '&endDatetime=' + endDatetime;
    return request('/api/service/activity/hours?' + query, 'get');
};

// 活動量（日）を登録します。
//   jsonData 体組成データ
function postActivity(jsonData) {
    return request('/api/service/activity/days', 'post', jsonData);
};

//ユーザプロフィールの取得
function getUserProfile() {
    return request("/api/service/userprofile/getData", 'get');
};


// 任意のデータをサーバに登録します。
//   key キー
//   value JSON形式の値
function postDatabase(key, value) {
    var json = JSON.stringify(value);
    request('api/data/' + key, 'post', json);
}

// 任意のデータをサーバから取得します。
// Deferを返すため、データを取得する場合は以下の様に記述します。
// getData('YOUR-KEY').done(function(data) { 
//    alert(JSON.stringify(data)); // ここに実際の処理を記述する。
// });
function getDatabase(key) {
    return request('api/data/' + key, 'get');
}

// フォームからオブジェクトを作成して返します。
//    name 対象フォームのname属性 (<form name="…" />)の値
function createFormObject(name) {
    var f = document.forms[name];
    var obj = new Object();
    for (i = 0; i < f.elements.length; i++) {
        var e = f.elements[i];
        if (e.name) {
            obj[e.name] = e.value;
        }
    }
    return obj;
}
 
//// 以下のメソッドは内部用のため他のファイルから直接呼び出す必要はありません。 ////

// リクエストを送信します。
function request(urlPath, method, jsonData) {
    if (!(method === 'get' || method === 'post')) {
        alert('パラメータエラー');
        return;
    }

    console.log('リクエスト送信: ' + urlPath + ' ' + method);
    return $.ajax({
        type: method,
        headers: {
            'clientToken': getClientToken()
        },
        url: urlPath,
        contentType: 'application/json',
        dataType: 'json',
        data: jsonData
    }).fail(function (data) {
        var res = data.responseJSON;
        alert('API送信でエラーが発生しました。\n\n' +
            'リクエスト\n' +
            '  URL = [' + urlPath + ']\n' + 
            '  Method = [' + method + ']\n\n' +
            '結果\n' +
            '  ステータスコード = [' + data.status + ']\n' +
            '  エラーコード = [' + res.error + ']\n' +
            '  説明 = [' + res.error_description + ']');
    });
};

// クライアントトークンを取得します。
function getClientToken() {
    // クッキーからクライアントトークンを取得
    var token = $.cookie("ClientToken");
    console.log(token);
    // 開発テスト用に固定のクライアントトークンを返すようにしています。
    // ログイン処理をちゃんと実装する場合は下の3行を削除してください
    if (!token) {
        //alert("ログインが必要です。");
        document.location.href = "index.html";
        return false;
    }

    return token;
};

var getterFormat = new DateFormat("yyyyMMdd");
