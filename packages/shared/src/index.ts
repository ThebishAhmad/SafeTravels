export type UserRole = 'STUDENT' | 'BUS_DRIVER' | 'AUTO_DRIVER' | 'ADMIN' | 'SUPER_ADMIN';

export type VehicleType = 'BUS' | 'AUTO';

export type RideStatus = 'OPEN' | 'FULL' | 'STARTED' | 'COMPLETED' | 'CANCELLED';

export type KycStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type LoadStatus = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
    id: string;
    email: string;
    phone?: string;
    name: string;
    role: UserRole;
    kycStatus?: KycStatus;
    createdAt: string;
}

export interface Vehicle {
    id: string;
    driverId: string;
    vehicleNumber: string;
    type: VehicleType;
    capacity: number;
    currentLat?: number;
    currentLng?: number;
    loadStatus?: LoadStatus;
    isOnline: boolean;
}

export interface RouteStop {
    id: string;
    name: string;
    lat: number;
    lng: number;
    arrivalOffset: number; // minutes from route start
}

export interface BusRoute {
    id: string;
    name: string;
    stops: RouteStop[];
    pathPolyline: string;
    isActive: boolean;
}

export interface RideRequest {
    id: string;
    hostId: string;
    originLat: number;
    originLng: number;
    destLat: number;
    destLng: number;
    departureTime: string;
    status: RideStatus;
    maxPassengers: number;
    fareEstimate: number;
    genderPreference?: 'ANY' | 'FEMALE_ONLY';
}

export interface Complaint {
    id: string;
    userId: string;
    targetType: 'RIDE' | 'DRIVER' | 'BUS' | 'GENERAL';
    targetId?: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED';
    createdAt: string;
}
