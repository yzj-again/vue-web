// 提供商品相关的API函数
import request from '@/utils/request'

/**
 * 获取商品详情
 * @param {String} id - 商品id
 */
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}

/**
 * 获取商品同类推荐-未传入ID为猜喜欢,传入为同类推荐
 * @param {String} id - 商品ID
 * @param {Number} limit - 获取条数
 */
export const findRelGoods = ({
  id,
  limit = 16
}) => {
  return request('/goods/relevant', 'get', {
    id,
    limit
  })
}

/**
 * 获取商品热销推荐
 * @param {String} id - 商品ID
 * @param {Number} limit - 获取条数
 * @param {Number} type - 1代表24小时热销榜 2代表周热销榜 3代表总热销榜
 */
export const findGoodsHot = ({
  id,
  limit = 3,
  type = 1
}) => {
  return request('/goods/hot', 'get', {
    id,
    limit,
    type
  })
}
