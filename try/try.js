var player = document.getElementById("player");  //播放元素
var index = window.localStorage.getItem("index")?localStorage.getItem("index"):0;  //当前歌曲下标
var models = ['列表顺序','列表随机','单曲循环'];
var currentModel = '列表顺序';

player.src = musicList[index].url;

function showVolumn(){
   var s = document.getElementById("volumn");
   s.hidden = !s.hidden;
  
}

/**
 * 移动滑条控制音量大小
 */
document.getElementById("volumn").onchange = function(){
    var size = document.getElementById("volumn").value;
    document.getElementById("volumnNumber").innerText = size;
    player.volume = size;
}
/**
 * 用单独的控制按钮，控制播放和暂停
 */
document.getElementById("button").onclick = function(){
    if(player.paused){
        player.play();
    }else{
        player.pause();
    }
}

/**
 * 播放，换播放图标
 */
document.getElementById("playButton").onclick = function(){
    player.play();
}

/**
 * 暂停，换暂停图标
 */
document.getElementById("pauseButton").onclick = function(){
    player.pause();
}

window.onload = function(){
     var timeRange = document.getElementById("musicTimeRange");
    timeRange.max = player.duration;
    document.getElementById("duration").innerText = player.duration;
    document.getElementById("currentTime").innerText = player.currentTime;
    timeRange.value = player.currentTime;
}

/*player.onTimeUpdate = function(){
    document.getElementById("currentTime").innerText = player.currentTime;
    document.getElementById("musicTimeRange").value = player.currentTime;
}*/

/*变化频繁,与主动控制进度的方法有冲突
player.addEventListener("timeupdate",function(){
    document.getElementById("currentTime").innerText = player.currentTime;
    document.getElementById("musicTimeRange").value = player.currentTime;
})*/
/**
 * 每隔一秒，更新进度条
 */
window.setInterval(function(){
    document.getElementById("currentTime").innerText = player.currentTime;
    document.getElementById("musicTimeRange").value = player.currentTime;
},1000)

/**
 * 当拖动进度条，改变进度（直接改变value不会触发onchange）
 */
document.getElementById("musicTimeRange").onchange = function(){
    player.currentTime = document.getElementById("musicTimeRange").value;
    
}

document.getElementById("nextButton").onclick = function(){
    index = (index+1)%musicList.length;
    var url = musicList[index].url;
    
    localStorage.setItem("index",index);

    player.src = url;
    
    player.play();
    
}

document.getElementById("previousButton").onclick = function(){
    if(index==0){
        index=musicList.length-1;
    }else{
        index-=1;
    }

    var url = musicList[index].url;
    
    localStorage.setItem("index",index);

    player.src = url;
    
    player.play();
    console.log("上一首");
    
}


player.ondurationchange= function () {
    console.log(index);
    document.getElementById("musicTimeRange").max = player.duration;
    document.getElementById("duration").innerText = player.duration;
    document.getElementById("name").innerText = musicList[index].name;

    document.getElementById("author").innerText = musicList[index].author;
    
}

/**
 * 当歌曲播放完毕，根据播放模式，决定播放哪一首
 */
player.addEventListener("ended",function(){
    console.log("歌曲完毕");
    
    switch (currentModel) {
        case '列表顺序':
        console.log("列表顺序");
        document.getElementById("nextButton").click();
            break;
        case '单曲循环':
            player.play();
            break;
        case '列表随机':
            index = Math.floor(Math.random*musicList.length);
            player.src = musicList[index].url;
            break;
        default:
            break;
           
    }
});

var m = 0;
document.getElementById("model").onclick = function(){
    m = (m+1)%3;
    currentModel = models[m];
    document.getElementById("model").innerText = '播放模式:'+currentModel;
}

document.getElementById("listButton").onclick = function(){
    var height = document.getElementById("musicBox").style.height;
    if (height=="0px") {
        document.getElementById("musicBox").style.height="400px";
    } else {
        document.getElementById("musicBox").style.height="0px";
    }
}