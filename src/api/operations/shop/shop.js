import fetch from '@/utils/fetch';

const APIGoodsShopPre = '/goods/shop/';
const APIDevicemShopPre = '/devicem/shop/';

/*
 * 请求说明: 查看店铺列表
 * 请求API: /api/goods/shop/page
 * 请求方式: POST
 * 输入参数:
     参数	        格式	             说明	             备注
    params	    Map<String,Obect>
    ename	        String	           店铺名称	           模糊查询
    status	        Int	                 状态	     0：未开业 1：正在营业 2：营业结束 3：店铺已关闭
    groupId	        Int	               所属店组
 * 返回结果:
     参数	        格式	             说明	             备注
    result	   List< ShopInfo >
 * 数据模型: 店铺信息（ShopInfo）
     参数	           格式	               说明	             备注
     eid	           Int	            机构编号
     ename	          String	        店铺名称
     groupId	      Int	            店组编号	       更新时候使用
     openDate	      String	        开业日期	   yyyy-MM-dd HH:mm:ss
     closeDate	      String	        停业日期	   yyyy-MM-dd HH:mm:ss
     openTime	      String	        营业时间	   yyyy-MM-dd HH:mm:ss
     closeTime	      String	        停业时间	   yyyy-MM-dd HH:mm:ss
     status	          Int	            状态	       0：未开业 1：正在营业 2：营业结束 3：店铺已关闭
     contact	      String	        联系人
     contactMobile	  String	        联系人手机号
     address	      String	        店铺地址
     parentBody	      String	        上级机构	   如：三只熊总部-深圳区域中心
     areaId	          Int	            区域Id
     areaName	      String	        区域名称	   如：广东省-深圳市-龙岗区
     longitude	      Double	        经度	       用于地图定位
     latitude	      double	        纬度	       用于地图定位
     picList	    List<OrgsPic>	    店铺图片

   机构图片（OrgsPic）
     参数	           格式	                说明	          备注
     eid	           Int	              机构编号
     picIndex	       Int	              图片序号	      1表示默认图片
     fileName	       String	          图片地址
     picFormat	       Short	          图片格式
     picAttr	       Int	              图片属性
     picWidth	       Int	              图片宽度
     picHeight	       Int	              图片高度
     dataVersion	   int	              图片版本

 * 注意: 排序 status asc , createdate desc
 */
export function getShopList(page, ename, status, groupId) {
    return fetch({
        method: 'POST',
        url: APIGoodsShopPre + 'page',
        data: {
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            totalRecord: page.totalRecord,
            totalPage: page.totalPage,
            params: {"ename": ename, "status": status, "groupId": groupId}
        }
    })
}

/*
 * 请求说明: 店铺状态更新/开业
 * 请求API: /api/goods/shop/updateStatus
 * 请求方式: GET
 * 输入参数:
    参数	        格式	             说明	             备注
    eids	       String		如：11000018,11000006
   status	        int	                 状态	           0：未开业  1：开业（营业） 2：营业结束  3：停业  4：休息
  operateDate	   String	            操作日期	       当状态为   1：值为开业日期，  2：值为营业结束时间  3：停业时间  4：休息时间  时间格式yyyy-mm-dd
 * 返回结果:
    参数	        格式	             说明	             备注
   retCode	       String	           返回编码	         SUCCESS/FAIL
   retMsg	       String	           返回文本说明	   失败将会返回错误信息
 * 数据模型:
 * 注意: 排序 status asc ,createdate desc
 */
export function updateShopStatus(eids, status, operateDate) {
    return fetch({
        method: 'GET',
        url: APIGoodsShopPre + 'updateStatus',
        params: {
            eids,
            status,
            operateDate
        }
    })
}

/*
 * 请求说明: 店铺详情
 * 请求API: /api/goods/shop/detail
 * 请求方式: GET
 * 输入参数:
    参数	        格式	             说明	             备注
    eid	            Int
 * 返回结果:
    参数	        格式	             说明	             备注
    retCode	       String	           返回编码	         SUCCESS/FAIL
    retMsg	       String	           返回文本说明	   失败将会返回错误信息
    result	       Object	          ShopInfo店铺信息
 * 数据模型:
 * 注意:
 */
export function getShopDetail(eid) {
    return fetch({
        method: 'GET',
        url: APIGoodsShopPre + 'detail',
        params: {
            eid
        }
    })
}

/*
 * 请求说明: 店铺更新
 * 请求API: /api/goods/shop/update
 * 请求方式: POST
 * 输入参数:
    参数	        格式	             说明	             备注
   shopInfo	      ShopInfo
 * 返回结果:
    参数	        格式	             说明	             备注
   retCode	       String	           返回编码	         SUCCESS/FAIL
   retMsg	       String	           返回文本说明	   失败将会返回错误信息
 * 数据模型:
 * 注意:
 */
export function updateShop(shopInfo) {
    return fetch({
        method: 'POST',
        url: APIGoodsShopPre + 'update',
        data: shopInfo
    })
}

/*
 * 请求说明: 设备模版列表
 * 请求API: /api/devicem/shop/devlist
 * 请求方式: GET
 * 输入参数:
 参数	      格式	        说明	      备注
 shopEid	Int	店铺编码	必填
 * 返回结果:
 参数	      格式	           说明	            备注
 retCode	     String	         返回编码	      SUCCESS/FAIL
 retMsg	     String	         返回文本说明	  失败将会返回错误信息
 result	  List<VEMDevInfo>   售卖机模版列表
 * 数据模型:
 售卖机设备信息（VEMDevInfo）
 参数	          格式	                说明	       备注
 posId	        int	                 售卖机编码
 posName	        String	             售卖机名称
 mainDevTemp	    MainDevInfo	         主控设备模版
 slaveDevTempList	List<SlaveDevInfo>	货柜设备模版列表

 主控设备信息（MainDevInfo）
 参数	              格式	                说明	        备注
 devId	              int	             设备编码
 devTypeid	          int	             设备类型编码
 devTypeName	      String	         设备类型名称
 displaySize	      String	         屏幕尺寸
 displayRate	      String	         分辨率
 systemVer	          String	         操作系统/版本
 netLinkType	      String	         网络类型	      WIFE,4G, LAN
 port	              String	         端口信息         如：4个USB,3个串口

 货柜设备信息（SlaveDevInfo）
 参数	              格式	                 说明	        备注
 modelId	           int	              模板编码
 devTypeid	           int	              设备类型编码
 devTypeName	       String	          设备类型名称
 devType		                          货柜类型	       1-	弹簧机  2-	蛇形机  3-	格子柜
 chnMaxSize		                          最大存货数
 maxRow	               Int	              最大行数
 maxCol	               Int	              最大列数
 ifCold	               Int	              是否支持冷藏
 ifWarm	               Int	              是否支持加热
 * 注意:
 */
export function getShopVEMDevInfo(shopEid) {
    return fetch({
        method: 'GET',
        url: APIDevicemShopPre + 'devlist',
        params: {shopEid}
    })
}

/*
 * 请求说明: 更新店铺售卖机信息(包括设备POS修改密码)（/api/devicem/shop/pos/updatePwd）
 * 请求API: /api/devicem/shop/pos/updatePwd
 * 请求方式: GET
 * 输入参数:
 参数	        格式	             说明	             备注
 posId	Int	POS编码	必填
 pwd	String	密码	前端MD5加密，注：只有修改密码的时候才传值。
 address	String	地址
 myposId	String	POS名称
 * 返回结果:
 参数	        格式	             说明	             备注
 retCode	String	返回编码	SUCCESS/FAIL
 retMsg	String	返回文本说明	失败将会返回错误信息
 * 数据模型:
 * 注意:
 */
export function updateShopPosInfo (posId, pwd, address, myposId) {
    return fetch({
        method: 'GET',
        url: APIDevicemShopPre + 'pos/updatePwd',
        params: {
            posId, pwd, address, myposId
        }
    })
}

/*
 * 请求说明: 新增店铺售卖机
 * 请求API: /api/devicem/shop/vem/add
 * 请求方式: GET
 * 输入参数:
 参数	        格式	             说明	             备注
 shopEid	Int	店铺编码	必填
 posName	String	售卖机名称 	选填
 pwd	String	售卖机密码	前端MD5加密
 address	String	POS地址
 * 返回结果:
 参数	        格式	             说明	             备注
 retCode	String	返回编码	SUCCESS/FAIL
 retMsg	String	返回文本说明	失败将会返回错误信息
 result	int	售卖机编码	新增时返回

 * 数据模型:
 * 注意: 编辑只修改编号和放置地点。
 */
export function addShopVEM(shopEid, posName, pwd, address) {
    return fetch({
        method: 'GET',
        url: APIDevicemShopPre + 'vem/add',
        params: {
            shopEid, posName, pwd, address
        }
    })
}

/*
 * 请求说明: 售卖机操作（/api/devicem/shop/vem/operate）
 * 请求API: /api/devicem/shop/vem/operate
 * 请求方式: GET
 * 输入参数:
 参数	        格式	             说明	             备注
 shopEid	Int	店铺编码	必填
 posId	int	售卖机编码	必填
 opType	int	操作类型	1-复制 2-删除
 posName	String	POS名称	复制时传值
 * 返回结果:
 参数	        格式	             说明	             备注
 retCode	String	返回编码	SUCCESS/FAIL
 retMsg	String	返回文本说明	失败将会返回错误信息
 * 数据模型:
 * 注意:
 */
export function operateShopVEM(shopEid, posId, opType, posName) {
    return fetch({
        method: 'GET',
        url: APIDevicemShopPre + 'vem/operate',
        params: {
            shopEid, posId, opType, posName
        }
    })
}

/*
 * 请求说明: 移除、新增设备（/api/devicem/shop/device/operate）
 * 请求API: /api/devicem/shop/device/operate
 * 请求方式: GET
 * 输入参数:
 参数	        格式	             说明	             备注
 shopEid	Int	店铺编码	必填
 posId	int	售卖机编码	必填
 devId	int	设备编码	必填，如果是新增则是devtypeid值。
 index	Int	设备编号	0表示主控，其他表示货柜。如：编号1，则传1。
 type	int	类型	1-新增，2-删除
 * 返回结果:
 参数	        格式	             说明	             备注
 retCode	String	返回编码	SUCCESS/FAIL
 retMsg	String	返回文本说明	失败将会返回错误信息
 * 数据模型:
 * 注意:
 */
export function operateShopPosDevice(params) {
    return fetch({
        method: 'GET',
        url: APIDevicemShopPre + 'device/operate',
        params: params
    })
}

/*
 * 请求说明: 经营商品模版
 * 请求API: /api/goods/shop/goodslist
 * 请求方式: POST
 * 输入参数:
 参数	        格式	             说明	             备注
 Params
 shopEid	    Int	                店铺编码	         必填
 goodsName	   String	            商品名称	         空全部
 brandId	   Int	                品牌	             -1全部
 catId	       int	                品类	             -1全部
 status	       Int	                状态	       -1全部，1正常，0停止销售
 goodsId	   Int	                商品编码
 * 返回结果:
 参数	        格式	             说明	             备注
 retCode	   String	           返回编码	         SUCCESS/FAIL
 retMsg	       String	           返回文本说明	   失败将会返回错误信息
 result	    List<GoodsInfo>
 * 数据模型:
 * 注意:
 */
export function getShopGoodsList(page, params) {
    return fetch({
        method: 'POST',
        url: APIGoodsShopPre + 'goodslist',
        data: {
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            totalRecord: page.totalRecord,
            totalPage: page.totalPage,
            params: {
                "shopEid": params.shopEid,
                "goodsName": params.goodsName,
                "brandId": params.brandId || -1,
                "catId": params.catId || -1,
                "status": params.status || -1,
                "goodsId": params.goodsId  || -1,
                "notingoodsid": params.notingoodsid  || ''
            }
        }
    })
}

/*
 * 请求说明: 经营商品批量操作
 * 请求API: /api/goods/shop/goods/batchoperate
 * 请求方式: POST
 */
export function shopGoodsBatchOperate(request) {
    return fetch({
        method: 'POST',
        url: APIGoodsShopPre + 'goods/batchoperate',
        data: request
    })
}

/*
 * 请求说明: 经营商品操作（/api/goods/shop/goods/operate）
 * 请求API: /api/goods/shop/goods/operate
 * 请求方式: GET
 * 输入参数:
 参数	        格式	             说明	             备注
 shopEid	Int	店铺
 goodsId	Int 	商品编码
 bulkPrice	Double	商品售价
 safeQty	Int	安全库存
 type	Int	操作类型	1-新增，2-删除，3-修改
 * 返回结果:
 参数	        格式	             说明	             备注
 retCode	String	返回编码	SUCCESS/FAIL
 retMsg	String	返回文本说明	失败将会返回错误信息
 * 数据模型:
 * 注意: 修改只是修改售价，需要记录。
 */
export function operateShopGoods(shopEid, goodsId, bulkPrice, safeQty, type) {
    return fetch({
        method: 'GET',
        url: APIGoodsShopPre + 'goods/operate',
        params: {
            shopEid, goodsId, bulkPrice, safeQty, type
        }
    })
}

/*
 * 请求说明: 经营商品状态修改（/api/goods/shop/goods/updateStatus）
 * 请求API: /api/goods/shop/goods/updateStatus
 * 请求方式: GET
 * 输入参数:
 参数	        格式	             说明	             备注
 shopEid	Int	店铺编码
 goodsIds	String	商品编码	如：1111,222
 status	Int	状态	0停止销售，1正常
 * 返回结果:
 参数	        格式	             说明	             备注
 retCode	String	返回编码	SUCCESS/FAIL
 retMsg	String	返回文本说明	失败将会返回错误信息
 * 数据模型:
 * 注意:
 */
export function updateShopGoodsStatus(shopEid, goodsIds, status) {
    return fetch({
        method: 'GET',
        url: APIGoodsShopPre + 'goods/updateStatus',
        params: {
            shopEid, goodsIds, status
        }
    })
}

/*
 * 请求说明: 查询店铺的所有POS
 * 请求API: /api/devicem/shop/poslist
 * 请求方式: GET
 * 输入参数:
 参数	        格式	             说明	             备注
 shopEid	    Int	                店铺编码
 * 返回结果:
 参数	        格式	             说明	             备注
 retCode	String	返回编码	SUCCESS/FAIL
 retMsg	String	返回文本说明	失败将会返回错误信息
 result	Object
 参数	格式	说明	备注
 eid	Int	店铺编码
 posid	Int	POS编码
 address	String	地址
 status	Int	状态
 myposid	String	POS名称
 * 数据模型:
 * 注意:
 */
export function getShopPosList(shopEid) {
    return fetch({
        method: 'GET',
        url: APIDevicemShopPre + 'poslist',
        params: {
            shopEid
        }
    })
}

/*
 * 请求说明: 查询店铺的所有货柜
 * 请求API: /api/devicem/shop/slavelist
 * 请求方式: GET
 * 输入参数:
 参数	        格式	             说明	             备注
 shopEid	    Int	                店铺编码
 posId
 goodsId
 palletid	Int	货道号
 counterid	Int	货柜号
 status
 * 返回结果:
 参数	        格式	             说明	             备注
 retCode	String	返回编码	SUCCESS/FAIL
 retMsg	String	返回文本说明	失败将会返回错误信息
 result	Object
 参数	格式	说明	备注
 eid	Int	店铺编码
 posid	Int	POS编码
 devid	Int	设备编码
 myposid	String	POS名称
 counterid	Int	货柜号
 * 数据模型:
 * 注意:
 */
export function getShopSlaveList(shopEid, posId, goodsId, palletid, counterid, status) {
    return fetch({
        method: 'GET',
        url: APIDevicemShopPre + 'slavelist',
        params: {
            shopEid,
            posId,
            goodsId,
            palletid,
            counterid,
            status
        }
    })
}

/*
 * 请求说明: 【店铺】货柜的货道详情
 * 请求API: /api/devicem/shop/slave/detail
 * 请求方式: GET
 * 输入参数:
 参数	      格式	        说明	      备注
 shopEid	      Int	       店组编码	      必填
 devId	      int	       模板编码	      必填
 * 返回结果:
 参数	      格式	             说明	           备注
 retCode	     String	           返回编码	       SUCCESS/FAIL
 retMsg	     String	           返回文本说明	   失败将会返回错误信息
 result	     List<PosChannel>  货位列表	       货位信息（PosChannel）
 * 数据模型:  货位信息（PosChannel）

 参数	      格式	              说明	           备注
 palletId 	  Long	            货道编码
 rowx	      Int	              行号         WIFE,4G, LAN-有线
 rowy	      Int	              列号
 notes 	     String	              备注
 chnMaxGoods	  Int	          货道最大商品数
 status	     String	              状态	        OK-正常  BREAK-故障  STOP-停用
 weightProp	  Int	            商品属性
 gInfo	    GoodsInfo	        商品信息	    商品信息(GoodsInfo)

 1.	retCode=FAIL，说明设备未注册，停留提示故障界面或播放广告，
 2.	设备状态（正常、故障、停用）只有正常状态，才能进入售卖界面，否则停留提示故障界面或播放广告，
 * 注意:
 */
export function getShopSlaveDetail(shopEid, devId) {
    return fetch({
        method: 'GET',
        url: APIDevicemShopPre + 'slave/detail',
        params: {shopEid, devId}
    })
}

/*
 * 请求说明: 【店铺】货柜的货道设置
 * 请求API: /api/devicem/shop/slave/pallet/set
 * 请求方式: POST
 * 输入参数:
 参数	      格式	        说明	      备注
 shopEid	Int	店铺编码
 slaveRowCol	Object
 devId	         int	模板编码	必填
 palletId	    Int	货位编码	必填
 goodsid	    int	商品编码	必填
 maxQty	        int	最大存货量	必填
 rowx	        Int	行号
 rowy	        Int	列号
 posId	        Int	POS编码
 counterid	    Int	货柜号
 weightProp	     Int	商品类型	0正常商品，6组合商品
 * 返回结果:
 参数	      格式	             说明	           备注
 retCode	     String	           返回编码	       SUCCESS/FAIL
 retMsg	     String	           返回文本说明	   失败将会返回错误信息
 * 数据模型:
 * 注意:
 */
export function setPalletSlave(shopEid, slaveRowCol) {
    return fetch({
        method: 'POST',
        url: APIDevicemShopPre + 'slave/pallet/set',
        data: {shopEid, slaveRowCol}
    })
}

/*
 * 请求说明: 【店铺】货柜行列操作 (/api/devicem/shop/slave/rowcol)
 * 请求API: /api/devicem/shop/slave/rowcol
 * 请求方式: POST
 * 输入参数:
 参数	        格式	              说明	       备注
 request	 SlaveRowColOperRequest
 * 返回结果:
 参数	      格式	             说明	           备注
 retCode	     String	           返回编码	       SUCCESS/FAIL
 retMsg	     String	           返回文本说明	   失败将会返回错误信息
 * 数据模型: 货道行列操作（SlaveRowColOperRequest）
 参数	      格式	              说明	           备注
 groupId	Int		店组
 modelId	Int		模版Id
 eid	Int	店铺eid
 type	Int		1-新增，2-删除
 rowcolList	List<SlaveRowCol>
 rowx	Int		行号
 rowy	Int		列号
 palletId	Int		货道号—前端控制
 goodsId	Int		商品编码，如果没有商品传入-1
 devId	      Int	设备编码
 posId	          Int	POS编码
 counterid	  Int	货柜号
 maxQty	       Int	最大库存数
 weightProp	     Int	商品类型	0正常，6组合商品
 * 注意:
 */
export function operateSlaveRowCol(slaveRowColOperRequest) {
    return fetch({
        method: 'POST',
        url: APIDevicemShopPre + 'slave/rowcol',
        data: slaveRowColOperRequest
    })
}

/*
 * 请求说明: 店铺按店组模版新增POS
 * 请求API: /api/devicem/shop/addposbygroup
 * 请求方式: POST
 * 输入参数:
 参数	        格式	              说明	       备注
 request	AddPosByGroupRequest
 shopEid	    Int	店铺编码	必填
 posId	        Int	POS编码	必填
 groupId	    Int	店组编码	必填
 posName	    String	售卖机名称 	必填
 pwd	       String	售卖机密码	前端MD5加密
 address	   String	POS地址	必填
 * 返回结果:
 参数	      格式	             说明	           备注
 retCode	String	返回编码	SUCCESS/FAIL
 retMsg	String	返回文本说明	失败将会返回错误信息
 result	Object	返回新增的POS编码
 * 数据模型:
 * 注意:
 */
export function addPosByGroup(request) {
    return fetch({
        method: 'POST',
        url: APIDevicemShopPre + 'addposbygroup',
        data: request
    })
}