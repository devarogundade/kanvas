import axios from 'axios';

const baseUrl = "https://api.studio.thegraph.com/query/59422/kanvas/version/latest";

async function makeRequest(query) {
    try {
        const response = await axios.post(baseUrl, { query });
        return response.data.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function fetchGames(wallet) {
    if (!wallet) return []

    const response = await makeRequest(`
    {
        gameCreateds(where: {creator: "${wallet}"}, orderDirection: asc, orderBy: blockTimestamp) {
            id
            gameId
            name
            description
            email
            website
            creator
            avatar
            plan
        }
    }
    `);

    return response.gameCreateds
}


export async function fetchGame(gameId) {
    if (!gameId) return null

    const response = await makeRequest(`
    {
        gameCreated(id: "${gameId}") {
            id
            gameId
            name
            description
            email
            website
            creator
            avatar
            plan
            templates(orderDirection: asc, orderBy: blockTimestamp) {
                templateUri
            }
        }
    }
    `);

    return response.gameCreated
}

export async function fetchPlans() {
    const response = await makeRequest(`
    {
        planCreateds(orderDirection: asc, orderBy: blockTimestamp) {
            id
            planId
            name
            cost
            color
        }
    }
    `);

    return response.planCreateds
}
