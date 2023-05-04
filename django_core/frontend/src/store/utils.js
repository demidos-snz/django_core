export const fromStorage = (key) => {
  return localStorage.getItem(key)
}

export const toStorage = (key, data) => {
  localStorage.setItem(key, data)
}

export const removeFromStorage = (key) => {
  localStorage.removeItem(key)
}
