const socket = io();

const URL = "http://" + window.location.host;

// grab game information from the player-session and load into gameApp
async function updateDataApp() {
    console.log("updateGameApp in dataApp.js");

    const userSessionRequest = await fetch(URL + "/user-session");
    const userSession = await userSessionRequest.json();

    dataApp.user = userSession.user;
    dataApp.events = userSession.evemts;
    dataApp.gardens = userSession.gardens;
    dataApp.posts = userSession.posts;
    dataApp.tasks = userSession.tasks;
}

socket.on("updateDataApp", updateDataApp);

let dataApp = new Vue({
    el: "#data-app",
    data: {
        user: {},
        events: {},
        gardens: {},
        posts: {},
        tasks: {}
    },
    methods: {

    }
});

updateDataApp();