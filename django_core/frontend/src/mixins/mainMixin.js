import { getFormattedDate } from '@/utils'

export default {
  filters: {
    dateFormat(value) {
      return getFormattedDate(value)
    },
    highlightSearchResults: function (value, search) {
      value = String(value)
      return value.replace(search, "<span class='blue'>" + search + '</span>')
    },
  },
}
