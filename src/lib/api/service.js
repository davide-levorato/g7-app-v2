import _ from 'lodash'

const getResponse = function (r) {
  var apiRes = {
    res: false
  }
  if (r.result) {
    const d = _.result(r, 'data', [])
    const c = _.result(r, 'count', {})

    apiRes.res = true
    apiRes.data = d
    apiRes.count = c
  }
  return apiRes
}

const getQueryFilters = function (p) {
  const fR = _.result(p, 'qB.f', {})

  if (_.isEmpty(fR)) {
    _.forOwn(p, function (value, key) {
      if (_.isArray(value)) {
        if (value.length > 0) {
          fR[key] = []
          for (var z = 0; z < value.length; z++) {
            const keys = _.keys(value[z])
            for (var iK = 0; iK < keys.length; iK++) {
              if (_.startsWith(_.upperCase(keys[iK]), 'ID')) {
                fR[key].push(value[z][keys[iK]])
              }
            }
          }
        }
      } else {
        if (_.isBoolean(value) && value) {
          fR[key] = value
        }
      }
    })
  }
  return fR
}

const getQueryAlwaysIncludeRecords = function (p) {
  const aI = _.result(p, 'qB.i', [])

  return aI
}

const getQueryColumns = function (p) {
  var qC = []
  const c = _.result(p, 'qB.c', [])
  if (c === 'all') { return c }

  _.forEach(c, function (col) {
    _.forEach(col.fields, function (f) {
      qC.push(f.name)
    })
  })
  return qC
}

const getQuerySorting = function (p) {
  var qSrt = []
  const c = _.result(p, 'qB.c', [])
  for (var i = 0; i < c.length; i++) {
    const sortable = _.result(c[i], 'sorting.sortable', false)
    const sortByName = _.result(c[i], 'sorting.sortBy.name', '')
    if (sortable && sortByName !== '') {
      qSrt.push({
        f: c[i].sorting.sortBy.name,
        d: c[i].sorting.sortBy.direction
      })
      break
    }
  }
  return qSrt
}

const getQueryPagination = function (p) {
  var qPg = {
    pN: _.result(p, 'qB.p.pN', 1),
    pS: _.result(p, 'qB.p.pS', 20)
  }

  return qPg
}

const getQuery = function (p) {
  var f = { }

  if (_.has(p, 'q')) {
    f = { q: p.q }
  } else {
    f = {
      q: {
        qS: _.result(p, 'qB.s', ''),
        qC: getQueryColumns(p),
        qF: getQueryFilters(p),
        qAI: getQueryAlwaysIncludeRecords(p),
        qSrt: getQuerySorting(p),
        qPg: getQueryPagination(p)
      }
    }
  }
  f.obj = p.obj

  return f
}

const getBody = function (p) {
  var f = { }
  if (_.has(p, 'd')) {
    f = p.d
  }
  return f
}

export { getResponse, getQueryColumns, getBody, getQuery, getQuerySorting }
