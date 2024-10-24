export const getExplorerUrl = (network, address) => {
    switch (mapNetworkName(network)) {
        case 'amoy':
        case 'matic-amoy':
            return `https://amoy.polygonscan.com/address/${address}`;
        case 'mainnet':
            return `https://etherscan.io/address/${address}`;
        case 'matic':
            return `https://polygonscan.com/address/${address}`;
        case 'sepolia':
            return `https://sepolia.etherscan.io/address/${address}`;
        default:
            return address;
    }
};

export const mapMetadataUrl = (url) => {
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
};

export const mapNetworkName = (network) => {
    if (network === 'homestead') {
        return 'mainnet';
    }
    return network;
};
