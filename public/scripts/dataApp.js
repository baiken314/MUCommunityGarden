const socket = io();

const URL = "http://" + window.location.host;

// grab all information for a user
async function updateDataApp(dataApp) {
    console.log("updateGameApp in dataApp.js");

    const userSessionRequest = await fetch(URL + "/user-session");
    const userSession = await userSessionRequest.json();

    dataApp.user = userSession.user;
    dataApp.events = userSession.events;
    dataApp.gardens = userSession.gardens;
    dataApp.posts = userSession.posts;
    dataApp.tasks = userSession.tasks;
}

async function makePost(args, dataApp) {

    args.user = dataApp.user._id;

    const req = await fetch(URL + "/", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });
    const res = await playerAttackRequest.json();

    console.log(res);

    window.location = URL + "/forum";

}

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

socket.on("updateDataApp", updateDataApp(dataApp));

// init
updateDataApp(dataApp);