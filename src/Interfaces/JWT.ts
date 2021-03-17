export type PartialSession = Omit<any, 'issued' | 'expires'>;

export interface EncodeResult {
    token: string,
    expires: number,
    issued: number
}

export type DecodeResult =
    | { type: "valid"; data: any; }
    | { type: "integrity-error" }
    | { type: "invalid-token" };

export type ExpirationStatus = "expired" | "active" | "grace";
