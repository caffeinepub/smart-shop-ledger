import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface PremiumStatus {
    expiryDate?: Time;
    isActive: boolean;
}
export interface backendInterface {
    activatePremium(userId: string): Promise<void>;
    getPremiumStatus(userId: string): Promise<PremiumStatus>;
}
