import { request, APIRequestContext, expect } from '@playwright/test';

export async function newApi(baseURL?: string): Promise<APIRequestContext> {
  return await request.newContext({ baseURL: baseURL || process.env.E2E_BASE_URL || 'http://localhost:3000' });
}

export async function apiCreate<T = any>(api: APIRequestContext, url: string, data: any): Promise<T> {
  const res = await api.post(url, { data });
  expect(res.ok()).toBeTruthy();
  return (await res.json()) as T;
}

export async function apiPut<T = any>(api: APIRequestContext, url: string, data: any): Promise<T> {
  const res = await api.put(url, { data });
  expect(res.ok()).toBeTruthy();
  return (await res.json()) as T;
}

export async function apiDelete<T = any>(api: APIRequestContext, url: string, data?: any): Promise<T> {
  const res = await api.delete(url, { data });
  expect(res.ok()).toBeTruthy();
  return (await res.json()) as T;
}
