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

export const moduleApi = {
  // GET /api/modules — fetch all modules
  getAll(): Promise<ModuleFromApi[]> {
    return api.get('/modules');
  },

  // GET /api/modules/:id — fetch single module by id
  getById(id: string): Promise<ModuleFromApi> {
    return api.get(`/modules/${id}`);
  },

  // POST /api/modules — create a module
  create(payload: Partial<ModuleFromApi>): Promise<ModuleFromApi> {
    return api.post('/modules', payload);
  },

  // PATCH /api/modules/:id — update a module
  update(id: string, payload: Partial<ModuleFromApi>): Promise<ModuleFromApi> {
    return api.patch(`/modules/${id}`, payload);
  },

  // DELETE /api/modules/:id — delete a module
  delete(id: string): Promise<{ message: string }> {
    return api.delete(`/modules/${id}`);
  },

  // POST /api/modules/:id/add-resource-url — add URL resource
  addResourceUrl(moduleId: string, data: any): Promise<any> {
    return api.post(`/modules/${moduleId}/add-resource-url`, data);
  },

  // PATCH /api/modules/:moduleId/resources/:resourceId/toggle-publish — toggle resource publish status
  toggleResourcePublish(moduleId: string, resourceId: string): Promise<any> {
    return api.patch(`/modules/${moduleId}/resources/${resourceId}/toggle-publish`);
  },
};
