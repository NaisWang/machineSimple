import myAxios from "../utils/myAxios";

import qs from "qs"

let BASE_URL = '/fix'

export function getFix(fix) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'get',
    params: fix,
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

export function putFix(fix) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'put',
    data: fix
  })
}

export function modifyFix(fix) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'post',
    data: fix
  })
}

export function deleteFix(machineNumbers) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'delete',
    params: {'machineNumbers': machineNumbers},
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
