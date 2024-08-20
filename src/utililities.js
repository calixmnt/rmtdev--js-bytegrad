export const getData = async completeURL => {
    const response = await fetch(completeURL);
    const data = await response.json();

    if (!response.ok) { // 4xx, 5xx status code
        throw new Error(data.description);
    }

    return data;
};