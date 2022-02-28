import * as React from "react";
import { useParams } from 'react-router-dom'

export const PageWithURLParameter = () => {

    const { detailid } = useParams()
    return (
        <div>
            <div>PageWithURLParameter</div>
            <div>This is PageWithURLParameter Page</div>
            <div>Path url parameter is - {detailid}</div>
        </div>
    )
}