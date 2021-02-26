AgoraRTC.Logger.enableLogUpload();

const liveMode = !!window.location.search.match(/live\=true/);
var client = AgoraRTC.createClient({ mode: "live", codec: "h264" });
AgoraRTS.init(AgoraRTC, {
  wasmDecoderPath: "AgoraRTS.wasm",
  asmDecoderPath: "AgoraRTS.asm",
  /**
   * 直播模式下为了保证流畅度，拉大延迟到 5s
   */
  bufferDelay: liveMode ? 5000 : 0,
  maxBufferDelay: 10000,
}).catch(e => {
  if (e === "LOAD_DECODER_FAILED") {
    console.log("加载解码器失败！");
  }
});
AgoraRTS.proxy(client);

client.enableAudioVolumeIndicator();

if (!AgoraRTS.checkSystemRequirements()) {
  alert("您的浏览器不支持 RTS！");
} else {
  console.log("check success");
}

var subscribedStreams = {};
var remoteStreams = {};

client.on("stream-type-changed", function (e) {
  console.log("stream-type-changed", e);
});

client.on("stream-subscribed", function (e) {

  var stream = e.stream;
  subscribedStreams[stream.getId()] = stream;
  playRemoteStream(stream);
});

client.on("peer-leave", function (e) {
  unsubscribe(e.uid, true);
  delete remoteStreams[e.uid];
})

$("#form").on("submit", function (e) {
  e.preventDefault();

  var channelName = $("#channel").val();
  var key = $("#key").val();
  var token = $("#token").val();
  var uid = $("#uid").val();
  if (!channelName || !key) return;

  joinChannel(channelName, key, token, uid);
});

function joinChannel(channelName, key, token, uid) {
  startSubscribe();
  console.log(channelName, key, token, parseInt(uid));
  client.init(key, function() {
    client.join(token || null, channelName, parseInt(uid) || null, function(uid) {
      $("#joinchannel_btn").addClass("disabled");
      $("#joinchannel_btn").css("pointer-events", "none");

      let noPub = !!window.location.search.match(/no_pub\=true/);
      noPub = true;
      if (!noPub) {
        var localStream = AgoraRTC.createStream({
          streamID: uid,
          audio: true, video: true, screen: false,
        });

        localStream.init(function() {
          localStream.play("local-stream__slot");
          client.publish(localStream);
        }, function(err) {
          console.error(err);
          showNotSupport();
        });

      }

    });
  });
}

function startSubscribe() {
  client.on("stream-added", function(e) {
    console.log("start subscribe", e);
    var stream = e.stream;
    remoteStreams[stream.getId()] = stream;
    client.subscribe(stream, { video: true, audio: true });
  });

  client.on("stream-removed", function(e) {
    var stream = e.stream;
    const id = stream.id;
    delete remoteStreams[id];
    delete subscribedStreams[id];
    $(`#streamid-${id}`).remove();
  });

  client.on("peer-leave", function(e) {
    var id = e.uid;
    delete remoteStreams[id];
    delete subscribedStreams[id];
    $(`#streamid-${id}`).remove();
  }); 

  client.on("first-audio-frame-decode", function(e) {
    $(`#streamid-${e.stream.getId()} .remote-audio-first-decoded`).text(`首帧音频解码时间: ${e.time}ms`);
  }); 

  client.on("first-video-frame-decode", function(e) {
    $(`#streamid-${e.stream.getId()} .remote-video-first-decoded`).text(`首帧视频解码时间: ${e.time}ms`);
  }); 

  client.on("first-video-frame-rendered", function(e) {
    $(`#streamid-${e.stream.getId()} .remote-video-first-rendered`).text(`首帧视频渲染时间: ${e.time}ms`);
  }); 

  client.on("mute-video", function(e) {
    $(`#streamid-${e.uid} .remote-video-mute`).text(`video mute: true`);
  }); 

  client.on("mute-audio", function(e) {
    $(`#streamid-${e.uid} .remote-audio-mute`).text(`audio mute: true`);
  }); 

  client.on("unmute-video", function(e) {
    $(`#streamid-${e.uid} .remote-video-mute`).text(`video mute: false`);
  }); 

  client.on("unmute-audio", function(e) {
    $(`#streamid-${e.uid} .remote-audio-mute`).text(`audio mute: false`);
  }); 

  client.on("stream-updated", function(e) {
    console.trace("stream updated: ", e.stream.getId());
  }); 

  client.on("exception", function(e) {
    console.log('exception: ',e.code, e.msg, e.uid);
  }); 

  client.on("volume-indicator", function(e) {
    // console.log('volume-indicator', e);
  }); 
}

function playRemoteStream(stream) {
  var id = stream.getId();
  window["stream-"+id] = stream;
  if ($(`#streamid-${id}`).length > 0) {
    $(`#streamid-${id} .btn`).text("取消订阅");
  } else {
    var remotePlayerElement = $(`
      <div class="remote-player-container" id="streamid-${id}">
        <div class="remote-player__stats">
          <p>StreamId: ${id}</p>
          <p class="remote-decode-frame-rate"></p>
          <p class="remote-frame-rate"></p>
          <p class="remote-video-resolution"></p>
          <p class="remote-audio-volume"></p>
          <p class="remote-audio-first-decoded"></p>
          <p class="remote-video-first-decoded"></p>
          <p class="remote-video-first-rendered"></p>
          <p class="access-delay"></p>
          <p class="e2e-delay"></p>
          <p class="audio-delay"></p>
          <p class="video-delay"></p>
          <p class="remote-video-mute">video mute: false </p>
          <p class="remote-audio-mute">audio mute: false </p>
          <input class="remote-set-volume" type="range" min="0" max="100"></input>
        </div>
        <div class="remote-player" id="player-${id}"></div>
        <button class="btn btn-primary" type="button">取消订阅</button>
      </div>
    `);

    var btn = remotePlayerElement.find("button");
    btn.on("click", function() {
      var stream = subscribedStreams[id];
      if (!stream) {
        console.log("resubscribe", id, remoteStreams[id]);
        client.subscribe(remoteStreams[id], { video: true, audio: true }, function(err) {
          console.log("subscribe faild!", err);
        });
      }
      unsubscribe(id, false);
    });

    var input = remotePlayerElement.find(`input`);
    input.on('change', function(e) {
      console.log(`set stream ${id} volume ${e.target.value}`);
      stream.setAudioVolume(Number(e.target.value));
    });

    $("#remote-streams__slot").append(remotePlayerElement);
  }
  stream.play("player-" + id);
}

function unsubscribe(id, cleanDom) {
  if (cleanDom) {
    $(`#streamid-${id}`).remove();
  } else {
    $(`#streamid-${id} .btn`).text("重新订阅");
  }
  var stream = subscribedStreams[id];
  if (!stream) return;
  client.unsubscribe(stream);
  delete subscribedStreams[id];
}

function streamStatsInterval() {
  for (var id in subscribedStreams) {
    var stream = subscribedStreams[id];
    stream.getStats(function(stats) {
      var decodeFrameRate = Number(stats.videoReceiveDecodeFrameRate);
      var receiveFrameRate = Number(stats.videoReceiveFrameRate);
      var videoHeight = stats.videoReceiveResolutionHeight;
      var videoWidth = stats.videoReceiveResolutionWidth;
      var accessDelay = stats.accessDelay;
      var endToEndDelay = stats.endToEndDelay;
      var audioReceiveDelay = stats.audioReceiveDelay;
      var videoReceiveDelay = stats.videoReceiveDelay;
      $(`#streamid-${id} .remote-decode-frame-rate`).text(`解码帧率: ${decodeFrameRate.toFixed(2)}`);
      $(`#streamid-${id} .remote-frame-rate`).text(`接收帧率: ${receiveFrameRate.toFixed(2)}`);
      $(`#streamid-${id} .remote-video-resolution`).text(`视频分辨率: ${videoWidth} x ${videoHeight}`);
      $(`#streamid-${id} .access-delay`).text(`AccessDealy ${accessDelay}`);
      $(`#streamid-${id} .e2e-delay`).text(`EndToEndDealy ${endToEndDelay}`);
      $(`#streamid-${id} .audio-delay`).text(`AudioDealy ${audioReceiveDelay}`);
      $(`#streamid-${id} .video-delay`).text(`VideoDealy ${videoReceiveDelay}`);
    });
  }
}

function streamVolume() {
  for (var id in subscribedStreams) {
    var stream = subscribedStreams[id];
    var level = stream.getAudioLevel();
    if(stream.isPlaying()) {
      $(`#streamid-${id} .remote-audio-volume`).text(`音量: ${Math.ceil(level / 1 * 100)}% (${level})`);
    }
  }
}

setInterval(streamStatsInterval, 2000);
setInterval(streamVolume, 100);

function showNotSupport() {
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
  var nativeBrowserName = "系统浏览器";
  if (isIOS) {
    nativeBrowserName = "Safari";
  }
  if (isAndroid) {
    nativeBrowserName = "Chrome";
  }
  $(".notsupport-wrapper__warn span").text(nativeBrowserName);
  $(".notsupport-location").text(location.href);

  $(".notsupport-wrapper").addClass("active");
  $(".notsupport-wrapper .btn").click(function() {
    $(".notsupport-wrapper").removeClass("active");
  });
}
