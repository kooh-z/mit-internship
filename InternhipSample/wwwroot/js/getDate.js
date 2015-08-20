$(function () {
    var s, x, y, w;
    var x = new Array("日", "月", "火", "水", "木", "金", "土");
    d = new Date();
    s = (d.getMonth() + 1) + "月" + d.getDate() + "日（" + x[d.getDay()] + "）";
    document.write(s);
});