class ApiError extends Error {
  constructor(code, status, message, data) {
    super(message);
    this.code = code;
    this.data = null;
    this.status = status;
  }
}

module.exports = ApiError;
