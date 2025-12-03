// API service for communicating with the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

interface StoreCreationData {
  storeId: string;
  storeSlug: string;
  storeName: string;
  storeNameEn?: string;
  description?: string;
  icon?: string;
  color?: string;
  categories: string[];
  products: any[];
  sliderImages: any[];
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async createStoreWithImages(formData: FormData): Promise<ApiResponse> {
    try {
      const url = `${BACKEND_BASE_URL}/api/stores/create-with-images`;

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
        return {
          success: false,
          error: errorMsg,
        };
      }

      return {
        success: true,
        data,
        message: data.message,
      };
    } catch (error) {
      let errorMsg = 'Unknown error occurred';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
          errorMsg = `الخادم غير متاح. تأكد من تشغيل الـ Backend على ${BACKEND_BASE_URL}`;
        } else {
          errorMsg = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMsg,
      };
    }
  }

  async createStoreWithFiles(storeData: StoreCreationData): Promise<ApiResponse> {
    return this.request('/stores/create-with-files', {
      method: 'POST',
      body: JSON.stringify(storeData),
    });
  }

  async validateStoreData(storeData: Partial<StoreCreationData>): Promise<ApiResponse> {
    return this.request('/stores/validate', {
      method: 'POST',
      body: JSON.stringify(storeData),
    });
  }

  async getAllStores(): Promise<ApiResponse> {
    return this.request('/stores', {
      method: 'GET',
    });
  }

  async checkBackendHealth(): Promise<{ isHealthy: boolean; message: string }> {
    const backendUrl = BACKEND_BASE_URL;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return { 
          isHealthy: true, 
          message: `✅ Backend server is running on ${BACKEND_BASE_URL}` 
        };
      } else {
        return { 
          isHealthy: false, 
          message: '❌ Backend server returned an error. Status: ' + response.status 
        };
      }
    } catch (error) {
      const message = error instanceof Error && error.name === 'AbortError' 
        ? '❌ Connection timeout. Backend server may not be responding.'
        : `❌ Cannot connect to backend server. Make sure it's running on ${BACKEND_BASE_URL}`;
      
      return { 
        isHealthy: false, 
        message 
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService;
