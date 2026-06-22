import api from '@/lib/axios';

export interface ResourceFromApi {
  _id: string;
  title: string;
  fileType: 'video' | 'image' | 'pdf' | 'file';
  fileUrl: string;
  fileKey: string;
  url?: string;
  thumbnailUrl?: string;
  description?: string;
  uploadedAt?: string;
  isPublished?: boolean;
}

export interface ModuleFromApi {
  _id: string;
  name: string;
  teacherId: string;
  teacherName: string;
  description: string;
  duration: string;
  fee: number;
  batch: string;
  status: 'active' | 'inactive';
  resources?: ResourceFromApi[];
  createdAt?: string;
  updatedAt?: string;
}

// Unwrap backend envelope: { success, message, data: [...] } or plain array
function unwrapList(res: unknown): ModuleFromApi[] {
  if (Array.isArray(res)) return res;
  if (res && typeof res === 'object') {
    const r = res as Record<string, unknown>;
    if (Array.isArray(r['data'])) return r['data'] as ModuleFromApi[];
    if (Array.isArray(r['modules'])) return r['modules'] as ModuleFromApi[];
    if (Array.isArray(r['result'])) return r['result'] as ModuleFromApi[];
  }
  return [];
}

export const moduleApi = {
  getAll(): Promise<ModuleFromApi[]> {
    return api.get('/modules').then((res) => unwrapList(res.data ?? res));
  },

  getById(id: string): Promise<ModuleFromApi> {
    return api.get(`/modules/${id}`).then((res) => res.data);
  },

  create(payload: Partial<ModuleFromApi>): Promise<ModuleFromApi> {
    return api.post('/modules', payload).then((res) => res.data);
  },

  update(id: string, payload: Partial<ModuleFromApi>): Promise<ModuleFromApi> {
    return api.patch(`/modules/${id}`, payload).then((res) => res.data);
  },

  delete(id: string): Promise<{ message: string }> {
    return api.delete(`/modules/${id}`).then((res) => res.data);
  },

  addResourceUrl(moduleId: string, data: unknown): Promise<unknown> {
    return api.post(`/modules/${moduleId}/add-resource-url`, data).then((res) => res.data);
  },

  toggleResourcePublish(moduleId: string, resourceId: string): Promise<unknown> {
    return api.patch(`/modules/${moduleId}/resources/${resourceId}/toggle-publish`).then((res) => res.data);
  },
};