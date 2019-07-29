
function Chart () {}

Chart.prototype.createChart = function () {
  var ctx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: 'Timesteps',
            borderColor: 'rgb(36, 188, 25)',
            data: []
        },
        {
            label: 'GoodMovement',
            borderColor: 'rgb(36, 25, 188)',
            data: []
        },
        {
            label: 'Adverse',
            borderColor: 'rgb(188, 36, 25)',
            data: []
        }
      ]
    },

    // Configuration options go here
    options: {
      title: {
              display: true,
              text: 'Wait For It...'
          },
      elements: {
          line: {
              tension: 0 // disables bezier curves
          }
      }
      }
  });
}


function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function updateConfigByMutating(chart) {
    chart.options.title.text = 'new title';
    chart.update();
}
