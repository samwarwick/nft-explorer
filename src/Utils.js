export const mapEtherscanUrl = (url) => {
    if (url.includes('mainnet')) {
        return url.replace('mainnet.', '');
    }
    return url;
}

export const mapMetadataUrl = (url) => {
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
}

export const mapNetworkName = (network) => {
    if (network === 'homestead') {
        return 'mainnet';
    }
    return network;
}
