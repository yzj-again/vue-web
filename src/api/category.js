// 定义分类相关的api接口函数
// 导入请求工具
import request from '@/utils/request'

/**
 * 获取所有分类（顶级，二级，对应的商品推荐数据）
 * @returns Promise
 */
// 返回promise对象,获取所有分类(顶级,二级,二级商品数据)
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

/**
 * 获取分类对应的顶级类目商品推荐数据
 * @param {String} id 顶级类目id
 * @returns Promise
 */
export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}

/**
 * 获取分类对应的二级类目的筛选条件
 * @param {String} id 二级类目id
 * @returns Promise
 */
export const findSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'get', { id })
}

/**
 * 获取分类先的商品,带筛选条件
 * @param {Object} params
 * @returns Promise
 */
export const findSubCategoryGoods = (params) => {
  return request('/category/goods', 'post', params)
}
