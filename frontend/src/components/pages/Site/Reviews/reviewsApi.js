import { buildApiUrl } from '../../../../config/api';

const getJson = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || 'Request failed.';
    throw new Error(message);
  }
  return data;
};

export const fetchPublishedReviews = async () => {
  const res = await fetch(buildApiUrl('/reviews'));
  const data = await getJson(res);
  return data.reviews || [];
};

export const fetchReviewableTours = async (email) => {
  const res = await fetch(buildApiUrl(`/reviews/reviewable-tours?email=${encodeURIComponent(email)}`));
  const data = await getJson(res);
  return data.tours || [];
};

export const createReview = async (payload) => {
  const formData = new FormData();

  formData.append('customerEmail', payload.customerEmail || '');
  formData.append('bookingId', payload.bookingId || '');
  formData.append('stars', String(payload.stars || ''));
  formData.append('driverName', payload.driverName || '');
  formData.append('title', payload.title || '');
  formData.append('comment', payload.comment || '');
  formData.append('tourTitle', payload.tourTitle || '');
  formData.append('tourType', payload.tourType || '');

  (payload.images || []).forEach((image) => {
    if (image instanceof File) {
      formData.append('images', image);
    }
  });

  const res = await fetch(buildApiUrl('/reviews'), {
    method: 'POST',
    body: formData,
  });
  return getJson(res);
};
