$(document).ready(function () {

    // Get a reference to the chart canvas element
    var chartCanvas = document.getElementById('myChart');

    // Initialize the chart using the weekly data and configuration
    var chartData = [10, 20, 30, 40, 50, 60, 70];
    var chartLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var chartConfig = {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Weekly Data',
                data: chartData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    };


    var myChart = new Chart(chartCanvas, chartConfig);


    // Initialize the Select2 plugin on the time range select element
    $('#timeRangeSelect').select2();

    // Initialize the jQuery UI week picker
    $('#weekPickerInput').datepicker({
        showWeek: true,
        firstDay: 1,  // Start the week on Monday
        onSelect: function () {
            updateChart();
        }
    });

    // Initialize the jQuery UI Datepicker on the month and year picker inputs
    $('#monthPickerInput').datepicker({
        dateFormat: 'MM yy',
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        onClose: function (dateText, inst) {
            // Set the selected month and year in the input value
            $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
            // Trigger the chart update
            updateChart();
        }
    });

    $('#yearPickerInput').datepicker({
        dateFormat: 'yy',
        changeYear: true,
        showButtonPanel: true,
        onClose: function (dateText, inst) {
            // Set the selected year in the input value
            $(this).datepicker('setDate', new Date(inst.selectedYear, 1, 1));
            // Trigger the chart update
            updateChart();
        }
    });

    // Listen for changes to the time range, and update the date picker container accordingly
    $('#timeRangeSelect').on('change', function () {
        var selectedValue = $(this).val();

        // Update the date picker container based on the selected time range
        var datePickerContainer = $('#datePickerContainer');
        if (selectedValue === 'weekly') {
            datePickerContainer.show();
            $('#weekPicker').show();
            $('#monthPicker').hide();
            $('#yearPicker').hide();
        } else if (selectedValue === 'monthly') {
            datePickerContainer.show();
            $('#monthPicker').show();
            $('#weekPicker').hide();
            $('#yearPicker').hide();
        } else if (selectedValue === 'yearly') {
            datePickerContainer.show();
            $('#monthPicker').hide();
            $('#weekPicker').hide();
            $('#yearPicker').show();
        }
    });

    // Function to update the chart based on the selected date
    function updateChart() {
        var timeRangeSelect = document.getElementById('timeRangeSelect');
        var selectedTimeRange = timeRangeSelect.value;

        if (selectedTimeRange === 'monthly') {
            var selectedMonth = $('#monthPickerInput').datepicker('getDate');
            var year = selectedMonth.getFullYear();
            var month = selectedMonth.getMonth();
            var updatedData = [];
            var updatedLabels = [];
            for (var i = 1; i <= 30; i++) {
                var date = new Date(year, month, i);
                updatedData.push(Math.floor(Math.random() * 100));
                updatedLabels.push(date.getDate().toString());
            }
            chartConfig.data.datasets[0].label = 'Monthly Data - ' + $.datepicker.formatDate('MM yy', selectedMonth);
            chartConfig.data.datasets[0].data = updatedData;
            chartConfig.data.labels = updatedLabels;
        } else if (selectedTimeRange === 'yearly') {
            var selectedYear = $('#yearPickerInput').datepicker('getDate');
            // Use the selected year to update the chart data and labels
            var updatedData = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];
            var updatedLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            chartConfig.data.datasets[0].label = 'Yearly Data - ' + $.datepicker.formatDate('yy', selectedYear);
            chartConfig.data.datasets[0].data = updatedData;
            chartConfig.data.labels = updatedLabels;
        } else if (selectedTimeRange === 'weekly') {
            var selectedWeek = $('#weekPickerInput').datepicker('getDate');
            var year = selectedWeek.getFullYear();
            var week = $.datepicker.iso8601Week(selectedWeek);
            var updatedData = [];
            var updatedLabels = [];

            // Loop through each day of the week and update the data and labels arrays
            for (var i = 0; i < 7; i++) {
                var date = new Date(year, 0, 1 + (week - 1) * 7 + i); // Construct the date object using the week and day of the week
                var weekday = date.toLocaleDateString('en-US', { weekday: 'long' }); // Get the full weekday name
                var day = date.getDate(); // Get the day of the month
                var month = date.getMonth() + 1; // Get the month (add 1 because getMonth() returns zero-based month index)
                var yearStr = date.getFullYear(); // Get the year
                var dateStr = ('0' + day).slice(-2) + '-' + ('0' + month).slice(-2) + '-' + yearStr; // Format the date string as DD-MM-YYYY
                updatedData.push(Math.floor(Math.random() * 100));
                updatedLabels.push(weekday + '\n\n' + dateStr); // Add the date to the label
            }

            // Update the chart data and labels
            chartConfig.data.datasets[0].label = 'Weekly Data - ' + selectedWeek.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            chartConfig.data.datasets[0].data = updatedData;
            chartConfig.data.labels = updatedLabels;
            myChart.update();

        }
        myChart.update();
    }

});