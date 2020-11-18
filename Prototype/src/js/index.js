var embed_video_url = "";
var videoId = "";
$(document).ready(function(){

    $('#urlBtn').click(function (){
        var url = $('#videoUrl').val();
        var isValidURL = embed_videoURL_generator(url);
        if(isValidURL){
            $('#urlBtn').prop('href', "main.html");
            //$('#ytplayer').attr('src', embed_video_url);
            window.localStorage.setItem('embedURL', embed_video_url);
            window.localStorage.setItem('videoId', videoId);
        } else {
            alert("Enter a valid Youtube URL");
        }
    });

    function embed_videoURL_generator(url){
        if (url != undefined || url != '') {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                // Do anything for being valid
                // if need to change the url to embed url then use below line
                videoId = match[2];
                embed_video_url = 'https://www.youtube.com/embed/' + match[2] + '?autoplay=0';
                //$('#ytplayerSide').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=0');
                return true;
            }
            else {
                // Do anything for not being valid
                return false;
            }
        }
    }
    
});