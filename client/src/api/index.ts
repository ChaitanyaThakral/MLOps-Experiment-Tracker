/**
 * Module for all HTTP requests to the Express backend.
 * All routes are prefixed with /api/ and Vite proxies them to http://localhost:65535
 */

export interface ApiResponse<T = unknown[]> {
    data?: T;
    success?: boolean;
    error?: string;
}

export async function checkDbConnection(): Promise<string> {
    const res = await fetch('/api/check-db-connection');
    return res.text();
}