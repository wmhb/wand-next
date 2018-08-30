const getAuthHeader = () => `bearer ${localStorage.getItem('user-token')}`

export default {
  getAuthHeader
}
