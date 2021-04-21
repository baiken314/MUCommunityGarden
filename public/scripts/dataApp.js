const URL = "http://" + window.location.host;

// grab game information from the player-session and load into gameApp
async function updateDataApp() {
    console.log("updateGameApp in dataApp.js");

    const userSessionRequest = await fetch(URL + "/user-session");
    const userSession = await userSessionRequest.json();

}

socket.on("updateGameApp", updateDataApp);

let dataApp = new Vue({
    el: "#data-app",
    data: {
        user: {},
        event: {},
        gardens: {},
        posts: {},
        tasks: {}
    },
    methods: {

    }
});

updateDataApp();