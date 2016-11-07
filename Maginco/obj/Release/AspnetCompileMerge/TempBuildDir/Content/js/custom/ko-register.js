var registerViewModel;

function RegisterModel() {
    var self = this;

    self.hasRegisterError = ko.observable(false);
}

$(function () {
    var registerError = $("#hdnHasRegisterError").val() === "true";

    registerViewModel = new RegisterModel();

    ko.applyBindings(registerViewModel, document.getElementById('ko-register'));

    registerViewModel.hasRegisterError(registerError)
});