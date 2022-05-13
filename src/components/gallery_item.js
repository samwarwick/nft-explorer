import React from 'react';
import { Image, List } from 'semantic-ui-react'
import { mapMetadataUrl } from '../Utils';

const GalleryItem = ({item, onItemSelect }) => {
    return (
        <List.Item>
            { /* eslint-disable-next-line */ }
            <a href='#' onClick={() => onItemSelect(item)}> 
                <Image rounded
                    src={mapMetadataUrl(item.metadata.image)}
                    alt={item.tokenId}
                    size='tiny' 
                 />    
                {item.tokenId}
            </a>
        </List.Item>
    );
}

export default GalleryItem;
