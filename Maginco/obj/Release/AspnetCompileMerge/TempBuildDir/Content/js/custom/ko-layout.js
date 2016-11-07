var layoutViewModel;

ko.bindingHandlers.stopBinding = {
    init: function () {
        return { controlsDescendantBindings: true };
    }
};

ko.virtualElements.allowedBindings.stopBinding = true;

function LayoutModel() {
    var self = this;

    self.scrollTop = function () {
        $('html, body').animate({ scrollTop: 0 });
    };
}

$(function () {

    layoutViewModel = new LayoutModel();

    ko.applyBindings(layoutViewModel, document.getElementById('ko-body'));

    $("[data-hide='alert']").click(function () {
        $(this).closest("div").slideUp();
    });

    $(window).scroll(function () {
        $(this).scrollTop() > 250 ? $("#scroll-top-wrapper").fadeIn() : $("#scroll-top-wrapper").fadeOut();
    });
});