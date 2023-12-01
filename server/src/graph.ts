import axios from 'axios';

export class Graph {
    private baseUrl: string = "https://api.studio.thegraph.com/query/59422/kanvas/version/latest";

    constructor() { }

    async makeRequest(query: string): Promise<any> {
        try {
            const response = await axios.post(this.baseUrl, { query });
            return response.data.data;
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }
}