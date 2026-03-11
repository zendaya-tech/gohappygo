import api from "./Api";

export interface CreateTravelData {
  description: string;
  flightNumber: string;
  isSharedWeight: boolean;
  isInstant: boolean;
  isAllowExtraWeight: boolean;
  punctualityLevel: boolean; // false = punctual, true = very punctual
  feeForGloomy: number;
  departureAirportId: number;
  arrivalAirportId: number;
  departureDatetime: string;
  pricePerKg: number;
  currencyId: number;
  totalWeightAllowance: number;
  image1: File;
  image2: File;
}

interface Airline {
  id: number;
  name: string;
  logo: string;
  iata: string;
  icao: string;
}

export const getAirlineFromFlightNumber = async (
  flightNumber: string
): Promise<Airline | null> => {
  try {
    const response = await api.get(
      "/demand-and-travel/airline-from-flight-number",
      {
        params: { flightNumber },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching airline from flight number:", error);
    return null;
  }
};

export const createTravel = async (data: CreateTravelData) => {
  try {
    const formData = new FormData();

    // Add all the form fields
    formData.append("description", data.description);
    formData.append("flightNumber", data.flightNumber);
    formData.append("isSharedWeight", data.isSharedWeight.toString());
    formData.append("isInstant", data.isInstant.toString());
    formData.append("isAllowExtraWeight", data.isAllowExtraWeight.toString());
    formData.append("punctualityLevel", data.punctualityLevel.toString());
    formData.append("feeForGloomy", data.feeForGloomy.toString());
    formData.append("departureAirportId", data.departureAirportId.toString());
    formData.append("arrivalAirportId", data.arrivalAirportId.toString());
    formData.append("departureDatetime", data.departureDatetime);
    formData.append("pricePerKg", data.pricePerKg.toString());
    formData.append("currencyId", data.currencyId.toString());
    formData.append(
      "totalWeightAllowance",
      data.totalWeightAllowance.toString()
    );

    // Add the two required images
    formData.append("image1", data.image1);
    formData.append("image2", data.image2);

    const response = await api.post("/travel", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating travel:", error);
    throw error; // Propagate the error instead of returning null
  }
};

export interface UpdateTravelData {
  description?: string;
  flightNumber?: string;
  isSharedWeight?: boolean;
  isInstant?: boolean;
  isAllowExtraWeight?: boolean;
  punctualityLevel?: boolean; // false = punctual, true = very punctual
  feeForGloomy?: number;
  departureAirportId?: number;
  arrivalAirportId?: number;
  departureDatetime?: string;
  pricePerKg?: number;
  currencyId?: number;
  totalWeightAllowance?: number;
}

export const updateTravel = async (travelId: number, data: UpdateTravelData) => {
  try {
    // Send as JSON since the backend PATCH endpoint expects application/json
    const jsonData: any = {};

    // Add all the form fields that are provided
    if (data.description !== undefined) jsonData.description = data.description;
    if (data.flightNumber !== undefined) jsonData.flightNumber = data.flightNumber;
    if (data.isSharedWeight !== undefined) jsonData.isSharedWeight = data.isSharedWeight;
    if (data.isInstant !== undefined) jsonData.isInstant = data.isInstant;
    if (data.isAllowExtraWeight !== undefined) jsonData.isAllowExtraWeight = data.isAllowExtraWeight;
    if (data.punctualityLevel !== undefined) jsonData.punctualityLevel = data.punctualityLevel;
    if (data.feeForGloomy !== undefined) jsonData.feeForGloomy = data.feeForGloomy;
    if (data.departureAirportId !== undefined) jsonData.departureAirportId = data.departureAirportId;
    if (data.arrivalAirportId !== undefined) jsonData.arrivalAirportId = data.arrivalAirportId;
    if (data.departureDatetime !== undefined) jsonData.departureDatetime = data.departureDatetime;
    if (data.pricePerKg !== undefined) jsonData.pricePerKg = data.pricePerKg;
    if (data.currencyId !== undefined) jsonData.currencyId = data.currencyId;
    if (data.totalWeightAllowance !== undefined) jsonData.totalWeightAllowance = data.totalWeightAllowance;

    // Note: Images cannot be updated via PATCH endpoint - only JSON data
    const response = await api.patch(`/travel/${travelId}`, jsonData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating travel:", error);
    throw error;
  }
};

export interface TravelItem {
  id: number;
  description: string;
  flightNumber: string;
  isSharedWeight: boolean;
  isInstant: boolean;
  isAllowExtraWeight: boolean;
  punctualityLevel: boolean;
  feeForGloomy: number;
  departureDatetime: string;
  pricePerKg: number;
  totalWeightAllowance: number;
  weightAvailable: number;
  isEditable: boolean;
  departureAirport: {
    id: number;
    name: string;
    municipality: string;
    isoCountry: string;
  };
  arrivalAirport: {
    id: number;
    name: string;
    municipality: string;
    isoCountry: string;
  };
  airline?: {
    id: number;
    name: string;
    logoUrl: string;
  };
  currency: {
    id: number;
    symbol: string;
    code: string;
  };
  images: Array<{
    id: number;
    fileUrl: string;
  }>;
  user: {
    id: number;
    fullName: string;
    profilePictureUrl?: string;
    isVerified: boolean;
  };
}

export interface GetTravelsResponse {
  items: TravelItem[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getUserTravels = async (
  userId?: number,
  page = 1,
  limit = 12
): Promise<GetTravelsResponse> => {
  try {
    const params: any = {};
    if (userId) {
      params.userId = userId;
    }
    params.page = page;
    params.limit = limit;

    const response = await api.get("/travel", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching user travels:", error);
    throw error;
  }
};

export const deleteTravel = async (travelId: number) => {
  try {
    const response = await api.delete(`/travel/${travelId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting travel:", error);
    throw error;
  }
};
