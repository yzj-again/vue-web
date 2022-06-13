import request from '@/utils/request'

/**
 * 获取新的商品信息,用来更新购物车
 * @param {String} skuId - 商品skuId
 * @returns Promise
 */
export const getNewCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'get')
}
