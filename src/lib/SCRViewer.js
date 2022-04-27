import React from "react";
import './SCRViewer.scss';
import  _ from 'lodash';

const SCRViewer = React.forwardRef(({...props},ref)=>{
    const {s3data} = props;

    const [nowTime,set_nowTime] = React.useState('0.00');
    const [taskNumber,set_taskNumber] = React.useState(0);
    const [playSpeed,set_playSpeed] = React.useState(1);
    const [playFrame,set_playFrame] = React.useState(60); //frame per sec

    const [isPlaying,set_isPlaying] = React.useState(false);

    const gazeRef = React.useRef();
    const canvasRef  =React.useRef();
    
    const [innerFrameScale, set_innerFrameScale] = React.useState(1);
    const [innerFrameTop, set_innerFrameTop] = React.useState(0);
    const [innerFrameLeft, set_innerFrameLeft] = React.useState(0);

    const resizeInnerFrame = React.useCallback(() => {
        if(!gazeRef.current) return;
   
        const resize100 = _.debounce(()=>{


            const pastScreenW = s3data.screenW;
            const pastScreenH = s3data.screenH;
            //console.log(pastScreenW + 'x' + pastScreenH);
            let pastRatio = pastScreenH / pastScreenW;
         


            const width = gazeRef.current.clientWidth;
            const height = gazeRef.current.clientHeight;
            
            // console.log("지금width:"+width);
            // console.log("지금height:"+height);
            //
            let nowRatio = height / width;
    
            // console.log("과거비율:" + pastRatio);
            // console.log("지금비율:" + nowRatio);
    
    
            //지금비율이 더크다는건=>지금가로가 더 작다  그말은 [높이기준]
            // 798 : x = 1920 * 1080   =>  1920*x = 1080 * 798
    
            //1268 지금
            //1239
            if (nowRatio >= pastRatio) {
                // console.log("지금세로가 더크다 - 가로기준 셋팅");
                set_innerFrameScale(width / pastScreenW);
    
    
                let newheight = pastScreenH * (width / pastScreenW);
                set_innerFrameTop((height - newheight) / 2);
                set_innerFrameLeft(0);
            }
            else {
                // console.log("지금 가로가 더 크다 (지금비율이 더 작다)-높이기준셋팅");
                set_innerFrameScale(height / pastScreenH);
    
    
                let newwidth = pastScreenW * (height / pastScreenH);
                set_innerFrameTop(0);
                set_innerFrameLeft((width - newwidth) / 2);
    
            }
        },100);

     
            resize100();



    }, [s3data]);


    const [justoneTimeResizeTwice,set_justoneTimeResizeTwice] = React.useState(true);
    React.useEffect(() => {
        
     
        resizeInnerFrame();
        set_taskNumber(0);
        set_nowTime(0);

        window.addEventListener('resize', resizeInnerFrame);
        if(justoneTimeResizeTwice){
            set_justoneTimeResizeTwice(false);
            resizeInnerFrame();
        }

        return () => {
            //console.log("소멸자");
            window.removeEventListener('resize', resizeInnerFrame);
        }
    }, [ resizeInnerFrame,justoneTimeResizeTwice]);



    const taskArr = React.useMemo(()=>{
        if(s3data){
            // console.log(s3data);
            let newarr=[];
            for(let i = 0 ; i<s3data.screeningObjectList.length; i++){
                let obj = {
                    ...s3data.screeningObjectList[i],
                    gazeData:s3data.taskArr[i]
                };
                newarr.push(obj);
            }
            // console.log("newarr",newarr);
            return newarr;
        }
        else{
            return null;
        }
    },[s3data]);
    
    const endTime = React.useMemo(()=>{
        if(taskArr && taskArr[taskNumber]){
            console.log("지금꺼정보",taskArr[taskNumber]);

            return (taskArr[taskNumber].relativeEndTime).toFixed(2);
        }
        else{
            return null;
        }
    },[taskArr,taskNumber])


    const handleBtnPlay = () => {
        if (nowTime * 1 === endTime * 1) {
            set_nowTime("0.00");
        }
        set_isPlaying(!isPlaying);
    }

    React.useEffect(()=>{
      set_nowTime('0.00');  
    },[taskNumber])

    React.useEffect(()=>{
        let interval;

        if (isPlaying === true) {
            interval = setInterval(function () {
                set_nowTime((nt) => {

                    if (nt*1 >= endTime) {
            
                            set_isPlaying(false);
                            nt = endTime;
                            return nt;
                    }
                    else {
                        nt = nt * 1 + (1/playFrame*playSpeed)                        
                        return nt.toFixed(2);
                    }
                });
            }, 1000/playFrame); //프레임 //0.1초마다 얼마큼씩 시간을 증가시킬거냐로

        }
        else {
            clearInterval(interval);
        }


        return () => {
            clearInterval(interval);
        }
    },[isPlaying,endTime,playFrame,playSpeed]);

    


    const [targetLeft,set_targetLeft] = React.useState(0);
  
    const [targetTop,set_targetTop] = React.useState(0);

    const setTargetLocation = React.useCallback(()=>{
        // console.log("setTargetLocation!!")
        const task = taskArr[taskNumber];
        let st = task.startWaitTime;
        let type = task.type;
        const MONITOR_PX_PER_CM = s3data.monitorInform.MONITOR_PX_PER_CM;
        if(type==='teleport'){
            if(nowTime*1<st*1){
                //startcoord
                set_targetLeft(task.startCoord.x+'px');
                set_targetTop(task.startCoord.y+'px');
            }
            else{
                //endcoord
                set_targetLeft(task.endCoord.x+'px');
                set_targetTop(task.endCoord.y+'px');
            }
        }
        else if(type==='circular'){
            const radian = Math.PI / 180; 
            const radius = task.radius; 

            if(nowTime*1<task.startWaitTime){
                // console.log("첫 대기")
                const cosTheta = Math.cos(task.startDegree * radian); 
                const sineTheta = Math.sin(task.startDegree * radian); 
                let sc = {
                    x : task.centerCoord.x + radius*cosTheta* MONITOR_PX_PER_CM,
                    y:  task.centerCoord.y - radius*sineTheta* MONITOR_PX_PER_CM
                }
                set_targetLeft(sc.x+'px');
                set_targetTop(sc.y+'px');
            }
            else if(nowTime*1 < (task.duration*1 + task.startWaitTime*1) ){
                // console.log(":asfasfasfsafsafasf");
                //nowdegree
                let nowDegree = -((task.startDegree - task.endDegree) * (nowTime - task.startWaitTime) / task.duration  - task.startDegree);

                const cosTheta = Math.cos(nowDegree * radian); 
                const sineTheta = Math.sin(nowDegree * radian); 
                let nc = {
                    x : task.centerCoord.x + radius*cosTheta* MONITOR_PX_PER_CM,
                    y:  task.centerCoord.y - radius*sineTheta* MONITOR_PX_PER_CM
                }
                set_targetLeft(nc.x+'px');
                set_targetTop(nc.y+'px');
            }
            else{
                // console.log("마지막 0.5초")
                const cosTheta = Math.cos(task.endDegree * radian); 
                const sineTheta = Math.sin(task.endDegree * radian); 
                let ec = {
                    x : task.centerCoord.x + radius*cosTheta* MONITOR_PX_PER_CM,
                    y:  task.centerCoord.y - radius*sineTheta* MONITOR_PX_PER_CM
                }
                set_targetLeft(ec.x+'px');
                set_targetTop(ec.y+'px');
            }
        }

    },[nowTime,taskArr,taskNumber,s3data]);

    const [RPOG_SIZE,set_RPOG_SIZE] = React.useState(1);

    const drawGaze = React.useCallback(()=>{
        const task = taskArr[taskNumber];
        let gazeArr = task.gazeData;
        const w = s3data.screenW;
        const h = s3data.screenH;
        // console.log("w",w);

        const RPOGSIZE = RPOG_SIZE;
        const canvas = canvasRef.current;
        const rctx = canvas.getContext('2d');
        rctx.clearRect(0, 0, w, h);

        // console.log("drawGaze 호출")
        for(let i = 0 ; i <gazeArr.length ; i++){
            if(gazeArr[i].relTime <=nowTime*1 && gazeArr[i].RPOGV){
                // console.log("야 여기당");

                rctx.beginPath();
                rctx.lineWidth = 0.5;
                rctx.strokeStyle = 'rgb(255,0,0,0.3)';
                rctx.fillStyle = 'rgb(255,0,0,0.3)';
                // let x = (gazeArr[i].RPOGX) * w;
                // let y = (gazeArr[i].RPOGY) * h;
                // console.log("x,y",x,y);
                rctx.arc((gazeArr[i].RPOGX) * w,
                    (gazeArr[i].RPOGY) * h, RPOGSIZE, 0, Math.PI * 2);
                rctx.fill();
                rctx.stroke();

                //그려
            }
        }

    },[nowTime,taskArr,taskNumber,s3data,RPOG_SIZE]);


    React.useEffect(()=>{
        setTargetLocation();
        drawGaze();
    },[nowTime,setTargetLocation,drawGaze])
    

    return (<div className="SCRViewer" ref={ref}>
       <div className="left">
            <div>
                <select value={taskNumber} onChange={e=>set_taskNumber(e.target.value*1)}>
                {taskArr.map((task,index)=>{
                    return (<option key={"task"+index} value={index}>
                        {(index+1)+"번 task"}
                    </option>)
                })}
                </select>
            </div>
            <div>frame
                <select value={playFrame} onChange={e=>set_playFrame(e.target.value*1)}>
                    <option>
                        10
                    </option>
                    <option>
                        20
                    </option>
                    <option>
                        30
                    </option>
                    <option>
                        60
                    </option>
                </select>
            </div>
            <div>배속
                <select value={playSpeed} onChange={e=>set_playSpeed(e.target.value*1)}>
                    <option>
                        1
                    </option>
                    <option>
                        2
                    </option>
                    <option>
                        3
                    </option>
                    <option>
                        10
                    </option>
                 
                </select>
            </div>
            <div>
         {nowTime}/{endTime}
            </div>
            <div>
                <button onClick={handleBtnPlay}>{isPlaying?'멈춤':'재생'}</button>
            </div>
            <div>
                <input type="range"
                    style={{width:'80%'}}
                min={1} max={40} value={RPOG_SIZE} onChange={(e)=>{
                    set_RPOG_SIZE(e.target.value*1)
                }}/>
            </div>
       </div>
       <div className="right">
            <div className="viewZone" >
                <div style={{width:'100%',height:'100%'}} ref={gazeRef}>
                    <div className="GC"style={{  width: `${s3data.screenW}px`,
                        height: `${s3data.screenH}px`,
                        transform: `scale(` + innerFrameScale + `)`,
                        top: `${innerFrameTop}px`,
                        left: `${innerFrameLeft}px`}}>



                            <div className="target" 
                            style={{width:s3data.monitorInform.MONITOR_PX_PER_CM*s3data.target_size+'px',
                                    height:s3data.monitorInform.MONITOR_PX_PER_CM*s3data.target_size+'px',
                                    left: targetLeft,
                                    top: targetTop}} 
                         />
                        <div className="GC-canvasWrapper" style={{width:'100%',height:'100%'}}>
                            <canvas className="gazeCanvas" 
                            width={s3data.screenW} 
                            height={s3data.screenH}
                             ref={canvasRef} />
                        </div>
                    </div>
                </div>

            </div>
            <div className="barZone">
                 <div className="rangePlayWrapper">
                    <input className="rangePlay" type="range" step="0.01"
                        value={nowTime} max={endTime} min='0' onChange={(e) => set_nowTime((e.target.value * 1).toFixed(2))} />
                </div>

            </div>
       </div>
    </div>)
})

export default SCRViewer;
