import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth.php?action=login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const createReport = async (reportData) => {
  try {
    const response = await api.post('/api.php?action=create_report', reportData);
    return response.data;
  } catch (error) {
    console.error('Create report error:', error);
    throw error;
  }
};

export const getReports = async () => {
  try {
    const response = await api.get('/api.php?action=list_reports');
    return response.data;
  } catch (error) {
    console.error('Get reports error:', error);
    throw error;
  }
};

export const getReport = async (id) => {
  try {
    const response = await api.get(`/api.php?action=get_report&id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Get report error:', error);
    throw error;
  }
};

export const uploadFile = async (file, type, reportId, itemId, uploadedBy) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('report_id', reportId);
    formData.append('item_id', itemId);
    formData.append('uploaded_by', uploadedBy);
    
    const response = await axios.post(`${API_URL}/upload.php`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: false,
    });
    
    return response.data;
  } catch (error) {
    console.error('Upload file error:', error);
    throw error;
  }
};