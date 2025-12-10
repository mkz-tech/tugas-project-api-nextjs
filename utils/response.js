export function ok(message = "Succes", data = {}) {
  return { success: true, message, data };
}

export function err(message = "Error", code = 500, data = {}) {
  return { success: false, error: message, code, data };
}