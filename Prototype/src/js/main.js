var latestURL = "";
var videoId = "";
var noteTitle = "";
var timestamp = 0;
var tsList = [];
var tempTs = [];
var tsListCount = 0;
var videoTitle;

// YOUTUBE VIDEO INITIALIZATION
latestURL = window.localStorage.getItem("embedURL");
videoId = window.localStorage.getItem("videoId");
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var videotime = 0;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    // height: '390',
    // width: '640',
    videoId: videoId,
    events: {
      onReady: onPlayerReady,
    },
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
  function updateTime() {
    var oldTime = videotime;
    if (player && player.getCurrentTime) {
      videotime = player.getCurrentTime().toFixed(2);
      document.getElementById("timeurl").innerHTML = videotime;
    }
  }
  timeupdater = setInterval(updateTime, 10);
}

function stopVideo() {
  player.stopVideo();
}

// SPLIT LIBRARY

Split([".a", ".b"], {
  gutterSize: 5,
  sizes: [50, 50],
  minSize: [200, 200],
});

//CKEDITOR PART

var noteContent;


var editor = CKEDITOR.replace("mytextarea");
CKEDITOR.config.tabSpaces = 4;
CKEDITOR.config.height = "80vh";
CKEDITOR.config.removePlugins = "specialchar,image";

CKEDITOR.config.extraPlugins = "codesnippet";

editor.on("change", function (evt) {
  // getData() returns CKEditor's HTML content.
  //console.log( 'Total bytes: ' + evt.editor.getData() );
  console.log("something typed");
});
function saveHandle() {
  console.log("save clicked");
  noteContent = CKEDITOR.instances.mytextarea.getData();
  database.collection("user-note").doc("note1").update({
    noteContent: noteContent,
  });
  console.log("noteContent: " + noteContent);
}
function openHandle() {
  console.log("open clicked");

  CKEDITOR.instances.mytextarea.setData("");

  database
    .collection("user-note")
    .doc("note1")
    .get()
    .then(function (doc) {
      noteContent = doc.data().noteContent;
      CKEDITOR.instances.mytextarea.insertHtml(noteContent);
    });
}

// Firestore

// function setPost(){
//     database.collection('posts')
//             .doc()
//             .set({
//                 author : "hyunsoo",
//                 createdAt : "2020-05-29",
//                 postContent: "This is 2nd post",
//                 postName : "Welcome Again!"
//             })
// }
// setPost();

// function getPosts() {
// function doseNoteExist() {
//   database
//     .collection("user-note")
//     .get()
//     .then((snapshot) => {
//       snapshot.docs.forEach((docs) => {
//         console.log(docs.data());
//         // console.log(docs.data());
//         docs.data().title;
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

// function deleteDoc(){
//     database.collection("posts")
//             .doc('document1').delete();
// }
// deleteDoc();

//OpenNote call
function openNoteHandler(title) {
  CKEDITOR.instances.mytextarea.setData("");
  while (tsListCount != 0) {
    $("#tsDiv").prev("#tsLists").remove();
    tsListCount--;
  }
  tsList = [];
  tempTs = [];
  database
    .collection("user-note")
    .where("title", "==", title)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        latestURL = doc.data().latestURL;
        CKEDITOR.instances.mytextarea.insertHtml(doc.data().noteContent);
        title = doc.data().title;

        videoTitle = doc.data().title;
        $("#noteTitle").text(videoTitle);
        videoId = doc.data().latestURL;
        console.log("VideoTitle is");
        console.log(videoTitle);
        player.loadVideoById({
          videoId: latestURL,
        });
      });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });

    // navbar note title update
   
  console.log("docs want!");
  database
    .collection("user-note")
    .doc(title)
    .collection("timestamps")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data().title);
        tempTs = [];

        _id = doc.data().videoId;
        _title = doc.data().title;
        _time = doc.data().time;
        _date = doc.data().date;

        tempTs.push(_id);
        tempTs.push(_title);
        tempTs.push(_time);
        tempTs.push(_date);

        // Add tempTs in tsList
        tsList.push(tempTs);
        tempTs = [];
      });
      tsList.map((eachTS) => {
        tsListCount++;
        // id = eachTS[0];
        // stime = eachTS[2];
        $(`
                  <div id="tsLists" class="d-flex flex-row">
                      <div class="pl-4 align-self-start">
                          <a href = "#" onclick="openVideoByTS('${eachTS[0]}', '${eachTS[2]}');">
                              <p>[${eachTS[2]}]</p>
                          </a>
                      </div>
                      <div class="VideoURL pl-4 align-self-end">${eachTS[1]}</div>
                  </div>
                  `).insertBefore("#tsDiv");
      });
    });



  $("#cancel-opn").click();
}

// TIMESTAMP VIDEO CALL
function openVideoByTS(id, ts) {
    videoId = id;
  player.loadVideoById({
    videoId: id,
    startSeconds: ts,
  });

  $("#cancel-ts").click();
}

$(document).ready(function () {
  latestURL = window.localStorage.getItem("embedURL");

  // SET NEW YOUTUBE VIDEO

  $("#newVideoURLBtn").click(function () {
    var newUrl = $("#urlInput").val();
    console.log(newUrl);
    var isValidURL = embed_videoURL_generator(newUrl);
    if (isValidURL) {
      player.loadVideoById({
        videoId: videoId,
      });

      $("#newVideoURLBtn").prop("href", "main.html");
      $("#cancel-btn").click();
    } else {
      alert("Enter a valid Youtube URL");
    }
  });

  // REFRESH NEW VIDEO URL INPUT BOX

  $("#watchNewVideo").click(function () {
    $("#urlInput").val("");
  });
  //OPEN NOTE

  var noteCount = 0;
  $("#opennote").click(function () {
    console.log("opennote");
    // var tsTitleInput = $("#tsTitle").val();
    // if (tsTitleInput != undefined || tsTitleInput != "") {
    //   while (tsListCount != 0) {
    //     $("#tsDiv").prev("#tsLists").remove();
    //     tsListCount--;
    //   }
    // Add title, time and date in tempTs
    while (noteCount != 0) {
      $("#opnDiv").next("#notesLists").remove();
      console.log("notecount", noteCount);
      noteCount--;
    }
    database
      .collection("user-note")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((docs) => {
          console.log("doc", docs.data().title);
          noteCount++;

          $(`
                <div id="notesLists" class="d-flex flex-row">
                    <div class="pl-4 align-self-start">
                        <a href = "#" onclick="openNoteHandler('${
                          docs.data().title
                        }');">
                            <p>${docs.data().title}</p>
                        </a>
                    </div>
                   
                </div>
                `).insertAfter("#opnDiv");
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  // TIMESTAMP SAVING

  $("#saveTS").click(function () {
    var tsTitleInput = $("#tsTitle").val();
    if (tsTitleInput != undefined || tsTitleInput != "") {
      while (tsListCount != 0) {
        $("#tsDiv").prev("#tsLists").remove();
        tsListCount--;
      }
      // Add title, time and date in tempTs
      tempTs.push(videoId);
      tempTs.push(tsTitleInput);
      tempTs.push(videotime);
      tempTs.push(new Date());

      // Add tempTs in tsList
      tsList.push(tempTs);
      console.log(tsList.length);
      var id = "";
      var stime = 0;
      tsList.map((eachTS) => {
        tsListCount++;
        // id = eachTS[0];
        // stime = eachTS[2];
        $(`
                <div id="tsLists" class="d-flex flex-row">
                    <div class="pl-4 align-self-start">
                        <a href = "#" onclick="openVideoByTS('${eachTS[0]}', '${eachTS[2]}');">
                            <p>[${eachTS[2]}]</p>
                        </a>
                    </div>
                    <div class="VideoURL pl-4 align-self-end">${eachTS[1]}</div>
                </div>
                `).insertBefore("#tsDiv");
      });

      // set tempTS list empty
      tempTs = [];
      //$('#cancel-ts').click();
    }
    // var count = 0;
    // if ($('.modal-videoURLs').is(":empty")){
    //     videoLists.map(videoURL => {
    //         $('.modal-videoURLs').append(`
    //         <div class="d-flex flex-row">
    //             <div class="p-4 align-self-start">
    //             <p><i class="fas fa-video"></i><br>URL</p>
    //             </div>
    //             <a href="main.html"><div id="url${count}" class="VideoURL p-4 align-self-end">${videoURL}</div></a>
    //         </div>
    //         `);
    //         count += 1;
    //     });
    // }
  });

  // EMBED VIDEOURL GENERATOR

  function embed_videoURL_generator(url) {
    if (url != undefined || url != "") {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length == 11) {
        // Do anything for being valid
        // if need to change the url to embed url then use below line
        videoId = match[2];
        latestURL = "https://www.youtube.com/embed/" + match[2] + "?autoplay=0";
        return true;
      } else {
        // Do anything for not being valid
        return false;
      }
    }
  }

  function timestampFunction() {
    var table = document.getElementById("timestampTable");

    if ("explanation" != "") {
      var row = table.insertRow(1);
      row.classname = "newtimestamp";
      var c1 = row.insertCell(0);
      var c2 = row.insertCell(1);

      c2.innerHTML = document.getElementById("explanation").value;

      var player = document.getElementById("player");
      var time = player.getCurrentTime();

      setTimeout(stopVideo, 6000);
      if (player && player.getCurrentTime) {
        videotime = player.getCurrentTime();

        var prettytime = parseInt(videotime);
        document.getElementById("timeurl").innerHTML = prettytime;
      }
    }
  }
});

// CREATE NEW NOTE

$("#newNoteBtn").click(function () {
  var empty = "";
  $("#noteTitle").html(empty);
  // clear note section
  CKEDITOR.instances.mytextarea.setData("");
  // clear note title
  
  // make timestamp list empty
  tsList = [];
  while (tsListCount != 0) {
    $("#tsDiv").prev("#tsLists").remove();
    tsListCount--;
  }

  // SAVE NOTE VALIDATE
 
  // Open modal for new video URL
  $("#watchNewVideo").click();
  $("#cancel-newNote").click();
});

// PREVENT ENTER KEY DOWN

$('input[type="text"]').keydown(function () {
  if (event.keyCode === 13) {
    event.preventDefault();
  }
});

// SAVE NOTE
$("#saveNoteBtn").click(function () {
  alert("saveNoteBTN");

  var title = $("#saveNoteInput").val();
  videoTitle = title;
  // navbar Note Title update
  $("#noteTitle").html(title);
  database.collection("user-note").doc(title).set({
    title: title,
    noteContent: CKEDITOR.instances.mytextarea.getData(),
    latestURL: videoId,
    date: new Date(),
  });
  tsList.map((eachTS) => {
    database
      .collection("user-note")
      .doc(title)
      .collection("timestamps")
      .doc(eachTS[1])
      .set({
        videoId: eachTS[0],
        title: eachTS[1],
        time: eachTS[2],
        date: eachTS[3],
      })
      .catch((err) => {
        console.log(err);
      });
  });

  $("#cancel-saveNote").click();
});

$("#saveNote").click(function () {
  console.log("saveNoteClicked");
  console.log("if test",videoTitle);
  if (videoTitle === "" || videoTitle == undefined) {
    // Save Note Action with title (Modal required)
    //$("#saveNoteModal").open();
       $("#saveNote").prop("href", "#saveNoteModal");
  } else {
    // Save Note Action without  title

    
    database.collection("user-note").doc(videoTitle).update({
      noteContent: CKEDITOR.instances.mytextarea.getData(),
      latestURL: videoId,
      date: new Date(),
    });
    tsList.map((eachTS) => {
      database
        .collection("user-note")
        .doc(videoTitle)
        .collection("timestamps")
        .doc(eachTS[1])
        .update({
          videoId: eachTS[0],
          title: eachTS[1],
          time: eachTS[2],
          date: eachTS[3],
        })
        .catch((err) => {
          console.log(err);
        });

    });

   
  }
});

