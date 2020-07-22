import * as React from 'react';

interface ILoadingProps{
    hidden:boolean;
    imageSrc: any;
}

const loading: React.FC<ILoadingProps> = (props)=>{
    const loadingStyles: React.CSSProperties = {
        position: "fixed",
        top: "40%",
        left: "40%"
    };    
    return(
        <div hidden={props.hidden }>
            <img style={loadingStyles} src={props.imageSrc} width={150} />
        </div>
    );
};

export default loading;