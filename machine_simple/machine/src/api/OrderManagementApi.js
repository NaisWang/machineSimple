import myAxios from "../utils/myAxios";

import qs from "qs"

let BASE_URL = '/order-management'

export function getOrderManagement(orderManagement) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'get',
    params: orderManagement,
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

export function putOrderManagement(orderManagement) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'put',
    data: orderManagement
  })
}

export function deleteOrderManagement(machineNumber) {
  return myAxios({
    url: BASE_URL + '/?machineNumber=' + machineNumber,
    method: 'delete',
  })
}

export function modifyOrderManagement(orderManagement) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'post',
    data: orderManagement
  })
}
