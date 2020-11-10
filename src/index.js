let score;

function play() {
    // canvas要素の取得
    const canvas = document.getElementById("maincanvas");
    const ctx = canvas.getContext("2d");

    // 画像を表示するの座標の定義 & 初期化
    var x = 500;
    var y = 9860;

    // 上下方向の速度
    var vy = 0;

    // ジャンプしたか否かのフラグ値
    var isJump = false;

    //一度だけ実行する為の変数
    let count = 0;

    // キーボードの入力状態を記録する配列の定義
    var input_key_buffer = new Array();

    //スクロールの最初の位置
    let Y_max = 9960;

    // 制限時間の表示と設定
    var timeLimit = 120; // 制限時間(秒)設定場所
    var timerReset = timeLimit;

    //スコア＆ボーナスポイントの定義
    let bonusPoint;

    // ブロックの位置の定義
    let position = [];
    let zero = [];
    let zerotwo = [];
    let one = [];

    let blocks12 = [
        {
            x: 0,
            y: 9960,
            w: 1000,
            h: 40
        }
    ];

    let block00 = [
        {
            x: 0,
            y: 250,
            w: 1000,
            h: 10
        }
    ]

    // ブロック要素の定義
    /* probaility　0・上昇するごとに数が減る
  　　　　　　　　1・上昇するごとに数が増える
  　　　　　　　　2・上昇するごとに数が減りyが1000以下で出現しなくなる */
    var blockPersonality = [
        {
            name: 'nomal',
            gimmick: 'jump',
            img: '../images/scaffold/block1.png',
            probaility: 0
        }, {
            name: 'damage',
            gimmick: 'gaover',
            img: '../images/scaffold/block2.png',
            probaility: 1
        }, {
            name: 'hi',
            gimmick: 'hightJump',
            img: '../images/scaffold/block3.png',
            probaility: 2
        }, {
            name: 'once',
            gimmick: 'onetime',
            img: '../images/scaffold/block4.png',
            probaility: 1
        }, {
            name: 'timedown',
            gimmick: 'timedown',
            img: '../images/scaffold/block5.png',
            probaility: 1
        }, {
            name: 'hide',
            gimmick: 'hidedisplay',
            img: '../images/scaffold/block6.png',
            probaility: 0
        }
    ];

    // ロード時に画面描画の処理が実行されるようにする
    window.addEventListener("load", update);

    // キーボードの入力イベントをトリガーに配列のフラグ値を更新させる
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);

    makeBlock();

    // 各ギミックの設定
    blockPersonality[0].gimmick = () => {
        vy = -13;
    };

    blockPersonality[1].gimmick = () => {
        vy = -4;
        if (count == 0) {
            count++;
            gameover();
        }
    };

    blockPersonality[2].gimmick = () => {
        vy = -17;
    }

    let timer003 = 0;
    let blockTimer = setInterval(function () {
        timer003++;
        if (timer003 % 2 == 0) {
            blockPersonality[3].gimmick = () => {
                vy = -13;
            }
            blockPersonality[3].img = '../images/scaffold/block4.png';
        } else {
            blockPersonality[3].gimmick = () => {};
            blockPersonality[3].img = '../images/scaffold/noBlock4.png';
        }
    }, 1500);

    blockPersonality[4].gimmick = () => {
        timeLimit -= 3;
        vy = -13;
    }

    blockPersonality[5].gimmick = () => {
        vy = -13;
        $('#over').html('<div id="over1"><img src ="../images/screen/cat.gif"></div>');
        //let num = Math.floor(Math.random() * 2);
        /* if (num == 0) {
            $('#over').html('<div id="over1"><img src ="../images/screen/cat.gif"></div>');
        } else {
            $('#over').html('<div id="over1"><img src ="../images/screen/画像名"></div>')
        } */
        let screentimer = setInterval(function () {
            $('#over').html('<div id="over1"><img src =""></div>');
            clearInterval(screentimer);
        }, 3000)
    }

    function handleKeydown(e) {
        e.preventDefault();
        input_key_buffer[e.keyCode] = true;
    }

    function handleKeyup(e) {
        e.preventDefault();
        input_key_buffer[e.keyCode] = false;
    }

    function makeBlock() {
        function point(Xpoint, Ypoint, Wpoint) {
            position.push({
                x: Xpoint,
                y: Ypoint,
                w: Wpoint,
                h: 10
            },)
        }

        for (let vertical = 9860; vertical > 250; vertical -= 130) {
            if (vertical >= 6000 && vertical <= 9860) {
                for (let side = 0; side < 1000; side += 140) {
                    let num = Math.floor(Math.random() * 10);
                    if (num < 8) {
                        point(side, vertical, 50);
                    }
                }
            } else if (vertical >= 2500 && vertical <= 6000) {
                for (let side = 0; side < 1000; side += 130) {
                    let num = Math.floor(Math.random() * 10);
                    if (num < 8) {
                        point(side, vertical, 40);
                    }
                }
            } else if (vertical >= 1000 && vertical <= 2500) {
                for (let side = 0; side < 1000; side += 120) {
                    let num = Math.floor(Math.random() * 10);
                    if (num < 8) {
                        point(side, vertical, 30);
                    }
                }
            } else if (vertical >= 0 && vertical <= 1000) {
                for (let side = 0; side < 1000; side += 110) {
                    let num = Math.floor(Math.random() * 10);
                    if (num < 8) {
                        point(side, vertical, 25);
                    }
                }
            }
        }

        // 各ブロックに位置を振り分け
        for (let i = 0; i < blockPersonality.length; i++) {
            blockPersonality[i].name = [];
        }

        for (let i = 0; i < position.length; i++) {
            if (i < Math.floor(position.length / 15 * 2)) {
                for (let j = 0; j < blockPersonality.length; j++) {
                    if (blockPersonality[j].probaility == 0 || blockPersonality[j].probaility == 2) {
                        zerotwo.push(blockPersonality[j].name);
                    } else {
                        one.push(blockPersonality[j].name);
                    }
                }

                zerotwo[Math.floor(Math.random() * zerotwo.length)].push(position[i]);

            } else if (i < Math.floor(position.length / 15 * 4)) {
                for (let j = 0; j < blockPersonality.length; j++) {
                    if (blockPersonality[j].probaility == 0 || blockPersonality[j] == 1) {
                        zerotwo.push(blockPersonality[j].name);
                    } else {
                        one.push(blockPersonality[j].name);
                    }
                }
                let num = Math.floor(Math.random() * 100)
                if (num >= 25) {
                    zerotwo[Math.floor(Math.random() * zerotwo.length)].push(position[i]);
                } else {
                    one[Math.floor(Math.random() * one.length)].push(position[i]);
                }
            } else if (i < Math.floor(position.length / 15 * 7)) {
                for (let j = 0; j < blockPersonality.length; j++) {
                    if (blockPersonality[j].probaility == 0 || blockPersonality[j] == 1) {
                        zerotwo.push(blockPersonality[j].name);
                    } else {
                        one.push(blockPersonality[j].name);
                    }
                }
                let num = Math.floor(Math.random() * 100)
                if (num >= 35) {
                    zerotwo[Math.floor(Math.random() * zerotwo.length)].push(position[i]);
                } else {
                    one[Math.floor(Math.random() * one.length)].push(position[i]);
                }
            } else if (i < Math.floor(position.length / 15 * 11)) {
                for (let j = 0; j < blockPersonality.length; j++) {
                    if (blockPersonality[j].probaility == 0) {
                        zero.push(blockPersonality[j].name);
                    } else if (blockPersonality[j].probaility == 1) {
                        one.push(blockPersonality[j].name);
                    }
                }
                let num = Math.floor(Math.random() * 100)
                if (num >= 50) {
                    zero[Math.floor(Math.random() * zero.length)].push(position[i]);
                } else {
                    one[Math.floor(Math.random() * one.length)].push(position[i]);
                }
            } else {
                for (let j = 0; j < blockPersonality.length; j++) {
                    if (blockPersonality[j].probaility == 0 || blockPersonality[j] == 1) {
                        zero.push(blockPersonality[j].name);
                    } else if (blockPersonality[j].probaility == 1) {
                        one.push(blockPersonality[j].name);
                    }
                }
                let num = Math.floor(Math.random() * 100)
                if (num >= 70) {
                    zero[Math.floor(Math.random() * zero.length)].push(position[i]);
                } else {
                    one[Math.floor(Math.random() * one.length)].push(position[i]);
                }
            }
        }
    }

    var timer = setInterval(function () {
        if (timeLimit <= 1) {
            position.length = 0;
            for (let i = 0; i < blockPersonality.length; i++) {
                if (count == 0) {
                    count++;
                    gameover();
                }
            }
            clearInterval(timer);
        };
        timeLimit--;
    }, 1000);

    // 画面を更新する関数を定義 (繰り返しここの処理が実行される)
    function update() {
        bonusPoint = Math.floor(timeLimit * 100);
        // 画面全体をクリア
        ctx.clearRect(0, 0, 1000, 10000);

        // タイマーのカウントダウン＆スコアの表示
        let clock = document.getElementById('cl');
        score = (9860 - Y_max) * 10;
        clock.innerHTML = '<p>TIME LIMIT 0' + Math.floor(timeLimit / 60) + ':' + Math.floor(
            (timeLimit - Math.floor(timeLimit / 60) * 60) / 10
        ) + ((timeLimit - Math.floor(timeLimit / 60) * 60) % 10) + '<br>SCORE ' +
                score + '</p>';

        // 更新後の座標
        var updatedX = x;
        var updatedY = y;

        // キャラの最高高度
        if (Y_max > y) {
            Y_max = y;
        }

        // 入力値の確認と反映
        if (input_key_buffer[37]) {
            updatedX = x - 8;
        }
        if (input_key_buffer[38]) {
            vy = -30;
            isJump = true;
        }
        if (input_key_buffer[39]) {
            updatedX = x + 8;
        }
        // esc[27]追加予定 ジャンプ中である場合のみ落下するように調整する
        if (isJump) {
            // 上下方向は速度分をたす
            updatedY = y + vy;

            // 落下速度はだんだん大きくなる
            vy = vy + 0.5;

            // 主人公が乗っているブロックを取得する
            const blockTargetIsOn = getBlock(x, y, updatedX, updatedY);

            // ブロックが取得できた場合には、そのブロックの上に立っているよう見えるように着地させる
            if (blockTargetIsOn !== null) {}
        } else {
            // ブロックの上にいなければジャンプ中の扱いとして初期速度0で落下するようにする
            if (getBlock(x, y, updatedX, updatedY) === null) {
                isJump = true;
                vy = 0;
            }
        }

        x = updatedX;
        y = updatedY;

        //背景の表示
        var img = new Image();
        img.src = '../images/screen/background.png';
        ctx.drawImage(img, 0, 0);

        // 主人公の画像を表示
        var image = new Image();

        image.src = "../images/character/mainObject.jpg";
        ctx.drawImage(image, x, y, 32, 32);

        // 地面の画像を表示
        for (let i = 0; i < blockPersonality.length; i++) {
            var groundImage = new Image();
            groundImage.src = blockPersonality[i].img;
            for (const block of blockPersonality[i].name) {
                ctx.drawImage(groundImage, block.x, block.y, block.w, block.h);
            }
        }

        var groundImage = new Image();
        groundImage.src = "../images/scaffold/ground.png";
        for (const block of blocks12) {
            ctx.drawImage(groundImage, block.x, block.y, block.w, block.h);
        }

        var groundImage = new Image();
        groundImage.src = "../images/scaffold/goal.png"
        for (const block of block00) {
            ctx.drawImage(groundImage, block.x, block.y, block.w, block.h);
        }

        // 再描画
        anime = window.requestAnimationFrame(update);
        if (y <= 10000) {
            $('#maincanvas').css({marginTop: -9370});
        }
        if (Y_max <= 9650) {
            $('#maincanvas').css({
                marginTop: -Y_max + 300
            });
        }
        if (Y_max <= 330) {
            $('#maincanvas').css({marginTop: 0});
        }

        // 自動スクロール&ゲームリセット
        if (Y_max > y) {
            window.scrollTo(0, y - 300);
            Y_max = y;
        } else if (y > Y_max + 370) {
            if (count == 0) {
                count++;
                gameover();
            }
        } else {
            window.scrollTo(0, Y_max - 300);
        }
    }

    function getBlock(x, y, updatedX, updatedY) {
        for (let i = 0; i < blockPersonality.length; i++) {
            for (const block of blockPersonality[i].name) {
                if (y + 32 <= block.y && updatedY + 32 >= block.y) {
                    if ((x + 32 <= block.x || x >= block.x + block.w) && (updatedX + 32 <= block.x || updatedX >= block.x + block.w)) {
                        // ブロックの上にいない場合には何もしない
                        continue;
                    }
                    // ブロックの上にいる場合には、そのブロック要素を返す
                    blockPersonality[i].gimmick();
                }
            }
        }

        // 最後までブロック要素を返さなかった場合はブロック要素の上にいないということなのでnullを返却する
        for (const block of blocks12) {
            if (y + 32 <= block.y && updatedY + 32 >= block.y) {
                if ((x + 32 <= block.x || x >= block.x + block.w) && (updatedX + 32 <= block.x || updatedX >= block.x + block.w)) {
                    continue;
                }
                vy = -13;
            }
        }

        // 最後までブロック要素を返さなかった場合はブロック要素の上にいないということなのでnullを返却する
        for (const block of block00) {
            if (y + 32 <= block.y && updatedY + 32 >= block.y) {
                if ((x + 32 <= block.x || x >= block.x + block.w) && (updatedX + 32 <= block.x || updatedX >= block.x + block.w)) {
                    continue;
                }
                vy = -4;
                if (count == 0) {
                    count++;
                    goal();
                }
            }
        }
        // 最後までブロック要素を返さなかった場合はブロック要素の上にいないということなのでnullを返却する
        return null;
    }

    //リセットイベント
    function reset() {}

    //ゲームオーバーのイベント
    function gameover() {
        updateresult();
        $('#over').html(
            '<div id="over3"><div id="sck">スコアは、' + score + 'です。</div><img src ="../images/' +
            'screen/over.png"></div>'
        );
        clearInterval(timer);
        if (count != 0) {
            $(function () {
                $("#over").click(function () {
                    count = 0;
                    clearInterval(timer);
                    x = 500;
                    y = 9860;
                    Y_max = 9960;
                    timeLimit = timerReset;
                    timer = setInterval(function () {
                        timeLimit--;
                    }, 1000);
                    $("#over3").remove();
                });
            });
        }
    }

    //ゴールのイベント
    function goal() {
        score += bonusPoint;
        updateresult();
        $('#over').html(
            '<div id="over3"><div id="sck">スコアは、' + score + 'です。</div><img src ="../images/' +
            'screen/goal.png"></div>'
        );
        clearInterval(timer);
        if (count != 0) {
            $(function () {
                $("#over").click(function () {
                    count = 0;
                    clearInterval(timer);
                    x = 500;
                    y = 9860;
                    Y_max = 9960;
                    timeLimit = timerReset;
                    timer = setInterval(function () {
                        timeLimit--;
                    }, 1000);
                    $("#over3").remove();
                });
            });
        }
    }
    update();
}

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

$(function () {
    $('#over').html(
        '<div id="over2"><img src ="../images/screen/explanation.png" id="start1" ><br>' +
        '<img src ="../images/screen/start.png" id="start" > </div>'
    )
    $("#start").click(function () {
        $("#over2").remove();
        play();
    });
});