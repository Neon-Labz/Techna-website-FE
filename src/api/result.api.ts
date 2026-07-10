import api from '@/lib/axios';

export const getResultsByStudentId = async (
  studentId: string,
  token: string,
) => {
  if (!studentId?.trim()) {
    throw new Error('Student ID is required');
  }

  const response: any = await api.get(
    `/results/student/${encodeURIComponent(studentId.trim())}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const body = response?.data ?? response;

  const payload =
    body?.success === true && body?.data !== undefined
      ? body.data
      : body;

  const results = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.results)
      ? payload.results
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  return {
    student:
      payload?.student ??
      body?.student ??
      body?.data?.student ??
      null,

    results,
  };
};