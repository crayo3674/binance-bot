export interface basicOptions {
    fiat: string,
    asset: string,
    payTypes: string[],
}

export interface fullOptions extends basicOptions {
    page: number,
    countries: string[],
    tradeType: TradeType,
    rows: number,
    publisherType?: string | null,
    shieldMerchantAds?: boolean,
    proMerchantAds?: boolean
}

export type TradeType = 'SELL' | 'BUY';

interface TradeMethod {
    payId: null | string;
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
    tradeMethods: TradeMethod[];
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

interface TradeDataSearch {
    adv: Adv;
    advertiser: Advertiser;
}

export interface ApiResponse {
    code: string;
    message: null | string;
    messageDetail: null | string;
    data: TradeDataSearch[];
    total: number;
    success: boolean;
}
