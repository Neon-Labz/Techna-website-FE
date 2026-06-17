import api from '@/lib/axios';

// ─── Interfaces ───────────────────────────────────────────────────────────────

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

// ─── Module API ───────────────────────────────────────────────────────────────

export const moduleApi = {
  getAll(): Promise<ModuleFromApi[]> {
    return api.get('/modules');
  },

  getById(id: string): Promise<ModuleFromApi> {
    return api.get(`/modules/${id}`);
  },

  create(payload: Partial<ModuleFromApi>): Promise<ModuleFromApi> {
    return api.post('/modules', payload);
  },

  update(id: string, payload: Partial<ModuleFromApi>): Promise<ModuleFromApi> {
    return api.patch(`/modules/${id}`, payload);
  },

  delete(id: string): Promise<{ message: string }> {
    return api.delete(`/modules/${id}`);
  },

  addResourceUrl(moduleId: string, data: any): Promise<any> {
    return api.post(`/modules/${moduleId}/add-resource-url`, data);
  },

  toggleResourcePublish(moduleId: string, resourceId: string): Promise<any> {
    return api.patch(`/modules/${moduleId}/resources/${resourceId}/toggle-publish`);
  },
};