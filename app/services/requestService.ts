import api from "./Api";

export interface CreateRequestToTravelPayload {
  travelId: number;
  requestType: 'GoAndGive' | 'GoAndGo';
  weight: number;
  paymentMethodId: string; // Stripe Payment Method ID
}

export interface UserResponse {
  id: number;
  firstName: string;
  fullName:string;
  lastName: string;
  email: string;
}

export interface StatusResponse {
  status: string;
}

export interface RequestResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  demandId?: number;
  travelId?: number;
  requesterId: number;
  requestType: string;
  weight: number;
  currentStatusId: number;
  requester: UserResponse;
  currentStatus: StatusResponse;
  travel?: any;
  demand?: any;
}

export interface PaginatedRequests {
  items: RequestResponse[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export const createRequestToTravel = async (payload: CreateRequestToTravelPayload): Promise<RequestResponse> => {
  try {
    const response = await api.post('/request/to-travel', payload);
    return response.data;
  } catch (error: any) {
    console.error("Error creating request to travel:", error);
    throw error?.response?.data || error;
  }
};

export const getRequests = async (): Promise<PaginatedRequests> => {
  try {
    const response = await api.get('/request');
    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    return {
      items: [],
      meta: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };
  }
};

export const acceptRequest = async (requestId: number): Promise<RequestResponse> => {
  try {
    const response = await api.patch(`/request/${requestId}/accept`);
    return response.data;
  } catch (error: any) {
    console.error("Error accepting request:", error);
    throw error?.response?.data || error;
  }
};

export const completeRequest = async (requestId: number): Promise<RequestResponse> => {
  try {
    const response = await api.patch(`/request/${requestId}/complete`);
    return response.data;
  } catch (error: any) {
    console.error("Error completing request:", error);
    throw error?.response?.data || error;
  }
};
