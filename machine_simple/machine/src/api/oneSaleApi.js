import myAxios from "../utils/myAxios";

import qs from "qs"

let BASE_URL = '/one-sale'

export function getOneSale(oneSale, times) {
  oneSale.times = times
  return myAxios({
    url: BASE_URL + '/',
    method: 'get',
    params: oneSale,
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

export function putOneSale(oneSale, times) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'put',
    data: oneSale
  })
}

export function deleteOneSale(pjNumbers) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'delete',
    params: {'pjNumbers': pjNumbers},
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
