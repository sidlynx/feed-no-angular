var App = {};
App.data = {};
App.videos = [];
App.page = 1;
App.render = function () {
    //
    App.videos = App.data.data;
    var search = $("#search").val();
    var itemsToTake = parseInt($('input[name=items]:checked').val());
    App.optVideos = [];
    App.videos.forEach(function (video) {
        var optVideo = {};
        optVideo.id = video.resource_key;
        if (video.user.pictures) {
            optVideo.user_image_url = video.user.pictures.sizes[video.user.pictures.sizes.length - 1].link;
        }
        optVideo.user_name = video.user.name;
        optVideo.user_link = video.user.link;

        optVideo.description = video.description;

        if(optVideo.description){
            optVideo.short_description = optVideo.description.substring(0,20);
        }

        optVideo.name = video.name;
        optVideo.link = video.link;

        if (video.pictures) {
            optVideo.image_url = video.pictures.sizes[video.pictures.sizes.length - 1].link;
        }

        optVideo.comments_count = video.metadata.connections.comments.total;
        optVideo.likes_count = video.metadata.connections.likes.total;


        if(optVideo.description && optVideo.description.indexOf(search) >= 0){
            App.optVideos.push(optVideo);
        }

        App.optVideos = _.take(App.optVideos,itemsToTake);
    })


    var template = $('#template').html();
    Mustache.parse(template);   // optional, speeds up future uses
    var rendered = Mustache.render(template, App);
    $('#target').html(rendered);

}

App.loadVideos = function () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            App.data = JSON.parse(this.responseText);
            App.videos = _.take(App.data.data, 10);
            console.log(App.videos);
            App.render();
        }
    };
    xhttp.open("GET", "videos.json", true);
    xhttp.send();
}


$(document).ready(function () {
    App.loadVideos();

    $('input[type=radio][name=items]').change(function () {
        App.render();
    });

    $("#search").change(function() {
        App.render();
    });

    $("#search").keyup(function() {
        App.render();
    });
});