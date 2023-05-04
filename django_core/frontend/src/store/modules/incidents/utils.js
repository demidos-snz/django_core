export function prepareRequestParams(filters) {
  const params = {}
  for (const [k, v] of Object.entries(filters)) {
    if (v.filterType === 'text') {
      const key = v.expression ? `${k}${v.expression}` : k
      params[key] = v.val
    } else if (v.filterType === 'bool') {
      const key = v.expression ? `${k}${v.expression}` : k
      params[key] = v.val.value
    } else if (v.filterType === 'combobox') {
      const key = v.expression ? `${k}${v.expression}` : k
      params[key] = v.expression ? v.val.toString() : v.val
    } else if (['periodDate', 'periodDatetime'].includes(v.filterType)) {
      params[`${k}__gte`] = v.val.start
      params[`${k}__lte`] = v.val.end
    } else if (typeof v !== 'object') {
      params[k] = v
    }
  }
  return params
}
