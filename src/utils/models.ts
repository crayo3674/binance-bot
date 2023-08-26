export interface Options {
    page?: number,
    fiat: string,
    countries: string[],
    tradeType?: 'SELL' | 'BUY',
    payTypes: string[],
    rows: number,
    asset: string,
    publisherType: null,
    shieldMerchantAds: boolean,
    proMerchantAds: boolean
}