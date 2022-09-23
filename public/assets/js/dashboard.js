$(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    $('li').on('click', function (e) {
        e.stopPropagation();
        $(".active").removeClass("active");
        $(this).addClass("active");
    });
});