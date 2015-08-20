//nキログラム減らすために必要な消費カロリー
function loseWeightKcal(weight, days, height, bmi) {
    var idealBMI = 22;
    height = height / 100;
    idealWeight = height * height * idealBMI;
    if (weight - idealWeight >= 0) {
        return 7200 * (weight - idealWeight) + idealWeight * 30 * days;
    }
    else {
        console.log("体重" + weight);
        console.log("目標体重" + idealWeight);
        alert("あなたはやせすぎです！");
        return 7200 * (idealWeight - weight) + idealWeight * 30 * days;
    }
}

//その日に消費すべきカロリー
//metaborithm = 基礎代謝
function lose1DayKcal(days, weight, height, bmi, metaborithm) {
    var loseKcal = loseWeightKcal(weight, days, height, bmi);
    return (loseKcal - metaborithm * days) / days;
}

//ジョギングで消費できるカロリー量の距離
//運動で消費するべきカロリー(kcal)÷体重(kg)=距離(km)
function loseKcalByJog(kcal, weight) {
    return kcal / weight;
}

//ウォーキングで減らせるカロリー量の距離
//運動で消費するべきカロリー(kcal)÷4.3メッツ÷体重(kg)×5.6km(=4.3メッツ)÷1.05=距離(km)
function loseKcalByWalk(kcal, weight) {
    return kcal / 4.3 / weight * 5.6 / 1.05;
}

//主婦の自転車の平均速度を16キロとした場合のサイクリングの時間
//体重（kg）×METS数×運動時間（時間）＝消費エネルギー（kcal）より
function loseKcalByCyc(kcal, weight) {
    return kcal / 5 / weight;
}

//クロールの場合の水泳での水泳時間
function loseKcalByCrawlSwim(kcal, weight) {
    return kcal / weight / 0.37 / 0.95;
}

//平泳ぎver
function loseKcalByBreSwim(kcal, weight) {
    return kcal / weight / 0.19 / 0.95;
}

//ヨガの場合
function loseKcalByYoga(kcal, weight) {
    return kcal / weight / 0.06 / 0.95;
}

//なわとびの場合
function loseKcalByJumpLope(kcal, weight) {
    console.log(kcal);
    return kcal / weight / 0.15 / 0.95;
}

//カラオケの場合
function loseKcalByKaraoke(kcal) {
    return kcal / 10;
}

//ボーリング
function loseKcalByBowling(kcal, weight) {
    return kcal / weight / 0.06 / 0.95;
}
