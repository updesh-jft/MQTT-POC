$(document).ready(function () {
    var table = $('#example').DataTable({
        select: false,
        "columnDefs": [{
            className: "Name",
            "targets": [0],
            "visible": false,
            "searchable": false
        }]
    });//End of create main table
    const recordData = JSON.parse($("#recordData").val());
    updateDataTable(recordData)
    function updateDataTable(recordData) {
        $("#total").html(recordData.total);
        $("#success").html(recordData.success);
        $("#failed").html(recordData.failed);
    }
    let socket = io.connect('http://mqttapp.teamjft.com/');
    socket.on('message', function (data, json) {
        const isEmpty = Object.keys(json).length === 0;
        if (!isEmpty) {
            updateDataTable(json);
        }
    });
});