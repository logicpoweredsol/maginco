var usersTable;

$(function () {
    loadUsers();
});

function loadUsers() {
    usersTable = $("#tbl-users").DataTable({
        "ajax": "/User/GetUsers",
        "columns": [
            { "data": "Id", "visible": false },
            { "data": "firstName" },
            { "data": "emailAddress" },
            { "data": "contactNumber" },
            {
                "render": function (data, type, row, meta) {
                    return row.EmailConfirmed ? "<input type='checkbox' disabled checked/>" : "<input type='checkbox' disabled />";
                },
                "class": "text-center"
            },
            {
                "render": function (data, type, row, meta) {
                    return "<span>" + row.type + "</span>" + "<span class='pull-right'> <i title='Upgrade account' class='glyphicon glyphicon-upload grid-icon' onclick='upgradeAccount(" + meta.row + ")'></i> <i title='Downgrade account' class='glyphicon glyphicon-download grid-icon' onclick='downgradeAccount(" + meta.row + ")'></i> </span>";
                }
            }
        ],
        "dom": '<"row"<"col-sm-6"l><"col-sm-6"f>>t<"row"<"toolbar col-sm-6"><"col-sm-6"p>>',
    });
}

function upgradeAccount(rowID) {
    var id = usersTable.row(rowID).data().Id;

    $.ajax({
        "url": "/User/UpgradeFromAdmin",
        "method": "POST",
        "data": { userId: id },
        success: function (isSucceeded) {
            if (isSucceeded) {
                alertSuccess("Account upgraded successfully.");
            }
            else {
                alertError("Unable to upgrade account, something went wrong.")
            }
        },
        error: function (err) {
            console.log(err);
        }
    })
    .done(function () {
        usersTable.ajax.reload();
    });
}

function downgradeAccount(rowID) {
    var id = usersTable.row(rowID).data().Id;

    $.ajax({
        "url": "/User/DowngradeFromAdmin",
        "method": "POST",
        "data": { userId: id },
        success: function (isSucceeded) {
            if (isSucceeded) {
                alertSuccess("Account downgraded successfully.");
            }
            else {
                alertError("Unable to downgrade account, something went wrong.")
            }
        },
        error: function (err) {
            console.log(err);
        }
    })
    .done(function () {
        usersTable.ajax.reload();
    });
}

function alertSuccess(msg) {
    $("#lbl-success").text(msg);
    $('#dv-success-modal').modal('show');
}

function alertError(msg) {
    $("#lbl-error").text(msg);
    $('#dv-error-modal').modal('show');
}