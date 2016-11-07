var loginViewModel;

function LoginModel() {
    var self = this;

    self.hasLoginError = ko.observable(false);
}

$(function () {
    var loginError = $("#hdnHasLoginError").val() === "true";

    loginViewModel = new LoginModel();

    ko.applyBindings(loginViewModel, document.getElementById('ko-login'));

    loginViewModel.hasLoginError(loginError)
});