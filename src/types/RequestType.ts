export interface PlanRequest{
    month: number;
    year: number;
    requests: RequestEntity[];
}

export type RequestState = "Wanted" | "Unavailable" | "Available";

export interface RequestEntity {
    day: number;
    vacation: boolean;
    shifts: {
        morning: RequestState;
        afternoon: RequestState;
        between?: BetweenShift;
    }
}

export interface BetweenShift {
    timeFrom: string; // utc time
    timeTo: string; // utc time
}