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
  const res = await fetch(buildApiUrl('/reviews'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return getJson(res);
};
