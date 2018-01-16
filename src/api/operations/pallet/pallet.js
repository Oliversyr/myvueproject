import fetch from '@/utils/fetch';

const APIDevicemPalletPre = '/devicem/pallet/';
const APIDevicemPosPre = '/devicem/pos/';

/*
 * 请求说明: 货道店铺汇总
 * 请求API: /api/devicem/pallet/summary/page
 * 请求方式: POST
 * 输入参数:
 参数	        格式	             说明	             备注
 params
 groupId	        Int	               所属店组
 goodsId	        Int	               商品ID
 ename	       String	           店铺名称	           模糊查询
 status	       Int	               状态             -1 全部、 0 未开业、 1 营业中、4 休息中、3 已停业，默认为营业中
 * 返回结果:
 参数	        格式	             说明	             备注
 result	  List< ShopPalletSummalyInfo >
 * 数据模型: 货道店铺汇总分页返回对象（ShopPalletSummalyInfo）
 参数	        格式	             说明	             备注
 eid	            Int	               机构编号
 ename	       String	           店铺名称	          如：坂田店
 address	       String	         店铺所在地址
 areaLName	   String	           区域全名	      如：广东省-深圳市-龙岗区
 contact	       String	            联系人
 contactMobile  String	          联系人电话
 status	       Int	                店铺状态	0未开业、1营业中、4休息中、3已停业
 inSaleCount	   Int	             店铺在售商品数量
 inSaleRate	   Int	              在售商品有货率
 errorCount	   Int	               货道故障数
 scabinet	   Int	               弹簧柜数量
 scPalletCount  Int	               弹簧柜或倒数(错别字‘货道数’)
 scPalletRate   Int	               弹簧柜货道有货率
 ccabinet	   Int	               格子柜数量
 ccPalletCount  Int	               格子柜货道数量
 ccPalletRate   Int	               格子柜货道有货率
 * 注意: 默认按店铺开业日期逆序排列、支持按照店铺商品有货率手动排序
 */
export function getShopPalletSummalyInfo(page, params) {
    return fetch({
        method: 'POST',
        url: APIDevicemPalletPre + 'summary/page',
        data: {
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            totalRecord: page.totalRecord,
            totalPage: page.totalPage,
            params: params
        }
    })
}

/*
 * 请求说明: 货道列表
 * 请求API: /api/devicem/pallet/page
 * 请求方式: POST
 * 输入参数:
 参数	        格式	             说明	             备注
 params
 posId	        Int	              售卖机编码
 palletId	    Int	                货道号	          只允许数字，精确查询
 goodsId	        Int	              商品编码
 counterid	    Int	              货柜号编码
 status	        int	                 状态	      -1全部、正常、故障、缺货、暂停销售
 * 返回结果:
 参数	        格式	             说明	             备注
 result	   List< ShopPalletInfo >
 * 数据模型: 货道列表分页返回对象（ShopPalletInfo）
 参数	        格式	             说明	             备注
 eid	            Int	                机构编号
 posId	        Int	                POS编码
 counterId	    Int	                货柜编码
 devType	        Int	                设备类型	   1-弹簧机  2-蛇形机   3-格子柜
 palletId	    Int	                货到号(错别字‘货道’)
 rowx	        Int	                行号
 rowy	        Int	                列号
 goodsId	        Int	                商品编码
 goodsName	    String	            商品名称
 barcode	        String
 spec1	        String	            规格1
 spec2	        String	            规格2
 uname	        String	            散装单位
 price	        Double	            售价
 stockQty	    Int	                库存数
 maxQty	        Int	                最大库存数
 status	        Int	                状态	         正常、故障、缺货、暂停销售
 * 注意: 默认按售卖机号、货柜号、货道号顺序排列
 */
export function getShopPalletInfo(page, params) {
    return fetch({
        method: 'POST',
        url: APIDevicemPalletPre + 'page',
        data: {
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            totalRecord: page.totalRecord,
            totalPage: page.totalPage,
            params: params
        }
    })
}

/*
 * 请求说明: 调整商品
 * 请求API: /api/devicem/pallet/adjustgoods
 * 请求方式: POST
 * 输入参数:
     参数	        格式	             说明	             备注
     posId	        Int	              售卖机编码
     palletId	    Int	              货道号
     goodsId	    Int	              商品编码	        -1表示删除商品
     counterid	    Int	              货柜号编码
     eid	        Int	              店铺编码
 * 返回结果:
     参数	        格式	             说明	             备注
     retCode	   String	           返回编码	         SUCCESS/FAIL
     retMsg	       String	         返回文本说明	  失败将会返回错误信息
 * 数据模型:
 * 注意:
 */
export function adjustPalletGoods(posId, palletId, goodsId, counterid, weightprop, eid, maxQty ) {
    return fetch({
        method: 'POST',
        url: APIDevicemPalletPre + 'adjustgoods',
        data: {
            posId,
            palletId,
            goodsId,
            counterid,
            weightprop,
            eid,
            maxQty
        }
    })
}

/*
 * 请求说明: 暂停、恢复销售 (/api/devicem /pallet/updateStatus)
 * 请求API: /api/devicem/pallet/updateStatus
 * 请求方式: GET
 * 输入参数:
    参数	        格式	             说明	             备注
    posId	        Int	              售卖机编码
    status	        int	              状态
    palletId	    Int	              货道号
    eid	            Int	              店铺编码
 * 返回结果:
    参数	        格式	             说明	             备注
    retCode	       String	           返回编码	         SUCCESS/FAIL
    retMsg	       String	         返回文本说明	  失败将会返回错误信息
 * 数据模型:
 * 注意:
 */
export function updatePosStatus(posId, status, palletId, eid) {
    return fetch({
        method: 'GET',
        url: APIDevicemPalletPre + 'updateStatus',
        params: {
            posId,
            status,
            palletId,
            eid
        }
    })
}