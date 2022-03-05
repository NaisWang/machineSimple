import myAxios from "../utils/myAxios";

import qs from "qs"

let BASE_URL = '/order-sign'

export function getOrderSign(orderSign) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'get',
    params: orderSign,
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

export function putOrderSign(orderSign) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'put',
    data: orderSign
  })
}

export function modifyOrderSign(orderSign) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'post',
    data: orderSign
  })
}

export function deleteOrderSign(machineNumbers) {
  return myAxios({
    url: BASE_URL + '/',
    params: {'machineNumbers': machineNumbers},
    method: 'delete',
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
