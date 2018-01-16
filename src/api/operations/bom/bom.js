import fetch from '@/utils/fetch';

const APIGoodsBomPre = '/goods/bom/';

/*
 * 请求说明: 查看组合商品列表
 * 请求API: /api/goods/bom/page
 * 请求方式: POST
 * 输入参数:
 参数	        格式	             说明	             备注
 params
 goodsId	        Int	                商品ID	          单个商品的ID
 bomGoodsName	   String	          组合商品名称
 ename	       String	            店铺名称
 * 返回结果:
 参数	        格式	             说明	             备注
 result	     List< BomInfo>
 * 数据模型: 组合商品信息（BomInfo）
 参数	        格式	             说明	             备注
 eid	            Int	                机构编号
 ename	       String	            店铺名称	       如：坂田店
 eLName	       String	          完整店铺名称	如：三只熊总部-深圳区域-坂田店
 bomId	       Int	                组合商品ID
 oldPrice	       Double	             原售价
 price	       Double	          执行价（售价）
 status	       Int	                  状态	           0-下架  1-上架
 goodsName	  String	            组合商品名称
 goodsLName	  String	            包含的商品名称	 如：蒙牛纯牛奶250ml(2罐)+盼盼软面包（2袋）
 goodsList	List<GoodsInfo>	        组合商品信息
 * 注意:
 */
export function getBomList(page, goodsId, bomGoodsName, ename, shopEid, status) {
    return fetch({
        method: 'POST',
        url: APIGoodsBomPre + 'page',
        data: {
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            totalRecord: page.totalRecord,
            totalPage: page.totalPage,
            params: {
                "goodsId": goodsId,
                "bomGoodsName": bomGoodsName,
                "ename": ename,
                "shopEid": (!shopEid ? -1 : shopEid),
                "status": (!status ? -1 : status)
            }
        }
    })
}

/*
 * 请求说明: 组合商品状态更新/开业
 * 请求API: /api/goods/bom/updateStatus
 * 请求方式: GET
 * 输入参数:
 参数	        格式	             说明	             备注
 bomIds 	    String
 status	        int	                 状态	         0-禁用  1-启用
 * 返回结果:
 参数	        格式	             说明	             备注
 retCode	       String	           返回编码	         SUCCESS/FAIL
 retMsg	       String	           返回文本说明	   失败将会返回错误信息
 * 数据模型:
 * 注意:
 */
export function updateBomStatus(bomIds, status) {
    return fetch({
        method: 'GET',
        url: APIGoodsBomPre + 'updateStatus',
        params: {
            bomIds,
            status
        }
    })
}

/*
 * 请求说明: 组合商品复制
 * 请求API: /api/goods/bom/copy
 * 请求方式: GET
 * 输入参数:
 参数	        格式	             说明	             备注
 bomIds	        String	            组合商品ID
 eid	            Int	                 店铺
 * 返回结果:
 参数	        格式	             说明	             备注
 retCode	       String	           返回编码	         SUCCESS/FAIL
 retMsg	       String	           返回文本说明	   失败将会返回错误信息
 * 数据模型:
 * 注意: 重新生成Bom记录
 */
export function copyBom(bomIds, eid) {
    return fetch({
        method: 'GET',
        url: APIGoodsBomPre + 'copy',
        params: {
            bomIds,
            eid
        }
    })
}

/*
 * 请求说明: 新增组合商品
 * 请求API: /api/goods/bom/add
 * 请求方式: POST
 * 输入参数:
 参数	        格式	             说明	             备注
 bomInfo	      BomInfo	          组合商品信息
 * 返回结果:
 参数	        格式	             说明	             备注
 retCode	       String	           返回编码	         SUCCESS/FAIL
 retMsg	       String	           返回文本说明	   失败将会返回错误信息
 * 数据模型:
 * 注意: 重新生成Bom记录
 */
export function addBom(bomInfo) {
    return fetch({
        method: 'POST',
        url: APIGoodsBomPre + 'add',
        data: bomInfo
    })
}

/*
 * 请求说明: 更新组合商品
 * 请求API: /api/goods/bom/update
 * 请求方式: POST
 * 输入参数:
 参数	        格式	             说明	             备注
 bomInfo	      BomInfo	          组合商品信息
 * 返回结果:
 参数	        格式	             说明	             备注
 retCode	       String	           返回编码	         SUCCESS/FAIL
 retMsg	       String	           返回文本说明	   失败将会返回错误信息
 * 数据模型:
 * 注意: 重新生成Bom记录
 */
export function updateBom(bomInfo) {
    return fetch({
        method: 'POST',
        url: APIGoodsBomPre + 'update',
        data: bomInfo
    })
}

/*
 * 请求说明: 详情(/api/goods/bom/detail)
 * 请求API: /api/goods/bom/detail
 * 请求方式: GET
 * 输入参数:
 参数	        格式	             说明	             备注
 bomId	        Int
 * 返回结果:
 参数	        格式	             说明	             备注
 retCode	       String	           返回编码	         SUCCESS/FAIL
 retMsg	       String	           返回文本说明	   失败将会返回错误信息
 result	       Object	          BomInfo组合商品信息
 * 数据模型:
 * 注意:
 */
export function getBomDetail(bomId) {
    return fetch({
        method: 'GET',
        url: APIGoodsBomPre + 'detail',
        params: {
            bomId
        }
    })
}