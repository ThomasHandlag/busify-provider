import { create } from "zustand";

export interface RouteData {
	id: number;
	name: string;
	startLocationId: number;
	startLocationName: string;
	endLocationId: number;
	endLocationName: string;
	defaultDurationMinutes: number;
	defaultPrice: number;
}

export interface RouteResponse {
	code: number;
	message: string;
	result: RouteData[];
	totalRecords: number;
	pageNumber: number;
	totalPages: number;
	pageSize: number;
	hasPrevious: boolean;
	hasNext: boolean;
}

export const routeStore = create<{
	routes: RouteData[];
	setRoutes: (routes: RouteData[]) => void;
}>((set) => ({
	routes: [],
	setRoutes: (routes) => set({ routes }),
}));
