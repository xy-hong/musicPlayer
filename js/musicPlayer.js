var player = document.getElementById("player");  //获取播放器
var index = localStorage.getItem("musicIndex")?localStorage.getItem("musicIndex"):0;  //musicList 下标，当前播放音乐在list中下标
player.src = musicList[index].url;
player.volume = localStorage.getItem("musicVolume")?localStorage.getItem("musicVolume"):0.5;

var models = ['列表循环', '列表随机', '单曲循环'];
var currentModel =localStorage.getItem("model")?localStorage.getItem("model"):"列表循环";  //当前播放模式

var log = console.log;



/**
 * @param {String} message 接收的消息
 * @param {Object} sender 发送者的信息，此处可忽略
 * @param {function} sendResponse 返回消息的函数,此处不使用
 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  switch (message.type) {
    case 'play' :
    playOrPause();
    break;

    case 'next':
    nextMusic();
    sendResponse( {name:musicList[index].name, author:musicList[index].author} );
    break;

    case 'previous':
    previousMusic();
    sendResponse( {name:musicList[index].name, author:musicList[index].author} );
    break;

    case 'volume':
    changeVolume(message.value);
    break;

    case 'refresh':
    sendResponse( {duration:Math.round(player.duration), currentTime:Math.round(player.currentTime), name:musicList[index].name, author:musicList[index].author} );
    break;

    case 'changeTime':
    changeCurrentTime(message.value);
    break;

    case 'model':
    changeModel();
    sendResponse( {model:currentModel});
    break;

    case 'playByIndex':
    console.log("进到了")
    playByIndex(message.value);
    break;

    default:
      break;
  }

  console.log("receive "+JSON.stringify(message));
});


/**
 * 需求：通过一个按钮控制音乐播放和停止
 * 实现：获取audio播放状态，将状态变成相反状态,改变播放图标
 */
function playOrPause(){
  if(player.paused){
    musicPlay();
  }else{
    musicPause();
  }
}

/**
 * 暂停音乐,切换图标为黑色，切换为暂停图标
 */
function musicPause(){  
  //  var player = document.getElementById("player");
  player.pause();
  chrome.browserAction.setIcon({path: {'19': 'images/icon_black_16.png'}});
  console.log("暂停")
}

/**
 * 播放音乐，切换图标为红色，切换为播放图标
 */
function musicPlay(){  
  // var player = document.getElementById("player");  //获取播放器
   player.play();
   chrome.browserAction.setIcon({path: {'19': 'images/icon_red_19.png'}});
   console.log("播放")
}

/**
 * 下一首
 */
function nextMusic(){
  index = (index+1)%musicList.length;
  localStorage.setItem("musicIndex",index);

  player.src = musicList[index].url;
  musicPlay();
}

/**
 * 上一首
 */
function previousMusic(){
  if(index==0){
    index=musicList.length-1;
  }else{
    index-=1;
  }
 
  localStorage.setItem("musicIndex",index);

  player.src = musicList[index].url;
  //player.play();
  musicPlay();

  log("上一首");
}

/**
 * 当歌曲结束时，根据currentModel决定接下来播放哪一首
 */
player.addEventListener("ended",function(){
    console.log("歌曲完毕");
   window.setTimeout(function(){

    switch (currentModel) {
      case '列表循环':
      console.log("列表循环");
      nextMusic();
          break;
      case '单曲循环':
          player.play();
          break;
      case '列表随机':
         randomPlay();
          break;   
    }
  },3000)        //间隔3秒才继续下一首

    
});

/**
 *更改播放模式 
 */
var m = 0;
function changeModel(){
  m = (++m)%models.length;
  currentModel = models[m];
  localStorage.setItem("model",currentModel);
  log("切换模式为 "+currentModel);
}

/**
 * 根据指定下标播放音乐
 * @param {int} musicIndex 音乐在musicList中的下标
 */
function playByIndex(musicIndex){
  console.log("playByIndex");
  index = musicIndex;
  localStorage.setItem("musicIndex",index);
  player.src = musicList[index].url;
  musicPlay();
}

/**
 * 改变音量
 * @param {double} musicVolume 音乐音量,在0.0-1.0区间
 */
function changeVolume(musicVolume){
  player.volume = musicVolume;
  localStorage.setItem("musicVolume",musicVolume);
}

/**
 * 改变音乐进度
 * @param {double} musicTimeValue 
 */
function changeCurrentTime(musicTimeValue){
  player.currentTime = musicTimeValue;
}

/**
 * 随机播放
 */
function randomPlay(){
  console.log(index);
  index = Math.floor(Math.random()*musicList.length);
  console.log(index);
  localStorage.setItem("musicIndex",index);
  player.src = musicList[index].url;
  player.play();
}
