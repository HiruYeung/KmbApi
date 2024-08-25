
  //Show Routes--------------------------------------//
  
  //Stop---------------------------------------------//
  
  async function searchRouteStops() {
    const routeInput = document.getElementById('routeInput');
    const routeNumber = routeInput.value.trim();
    const stopResults = document.getElementById('stopResults');
  
    try {
        // 构建 API 请求 URL 获取路线和站点信息
        const routeStopApiUrl = `https://data.etabus.gov.hk/v1/transport/kmb/route-stop`;
        console.log(`Fetching data from API URL: ${routeStopApiUrl}`);
  
        // 使用 Fetch API 发送 GET 请求获取路线和站点信息
        const routeStopResponse = await fetch(routeStopApiUrl);
        if (!routeStopResponse.ok) {
            throw new Error(`HTTP error ${routeStopResponse.status}: ${routeStopResponse.statusText}`);
        }
        const routeStopData = await routeStopResponse.json();
  
        // 过滤出特定的路线站点
        const filteredStops = routeStopData.data.filter(stop => stop.route === routeNumber);
  
        // 处理返回的车站数据
        stopResults.innerHTML = '';
        if (filteredStops.length > 0) {
            let previousServiceType = null; // 用于跟踪上一个站点的 Service_type
  
            for (const stop of filteredStops) {
                // 获取每个站点的详细信息
                const stopDetailApiUrl = `https://data.etabus.gov.hk/v1/transport/kmb/stop/${stop.stop}`;
                const stopDetailResponse = await fetch(stopDetailApiUrl);
                if (!stopDetailResponse.ok) {
                    throw new Error(`HTTP error ${stopDetailResponse.status}: ${stopDetailResponse.statusText}`);
                }
                const stopDetailData = await stopDetailResponse.json();
  
                const stopName = stopDetailData.data.name_tc;
                const stopname = stopDetailData.data.name_en;
  
                // 检查 Service_type 是否改变
                if (previousServiceType !== null && previousServiceType !== stop.service_type) {
                    // 如果 Service_type 发生变化，在前一组数据后添加分隔线
                    const separator = document.createElement('hr');
                    stopResults.appendChild(separator);
                }
  
                const stopElement = document.createElement('div');
                stopElement.textContent = `Route: ${stop.route} | Bound(Out/In): ${stop.bound} | Service_type: ${stop.service_type}`;
                const stopElement2 = document.createElement('h3');
                stopElement2.textContent = `站數Seq: ${stop.seq} 站名Stop: ${stopName} ${stopname}`;
  
                // 添加站点信息到结果容器
                stopResults.appendChild(stopElement);
                stopResults.appendChild(stopElement2);
  
                // 更新 previousServiceType 为当前站点的 Service_type
                previousServiceType = stop.service_type;
            }
        } else {
            stopResults.textContent = `No route stops found for route ${routeNumber}.`;
        }
    } catch (error) {
        console.error('Error:', error);
        stopResults.textContent = 'An error occurred while fetching the route stop data.';
    }
  }
  
  //------------------------------------------------------//
  
  
  //StopTime----------------------------------------------//
  document.getElementById('fetchData').addEventListener('click', async () => {
    const routeName = document.getElementById('routeInput').value.trim();
    const serviceType = document.getElementById('serviceType').value.trim();
    if (!routeName || !serviceType) {
        alert('Please enter service type.');
        return;
    }
    const apiUrl = `https://data.etabus.gov.hk/v1/transport/kmb/route-eta/${routeName}`;
    console.log(`Fetching data from API URL: ${apiUrl}`);
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        const filteredRoutes = data.data.filter(route => route.route === routeName);
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
  
        if (filteredRoutes.length > 0) {
            let firstSeqOneFound = false; // 标志位，用于跟踪第一个 seq: 1 是否已经出现
  
            filteredRoutes.forEach(route => {
                if (route.seq === 1) {
                    if (firstSeqOneFound) {
                        // 如果第一个 seq: 1 已经出现，插入分隔线
                        const separator = document.createElement('hr');
                        resultsDiv.appendChild(separator);
                    } else {
                        // 标记第一个 seq: 1 已经找到
                        firstSeqOneFound = true;
                    }
                }
  
                const routeInfo = document.createElement('p');
                routeInfo.textContent = `Route: ${route.route} | Service_type: ${route.service_type} | Time: ${route.eta}`;
                resultsDiv.appendChild(routeInfo);
  
                const routeInfo2 = document.createElement('h3');
                routeInfo2.textContent = ` ${route.dest_tc} ${route.dest_en} `;
                resultsDiv.appendChild(routeInfo2);
                const routeInfo3 = document.createElement('h3');
                routeInfo3.textContent = `Seq: ${route.seq} Time: ${route.eta} `;
                resultsDiv.appendChild(routeInfo3);
  
                const space = document.createElement('p');
                space.textContent = ` `;
                resultsDiv.appendChild(space);
            });
        } else {
            resultsDiv.textContent = `No data found for route: ${routeName}`;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the data.');
    }
  });