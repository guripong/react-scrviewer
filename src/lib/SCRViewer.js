import React from "react";
import './SCRViewer.scss';

const SCRViewer = React.forwardRef(({...props},ref)=>{
    const {s3data} = props;

    
    
    return (<div className="SCRViewer" ref={ref}>
       SCRViewer임
    </div>)
})

export default SCRViewer;
