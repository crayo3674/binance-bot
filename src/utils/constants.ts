import { AxiosRequestConfig } from 'axios';

export const url = {
    search: '/bapi/c2c/v2/friendly/c2c/adv/search',
    fiatList: '/bapi/c2c/v1/friendly/c2c/trade-rule/fiat-list',
    filterConditions: '/bapi/c2c/v2/public/c2c/adv/filter-conditions',
    config: '/bapi/c2c/v2/friendly/c2c/portal/config'
}

export const config: AxiosRequestConfig = {
    validateStatus: status => status === 200,
    baseURL: 'https://p2p.binance.com'
}
