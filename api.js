const BASE_URL = 'http://127.0.0.1'

export const sendQuery = (data) => {
    return fetch(BASE_URL, {
        method: 'POST',
        body: data
    })
}