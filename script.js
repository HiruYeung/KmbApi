async function searchRoutes() {
  const routeName = document.getElementById('routeInput').value.trim();
  const routeResults = document.getElementById('routeResults');

  try {
      const response = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/route/');
      if (!response.ok) throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      const data = await response.json();

      const filteredRoutes = data.data.filter(route => route.route === routeName);

      if (filteredRoutes.length > 0) {
          routeResults.innerHTML = '';
          filteredRoutes.forEach(route => {
              const routeElement = document.createElement('div');
              routeElement.textContent = `Route: ${route.route} | Bound: ${route.bound}`;
              const routeElement2 = document.createElement('h3');
              routeElement2.textContent = `出發站Origin: ${route.orig_tc} ${route.orig_en}`;
              routeElement.addEventListener('click', () => showRouteDetails(route));
              routeResults.appendChild(routeElement);
              routeResults.appendChild(routeElement2);
              const separator = document.createElement('hr');
              routeResults.appendChild(separator);
          });
      } else {
          routeResults.innerHTML = `No data found for route: ${routeName}`;
      }
  } catch (error) {
      console.error('Error:', error);
      routeResults.innerHTML = 'An error occurred while fetching the data.';
  }
}

async function searchRouteStops() {
  const routeNumber = document.getElementById('routeInput').value.trim();
  const stopResults = document.getElementById('stopResults');

  try {
      const routeStopApiUrl = `https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${routeNumber}`;
      const routeStopResponse = await fetch(routeStopApiUrl);
      if (!routeStopResponse.ok) throw new Error(`HTTP error ${routeStopResponse.status}: ${routeStopResponse.statusText}`);
      const routeStopData = await routeStopResponse.json();

      const filteredStops = routeStopData.data;

      stopResults.innerHTML = '';
      if (filteredStops.length > 0) {
          for (const stop of filteredStops) {
              const stopDetailApiUrl = `https://data.etabus.gov.hk/v1/transport/kmb/stop/${stop.stop}`;
              const stopDetailResponse = await fetch(stopDetailApiUrl);
              if (!stopDetailResponse.ok) throw new Error(`HTTP error ${stopDetailResponse.status}: ${stopDetailResponse.statusText}`);
              const stopDetailData = await stopDetailResponse.json();

              const stopName = stopDetailData.data.name_tc;
              const stopname = stopDetailData.data.name_en;

              const stopElement = document.createElement('div');
              stopElement.textContent = `Route: ${stop.route} | Bound: ${stop.bound}`;
              const stopElement2 = document.createElement('h3');
              stopElement2.textContent = `站數Seq: ${stop.seq} 站名Stop: ${stopName} ${stopname}`;

              stopResults.appendChild(stopElement);
              stopResults.appendChild(stopElement2);
          }
      } else {
          stopResults.textContent = `No route stops found for route ${routeNumber}.`;
      }
  } catch (error) {
      console.error('Error:', error);
      stopResults.textContent = 'An error occurred while fetching the route stop data.';
  }
}

// document.getElementById('fetchData').addEventListener('click', async () => {
//   await searchRoutes();
//   await searchRouteStops();
// });



async function fetchStopTime() {
  const routeName = document.getElementById('routeInput').value.trim();
  const stopTimeResults = document.getElementById('results');

  if (!routeName) {
    alert('Please enter a route name.');
    return;
  }

  const stopTimeApiUrl = `https://data.etabus.gov.hk/v1/transport/kmb/stop-time/${routeName}`;
  console.log(`Fetching data from API URL: ${stopTimeApiUrl}`);

  try {
    const response = await fetch(stopTimeApiUrl);
    if (!response.ok) throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    const data = await response.json();

    stopTimeResults.innerHTML = '';

    if (data.data && data.data.length > 0) {
      data.data.forEach(stopTime => {
        const stopTimeInfo = document.createElement('div');
        stopTimeInfo.textContent = `Stop: ${stopTime.stop} | Time: ${stopTime.time}`;
        stopTimeResults.appendChild(stopTimeInfo);
      });
    } else {
      stopTimeResults.textContent = `No stop times found for route: ${routeName}`;
    }
  } catch (error) {
    console.error('Error:', error);
    stopTimeResults.textContent = 'An error occurred while fetching the stop time data.';
  }
}