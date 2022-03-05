import myAxios from "../utils/myAxios";

import qs from "qs"

let BASE_URL = '/two-sale'

export function getTwoSale(twoSale) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'get',
    params: twoSale,
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

export function putTwoSale(twoSale) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'put',
    data: twoSale
  })
}

export function deleteTwoSale(pjNumber) {
  return myAxios({
    url: BASE_URL + '/?pjNumber=' + pjNumber,
    method: 'delete',
  })
}
