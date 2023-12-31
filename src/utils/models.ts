export interface BasicOptions {
    fiat: string,
    asset: string,
    payTypes: string[],
}

export interface FullOptions extends BasicOptions {
    page: number,
    countries: string[],
    tradeType: TradeType,
    rows: number,
    publisherType?: string | null,
    shieldMerchantAds?: boolean,
    proMerchantAds?: boolean
}

export type TradeType = 'SELL' | 'BUY';

// Config data

interface Asset {
    asset: string;
    description: null | string;
    iconUrl: string;
    newToken: null | string;
    pop: null | string;
}

interface TradeSide {
    side: TradeType;
    assets: Asset[];
    convertAssets: any[];
    tradeMethods: { identifier: string }[];
}

interface Area {
    area: string;
    proMerchantFilterAvailable: boolean;
    tradeSides: TradeSide[];
    filters: {
        proMerchant: boolean;
        advancedSort: boolean;
        makerCategory: any;
    };
}

export interface ConfigData {
    fiat: string,
    areas: Area[],
    filterDefaultValues: {
        publisherType: string;
    };
}

// Filter conditions data

interface TradeMethod <T> {
    payId: T extends TradeDataSearch ? null | string : never;
    id: T extends FilterConditionsData ? null | string : never;
    payMethodId: string;
    payType: null | string;
    payAccount: null | string;
    payBank: null | string;
    paySubBank: null | string;
    identifier: string;
    iconUrlColor: null | string;
    tradeMethodName: string;
    tradeMethodShortName: string;
    tradeMethodBgColor: string;
}

interface Country {
    scode: string,
    name: string
}

export interface FilterConditionsData {
    countries: Country[],
    tradeMethods: TradeMethod<FilterConditionsData>[],
    preferredCountry: string,
    periods: number[]
}

// Trade data

interface Adv {
    advNo: string;
    classify: string;
    tradeType: string;
    asset: string;
    fiatUnit: string;
    advStatus: null | string;
    priceType: null | string;
    priceFloatingRatio: null | string;
    rateFloatingRatio: null | string;
    currencyRate: null | string;
    price: string;
    initAmount: null | string;
    surplusAmount: string;
    amountAfterEditing: null | string;
    maxSingleTransAmount: string;
    minSingleTransAmount: string;
    buyerKycLimit: null | string;
    buyerRegDaysLimit: null | string;
    buyerBtcPositionLimit: null | string;
    remarks: null | string;
    autoReplyMsg: string;
    payTimeLimit: number;
    tradeMethods: TradeMethod<TradeDataSearch>[];
    userTradeCountFilterTime: null | string;
    userBuyTradeCountMin: null | string;
    userBuyTradeCountMax: null | string;
    userSellTradeCountMin: null | string;
    userSellTradeCountMax: null | string;
    userAllTradeCountMin: null | string;
    userAllTradeCountMax: null | string;
    userTradeCompleteRateFilterTime: null | string;
    userTradeCompleteCountMin: null | string;
    userTradeCompleteRateMin: null | string;
    userTradeVolumeFilterTime: null | string;
    userTradeType: null | string;
    userTradeVolumeMin: null | string;
    userTradeVolumeMax: null | string;
    userTradeVolumeAsset: null | string;
    createTime: null | string;
    advUpdateTime: null | string;
    fiatVo: null | string;
    assetVo: null | string;
    advVisibleRet: null | string;
    assetLogo: null | string;
    assetScale: number;
    fiatScale: number;
    priceScale: number;
    fiatSymbol: string;
    isTradable: boolean;
    dynamicMaxSingleTransAmount: string;
    minSingleTransQuantity: string;
    maxSingleTransQuantity: string;
    dynamicMaxSingleTransQuantity: string;
    tradableQuantity: string;
    commissionRate: string;
    takerCommissionRate: null | string;
    tradeMethodCommissionRates: any[];
    launchCountry: null | string;
    abnormalStatusList: null | string;
    closeReason: null | string;
    storeInformation: null | string;
    allowTradeMerchant: null | string;
}

interface Advertiser {
    userNo: string;
    realName: null | string;
    nickName: string;
    margin: null | string;
    marginUnit: null | string;
    orderCount: null | string;
    monthOrderCount: number;
    monthFinishRate: number;
    positiveRate: number;
    advConfirmTime: null | string;
    email: null | string;
    registrationTime: null | string;
    mobile: null | string;
    userType: string;
    tagIconUrls: any[];
    userGrade: number;
    userIdentity: string;
    proMerchant: null | string;
    badges: null | string;
    isBlocked: null | string;
    activeTimeInSecond: number;
}

export interface TradeDataSearch {
    adv: Adv;
    advertiser: Advertiser;
}

// Currency data

export interface CurrencyData {
    currencyCode: string;
    currencySymbol: string;
    currencyScale: number;
    countryCode: string;
    iconUrl: string;
}

export interface ApiResponse <T> {
    code: string;
    message: null | string;
    messageDetail: null | string;
    data: T extends TradeDataSearch | CurrencyData ? T[] : T;
    total: T extends TradeDataSearch ? number : never;
    success: boolean;
}
