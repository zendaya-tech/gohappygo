export interface ProfileSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number | string;
}

export interface Conversation {
  id: number;
  requestId: number;
  otherUser: {
    id: number;
    name: string;
    avatar: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: number;
  };
  unreadCount: number;
  travel: {
    departureAirport?: { name: string };
    arrivalAirport?: { name: string };
    flightNumber?: string;
  };
}
