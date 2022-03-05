import myAxios from "../utils/myAxios";

import qs from "qs"

let BASE_URL = '/settlement'

export function getSettlement(settlement) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'get',
    params: settlement,
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

export function putSettlement(settlement) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'put',
    data: settlement
  })
}

export function deleteSettlement(pjNumbers) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'delete',
    params: {'pjNumbers': pjNumbers},
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

export function modifySettlement(settlement) {
  return myAxios({
    url: BASE_URL + '/',
    method: 'post',
    data: settlement
  })
}
