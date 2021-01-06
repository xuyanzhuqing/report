const toGB = size => {
  if (typeof size !== 'number') {
    return size
  }
  return (size / 1024 ** 3).toFixed(2)
}

const formatStatus = (h, status, value = '') => {
  const className = status ? 'icon-upward' : 'icon-downward'
  return h('css-icon', { class: [className] })
}

const renderHead = (text, unit) => {
  const style = {
    textAlign: 'center'
  }
  return (h) => h('div', { style }, [
    h('p', text),
    h('p', `（${unit}）`),
  ])
}

const isEmpty = (v) => {
  const common = [NaN, null, undefined]
  if (
    common.includes(v) ||
    (typeof v === 'string' && !v.trim()) ||
    (Array.isArray(v) && !v.length) ||
    JSON.stringify(v) === '{}'
  ) {
    return true
  }
  return false
}

const setType = (type, data) =>{
  const arr = Object.values(data)
  const result = arr.flat().filter(v => !isEmpty(v))
  return result.map(v => Object.assign(v, { type }))
}

// 安全获取字段
function safe (data) {
  return function (path, defaults) {
    if(typeof path === 'undefined') {
      return data
    }

    if (isEmpty(data)) {
      return defaults
    }
    const [ first, ...last ] = path.split('.')
    if (!last.length) {
      return isEmpty(data[first]) ? defaults: data[first]
    }
    try {
      let curr = data[first]
      while (last.length > 0) {
        const key = last.shift()
        curr = curr[key]
      }
      return isEmpty(curr) ? defaults : curr
    } catch (err) {
      return defaults
    }
  }
}

function groupBy (data, key) {
  const result = {}
  for (let i = 0; i < data.length; i++) {
    const curr = data[i]
    const group = curr[key]
    if (result[group]) {
      result[group].push(curr)
    } else {
      result[group] = [curr]
    }
  }
  return result
}