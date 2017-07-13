var App = {};
App.data = {};
App.videos = [];
App.render = function () {
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
            App.videos = _.take(App.data.data,10);
            console.log(App.videos[0]);
            //App.video =
            //App.render();
        }
    };
    xhttp.open("GET", "videos.json", true);
    xhttp.send();
}










$(document).ready(function () {
    App.loadVideos();
});