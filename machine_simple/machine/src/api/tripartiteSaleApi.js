import myAxios from "../utils/myAxios";

import qs from "qs"

let BASE_URL = '/tripartite-sale'

export function getTripartiteSale(tripartiteSale) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'get',
    params: tripartiteSale,
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

export function putTripartiteSale(tripartiteSale) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'put',
    data: tripartiteSale
  })
}

export function modifyTripartiteSale(tripartiteSale) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'post',
    data: tripartiteSale
  })
}

export function deleteTripartiteSale(machineNumbers) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'delete',
    params: {'machineNumbers': machineNumbers},
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
