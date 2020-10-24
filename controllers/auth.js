exports.getLogin = (request, response, next) => {

    // in order to extract the true value from Cookie
    const isLoggedIn = request
            .get("Cookie")
            .split(";")[1]
            .trim()
            .split("=")[1] === 'true';

    response.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        isAuthenticated: isLoggedIn
    });

};

exports.postLogin = (request, response, next) => {

    // Expires is expiration date
    response.setHeader("Set-Cookie", "loggedIn=true");

    response.redirect("/");

};