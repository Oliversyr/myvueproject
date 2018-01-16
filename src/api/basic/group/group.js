import fetch from '@/utils/fetch';

const APIGroupPre = '/devicem/group/';
const APIStorePre = '/devicem/store/';

/*
 * 请求说明: 查看店组列表
 * 请求API: /api/devicem/group/list
 * 请求方式: GET
 * 输入参数:
 参数	        格式	             说明	    备注
 params	    Map<String,Obect>
 keyValue	String	              搜索条件	  店铺名称，模糊查询
 status	    int	                    状态	  -1 全部  1：启用 0：禁用
 * 返回结果:
 参数	        格式	             说明	    备注
 result	List<StoreGroupList>	   店组列表
 * 数据模型: 店组列表(StoreGroupList)
 参数	    格式	    说明	     备注
 groupId	    Int	      店组编码
 groupName	String	  店组名称
 status	    Int	      状态	      1：启用 0：禁用
 notes	    String	  备注
 storeNum	    int	      店铺数量
 * 注意: 按店铺数量逆序
 */
export function getGroupList(searchParams) {
    return fetch({
        method: 'GET',
        url: APIGroupPre + 'list',
        params: searchParams
    })
}

/*
 * 请求说明: 店组操作
 * 请求API: /api/devicem/group/oprate
 * 请求方式: GET
 * 输入参数:
 参数	    格式	   说明	             备注
 opType	int	     操作类型	    1-启用 0-禁用 2-复制
 groupId	Int	     店组编码
 groupName	String	 店组名称	    复制的时候赋值
 notes	    String	 备注	        复制的时候赋值
 * 返回结果:
 参数	    格式	   说明	              备注
 retCode	String	 返回编码	    SUCCESS/FAIL
 retMsg	String	 返回文本说明	失败将会返回错误信息
 * 注意: 禁用操作只能在店组下没有店铺才可以操作。
 */
export function oprateGroup(opType, groupId, groupName, notes) {
    return fetch({
        method: 'GET',
        url: APIGroupPre + 'oprate',
        params: {
            opType, groupId, groupName, notes
        }
    })
}

/*
 * 请求说明: 查看店组店铺
 * 请求API: /api/devicem/group/storelist
 * 请求方式: POST
 * 输入参数:
 参数	    格式	            说明	               备注
 params	 Map<String,Obecjt>
 groupId	 Int	              店组编码
 keyValue	 String	              搜索条件	             店铺名称
 bDate	 String	            统计销售开始时间	yyyy-MM-dd，本周日期
 eDate	 String	            统计销售结束时间	yyyy-MM-dd，本周日期
 * 返回结果: (与后台接口对应有问题)
 参数	    格式	            说明	               备注
 result    List<StoreHeadInfo>  店铺列表
 * 数据模型: 店铺信息（StoreHeadInfo）
 参数	    格式	            说明	               备注
 eid	        int	              店铺编码
 eName	   String	          店铺名称
 address	   String	          店铺地址
 parentId	    Int	            上级机构编码
 parentName  String	        上级机构名称
 saleSum	   Double	           销售金额
 Status	   int	                状态	             0：未开业  1：正在营业  2：营业结束 3：店铺已关闭
 * 注意:
 */
export function getStoreList(page, groupId, keyValue, bDate, eDate) {
    return fetch({
        method: 'POST',
        url: APIGroupPre + 'storelist',
        data: {
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            totalRecord: page.totalRecord,
            totalPage: page.totalPage,
            params: {"groupId": groupId, "keyValue": keyValue, "bDate": bDate, "eDate": eDate}
        }
    })
}

/*
 * 请求说明: 查看店组详情
 * 请求API: /api/devicem/group/detail
 * 请求方式: POST
 * 输入参数:
 参数	    格式	            说明	               备注
 params
 groupId	Int	店组编码
 bDate	String	开始日期	格式：yyyy-MM-dd
 eDate	String	结束日期	格式：yyyy-MM-dd
 keyValue	String	店铺名称
 * 返回结果:
 参数	    格式	            说明	               备注
 result	GroupDetailResponse	店铺列表
 groupId	Int	店组编码
 groupName	String	店组名称
 status	Int	状态	1：启用 0：禁用
 notes	String	备注
 storeNum	int	店铺数量
 saleMoney	String	本周销售金额
 list	List<StoreHeadInfo>
 * 注意:
 */
export function getGroupDetail(params) {
    return fetch({
        method: 'POST',
        url: APIGroupPre + 'detail',
        data: params
    })
}

/*
 * 请求说明: 店组名称备注店铺更新
 * 请求API: /api/devicem/group/allupdate
 * 请求方式: POST
 * 输入参数:
 参数	    格式	            说明	               备注
 groupId	 Int
 groupName	 String
 notes	     String
 storeEids	 List<int>
 * 返回结果:
 参数	    格式	            说明	               备注
 retCode	  String	 返回编码	    SUCCESS/FAIL
 retMsg	  String	 返回文本说明	失败将会返回错误信息
 * 注意:
 */
export function updateGroupInfo(params) {
    return fetch({
        method: 'POST',
        url: APIGroupPre + 'allupdate',
        data: params
    })
}

/*
 * 请求说明: 创建店组
 * 请求API: /api/devicem/group/create
 * 请求方式: GET
 * 输入参数:
 参数	    格式	            说明	           备注
 groupName	String	          店组名称
 status	    Int	                状态	      1：启用 0：禁用
 notes	    String	            备注
 * 返回结果: (与后台接口对应有问题)
 参数	    格式	   说明	              备注
 retCode	  String	 返回编码	    SUCCESS/FAIL
 retMsg	  String	 返回文本说明	失败将会返回错误信息
 * 注意:
 */
export function createGroup(groupName, status, notes) {
    return fetch({
        method: 'GET',
        url: APIGroupPre + 'create',
        params: {
            groupName: groupName,
            status: status,
            notes: notes
        }
    })
}

/*
 * 请求说明: 查询店铺所属物业
 * 请求API: /api/devicem/store/ext_info
 * 请求方式: GET
 * 输入参数:
 参数	    格式	        说明	  备注
 stroeId	    Int	          店铺编码
 * 返回结果:
 参数	    格式	   说明	          备注
 retCode	   String	返回编码	    SUCCESS/FAIL
 retMsg	   String	返回文本说明	失败将会返回错误信息
 result	   String	物业名称
 * 注意:
 */
export function getStoreEXTInfo(stroeId) {
    return fetch({
        method: 'GET',
        url: APIStorePre + 'ext_info',
        params: {stroeId}
    })
}

/*
 * 请求说明: 用户可管理的下级机构查询
 * 请求API: /api/orgm/org/juniororg
 * 请求方式: POST
 * 输入参数:
 参数	      格式	        说明	      备注
 eid	     int	       机构编码	   -1查询全部
 groupId	 Int	       店组编码	   -1查询全部
 parentId	 Int	       父机构	   -1查询全部
 ename	   String	       店铺名称	    模糊查询
 areaid	     Int	       区域编码	   -`1查询全部
 eids	  List<Integer>	 多个机构编码
 userId	     Int	       用户编码
 notIn	 List<Integer>	  排除的机构
 orgType	Int	           机构类型	    -1全部， 0区域或连锁、1店铺，31加盟商、32物业公司
 * 返回结果:
 参数	      格式	        说明	      备注
 retCode	String	      返回编码	    SUCCESS/FAIL
 retMsg	    String	    返回文本说明	失败将会返回错误信息
 result	  List<OrgInfo>
 * 注意:
 */
export function getORG(params) {
    return fetch({
        method: 'POST',
        url: '/orgm/org/juniororg',
        data: params
    })
}

/*
 * 请求说明: 添加店铺到店组
 * 请求API: /api/devicem/group/addstore
 * 请求方式: GET
 * 输入参数:
 参数	      格式	        说明	      备注
 storeIdList	  String	店铺企业列表    如1111,222
 groupId	      Int	    店组Id
 * 返回结果:
 参数	      格式	        说明	      备注
 retCode	     String	    返回编码	    SUCCESS/FAIL
 retMsg	     String	    返回文本说明	失败将会返回错误信息
 * 注意:
 */
export function addStoreToGroup(storeIdList, groupId) {
    return fetch({
        method: 'GET',
        url: APIGroupPre + 'addstore',
        params: {storeIdList, groupId}
    })
}

/*
 * 请求说明: 移除店铺
 * 请求API: /api/devicem/group/removestore
 * 请求方式: GET
 * 输入参数:
 参数	      格式	        说明	      备注
 storeId	     String	       店铺Id
 groupId	     Int	       店组Id
 * 返回结果:
 参数	      格式	        说明	      备注
 retCode	     String	      返回编码	    SUCCESS/FAIL
 retMsg	     String	     返回文本说明	失败将会返回错误信息
 * 注意:
 */
export function removeGroupStore(storeId, groupId) {
    return fetch({
        method: 'GET',
        url: APIGroupPre + 'removestore',
        params: {storeId, groupId}
    })
}

/*
 * 请求说明: 设备模版列表
 * 请求API: /api/devicem/group/template/devlist
 * 请求方式: GET
 * 输入参数:
 参数	      格式	        说明	      备注
 groupId	      Int	       店组编码	      必填
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
export function getTemplateVEMDevInfo(groupId) {
    return fetch({
        method: 'GET',
        url: APIGroupPre + 'template/devlist',
        params: {groupId}
    })
}

/*
 * 请求说明: 经营商品模版
 * 请求API: /api/devicem/group/template/goodslist
 * 请求方式: GET
 * 输入参数:
 参数	      格式	        说明	      备注
 groupId	      Int	       店组编码	      必填
 * 返回结果:
 参数	      格式	        说明	      备注
 retCode	     String	    返回编码	    SUCCESS/FAIL
 retMsg	     String	    返回文本说明	失败将会返回错误信息
 * 注意:
 */
export function getTemplateGoodsList(page, groupId, goodsName, brandId, catId) {
    return fetch({
        method: 'POST',
        url: APIGroupPre + 'template/goodslist',
        data: {
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            totalRecord: page.totalRecord,
            totalPage: page.totalPage,
            params: {"goodsName": goodsName, "brandId": brandId, "catId": catId, "groupId": groupId}
        }
    })
}

/*
 * 请求说明: 经营商品批量操作
 * 请求API: /api/devicem/group/template/goods/batch/operate
 * 请求方式: POST
 */
export function groupTemplateGoodsBatchOperate(request) {
    return fetch({
        method: 'POST',
        url: APIGroupPre + 'template/goods/batch/operate',
        data: request
    })
}

/*
 * 请求说明: 商品售价安全库存调整
 * 请求API: /api/devicem/group/goods/update/pricesafeqty
 * 请求方式: GET
 * 输入参数:
 groupId	Int	店组编码
 goodsId	Int 	商品编码
 bulkPrice	Double	商品售价
 safeQty	Int	安全库存
 */
export function groupTemplateGoodsUpdatePriceSafeQty(params) {
    return fetch({
        method: 'GET',
        url: APIGroupPre + 'goods/update/pricesafeqty',
        params: params
    })
}

/*
 * 请求说明: 经营商品操作
 * 请求API: /api/devicem/group/template/goods/operate
 * 请求方式: GET
 * 输入参数:
 参数	      格式	        说明	      备注
 groupId	      Int	      店组编码
 goodsId	      Int 	      商品编码
 bulkPrice	Double	      商品售价
 safeQty	      Int	      安全库存
 type	          Int	      操作类型	   1-新增，2-删除
 * 返回结果:
 参数	      格式	        说明	      备注
 retCode	     String	      返回编码	    SUCCESS/FAIL
 retMsg	     String	      返回文本说明	失败将会返回错误信息
 * 注意:
 */
export function operateTemplateGoods(groupId, goodsId, bulkPrice, safeQty, type) {
    return fetch({
        method: 'GET',
        url: APIGroupPre + 'template/goods/operate',
        params: {groupId, goodsId, bulkPrice, safeQty, type}
    })
}

/*
 * 请求说明: 售卖机操作
 * 请求API: /api/devicem/group/vem/operate
 * 请求方式: GET
 * 输入参数:
 参数	      格式	        说明	      备注
 groupId	      Int	      店组编码	      必填
 posId	      int	      售卖机编码	  必填
 opType	      int	      操作类型	   1-复制  2-删除
 posName	     String	      POS名称	    复制时传值
 * 返回结果:
 参数	      格式	        说明	      备注
 retCode	     String	      返回编码	    SUCCESS/FAIL
 retMsg	     String	      返回文本说明	失败将会返回错误信息
 * 注意:
 */
export function operateVEM(groupId, posId, opType, posName) {
    return fetch({
        method: 'GET',
        url: APIGroupPre + 'vem/operate',
        params: {groupId, posId, opType, posName}
    })
}

/*
 * 请求说明: 新增售卖机
 * 请求API: /api/devicem/group/vem/add
 * 请求方式: GET
 * 输入参数:
 参数	      格式	        说明	      备注
 groupId	      Int	      店组编码	      必填
 posName	     String	      售卖机名称	  选填
 * 返回结果:
 参数	      格式	        说明	      备注
 retCode	     String	      返回编码	    SUCCESS/FAIL
 retMsg	     String	      返回文本说明	失败将会返回错误信息
 result	     int	      售卖机编码	新增时返回
 * 注意:
 */
export function addVEM(groupId, posName) {
    return fetch({
        method: 'GET',
        url: APIGroupPre + 'vem/add',
        params: {groupId, posName}
    })
}

/*
 * 请求说明: 移除、新增设备
 * 请求API: /api/devicem/group/device/operate
 * 请求方式: GET
 * 输入参数:
 参数	      格式	        说明	      备注
 groupId	      Int	       店组编码	      必填
 posId	      int	       售卖机编码	  必填
 devId	      int	       设备编码	      必填
 index	      Int	       设备编号	   如：编号1，则传1.
 type	      int	       类型	        1-新增，2-删除
 * 返回结果:
 参数	      格式	        说明	      备注
 retCode	 String	      返回编码	    SUCCESS/FAIL
 retMsg	     String	      返回文本说明	失败将会返回错误信息
 * 注意:
 */
export function operateVEMDevice(params) {
    return fetch({
        method: 'GET',
        url: APIGroupPre + 'device/operate',
        params: params
    })
}

/*
 * 请求说明: 获取设备列表
 * 请求API: /api/devicem/device/list
 * 请求方式: GET
 * 输入参数:
 参数	         格式	        说明	      备注
 devTypeName	String	     设备类型名称	  选填
 sType	        int	         设备种类	    -1全部 0：主控 1：货柜
 devType	    int	         设备种类	      选填    1-弹簧机 2-蛇形机 3-格子柜
 * 返回结果:
 参数	      格式	        说明	      备注
 retCode	 String	      返回编码	    SUCCESS/FAIL
 retMsg	     String	      返回文本说明	失败将会返回错误信息
 result	 DeviceListResponse
 mainDevList	List<MainDevInfo>	主控设备模版	主控设备信息（MainDevInfo）
 slaveDevList	List<SlaveDevInfo>	货柜设备模版列表	货柜设备信息（SlaveDevInfo）
 * 注意:
 */
export function getDeviceList(params) {
    return fetch({
        name: '获取设备列表',
        method: 'GET',
        url: '/devicem/device/list',
        params: params
    })
}

/*
 * 请求说明: 货柜的货道详情
 * 请求API: /api/devicem/group/slave/detail
 * 请求方式: GET
 * 输入参数:
 参数	      格式	        说明	      备注
 groupId	      Int	       店组编码	      必填
 modelId	      int	       模板编码	      必填
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
export function getSlaveDetail(groupId, devId) {
    return fetch({
        method: 'GET',
        url: APIGroupPre + 'slave/detail',
        params: {groupId, devId}
    })
}

/*
 * 请求说明: 货柜的货道设置
 * 请求API: /api/devicem/group/slave/pallet/set
 * 请求方式: GET
 * 输入参数:
 参数	      格式	        说明	      备注
 modelId	      int	      模板编码	      必填
 palletid	      Int	      货位编码	      必填
 goodsid	      int	      商品编码	      必填
 maxQty	      int	      最大存货量	  必填
 rowx	    Int	           行号
 rowy	    Int	           列号
 * 返回结果:
 参数	      格式	             说明	           备注
 retCode	     String	           返回编码	       SUCCESS/FAIL
 retMsg	     String	           返回文本说明	   失败将会返回错误信息
 * 数据模型:
 * 注意:
 */
export function setPalletSlave(modelId, palletid, goodsid, maxQty, rowx, rowy) {
    return fetch({
        method: 'GET',
        url: APIGroupPre + 'slave/pallet/set',
        params: {modelId, palletid, goodsid, maxQty, rowx, rowy}
    })
}

/*
 * 请求说明: 货柜行列操作 (/api/devicem/group/slave/rowcol)
 * 请求API: /api/devicem/group/slave/rowcol
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
 groupId	      Int		          店组
 modelId	      Int		         模版Id
 type	          Int		      1-新增，2-删除
 rowcolList	List<SlaveRowCol>
 rowx	          Int		          行号
 rowy	          Int		          列号
 palletId	      Int		      货道号—前端控制
 goodsId	      Int		   商品编码，如果没有商品传入-1
 * 注意:
 */
export function operateSlaveRowCol(slaveRowColOperRequest) {
    return fetch({
        method: 'POST',
        url: APIGroupPre + 'slave/rowcol',
        data: slaveRowColOperRequest
    })
}

/*
 * 请求说明: 店组弹出框列表
 * 请求API: /api/devicem/group/popup/list
 * 请求方式: GET
 * 输入参数:
 参数	      格式	        说明	      备注
 shopEid	Int	店铺eid
 * 返回结果:
 参数	      格式	             说明	           备注
 result	List<GroupPopItem >	店组列表
 GroupPopItem
 groupName	String	店组名称
 defaultFlag	Int	是否是当前店组	1 是，0否
 groupId	Int	店组编码
 * 数据模型:
 * 注意: 是否当前店组排序，默认第一个是当期店铺所在店组
 */
export function getGroupPopupList(shopEid) {
    return fetch({
        method: 'GET',
        url: APIGroupPre + 'popup/list',
        params: {shopEid}
    })
}

/*
 * 请求说明: 店组售卖机弹出框列表
 * 请求API: /api/devicem/group/pos/popup/list
 * 请求方式: GET
 * 输入参数:
 参数	      格式	        说明	      备注
 groupId	Int	店组编码
 * 返回结果:
 参数	      格式	             说明	           备注
 result	List<GroupPosPopupItem>
 GroupPosPopupItem
 groupId	Int	店组编码
 posId	Int	POS编码
 myPosId	String	售卖机名称
 mainCount	Int	主控数量
 springCabinetCount	Int	弹簧柜数量
 checkerCabinetCount	Int	格子柜数量
 * 数据模型:
 * 注意: 按POS编码倒序排列
 */
export function getGroupPosPopupList(groupId) {
    return fetch({
        method: 'GET',
        url: APIGroupPre + 'pos/popup/list',
        params: {groupId}
    })
}