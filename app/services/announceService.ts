import api from './Api';
import { listings } from '~/data/announces';

export const getAnnounce = async (id: string) => {
  try {
    // if(process.env.NODE_ENV === "development") {
    return listings.find((l) => l.id === id);
    // }
    const response = await api.get(`/announces/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAnnounceByIdAndType = async (
  id: string,
  type: 'demand' | 'travel'
): Promise<DemandTravelItem | null> => {
  try {
    const endpoint = type === 'demand' ? `/demand/${id}` : `/travel/${id}`;
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching announce:', error);
    return null;
  }
};

export const getAnnounces = async () => {
  try {
    const response = await api.get(`/announces`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export type DemandAndTravelFilters = {
  originAirportId?: string;
  destinationAirportId?: string;
  departureDatetime?: string;
  flightNumber?: string;
  travelDate?: string; // YYYY-MM-DD (ISO 8601)
  minWeight?: number;
  maxWeight?: number;
  minPricePerKg?: number;
  maxPricePerKg?: number;
  weightAvailable?: number; // travels only
  isVerified?: boolean;
  status?: string; // active, expired, cancelled, resolved
  type?: 'demand' | 'travel';
  description?: string;
  airlineId?: number;
};

export interface Airport {
  id: number;
  name: string;
  municipality: any;
  isoCountry: any;
}

export interface Airline {
  airlineId: number;
  name: string;
  logoUrl: string;
}

export interface Currency {
  id: number;
  code: string;
  symbol: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  selfieImage?: string;
  fullName?: string;
  phone?: string;
  username?: string;
  profilePictureUrl: string;
  bio?: string;
  isVerified: boolean;
  createdAt: string;
  rating?: string;
}

export interface Image {
  id: number;
  fileUrl: string;
  originalName?: string;
  purpose: string;
}

export interface Review {
  id: number;
  createdAt: string;
  updatedAt: string;
  reviewerId: number;
  revieweeId: number;
  requestId: number;
  rating: string;
  comment: string;
  reviewer: {
    fullName?: string;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl: string;
  };
}

export interface DemandTravelItem {
  id: number;
  type?: 'demand' | 'travel';
  title?: string;
  description: string;
  flightNumber: string;
  departureAirportId: number;
  arrivalAirportId: number;
  departureAirport: Airport;
  arrivalAirport: Airport;
  airline: Airline;
  currency?: Currency;
  userId: number;
  status: 'active' | string;
  deliveryDate?: string; // For unified API
  departureDatetime?: string; // For travel detail
  travelDate?: string; // For demand detail
  createdAt: string;
  updatedAt: string;
  weight?: number; // For demands
  pricePerKg: number;
  weightAvailable?: number; // For travels
  totalWeightAllowance?: number; // For travels
  isDeactivated: boolean;
  packageKind?: string;
  isSharedWeight?: boolean;
  isInstant?: boolean;
  isAllowExtraWeight?: boolean;
  punctualityLevel?: boolean;
  feeForLateComer?: number;
  feeForGloomy?: number;
  user: User;
  images: Image[];
  isBookmarked?: boolean;
  reviews?: Review[];
}

export async function getDemandAndTravel(
  filters: DemandAndTravelFilters & { page?: number; limit?: number }
) {
  const params: Record<string, string | number | boolean | undefined> = {};

  // Airport filters
  if (filters.originAirportId) params.departureAirportId = filters.originAirportId;
  if (filters.destinationAirportId) params.arrivalAirportId = filters.destinationAirportId;

  // Flight and airline filters
  if (filters.flightNumber) params.flightNumber = filters.flightNumber;
  if (typeof filters.airlineId === 'number') params.airlineId = filters.airlineId;

  // Date filter
  if (filters.travelDate) params.travelDate = filters.travelDate;

  // Weight filters
  if (typeof filters.minWeight === 'number') params.minWeight = filters.minWeight;
  if (typeof filters.maxWeight === 'number') params.maxWeight = filters.maxWeight;
  if (typeof filters.weightAvailable === 'number') params.weightAvailable = filters.weightAvailable;

  // Price filters
  if (typeof filters.minPricePerKg === 'number') params.minPricePerKg = filters.minPricePerKg;
  if (typeof filters.maxPricePerKg === 'number') params.maxPricePerKg = filters.maxPricePerKg;

  // Other filters
  if (filters.type) params.type = filters.type;
  if (filters.description) params.description = filters.description;
  if (filters.status) params.status = filters.status;
  if (typeof filters.isVerified === 'boolean') params.isVerified = filters.isVerified;

  // Pagination
  if (typeof filters.page === 'number') params.page = filters.page;
  if (typeof filters.limit === 'number') params.limit = filters.limit;

  const response = await api.get(`/demand-and-travel`, { params });
  return response.data; // expected to be { items, meta, ... } structure
}

export const createAnnounce = async (announce: any) => {
  try {
    const response = await api.post(`/announces`, announce);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getLatestTravels = async (limit: number = 3) => {
  try {
    const response = await getDemandAndTravel({
      type: 'travel',
      page: 1,
      limit,
    });
    const items = Array.isArray(response) ? response : (response?.items ?? []);
    return items.slice(0, limit);
  } catch (error) {
    console.error('Error fetching latest travels:', error);
    return [];
  }
};

export const getLatestDemands = async (limit: number = 6) => {
  try {
    const response = await getDemandAndTravel({
      type: 'demand',
      page: 1,
      limit,
    });
    const items = Array.isArray(response) ? response : (response?.items ?? []);
    return items.slice(0, limit);
  } catch (error) {
    console.error('Error fetching latest demands:', error);
    return [];
  }
};

export interface BookmarkItem {
  id: number;
  createdAt: string;
  userId: number;
  bookmarkType: 'TRAVEL' | 'DEMAND';
  travelId?: number;
  demandId?: number;
  notes?: string;
  travel?: {
    id: number;
    flightNumber: string;
    description: string;
    departureAirportId: number;
    arrivalAirportId: number;
    departureDatetime: string;
    pricePerKg: string;
    weightAvailable: string;
    status: string;
    departureAirport: Airport;
    arrivalAirport: Airport;
    user: User;
    airline?: Airline;
    images?: Image[];
  };
  demand?: {
    id: number;
    flightNumber: string;
    description: string;
    departureAirportId: number;
    arrivalAirportId: number;
    departureDatetime: string;
    weight: string;
    pricePerKg: string;
    status: string;
    departureAirport: Airport;
    arrivalAirport: Airport;
    user: User;
    images?: Image[];
  };
}

export const getBookmarks = async () => {
  try {
    const response = await api.get('/bookmark');
    return response.data; // { items: BookmarkItem[], meta: {} }
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return { items: [], meta: {} };
  }
};

export const getUserDemandsAndTravels = async (userId: number, type?: 'demand' | 'travel') => {
  try {
    const params: Record<string, any> = { userId };
    if (type) params.type = type;

    const response = await api.get('/demand-and-travel', { params });
    return response.data; // { items: DemandTravelItem[], meta: {} }
  } catch (error) {
    console.error('Error fetching user demands and travels:', error);
    return { items: [], meta: {} };
  }
};

export const deleteTravel = async (travelId: number) => {
  try {
    const response = await api.delete(`/travel/${travelId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting travel:', error);
    throw error?.response?.data || error;
  }
};

export const deleteDemand = async (demandId: number) => {
  try {
    const response = await api.delete(`/demand/${demandId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting demand:', error);
    throw error?.response?.data || error;
  }
};
