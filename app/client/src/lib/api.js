function loginUrl() {
  const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  return `/auth/login?returnTo=${encodeURIComponent(returnTo || '/')}`;
}

export async function apiFetch(url, options) {
  const response = await fetch(url, options);

  if (response.status === 401) {
    window.location.href = loginUrl();
    throw new Error('Unauthorized');
  }

  return response;
}
