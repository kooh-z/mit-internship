var msg = new Array();


// 設定開始（メッセージの内容を設定してください）

msg[0] = '1日何kcal食べていいの?自分の目標の体重の25～30倍した分だけ食べていいです。たとえば体重50kgを目標としている人は1250~1500kcalおにぎり100g(179kcal)で言うと7~8個食べていいんだよ☆';
/*msg[1] = '<strong>吉！</strong> … 今日はまあまあ良いことがあるでしょう';
msg[2] = '<strong>小吉！</strong> … 今日は普通の日ですね';
msg[3] = '<strong>凶！</strong> … 今日は凶。。。';
msg[4] = '<strong>大・激・凶！</strong> … もう最悪っスね！！（ウソです）';
*/
// 設定終了


var no = Math.floor(Math.random() * msg.length);

// 表示開始
document.write(msg[no]);