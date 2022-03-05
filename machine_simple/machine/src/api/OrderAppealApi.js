import myAxios from "../utils/myAxios";

import qs from "qs"

let BASE_URL = '/order-appeal'

export function getOrderAppeal(orderAppeal) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'get',
    params: orderAppeal,
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

export function putOrderAppeal(orderAppeal) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'put',
    data: orderAppeal
  })
}

export function modifyOrderAppeal(orderAppeal) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'post',
    data: orderAppeal
  })
}

export function deleteOrderAppeal(machineNumbers) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'delete',
    params: {'machineNumbers': machineNumbers},
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
