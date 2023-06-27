let ctx_nyquist = document.getElementById("nyquist-chart").getContext("2d");
let chart_nyquist = new Chart(ctx_nyquist, {
  type: "line",
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: "Niveles de modulación",
        },
      },
      y: {
        title: {
          display: true,
          text: "Capacidad (bps)",
        },
      },
    },
    datasets: {
      line: {
        pointRadius: 0, // disable for all `'line'` datasets
      },
    },
    elements: {
      point: {
        radius: 0, // default to disabled in all datasets
      },
    },
  },
});

let ctx_shannon = document.getElementById("shannon-chart").getContext("2d");
let chart_shannon = new Chart(ctx_shannon, {
  type: "line",
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: "Relación señal-ruido (SNR)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Capacidad(bps)",
        },
      },
    },
    datasets: {
      line: {
        pointRadius: 0, // disable for all `'line'` datasets
      },
    },
    elements: {
      point: {
        radius: 0, // default to disabled in all datasets
      },
    },
  },
});

document.getElementById("channel-form").addEventListener("submit", function (event) {
  event.preventDefault();

  
    // Obtener los valores ingresados por el usuario
    let bandwidth = parseFloat(document.getElementById("bandwidth").value);
    let levels = parseInt(document.getElementById("levels").value);
    let snr_db = parseFloat(document.getElementById("snr").value);
    let snr = Math.pow(10, snr_db / 10);

    if (isNaN(bandwidth) || isNaN(levels) || isNaN(snr_db)) {
      alert(
        "Por favor, ingresa valores válidos para el ancho de banda, niveles de modulación y relación señar-ruido."
      );
      return;
    }
    
    // Calcular la capacidad según Nyquist y Shannon
    let nyquistCapacity = 2 * bandwidth * Math.log2(levels);
    let shannonCapacity = bandwidth * Math.log2(1 + snr);

    // Mostrar los resultados en la interfaz
    document.getElementById("nyquist-result").innerHTML =
      "Capacidad según Nyquist: " + nyquistCapacity.toFixed(2) + " bps";
    document.getElementById("shannon-result").innerHTML =
      "Capacidad según Shannon: " + shannonCapacity.toFixed(2) + " bps";

    // Graficar los resultados
    generarGrafica(chart_nyquist, bandwidth, levels);
    generarGrafica(chart_shannon,bandwidth, null, snr);
});

function generarGrafica(chart, bandwidth, levels= null, snr = null) {
  let chartData = generarDatosGrafica(bandwidth, levels, snr);

  chart.data = chartData;
  chart.update();
}

function generarDatosGrafica(bandwidth, levels, snr) {
  let data = [];
  let labels = [];

  if (levels == null) {
    let i = 0
    while (i <= (10 * Math.log10(snr))* 2) {
      let shannonCapacity = bandwidth * Math.log2(1 + Math.pow(10, i/ 10));
      data.push({
        x: i.toFixed(2),
        y: shannonCapacity.toFixed(2),
      });

      labels.push(i.toFixed(2));

      i += 1;
    }
  }
  
  if (snr == null) {
    let i = 2;
    while (i <= levels * 2) {
      let nyquistCapacity = 2 * bandwidth * Math.log2(i);
      data.push({
        x: i.toFixed(2),
        y: nyquistCapacity.toFixed(2),
      });

      labels.push(i.toFixed(2));

      i += 1;
    }
  }

  return {
    datasets: [
      {
        label: "Capacidad del canal (bps)",
        data: data,
        borderColor: "blue",
        fill: false,
      },
    ],
    labels: labels,
  };
}
