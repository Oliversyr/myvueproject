import fetch from '@/utils/fetch';

const APIComUrl = '/salem/report/';

/*
 * 请求说明: 查看店铺汇总报表
 * 请求API: /api/salem/report/shopsummary
 * 请求方式: POST
 * 输入参数:
参数	格式	说明	备注
params	Map<String,Object>		
eid	        Int	    当前用户Eid	
shopName	String	店铺名称	模糊查询，为空查询全部
areaid	    long	区域编码	-1查询全部
goodsName	String	商品名称	模糊查询，为空查询全部
goodsId	    Int	    商品编码	-1查询全部
bDate	    String	开始日期	必填，格式：yyyy-MM-dd
eDate	    String	结束日期	必填，格式：yyyy-MM-dd。日期区间不能大于3个月

 * 返回结果:
参数	格式	说明	备注
response	ShopSummaryResponse		
retCode	    String		
retMsg	    String		
pageNum	    Int		
pageSize	Int		
totalRecord	Long		
totalPage	int		
shopCountT	Int	    店铺数量	
saleMoneyT	String	总销售金额	
sheetCountT	Int	    总客单数	
result	List<>		
eid	Int	店铺编码	
ename	    String	店铺名称	
areaLName	String	区域名称	
address	    String	地址	
contact	    String	联系人	
contactMobile	String	联系电话	
shopStatus	Int	店铺状态	
saleMoney	String	销售金额	
sheetCount	Int	客单数	
sheetPrice	String	客单价		
注： 商品店铺汇总只需要传入goodsId即可
 */
export function getShopsummaryList(params) {
    return fetch({
        method: 'POST',
        url: APIComUrl + 'shopsummary',
        data: {
            pageNum: params.pageNum,
            pageSize: params.pageSize,
            totalRecord: params.totalRecord,
            totalPage: params.totalPage,
            params: {
                "eid": params.eid * 1,
                "goodsId": params.goodsId * 1 || -1,
                "areaid": params.areaid * 1 || -1,
                "shopName": params.shopName || '',
                "goodsName": params.goodsName || '',
                "bDate": params.bDate || '',
                "eDate": params.eDate || ''
            }
        }
    })
}


/*
 * 请求说明: 查看店铺汇总报表
 * 请求API: /api/salem/report/good/shopsummary
 * 请求方式: POST
 * 输入参数:
 参数	格式	说明	备注
 params	Map<String,Object>
 eid	        Int	    当前用户Eid
 shopName	String	店铺名称	模糊查询，为空查询全部
 areaid	    long	区域编码	-1查询全部
 goodsName	String	商品名称	模糊查询，为空查询全部
 goodsId	    Int	    商品编码	-1查询全部
 bDate	    String	开始日期	必填，格式：yyyy-MM-dd
 eDate	    String	结束日期	必填，格式：yyyy-MM-dd。日期区间不能大于3个月

 * 返回结果:
 参数	格式	说明	备注
 response	ShopSummaryResponse
 retCode	    String
 retMsg	    String
 pageNum	    Int
 pageSize	Int
 totalRecord	Long
 totalPage	int
 shopCountT	Int	    店铺数量
 saleMoneyT	String	总销售金额
 sheetCountT	Int	    总客单数
 result	List<>
 eid	Int	店铺编码
 ename	    String	店铺名称
 areaLName	String	区域名称
 address	    String	地址
 contact	    String	联系人
 contactMobile	String	联系电话
 shopStatus	Int	店铺状态
 saleMoney	String	销售金额
 sheetCount	Int	客单数
 sheetPrice	String	客单价
 注： 商品店铺汇总只需要传入goodsId即可
 */
export function getGoodsShopsummaryList(params) {
    return fetch({
        method: 'POST',
        url: APIComUrl + 'good/shopsummary',
        data: {
            pageNum: params.pageNum,
            pageSize: params.pageSize,
            totalRecord: params.totalRecord,
            totalPage: params.totalPage,
            params: {
                "eid": params.eid * 1,
                "goodsId": params.goodsId * 1 || -1,
                "areaid": params.areaid * 1 || -1,
                "shopName": params.shopName || '',
                "goodsName": params.goodsName || '',
                "bDate": params.bDate || '',
                "eDate": params.eDate || ''
            }
        }
    })
}

/*
 * 请求说明: 查看商品汇总报表
 * 请求API: /api/salem/report/goodsummary
 * 请求方式: POST
 * 输入参数:
参数	格式	说明	备注
params	Map<String,Object>		
eid	        Int	        当前用户Eid	
shopEid	    Int	        店铺编码	
shopName	String	    店铺名称	模糊查询，为空查询全部
areaid	    long	    区域编码	-1查询全部
goodsName	String	    商品名称	模糊查询，为空查询全部
bDate	    String	    开始日期	必填，格式：yyyy-MM-dd
eDate	    String	    结束日期	必填，格式：yyyy-MM-dd。日期区间不能大于3个月


 * 返回结果:
参数	格式	说明	备注
response	GoodsSummaryResponse	
retCode	String	
retMsg	String	
pageNum	Int	
pageSize	Int	
totalRecord	Long	
totalPage	int	
goodsCountT	Int	商品数量总计
saleMoneyT	String	总销售金额总计
sheetCountT	Int	总客单数总计
result	List<>	
goodsId	Int	商品编码
myGoodsId	String	商品内码
barcode	String	条码
spec	String	规格1
spec2	String	规格2
brandName	String	品牌名称
catLName	String	品类全称
saleMoney	String	销售金额
sheetCount	Int	客单数
sheetPrice	String	客单价
注： 店铺商品汇总，需要传入shopEid
 */
export function getGoodsummaryList(params) {
    return fetch({
        method: 'POST',
        url: APIComUrl + 'goodsummary',
        data: {
            pageNum: params.pageNum,
            pageSize: params.pageSize,
            totalRecord: params.totalRecord,
            totalPage: params.totalPage,
            params: {
                "eid": params.eid * 1,
                "shopEid": params.shopEid * 1 || -1,
                "goodsId": params.goodsId * 1 || -1,
                "areaid": params.areaid * 1 || -1,
                "shopName": params.shopName || '',
                "goodsName": params.goodsName || '',
                "bDate": params.bDate || '',
                "eDate": params.eDate || ''
            }
        }
    })
}

/*
 * 请求说明: 查看店铺销售流水报表
 * 请求API: /api/salem/report/shop/salesummary
 * 请求方式: POST
 * 输入参数:
参数	格式	说明	备注
params	Map<String,Object>		
eid	        Int	        当前用户Eid	
shopEid	    Int	        店铺编码	
shopName	String	    店铺名称	模糊查询，为空查询全部
areaid	    long	    区域编码	-1查询全部
goodsName	String	    商品名称	模糊查询，为空查询全部
bDate	    String	    开始日期	必填，格式：yyyy-MM-dd
eDate	    String	    结束日期	必填，格式：yyyy-MM-dd。日期区间不能大于3个月

 * 返回结果:
参数	格式	说明	备注
response	GoodsSummaryResponse	
retCode	String	
retMsg	String	
pageNum	Int	
pageSize	Int	
totalRecord	Long	
totalPage	int	
saleMoneyT	String	总销售金额总计
sheetCountT	Int	    总客单数总计

result	List<>	
eid	        Int	    店铺编码	
ename	    String	店铺名称	
saleDate	String	销售日期	格式：yyyy-MM-dd HH:mm:ss
sheetId	    Long	销售单号	
saleMoney	String	销售金额	
goodsCount	Int	    商品数量	
payType	    Int 	支付方式	3支付宝，4微信

 */
export function getShopSalesummaryList(params) {
    return fetch({
        method: 'POST',
        url: APIComUrl + 'shop/salesummary',
        data: {
            pageNum: params.pageNum,
            pageSize: params.pageSize,
            totalRecord: params.totalRecord,
            totalPage: params.totalPage,
            params: {
                "eid": params.eid * 1,
                "shopEid": params.shopEid * 1 || -1,
                "goodsId": params.goodsId * 1 || -1,
                "areaid": params.areaid * 1 || -1,
                "shopName": params.shopName || '',
                "goodsName": params.goodsName || '',
                "bDate": params.bDate || '',
                "eDate": params.eDate || ''
            }
        }
    })
}

/*
 * 请求说明: 查看店铺商品销售流水报表
 * 请求API: /api/salem/report/shop/saledetail
 * 请求方式: POST
 * 输入参数:
参数	格式	说明	备注
params	Map<String,Object>		
eid	        Int	        当前用户Eid	
shopEid	    Int	        店铺编码	
shopName	String	    店铺名称	模糊查询，为空查询全部
areaid	    long	    区域编码	-1查询全部
goodsName	String	    商品名称	模糊查询，为空查询全部
bDate	    String	    开始日期	必填，格式：yyyy-MM-dd
eDate	    String	    结束日期	必填，格式：yyyy-MM-dd。日期区间不能大于3个月
goodsId	    Int	        商品编码	-1查询全部
sheetId	    Long	    订单号	     -1查询全部


 * 返回结果:
参数	格式	说明	备注
response	GoodsSummaryResponse	
retCode	String	
retMsg	String	
pageNum	Int	
pageSize	Int	
totalRecord	Long	
totalPage	int	
saleMoneyT	String	总销售金额总计
sheetCountT	Int	    总客单数总计

result	List<>	
eid	        Int	    店铺编码
ename	    String	店铺名称
saleDate	String	销售日期
sheetId	    Long	销售单号
goodsId	    Int	    商品编码
myGoodsId	String	商品内码
goodsName	String	商品名称
barcode	    String	条码
spec	    String	规格1
spec2	    String	规格2
saleQty	    Int	    销售数量
saleMoney	String	销售金额
goodsCount	Int	    商品数量
payType	    Int	    支付方式
price	    String	售价

 */
export function getShopSaledetailList(params) {
    return fetch({
        method: 'POST',
        url: APIComUrl + 'shop/saledetail',
        data: {
            pageNum: params.pageNum,
            pageSize: params.pageSize,
            totalRecord: params.totalRecord,
            totalPage: params.totalPage,
            params: {
                "eid": params.eid * 1,
                "shopEid": params.shopEid * 1 || -1,
                "goodsId": params.goodsId * 1 || -1,
                "sheetId": params.sheetId * 1 || -1,
                "areaid": params.areaid * 1 || -1,
                "shopName": params.shopName || '',
                "goodsName": params.goodsName || '',
                "bDate": params.bDate || '',
                "eDate": params.eDate || ''
            }
        }
    })
}

