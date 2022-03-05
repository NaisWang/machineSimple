import myAxios from "../utils/myAxios";

import qs from "qs"

let BASE_URL = '/after-sale'

export function getAfterSale(afterSale) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'get',
    params: afterSale,
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

export function putAfterSale(afterSale) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'put',
    data: afterSale
  })
}

export function modifyAfterSale(afterSale) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'post',
    data: afterSale
  })
}

export function deleteAfterSale(pjNumbers) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'delete',
    params: {'pjNumbers': pjNumbers},
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
