export const getMoralisPriceUrl = (chain: string): string | undefined => {
    switch (chain) {
        case 'ethereum':
            return 'https://deep-index.moralis.io/api/v2.2/erc20/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/price';
        case 'polygon':
            return 'https://deep-index.moralis.io/api/v2.2/erc20/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0/price';
        default:
            return undefined;
    }
};
