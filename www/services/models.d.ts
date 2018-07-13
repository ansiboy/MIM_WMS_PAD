interface InStorageEntity {
    /** 订单号 */
    OrderNum: string,
    /** 订单时间 */
    OrderTime: string,
    /** 物资名称 */
    ProductName: string,
    /** 物资编号 */
    BarCode: string,
    /** 批次 */
    BatchNum: string,
    /** 规格 */
    Size: string,
    /** 数量 */
    RealNum: string,
    /** 仓库编号 */
    StorageNum: string,
    /** 仓库 */
    StorageName: string,
    /** 库位 */
    LocalName: string,
    /** 入库类型 */
    InType: number,
    /** 项目名称 */
    ProjectName: string,
    /** 物资来源 */
    FromSource: string,
    /** 供应商编号 */
    SupNum: string,
    /** 供应商 */
    SupName: string,
    SupSnNum: string,
    /** 联系人 */
    ContactName: string,
    /** 联系方式 */
    Phone: string,
    /** 制单人 */
    CreateUserName: string,
    /** 制单时间 */
    CreateTime: string,
    /** 状态 */
    Status: string,
    /** 审核人 */
    AuditeUserName: string,
    /** 审核时间 */
    AuditeTime: string,
    /** 地址 */
    Address: string,
    /** 预到时间 */
    EstimateTime: string,
    /** 收货时间 */
    ReceiveTime: string,
    Remark: string,
    CreateUser: string,
}
interface InStorDetailEntity {
    ID: number,
    /** 物资名称 */
    ProductName: string,
    ProductNum: string,
    /** 物资编号 */
    BarCode: string,
    /** 批次 */
    BatchNum: string,
    /** 规格 */
    Size: string,
    /** 数量 */
    RealNum: number,
    /** 仓库 */
    StorageName: string,
    /** 库位 */
    LocalName: string,
    LocalNum: string,
    Num: number,
    Expiry: string,
    InPrice: number,
    Amount: number,
}
interface StorageEntity {
    ID: number,
    SnNum: string,
    StorageNum: string,
    StorageName: string,
}

interface BaseDicEntity {
    DicName,
    DicValue,
}

interface SupplierEntity {
    ID: number,
    /** 供应商编号 */
    SupNum: string,
    /** 供应商名称 */
    SupName: string,
    /** 电话 */
    Phone: string,
    /** 传真 */
    Fax: string,
    /** Email */
    Email: string,
    /** 联系人 */
    ContactName: string,
    /** 地址 */
    Address: string,
    SnNum: string,
}


interface ProductEntity {
    AvgPrice: number,

    /** 物资条码 */
    BarCode: string,

    /** 类型 */
    CateName: string,

    Color: string,
    CompanyID: string,
    CreateTime: string,
    CreateUser: string,
    CusName: string,
    CusNum: string,
    DefaultLocal: string,
    Description: string,
    DianWei: string,
    Display: string,

    /** 定检期 */
    Expiry: number,

    /** 生产厂家 */
    FactoryName: string,
    FactoryNum: string,

    ID: number,

    SnNum: string,

    /** 物资名称 */
    ProductName: string,

    /** 物料编码 */
    InCode: string,

    /** 规格 */
    Size: string,

    /** 单位 */
    UnitName: string,

    /** 材质 */
    Material: string,
    /** 供应商 */
    SupName: string,
    /** 备注 */
    Remark: string,
    /** 数量 */
    Num: number,
    Qty: number,
    /** 单价 */
    InPrice: number,

    /** 库位名称 */
    LocalName: string,
    /** 库存数 */
    LocalNum: string,
    /** 仓库编号 */
    StorageNum: string,
    /** 仓库名称 */
    StorageName: string,
}

type Bit = 0 | -1;
interface LocationEntity {
    ID: number,
    LocalNum: string,
    /** 库位编号 */
    LocalBarCode: string,
    /** 库位名称 */
    LocalName: string,
    /** 库位类型 */
    LocalType: string,
    /** 仓库名称 */
    StorageName: string,
    /** 仓库编号 */
    StorageNum: string,
    IsForbid: Bit,
    IsDefault: Bit,
    /** 辅助查询作用-仓库库位类型 */
    ListLocalType: number[],
}

interface AdminEntity {
    CompanyID: string,
    CreateTime: string,
    Email: string,
    ID: string,
    RealName: string,
    RoleNum: string,
    Status: number,
    UpdateTime: string,
    UserCode: string,
    UserName: string,
    UserNum: string,
    UserType: number,
}

// type EMoveType = 1 | 2 | 3
interface MoveOrderEntity {
    /**
     * 1: 移库上架
     * 2: 站场调拨
     * 3: 报修移库
     */
    MoveType: 1 | 2 | 3,
    /** 关联订单号 */
    ContractOrder: string,
    CreateTime: string,
    CreateUserName: string,
    CreateUser: string,
    StorageNum: string,
    Reamrk: string,
}

interface MoveOrderDetailEntity {
    ID: number,
    /** 批次 */
    BatchNum: string,
    /** 物资编号 */
    BarCode: string,
    /** 物资名称 */
    ProductName: string,
    ProductNum: string,
    /** 规格 */
    Size: string,
    /** 数量 */
    Num: number,
    /** 目标库位 */
    StorageName: string,
    StorageNum: string,
    ToLocalName: string,
    ToLocalNum: string,
    SnNum: string,
    RealNum: number,
}

interface BaseEntity {
    ID?: number
}

interface LocalProductEntity extends BaseEntity {
    AvgPrice: number,
    BarCode: string,
    BatchNum: string,
    CateName: string,
    CateNum: string,
    CompanyID: string,
    CreateName: string,
    CreateTime: string,
    CreateUser: string,
    Expiry: number,
    GrossWeight: number,
    ID: number,
    InOrderNum: string,
    LastTime: string,
    ListLocal: string,
    LocalName: string,
    LocalNum: string,
    LocalType: number,
    MaxNum: number,
    MinNum: number,
    Num: number,
    ProductName: string,
    ProductNum: string,
    Sn: string,
    StorageName: string,
    StorageNum: string,
    SupName: string,
    SupNum: string,
    UnitName: string,
    UnitNum: string,
    Size: string,
}

interface OutStorageEntity extends BaseEntity {
    CreateTime: string,
    CreateUserName: string,
    CreateUser: string,
    /** 联系人 */
    CusName: string,
    /** 自定义单号 */
    CusOrderNum: string,

    Email: string,

    /** 站场 */
    LocalNum: string,

    OutType: number,

    /** 联系方式 */
    Phone: string,

    /** 备注 */
    Remark: string,

    /** 领用日期 */
    SendDate: string,
    StorageNum: string,
    StorageName: string,
}

interface OutStoDetailEntity extends BaseEntity {

    BarCode: string,
    BatchNum: string,

    LocalName: string,
    LocalNum: string,
    LocalSn: string,

    RealNum: number,
    Num: number;

    ProductName: string,
    ProductNum: string,

    StorageName: string,
    StorageNum: string,
}

interface BadReportEntity {

    BadType: string,

    CreateTime: string,
    CreateUser: string,
    CreateUserName: string,

    OrderNum: string,

    Remark: string,

    SnNum: string
    StorageName: string
    StorageNum: string,
}

interface BadReportDetailEntity extends BaseEntity {
    BarCode: string
    BatchNum: string

    Num: number

    ProductName: string
    ProductNum: string

    RealNum: number

    Size: string
    SnNum: string

    /** 报损库位名称 */
    ToLocalName: string,
    ToLocalNum: string
}