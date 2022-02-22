import { Menu } from "@fluentui/react-northstar";
import * as React from "react";
import { createHashHistory } from 'history';
import { Link } from "react-router-dom";
import { useEffect } from "react";

const items = [
    {
        key: 'home',
        content: 'Home',
    },
    {
        key: 'Page1',
        content: 'Page1',
    },
   
    {
        key: 'Page2',
        content: 'Page2',
    },
    {
        key: 'Page3',
        content: 'Page3',
    },
];

export const MyAppHeader = () => {
    const history = createHashHistory();
    const [activeIndex, setactiveIndex] = React.useState<number>(0);
   
    const itemClicked = (event, data) => {
        if (!!data) {
            // NOTE - you can also use window.location.hash to redirect user to new route\
            // diffrence between .hash and router -- ? TODO
            setactiveIndex(data.index);
            window.location.hash = `/${items[data.index].key}/`;
            //history.push(`/${items[data.index].content}/`);
        }
    }

    useEffect(() => {
        if ( window.location.hash ) {
            //console.log("location",location)
            var currentIndex = items.findIndex(item => window.location.hash.indexOf(item.key) != -1)
            setactiveIndex(currentIndex);
        }
    }, );

    
    return (
        <div>
            This is header
            <Menu activeIndex={activeIndex} defaultActiveIndex={0} onItemClick={itemClicked} items={items} underlined primary />
        </div>
    )
}