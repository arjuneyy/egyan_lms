$(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    $('li').on('click', function (e) {
        $(".active").removeClass("active");
        $(this).addClass("active");
    });
});