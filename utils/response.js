
export const ok = (message = "Success", data = {}) => ({ success: true, message, data });
export const err = (error = "Error", code = 500) => ({ success: false, error, code });
