$(document).ready(() => {
  var data = [];

  $('#azophicc-procedimentos-realizados').length > 0 && $.ajax({
    url: 'azophicc/data',
    type: 'GET',
    dataType: 'json',
    success: (response) => {
      console.log(response);
      data = response;
      getProceduresChart(data);
    },
    error: (error) => {
      console.log(error);
    }
  });

  const getProceduresChart = (data) => {
    const generatedChart = new CanvasJS.Chart(`azophicc-procedimentos-realizados`, {
      animationEnabled: true,
      theme: 'light2',
      axisX: {
        crosshair: {
          enabled: true,
          snapToDataPoint: false,
          lineDashType: "longDash",
          labelBackgroundColor: '#1c2e5f',
          color: "#1c2e5f",
        },
        gridDashType: "shortDash",
        gridThickness: 1,
        includeZero: true
      },
      axisY: {
        gridDashType: "shortDash",
        gridThickness: 1,
      },
      legend: {
        cursor: "pointer",
        fontSize: 14,
        horizontalAlign: "center",
        verticalAlign: "bottom",
        itemclick: (e) => {
          if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          generatedChart.render();
        }
      },
      toolTip: {
        shared: true,
        contentFormatter: function (e) {
          let entities = e.entries[0].dataPoint.label + "<br/>";
          for (let i = 0; i < e.entries.length; i++) {
            if (e.entries[i].dataPoint.y > 0) {

              if (e.entries[i].dataSeries.visible === undefined || e.entries[i].dataSeries.visible === false)
                continue;

              let tooltip_text = `<span style='color: ${e.entries[i].dataSeries.color}'> ${e.entries[i].dataSeries.name}</span>: ${e.entries[i].dataPoint.y}`;

              if (e.entries[i].dataSeries.name === 'Total HRG') {
                tooltip_text += `<hr style="background-color: ${e.entries[0].dataSeries.color}" class="my-0">`;
                entities = entities.concat(tooltip_text);
                continue;
              }

              entities = entities.concat(tooltip_text + "<br/>");
            }
          }
          return entities;
        }
      },
      data: [{
        click: getCharts,
        cursor: "pointer",
        ...data['procedimentos-realizados']['centro-cirurgico'],
      }, {
        click: getCharts,
        cursor: "pointer",
        ...data['procedimentos-realizados']['centro-cirurgico-maternidade'],
      }, {
        click: getCharts,
        cursor: "pointer",
        ...data['procedimentos-realizados']['total'],
      }]
    });
    generatedChart.render();
  }

  const getScheduleSurgeriesChart = (data) => {
    const generatedChart = new CanvasJS.Chart(`azophicc-cirurgias-horarios`, {
      animationEnabled: true,
      theme: 'light2',
      axisX: {
        includeZero: true,
        crosshair: {
          enabled: true,
          snapToDataPoint: false,
          lineDashType: "longDash",
          labelBackgroundColor: '#1c8f69',
          color: "#1c8f69",
        },
      },
      axisY: {
        gridDashType: "shortDash",
      },
      legend: {
        cursor: "pointer",
        fontSize: 14,
        horizontalAlign: "center",
        verticalAlign: "bottom",
      },
      data: [{
        color: '#51cda0',
        type: 'area',
        dataPoints: data,
      }]
    });
    generatedChart.render();
  };

  const getUseRoomsChart = (data) => {
    const chartOptions = {
      animationEnabled: true,
      theme: 'light2',
      culture: 'ptBr',
      legend: {
        cursor: "pointer",
        fontSize: 14,
        horizontalAlign: "center",
        verticalAlign: "bottom",
        itemclick: (e) => {
          if (typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
            e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
          } else {
            e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
          }
          e.chart.render();
        }
      },
      toolTip: {
        contentFormatter: function (e) {
          const dataPoint = e.entries[0].dataPoint;
          const hours = Math.floor(dataPoint.y / 60).toString().padStart(2, '0');
          const minutes = (dataPoint.y % 60).toString().padStart(2, '0');
          const time = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;

          return `<b>${dataPoint.label}:</b> ${time}<br>Sala utilizada em ${dataPoint.percent}% do periodo buscado`;
        }
      }
    }

    $('.container-salas-hrg, .container-salas-mat').removeClass('d-none');

    !data.CIR && $('.container-salas-hrg').addClass('d-none');
    !data.CIM && $('.container-salas-mat').addClass('d-none');

    if (data.CIR) {
      const generatedChartHRG = new CanvasJS.Chart(`azophicc-cirurgias-salas-hrg`, {
        ...chartOptions,
        data: [{
          showInLegend: true,
          type: "doughnut",
          indexLabel: "{label} - {percent}%",
          dataPoints: data.CIR
        }]
      });

      generatedChartHRG.render();
    }

    if (data.CIM) {
      const generatedChartMat = new CanvasJS.Chart(`azophicc-cirurgias-salas-mat`, {
        ...chartOptions,
        data: [{
          showInLegend: true,
          type: "doughnut",
          indexLabel: "{label} - {percent}%",
          dataPoints: data.CIM
        }]
      });
      generatedChartMat.render();
    }

  };

  const getHealthPlansProceduresChart = (data) => {
    const generatedChart = new CanvasJS.Chart(`azophicc-procedimentos-convenios`, {
      animationEnabled: true,
      theme: 'light2',
      axisX: {
        tickLength: 0,
        labelFormatter: function () {
          return "";
        }
      },
      axisY: {
        gridDashType: "shortDash",
        includeZero: true,
      },
      legend: {
        cursor: "pointer",
        fontSize: 14,
        horizontalAlign: "center",
        verticalAlign: "bottom",
      },
      data: [{
        type: 'bar',
        dataPoints: data,
      }]
    });
    generatedChart.render();
  }

  const getTypesSurgery = (data) => {
    const generatedChart = new CanvasJS.Chart(`azophicc-procedimentos-porte`, {
      animationEnabled: true,
      theme: 'light2',
      axisX: {
        tickLength: 0,
        labelFormatter: function () {
          return "";
        }
      },
      axisY: {
        gridDashType: "shortDash",
        includeZero: true,
      },
      legend: {
        cursor: "pointer",
        fontSize: 14,
        horizontalAlign: "center",
        verticalAlign: "bottom",
      },
      data: [{
        type: 'bar',
        dataPoints: data,
      }]
    });
    generatedChart.render();
  }


  function getCharts(e) {
    const date = e.dataPoint.date;
    const type = e.dataPoint.type;

    $.ajax({
      url: 'azophicc/data',
      type: 'POST',
      dataType: 'json',
      data: {
        date,
        type
      },
      success: (response) => {
        $('.chart-container').removeClass('d-none');
        getScheduleSurgeriesChart(response.data.scheduleSurgeries);
        getUseRoomsChart(response.data.useRooms);
        getHealthPlansProceduresChart(response.data.healthPlansProcedures);
        getTypesSurgery(response.data.typesSurgery);
      },
      error: (error) => {
        console.log(error);
      }
    });




  }


});