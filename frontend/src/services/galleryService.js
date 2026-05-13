import { api } from '../config/api';

export const fetchGalleryPhotos = async () => {
  const data = await api.get('/gallery');
  return Array.isArray(data) ? data : [];
};

export const createGalleryPhoto = async ({ file, payload }) => {
  const form = new FormData();
  form.append('image', file);
  Object.entries(payload).forEach(([key, value]) => {
    if (typeof value !== 'undefined' && value !== null) {
      form.append(key, String(value));
    }
  });

  return api.upload('/gallery', form);
};

export const updateGalleryPhotoStatus = (id, status) =>
  api.patch(`/gallery/${id}/status`, { status });

export const deleteGalleryPhoto = (id) => api.delete(`/gallery/${id}`);

export const fetchLocations = async () => {
  const data = await api.get('/locations');
  return Array.isArray(data) ? data : [];
};

export const createLocation = (payload) => api.post('/locations', payload);

export const updateLocation = (id, payload) => api.put(`/locations/${id}`, payload);

export const deleteLocation = (id) => api.delete(`/locations/${id}`);
