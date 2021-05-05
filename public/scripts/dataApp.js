const socket = io();

const URL = "http://" + window.location.host;


/************
 * API CALLS
 ************/
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
    dataApp.currentPost = userSession.currentPost;

    console.log(JSON.stringify(userSession.currentPost));
}

async function createPost(args, dataApp) {
    console.log("BEGIN createPost");

    args.user = dataApp.user._id;

    console.log(args);

    const req = await fetch(URL + "/post/create", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });
    const res = await req.json();

    console.log("END makePost " + res);
}

async function updatePost(args, dataApp) {
    console.log("BEGIN updatePost");

    args.user = dataApp.user._id;

    console.log(args);

    const req = await fetch(URL + "/post/update", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });
    const res = await req.json();

    console.log("END updatePost " + res);
}

async function deletePost(args, dataApp) {
    console.log("BEGIN deletePost");

    args.user = dataApp.user._id;
    args.post = [args.post];

    console.log(args);

    const req = await fetch(URL + "/post/update", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });
    const res = await req.json();

    console.log("END deletePost " + res);
}

async function likePost(args, dataApp) {
    console.log("BEGIN likePost");

    args.user = dataApp.user._id;
    args.posts = dataApp.currentPost._id;

    console.log(args);

    const req = await fetch(URL + "/post/update", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });
    const res = await req.json();

    console.log("END likePost " + res);
}

async function createTask(args, dataApp) {}
async function updateTask(args, dataApp) {}
async function deleteTask(args, dataApp) {}
async function toggleCompleteTask(args, dataApp) {}

async function logVolunteerHours(args, dataApp) {

}

// below functions for admins
async function toggleApproveVolunteerHours(args, dataApp) {}

async function createGarden(args, dataApp) {}
async function deleteGarden(args, dataApp) {}
async function assignGardenToUser(args, dataApp) {}
async function removeGardenFromUser(args, dataApp) {}

async function createEvent(args, dataApp) {}
async function updateEvent(args, dataApp) {}
async function deleteEvent(args, dataApp) {}


/*********
 * VUE APP
 *********/
let dataApp = new Vue({
    el: "#data-app",
    data: {
        user: {},
        events: {},
        gardens: {},
        posts: {},
        tasks: {},
        currentPost: {},  // used for post.html
        
        title: null,
        tags: null,
        content: null,
        isAnnouncement: null
    },
    methods: {
        createPost: async function () {
            if (this.title.length && this.content.length) {
                await createPost({
                    user: this.user._id,
                    tags: this.tags.split(/[ ]*,[ ]*/),
                    type: this.isAnnouncement && this.user.type == "admin" ? "announcement" : "post",
                    title: this.title,
                    content: this.content
                }, this);
                window.location = URL + "/forum";   
            }
        },

        createComment: async function () {
            if (this.content.length) {
                await createPost({
                    user: this.user._id,
                    tags: [],
                    type: "post",
                    title: "",
                    content: this.content,
                    parent: this.currentPost._id
                }, this);
                this.content = null;
                updateDataApp(this);
            }
        },

        likePostFromPostPage: async function () {
            await likePost({ post: this.currentPost._id }, this);
            updateDataApp(this);
        },

        // this should only be available to users that are looking at their own post or whose type == "admin"
        deletePostFromPostPage: async function () {
            await deletePost({ post: this.currentPost._id }, this);
            window.location = URL + "/forum";
        }
    }
});


/*****************
 * SOCKET.IO CALLS
 *****************/
socket.on("updateDataApp", updateDataApp(dataApp));


/******
 * INIT
 ******/
updateDataApp(dataApp);