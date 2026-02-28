import type { DemandTravelItem } from './announceService';
import api from './Api';

export interface CreateDemandDto {
  title?: string;
  description: string;
  flightNumber: string;
  departureAirportId: number;
  arrivalAirportId: number;
  airlineId: number;
  currencyId?: number;
  deliveryDate: string;
  travelDate?: string;
  weight: number;
  pricePerKg: number;
  packageKind?: string;
  isSharedWeight?: boolean;
  isInstant?: boolean;
}

export interface UpdateDemandDto {
  title?: string;
  description?: string;
  flightNumber?: string;
  departureAirportId?: number;
  arrivalAirportId?: number;
  airlineId?: number;
  currencyId?: number;
  deliveryDate?: string;
  travelDate?: string;
  weight?: number;
  pricePerKg?: number;
  packageKind?: string;
  isSharedWeight?: boolean;
  isInstant?: boolean;
}

export interface DemandImage {
  id: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface Airport {
  id: number;
  name: string;
  iataCode: string;
  icaoCode: string;
  city: string;
  country: string;
  municipality?: string;
}

export interface Airline {
  id: number;
  name: string;
  iataCode: string;
  icaoCode: string;
  logoUrl?: string;
}

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
}

export interface FindDemandsQuery {
  page?: number;
  limit?: number;
  userId?: number;
  flightNumber?: string;
  departureAirportId?: number;
  arrivalAirportId?: number;
  status?: string;
  deliveryDate?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedDemandResponse {
  items: DemandTravelItem[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

// Get demands with filtering
export const getDemands = async (
  query: FindDemandsQuery = {}
): Promise<PaginatedDemandResponse> => {
  try {
    const response = await api.get('/demand', { params: query });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching demands:', error);
    throw error?.response?.data || error;
  }
};

// Get demand by ID
export const getDemandById = async (id: number): Promise<DemandTravelItem> => {
  try {
    const response = await api.get(`/demand/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching demand:', error);
    throw error?.response?.data || error;
  }
};

// Delete/Cancel demand
export const deleteDemand = async (id: number): Promise<DemandTravelItem> => {
  try {
    const response = await api.delete(`/demand/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting demand:', error);
    throw error?.response?.data || error;
  }
};

// Get user's demands
export const getUserDemands = async (userId?: number): Promise<PaginatedDemandResponse> => {
  try {
    const query: FindDemandsQuery = {};
    if (userId) {
      query.userId = userId;
    }
    return await getDemands(query);
  } catch (error: any) {
    console.error('Error fetching user demands:', error);
    throw error?.response?.data || error;
  }
};
