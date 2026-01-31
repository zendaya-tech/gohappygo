import api from "./Api";

export type Airport = {
    id: number;
    code: string; // e.g. CDG
    iataCode?: string; // IATA code
    name: string; // e.g. Paris Charles de Gaulle
    city?: string;
    country?: string;
    municipality?: string;
    isoCountry?: string;
};

export type AirportSearchResponse = {
    items: Airport[];
    nextCursor?: string | null;
};

export async function searchAirports(params: { name?: string; municipalityOrName?: string; cursor?: string; limit?: number }): Promise<AirportSearchResponse> {
    const { name, municipalityOrName, cursor, limit = 20 } = params;
    const response = await api.get("/airports", { params: { name, municipalityOrName, cursor, limit } });
    // Backend may return different shapes; normalize to { items, nextCursor }
    const data = response.data;
    if (Array.isArray(data)) {
        return { items: data, nextCursor: null };
    }
    if (data && Array.isArray(data.items)) {
        return { items: data.items, nextCursor: data.nextCursor ?? null };
    }
    return { items: [], nextCursor: null };
}

export async function getAirportById(id: number): Promise<Airport | null> {
    try {
        const response = await api.get(`/airports/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching airport by ID:", error);
        return null;
    }
}


