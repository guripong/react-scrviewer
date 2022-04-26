import React from 'react';
import './App.css';

import SCRViewer from './lib/SCRViewer';

import teleport from './datasample/teleport.json';
import linear from './datasample/linear.json';
import circle from './datasample/circle.json';

function App() {
  const [dataNumber,set_dataNumber] = React.useState(0);

  
  const s3data = React.useMemo(()=>{

    let newraw;
    if(dataNumber===0){
      // console.log(teleport);
      newraw =teleport;
    }
    else if(dataNumber===1){
      newraw =linear;
    }
    else if(dataNumber===2){
      newraw =circle;
    }


    if(newraw){
      // console.log("newraw",newraw);
      let gazeData = newraw.gazeData;

      let gazeProperty =  newraw.gazeProperty;
      let newgazeData=[];
      for(let i = 0 ; i <gazeData.length; i++){

        let data = gazeData[i];
        let newdata=[];
        // console.log(data);
        for(let j = 0 ; j <data.length; j++){
          let oneEye = data[j];
          // console.log("oneEye",oneEye);
          let newEye ={};
          for(let k = 0; k<gazeProperty.length; k++){
              newEye[gazeProperty[k]] = oneEye[k];
          }
          // console.log(newEye);
          newdata.push(newEye);
        }
        newgazeData.push(newdata);
      }
      
      newraw.taskArr = newgazeData;
      console.log("데이터",newraw);
      return newraw;
      // return newraw;
    }
    else{
      return null;
    }

  },[dataNumber]);



  return (
    <div className="App">
        데이터셈플 
        <select value={dataNumber} onChange={(e)=>{
          // console.log(e.target.value)
          set_dataNumber(e.target.value*1)
        }}>
          <option value={0}>teleport</option>
          <option value={1}>linear</option>
          <option value={2}>circular</option>
          </select>
       <div style={{width:'50%',height:'50%',outline:'1px solid red'}}>
          <SCRViewer s3data={s3data} />
       </div>
    </div>
  );
}

export default App;
