document.getElementById("musicListButton").onclick = function(){
    var h = document.getElementById("musicListDiv").style.height;

    if(h=='0px'){
        document.getElementById("musicListDiv").style.height='100px';
        document.getElementById("div2").style.width='55%';
        document.getElementById("div2").style.height='100%';
    }else{
        document.getElementById("musicListDiv").style.height='0px';
        document.getElementById("div2").style.width='0px';
        document.getElementById("div2").style.height='0px';
    }
}

document.getElementById("volumeButton").onclick = function(){
    document.getElementById("volumeRange").hidden = !document.getElementById("volumeRange").hidden;
    
}

/*document.getElementById("musicListButton").onclick = function(){
    var h = document.getElementById("musicListDiv").hidden;

    if(h==true){
        document.getElementById("musicListDiv").hidden=false;
        document.getElementById("div2").hidden=false;
        
    }else{
        document.getElementById("musicListDiv").hidden=true;
        document.getElementById("div2").hidden=true;
    }
}*/