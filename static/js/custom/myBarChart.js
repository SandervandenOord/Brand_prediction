 // bar chart data
    var data = {
        labels: ["Golden Rose", "Kiss Rose", "Maybelline"],
        datasets: [
            {
                label: "Kans dat merk correct is",
                backgroundColor: [
                    'rgba(8,81,156, 0.2)',
                    'rgba(49,130,189, 0.2)',
                    'rgba(189,215,231, 0.2)'
                ],
                borderColor: [
                    'rgba(8,81,156, 0.2)',
                    'rgba(49,130,189, 0.2)',
                    'rgba(189,215,231, 0.2)'
                ],
                borderWidth: 3,
                data: [0.95, 0.50, 0.30],
            }
        ]
    };
    
    var option = {
        scales: {
            xAxes: [{
                ticks: {
                    min: 0,
                    max: 1
                }
            }]
        },
        responsive: false,
        legend: {
            display: true,
            labels: {
                fontColor: 'rgb(0, 99, 132)'
            }
        }
    };
    
    // get bar chart canvas
    var income = document.getElementById("income").getContext("2d");
    
    var myBarChart = new Chart(income, {
        type: 'horizontalBar',
        data: data,
        options: option
    });
    
    function changeData(){
        alert(message);
        myBarChart.data.datasets[0].data[0] -= 0.05;
        myBarChart.update();
    } 