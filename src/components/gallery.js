import React from 'react';
import GalleryItem from './gallery_item';
import { List } from 'semantic-ui-react'

const Gallery = (props) => {
    const items = props.items.map((item) => {
        return <GalleryItem
            onItemSelect={props.onItemSelect}
            key={item.tokenId} item={item}
        />
    });

    return (
        <div>
            <List horizontal>
                {items}
            </List>
        </div>
    )
}

export default Gallery;
