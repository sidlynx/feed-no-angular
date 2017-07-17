var App = {
    data: {},
    allVideos: [],
    videos: [],
    videosToShow: [],
    page: 0,
    params: {
        $_search: '',
        $_10_likes: false,
        $_items_to_take: 10
    }
};

App.updateParams = function () {
    App.params.$_search = $("#search").val();
    App.params.$_10_likes = $('#10_likes').is(":checked");
    App.params.$_items_to_take = parseInt($('input[name=items]:checked').val());
};

App.render = function () {
    App.videos = App.allVideos;
    App.videos = App.searchVideos(App.videos, App.params.$_search);

    if (App.params.$_10_likes) {
        App.videos = App.filterVideos(App.videos);
    }

    if (App.page < 0) App.page = 0;
    else if (App.page > (App.paginateVideos(App.videos, App.params.$_items_to_take).length - 1)) App.page = App.paginateVideos(App.videos, App.params.$_items_to_take).length - 1;

    App.videosToShow = App.paginateVideos(App.videos, App.params.$_items_to_take)[App.page];


    var template = $('#template').html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, App);
    $('#target').html(rendered);

};
App.loadVideos = function () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            App.data = JSON.parse(this.responseText);
            App.allVideos = App.transformVideos(App.data.data);
            App.render();
        }
    };
    xhttp.open("GET", "videos.json", true);
    xhttp.send();
};
App.transformVideos = function (videos) {
    return videos.map(function (video) {
        var optVideo = {};
        optVideo.id = video.resource_key;
        if (video.user.pictures) {
            optVideo.user_image_url = video.user.pictures.sizes[video.user.pictures.sizes.length - 1].link;
        }
        else {
            optVideo.user_image_url = "assets/no-user-image.jpg";
        }
        optVideo.user_name = video.user.name;
        optVideo.user_link = video.user.link;

        optVideo.description = video.description;

        if (optVideo.description) {
            optVideo.short_description = optVideo.description.substring(0, 20);
            optVideo.htmlDescription = optVideo.description.replace(/(?:\r\n|\r|\n)/g, '<br />');
        }

        optVideo.name = video.name;
        optVideo.link = video.link;

        if (video.pictures) {
            optVideo.image_url = video.pictures.sizes[video.pictures.sizes.length - 1].link_with_play_button;
        }

        optVideo.comments_count = video.metadata.connections.comments.total;
        optVideo.likes_count = video.metadata.connections.likes.total;

        if (video.user.metadata.connections.likes.total) {
            optVideo.user_likes_count = video.user.metadata.connections.likes.total;
        }
        return optVideo;
    })
};
App.searchVideos = function (videos, search) {
    var tempVideos = [];
    videos.forEach(function (video) {
        if (video.description && video.description.indexOf(search) >= 0) {
            tempVideos.push(video);
        }
    });
    return tempVideos;
};
App.filterVideos = function (videos) {
    var tempVideos = [];
    videos.forEach(function (video) {
        if (video.user_likes_count >= 0) tempVideos.push(video);
    });
    return tempVideos;
};
App.paginateVideos = function (videos, items_per_page) {
    return _.chunk(videos, items_per_page);
};


$(document).ready(function () {
    App.loadVideos();

    $('input[type=radio][name=items]').change(function () {
        App.updateParams();
        App.render();
    });

    $("#search").change(function () {
        App.updateParams();
        App.render();
    });

    $("#search").keyup(function () {
        App.updateParams();
        App.render();
    });

    $("#prev").click(function () {
        App.page--;
        App.render();
    });

    $("#next").click(function () {
        App.page++;
        App.render();
    });

    $("#10_likes").change(function () {
        App.updateParams();
        App.render();
    });
});