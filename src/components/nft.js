import React from 'react';
import { Divider, Grid, Header, Image, Table } from 'semantic-ui-react'

const NFT = ({nft}) => {
    if (!nft) {
        return <div>No contract loaded</div>;
    }

    const attributes = nft.metadata.attributes.map((attribute, i) => {
        return(
            <Table.Row key={i}>
                <Table.Cell>{attribute.trait_type}</Table.Cell>
                <Table.Cell>{attribute.value}</Table.Cell>
            </Table.Row>
        );
    });

    const ownerAccountUrl = `https://${nft.network}.etherscan.io/address/${nft.ownerAccount}`;

    return (
        <div>  
            <Divider horizontal>
                <Header as='h3'>
                    Token {nft.tokenId}
                </Header>
            </Divider>
            <Grid>
            <Grid.Row>
         
            <Grid.Column width={4}>
            <div>          
                <Image 
                    as='a'
                    href={nft.metadata.image} target="_blank"
                    src={nft.metadata.image} alt={nft.tokenId} size='medium' rounded
                 />
            </div> 
            </Grid.Column> 
            <Grid.Column width={8} floated='left'>
               
            <div>
                <b>Name:</b> {nft.metadata.name}<br/>
                <b>Description:</b> {nft.metadata.description}<br/>
                <b>Owner:</b> <a href={ownerAccountUrl} target="_blank">{nft.ownerAccount.substring(2, 10)}</a>
                {nft.currentAccount.toLowerCase() === nft.ownerAccount.toLowerCase() ? " (mine)" : ""}
            </div>   
            <div>
                <Divider horizontal>
                    <Header as='h4'>
                        Properties
                    </Header>
                </Divider>
                <Table definition compact fixed>
                    <Table.Body>
                        {attributes}
                    </Table.Body>
                </Table>
            </div>
            </Grid.Column> 
            </Grid.Row>
            </Grid>
       
            <div>
                <a href={nft.tokenURI} target="_blank">Metadata</a> | <a href={nft.metadata.image} target="_blank">Image</a>
            </div>
        </div>   
    )
}

export default NFT;
