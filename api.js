const BASE_URL = 'http://127.0.0.1:5000';

export let checkTokenController = null;

export const checkToken = () => {
    checkTokenController = new AbortController();

    return fetch(`${BASE_URL}/api/check/`, {
        signal: checkTokenController.signal,
        credentials: 'include'
    })
}

export const login = (data) => {
    return fetch(`${BASE_URL}/api/login/`, {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include'
    })
}

export const sendQuery = (data) => {
    return fetch(`${BASE_URL}/api/query/`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export const fetchCountries = async () => {
    const response = await fetch(`${BASE_URL}/api/countries/`);
    if(response.status === 200) {
        return await response.json();
    }
    return [] 
}

export const fetchGeodataList = async (country) => {
    const response = await fetch(`${BASE_URL}/api/geo-data/`, {
        method: 'POST',
        body: JSON.stringify({'country': country}),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(response.status === 200) {
        const data = await response.json();
        return data.map(item => `${BASE_URL}/${item}`)
    }
    return [] 
}

export const loadFiles = async (filesList) => {
    const promises = filesList.map(file => fetch(file));
    const results = await Promise.all(promises);
    let geoJsonDataList = [];

    for(const item of results) {
        geoJsonDataList.push(await item.json());
    }
    
    return geoJsonDataList
}

export const fetchIndicators = async () => {
    const response = await fetch(`${BASE_URL}/api/indicator/`);
    if(response.status === 200) {
        return await response.json()
    }
    return []
}