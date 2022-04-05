import React from 'react';
import { Image, List } from 'semantic-ui-react'

const GalleryItem = ({item, onItemSelect }) => {
    return (
        <List.Item>
            <a href='#' onClick={() => onItemSelect(item)}>
                <Image rounded
                    src={item.metadata.image}
                    alt={item.tokenId}
                    size='tiny' 
                 />    
                {item.tokenId}
            </a>
        </List.Item>
    );
}

export default GalleryItem;
