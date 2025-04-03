export default {
  getMatches(): Promise<any> {
    return useApiFetch('/matching/', { method: 'GET' })
  },
}