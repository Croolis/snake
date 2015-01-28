// загрузчик звуков
// Важно: также как и перекрашивание, работает только из под одного домена (тобишь для корректной работы нужно запускать с сервера)
function BufferLoader(soundContext, urlList, callback) {
    this.soundContext = soundContext;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    // асинхронно подкачиваем файлы
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
        // декодируем данные
        loader.soundContext.decodeAudioData(
            request.response,
            function(buffer) {
            if (!buffer) {
                alert('error decoding file data: ' + url);
                return;
            }
            loader.bufferList[index] = buffer;
            if (++loader.loadCount == loader.urlList.length)
                loader.onload(loader.bufferList);
            },
            function(error) {
                console.error('decodeAudioData error', error);
            }
        );
    }   

    request.onerror = function() {
        console.log('BufferLoader: XHR error');
    }

    request.send();
}

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
}

window.onload = init;
var soundContext; 
var bufferLoader;

// запуск загрузки звуков
function init() {  
    window.AudiosoundContext = window.AudiosoundContext || window.webkitAudiosoundContext;
    soundContext = new AudioContext();

    bufferLoader = new BufferLoader(
        soundContext, 
        [
          'sound1.mp3', //список необходимых звуков 
          'sound2.mp3',
        ],
        finishedLoading  // callback
    );

    bufferLoader.load();
}

var soundBuffer; // массив загруженных звуков

function finishedLoading(bufferList) { // записать в массив после загрузки
    soundBuffer = bufferList;
}

// воспроизводит звук. Sound - объект из soundbuffer
function playSound(sound) {
    var source = soundContext.createBufferSource();
    source.buffer = sound;
    source.connect(soundContext.destination);
    source.start(0);
}
