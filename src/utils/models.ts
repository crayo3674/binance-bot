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
