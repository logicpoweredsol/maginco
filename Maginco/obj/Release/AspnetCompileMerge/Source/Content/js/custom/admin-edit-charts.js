var chartsTable;

$(function () {
    loadCharts();
});

function loadCharts() {
    chartsTable = $("#tbl-charts").DataTable({
        "ajax": "/User/GetAllCharts",
        "columns": [
            { "data": "iID", "visible": false },
            { "data": "strName" },
            { "data": "strUsername" },
            { "data": "strDate" },
            {
                "render": function (data, type, row, meta) {
                    return "$5";
                },
                "class": "text-center"
            },
        ],
        "dom": '<"row"<"col-sm-6"l><"col-sm-6"f>>t<"row"<"toolbar col-sm-6"><"col-sm-6"p>>',
    });
}