import Report from '@/store/models/report'

export const getters = {
  reports: (state) => {
    return state.reports.map((report) => new Report(report))
  },
}
