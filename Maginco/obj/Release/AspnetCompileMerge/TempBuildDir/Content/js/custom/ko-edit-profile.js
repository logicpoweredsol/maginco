var editProfileViewModel;

function EditProfileModel() {
    var self = this;

    self.hasUpdationError = ko.observable(false);
}

$(function () {
    var updationError = $("#hasUpdationError").val() === "true";

    editProfileViewModel = new EditProfileModel();

    ko.applyBindings(editProfileViewModel, document.getElementById('ko-edit-profile'));

    editProfileViewModel.hasUpdationError(updationError);
});