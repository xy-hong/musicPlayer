
var playButton = document.getElementById("playButton");           //播放和停止按钮
var nextBbutton = document.getElementById("nextButton");         //下一首按钮
var previousButton = document.getElementById("previousButton");    //上一首按钮

var volumeButton = document.getElementById("volumeButton");        //显示音量调节条按钮
var volumeRange = document.getElementById("volumeRange");          //音量调节条
var volumeText = document.getElementById("volumeText");

var musicTimeRange = document.getElementById("musicTimeRange");         //音乐进度条
var musicCurrentTime = document.getElementById("musicCurrentTime");      //音乐当前时间 <i>
var musicDuration = document.getElementById("musicDuration");             //音乐总时间   <i>

var modelButton = document.getElementById("modelButton");              //改变模式按钮
var musicListButton = document.getElementById("musicListButton");      //打关音乐列表按钮

var musicName = document.getElementById("musicName");          //歌曲名 <span>
var musicAuthor = document.getElementById("musicAuthor");           //歌曲作者 <span>

var musicListDiv = document.getElementById("musicListDiv");    //音乐列表框

/*
* 页面初始化（获取并显示当前歌曲下标，歌曲名，作者名）
*/

var index = localStorage.getItem("musicIndex") ? localStorage.getItem("musicIndex") : 0;
musicName.innerText = musicList[index].name;
musicAuthor.innerText = musicList[index].author;
volumeRange.value = localStorage.getItem("musicVolume") ? localStorage.getItem("musicVolume") : 0.5;
volumeText.innerText = volumeRange.value;

/**
 *  是否显示下方框和音量条
 */
var showDiv = localStorage.getItem("showDiv") ? localStorage.getItem("showDiv") : 'false';
var showVolume = localStorage.getItem("showVolume") ? localStorage.getItem("showVolume") : 'false';

if(showVolume=='true'){
    volumeRange.hidden = false;
    volumeText.hidden = false;
}else if(showVolume=='false'){
    volumeRange.hidden = true;
    volumeText.hidden = true;
}


if (showDiv == 'true') {
    musicListDiv.style.height = '100px';
    document.getElementById("div2").style.height = '45px';
} else {
    musicListDiv.style.height = '0px';
    document.getElementById("div2").style.height = '0px';
}


modelButton.innerText = localStorage.getItem("model") ? localStorage.getItem("model") : "列表循环";
/**
 * <button class='musicButton' >"+musicList[i].name+"--"+musicList[i].author+"</button>
 */
for (let i = 0; i < musicList.length; i++) {
    document.getElementById("musicTable").innerHTML += "<tr style='width:100%;' ><td style='width:100%'><button style='width:100%;text-align: left' class='musicButton'>" + musicList[i].name + "--" + musicList[i].author + "</button></td></tr>";

}

/**
 * 
 * @param {Object} message 向后端发送的信息 
 * @param {function} responseCallback 回调函数，带有response参数，此参数包含另一端响应的数据
 */
function send(message, responseCallback) {
    if (responseCallback != null) {
        chrome.runtime.sendMessage(message, responseCallback);
    } else {
        chrome.runtime.sendMessage(message);
    }
    console.log("send " + JSON.stringify(message));
}

/**
 * 播放按钮
 */
playButton.onclick = function () {
    send({ type: "play" }, null);
}

/**
 * ”下一首“按钮点击事件
 * 发送 { type:"next" }，接收响应，调用刷新歌曲名函数
 */
nextBbutton.onclick = function () {
    send({ type: "next" }, function (response) {
        refreshNameAndAuthor(response.name, response.author);
        //alert(response.name);
    });
}

/**
 * 发送{ type:"previous" },接收响应，调用刷新歌曲名函数
 */
previousButton.onclick = function () {
    send({ type: "previous" }, function (response) {
        refreshNameAndAuthor(response.name, response.author);
    });
}

/**
 * 刷新歌曲名和音乐名
 * @param {String} name 
 * @param {String} author 
 */
function refreshNameAndAuthor(name, author) {
    musicName.innerText = name;
    musicAuthor.innerText = author;
}

/**
 * 显示/隐藏音量条
 */
volumeButton.onclick = function () {
    volumeRange.hidden = !volumeRange.hidden;
    volumeText.hidden = !volumeText.hidden;
    if (showVolume == 'true') {
        showVolume = 'false';
    } else {
        showVolume = 'true';
    }
    localStorage.setItem("showVolume", showVolume);
}

/**
 * 音量调节，发送信息
 */
volumeRange.onchange = function () {
    volumeText.innerText = volumeRange.value;
    send({ type: "volume", value: volumeRange.value }, null);
}

modelButton.onclick = function () {
    send({ type: 'model' }, function (response) {
        modelButton.innerText = response.model;
    });
}

/**
 * 轮询请求，获取歌曲总时间，歌曲时长
 */
window.setInterval(function () {
    send({ type: "refresh" }, function (response) {
        musicTimeRange.max = response.duration;
        musicTimeRange.value = response.currentTime;

        musicCurrentTime.innerText = timeFormat(response.currentTime);
        musicDuration.innerText = timeFormat(response.duration);
        musicName.innerText = response.name;
        musicAuthor.innerText = response.author;
    });
    // console.log("轮询请求后端数据")
}, 1000);

/**
 * 通过改变进度条改变歌曲进度
 */
musicTimeRange.onchange = function () {
    console.log("改变进度");
    send({ type: "changeTime", value: musicTimeRange.value });
}
/**
 * 传入秒数，返回 mm:ss 格式的时间
 * @param {double} second 秒数
 */
function timeFormat(second) {
    var m = Math.floor(second / 60);
    var s = Math.floor(second % 60);

    if (m < 10) {
        m = '0' + m;
    }
    if (s < 10) {
        s = '0' + s;
    }

    return m + ":" + s;
}

/**
 * 显示隐藏歌曲列表和歌曲进度框
 */
musicListButton.onclick = function () {
    if (showDiv == 'true') {
        showDiv = 'false';
    } else {
        showDiv = 'true';
    }
    localStorage.setItem("showDiv", showDiv);

    if (showDiv == 'false') {
        musicListDiv.style.height = '0px';
        document.getElementById("div2").style.height = '0px';

        console.log("缩");
    } else {
        musicListDiv.style.height = '100px';
        document.getElementById("div2").style.height = '45px';
        console.log("展开");
    }

}

/**
 * 指定歌曲播放
 * @param {int} musicIndex 
 */
function playByIndex(musicIndex) {
    send({ type: 'playByIndex', value: musicIndex }, null);
}

/**
 * 为每个按钮附加onclick事件
 */
var musicButtons = document.getElementsByClassName("musicButton");
for (let i = 0; i < musicButtons.length; i++) {
    musicButtons[i].onclick = function () {
        console.log('playByIndex');
        playByIndex(i);
    }
}