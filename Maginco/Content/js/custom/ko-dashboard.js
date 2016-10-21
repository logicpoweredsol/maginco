var dashboardViewModel;
var usersTable;

function DashboardModel() {
    var self = this;
}

$(function () {
    dashboardViewModel = new DashboardModel();

    ko.applyBindings(dashboardViewModel, document.getElementById('ko-dashboard'));

    loadUserCharts();
});

function loadUserCharts() {

    usersTable = $("#tbl-charts").DataTable({
        "ajax": "/User/GetCharts",
        "columns": [
            { "data": "iID", "visible": false },
            { "data": "strName" },
            { "data": "strDate" },
            {
                "render": function (data, type, row) {
                    return "5$";
                }
            },
            {
                "render": function (data, type, row, meta) {
                    return "<i class='glyphicon glyphicon-eye-open grid-icon' onclick='showChart(" + meta.row + ")'></i>";
                },
                "class": "text-center"
            },
            {
                "render": function (data, type, row, meta) {
                    return "<a onclick='downloadChart(" + meta.row + ',this' + ")'> <i class='glyphicon glyphicon-save grid-icon'></i> </a>"
                },
                "class": "text-center"
            },
            {
                "render": function (data, type, row, meta) {
                    return "<i class='glyphicon glyphicon-pencil grid-icon' onclick='editChart(" + meta.row + ")'></i>";
                },
                "class": "text-center"
            }
        ],
        "dom": '<"row"<"col-sm-6"l><"col-sm-6"f>>t<"row"<"toolbar col-sm-6"><"col-sm-6"p>>',
    });
}

function showChart(rowID) {
    var svgContent = usersTable.row(rowID).data().strSvg;
    var newTab = window.open();
    var css = "<style>body{font-family: 'Segoe UI', sans-serif;}</style>";

    $(newTab.document.body).html(css + svgContent);
}

function downloadChart(rowID, target) {
    var svgContent = usersTable.row(rowID).data().strSvg;
    var canvas = document.getElementById("temp-canvas");

    canvg(canvas, svgContent);

    target.href = canvas.toDataURL();
    target.download = 'chart.png';
}

function editChart(rowID) {
    var svgContent = usersTable.row(rowID).data().strSvg;
    var form = $("#form-edit-chart")[0];

    $("#svgData").text(svgContent);

    $(form).submit();
}