import api from "./authService";

/**
 * @typedef {Object} SystemPerformanceDto
 * @property {number} totalRequests
 * @property {number} successRequests
 * @property {number} clientErrors
 * @property {number} serverErrors
 * @property {number} avgResponseTimeMs
 * @property {number} memoryUsedMb
 * @property {number} memoryMaxMb
 */

/**
 * @typedef {Object} EndpointPerformanceDto
 * @property {string} method
 * @property {string} uri
 * @property {number} totalRequests
 * @property {number} avgResponseTimeMs
 * @property {number} maxResponseTimeMs
 * @property {number} successRequests
 * @property {number} clientErrorRequests
 * @property {number} serverErrorRequests
 * @property {string[]} topExceptions
 */

/**
 * @typedef {Object} HttpMetricDto
 * @property {string} method
 * @property {string} uri
 * @property {number} status
 * @property {string|null} exception
 * @property {number} count
 * @property {number} meanMs
 * @property {number} maxMs
 */

/**
 * @typedef {Object} RecentErrorDto
 * @property {string} timestamp
 * @property {string} method
 * @property {string} path
 * @property {string} query
 * @property {string} exceptionClass
 * @property {string} message
 */

// Helper unwrap response { status, message, data }
const unwrapApiResponse = (res) => {
  const payload = res?.data;
  if (!payload || payload.status !== 200) {
    const message = payload?.message || "Có lỗi khi kết nối máy chủ.";
    throw new Error(message);
  }
  return payload.data;
};

const handleError = (error, fallback) => {
  if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
    throw new Error(
      "Request timeout. Vui lòng thử lại hoặc kiểm tra kết nối mạng."
    );
  }
  if (error.response) {
    const message =
      error.response?.data?.message || "Có lỗi từ server khi lấy số liệu.";
    throw new Error(message);
  }
  if (error.request) {
    throw new Error(
      "Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không."
    );
  }
  throw new Error(error.message || fallback);
};

// Service cho trang Admin Performance
export const performanceStatisticsService = {
  /** @returns {Promise<SystemPerformanceDto>} */
  async getSystemPerformance() {
    try {
      const res = await api.get("admin/performance/system", {
        timeout: 15000,
      });
      return unwrapApiResponse(res);
    } catch (error) {
      handleError(error, "Có lỗi khi tải dữ liệu system performance.");
    }
  },

  /** @returns {Promise<EndpointPerformanceDto[]>} */
  async getEndpointsPerformance() {
    try {
      const res = await api.get("admin/performance/endpoints", {
        timeout: 15000,
      });
      return unwrapApiResponse(res);
    } catch (error) {
      handleError(error, "Có lỗi khi tải danh sách endpoints.");
    }
  },

  /**
   * @param {{ status?: string|number|null, method?: string|null, uri?: string|null }} params
   * @returns {Promise<HttpMetricDto[]>}
   */
  async getHttpMetrics(params = {}) {
    try {
      const res = await api.get("admin/performance/http-metrics", {
        params,
        timeout: 15000,
      });
      return unwrapApiResponse(res);
    } catch (error) {
      handleError(error, "Có lỗi khi tải HTTP metrics.");
    }
  },

  /**
   * @param {number} limit
   * @returns {Promise<RecentErrorDto[]>}
   */
  async getRecentErrors(limit = 20) {
    try {
      const res = await api.get("admin/performance/errors/recent", {
        params: { limit },
        timeout: 15000,
      });
      return unwrapApiResponse(res);
    } catch (error) {
      handleError(error, "Có lỗi khi tải danh sách lỗi gần nhất.");
    }
  },
};

export default performanceStatisticsService;
