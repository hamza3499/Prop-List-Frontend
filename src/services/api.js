export const API_URL = `http://${window.location.hostname}:5001`;

export const resolveImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // Strip any leading slash before joining with base URL (avoids double-slash)
  const clean = path.replace(/\\/g, '/').replace(/^\/+/, '');
  return `${API_URL}/${clean}`;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const signupUser = async (data) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'Signup failed');
  }
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'Login failed');
  }
  return res.json();
};

export const uploadAvatar = async (formData, token) => {
  const response = await fetch(`${API_URL}/api/users/upload-avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Content-Type is omitted to let browser set it with boundary
    },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Avatar upload failed');
  }
  return response.json();
};

export const updateUserProfile = async (data, token) => {
  const response = await fetch(`${API_URL}/api/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Profile update failed');
  }
  return response.json();
};

export const getProperties = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        params.append(key, filters[key]);
      }
    });

    const queryString = params.toString();
    const url = queryString ? `${API_URL}/properties?${queryString}` : `${API_URL}/properties`;

    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) throw new Error('Failed to fetch properties');
    return res.json();
  } catch (error) {
    console.error("API error fetching properties:", error);
    return { properties: [], total: 0 };
  }
};

export const getPropertyById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/properties/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Property not found');
    return res.json();
  } catch (error) {
    console.error(`API error fetching property ${id}:`, error);
    return null;
  }
};

export const addProperty = async (data, token) => {
  const isFormData = data instanceof FormData;
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_URL}/properties`, {
    method: 'POST',
    headers,
    body: isFormData ? data : JSON.stringify(data)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'Failed to add property');
  }
  return res.json();
};

export const getMyProperties = async (token) => {
  const res = await fetch(`${API_URL}/my-properties`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch user properties');
  return res.json();
};

export const submitVerification = async (data, token) => {
  try {
    const res = await fetch(`${API_URL}/api/users/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Verification submission failed');
    return result;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (token) => {
  try {
    const res = await fetch(`${API_URL}/api/users/profile`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
};
