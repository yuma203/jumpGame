
//ランキング
const STORAGE_KEY = "jumpGameScoreArray";
let arrRanking = [0, 0, 0, 0, 0];
$("#ranking").css(
    {'position': 'fixed', 'font-size': '150%', 'text-align': 'center'}
);

updateRanking();

function updateresult() {
    arrRanking = updateRankArray(arrRanking, score);
    setArrayToLS(arrRanking);
    updateRanking();
}

function updateRankArray(arr, scores) {
    arr.push(scores);
    arr.sort(function (a, b) {
        return b - a;
    });
    arr.splice(5, 1);
    return arr;
}

function updateRanking() {
    let arr = getArrayFromLS();
    $("#rank").html("");
    $("#over").html("");
    $("#rank").css({'z-index': '20'});
    $("#rank").append(`<div>--RANKING--</div>`);
    for (let i = 0; i < arr.length; i++) {
        $("#rank").append(`<div>${i + 1}位・${arr[i]}</div>`);
    }

    arrRanking = getArrayFromLS();
}

function setArrayToLS(arr) {
    let string = JSON.stringify(arr);
    localStorage.setItem(STORAGE_KEY, string);
}

function getArrayFromLS() {
    let string = localStorage.getItem(STORAGE_KEY);
    let arr = JSON.parse(string);
    if (arr !== null) {
        return arr;
    } else {
        return [];
    }
}