const getAuthHeader = () => `bearer ${localStorage.getItem('user-token')}`
const getToken = () => localStorage.getItem('user-token')

export default {
  getAuthHeader,
  getToken
}
