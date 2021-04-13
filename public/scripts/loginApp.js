const URL = "http://" + window.location.host;

let loginApp = new Vue({
    el: "#login-app",
    data: {
        mode: "login"
    },
    methods: {
        toggleMode: function () {
            console.log("TOGGLING MODE");
            this.mode = this.mode == "login" ? "signup" : "login";
        }
    }
});