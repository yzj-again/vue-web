// 首页接口api函数
import request from '@/utils/request'

export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}

export const findBanner = () => {
  return request('/home/banner', 'get')
}

export const findNew = () => {
  return request('/home/new', 'get')
}

export const findHot = () => {
  return request('/home/hot', 'get')
}
/**
 * 获取商品
 * @return Promise
* */
export const findProduct = () => {
  return request('/home/goods', 'get')
}
/**
 * 获取最新专题
 * @return Promise
 * */
export const findSpecial = () => {
  return request('/home/special', 'get')
}
