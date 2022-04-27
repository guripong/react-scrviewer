"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

require("./SCRViewer.scss");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SCRViewer = /*#__PURE__*/_react.default.forwardRef(function (_ref, ref) {
  var props = _extends({}, _ref);

  var s3data = props.s3data;

  var _React$useState = _react.default.useState('0.00'),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      nowTime = _React$useState2[0],
      set_nowTime = _React$useState2[1];

  var _React$useState3 = _react.default.useState(0),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      taskNumber = _React$useState4[0],
      set_taskNumber = _React$useState4[1];

  var _React$useState5 = _react.default.useState(1),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      playSpeed = _React$useState6[0],
      set_playSpeed = _React$useState6[1];

  var _React$useState7 = _react.default.useState(60),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      playFrame = _React$useState8[0],
      set_playFrame = _React$useState8[1]; //frame per sec


  var _React$useState9 = _react.default.useState(false),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      isPlaying = _React$useState10[0],
      set_isPlaying = _React$useState10[1];

  var gazeRef = _react.default.useRef();

  var canvasRef = _react.default.useRef();

  var _React$useState11 = _react.default.useState(1),
      _React$useState12 = _slicedToArray(_React$useState11, 2),
      innerFrameScale = _React$useState12[0],
      set_innerFrameScale = _React$useState12[1];

  var _React$useState13 = _react.default.useState(0),
      _React$useState14 = _slicedToArray(_React$useState13, 2),
      innerFrameTop = _React$useState14[0],
      set_innerFrameTop = _React$useState14[1];

  var _React$useState15 = _react.default.useState(0),
      _React$useState16 = _slicedToArray(_React$useState15, 2),
      innerFrameLeft = _React$useState16[0],
      set_innerFrameLeft = _React$useState16[1];

  var resizeInnerFrame = _react.default.useCallback(function () {
    if (!gazeRef.current) return;

    var resize100 = _lodash.default.debounce(function () {
      var pastScreenW = s3data.screenW;
      var pastScreenH = s3data.screenH; //console.log(pastScreenW + 'x' + pastScreenH);

      var pastRatio = pastScreenH / pastScreenW;
      var width = gazeRef.current.clientWidth;
      var height = gazeRef.current.clientHeight; // console.log("지금width:"+width);
      // console.log("지금height:"+height);
      //

      var nowRatio = height / width; // console.log("과거비율:" + pastRatio);
      // console.log("지금비율:" + nowRatio);
      //지금비율이 더크다는건=>지금가로가 더 작다  그말은 [높이기준]
      // 798 : x = 1920 * 1080   =>  1920*x = 1080 * 798
      //1268 지금
      //1239

      if (nowRatio >= pastRatio) {
        // console.log("지금세로가 더크다 - 가로기준 셋팅");
        set_innerFrameScale(width / pastScreenW);
        var newheight = pastScreenH * (width / pastScreenW);
        set_innerFrameTop((height - newheight) / 2);
        set_innerFrameLeft(0);
      } else {
        // console.log("지금 가로가 더 크다 (지금비율이 더 작다)-높이기준셋팅");
        set_innerFrameScale(height / pastScreenH);
        var newwidth = pastScreenW * (height / pastScreenH);
        set_innerFrameTop(0);
        set_innerFrameLeft((width - newwidth) / 2);
      }
    }, 100);

    resize100();
  }, [s3data]);

  var _React$useState17 = _react.default.useState(true),
      _React$useState18 = _slicedToArray(_React$useState17, 2),
      justoneTimeResizeTwice = _React$useState18[0],
      set_justoneTimeResizeTwice = _React$useState18[1];

  _react.default.useEffect(function () {
    resizeInnerFrame();
    set_taskNumber(0);
    set_nowTime(0);
    window.addEventListener('resize', resizeInnerFrame);

    if (justoneTimeResizeTwice) {
      set_justoneTimeResizeTwice(false);
      resizeInnerFrame();
    }

    return function () {
      //console.log("소멸자");
      window.removeEventListener('resize', resizeInnerFrame);
    };
  }, [resizeInnerFrame, justoneTimeResizeTwice]);

  var taskArr = _react.default.useMemo(function () {
    if (s3data) {
      // console.log(s3data);
      var newarr = [];

      for (var i = 0; i < s3data.screeningObjectList.length; i++) {
        var obj = _objectSpread(_objectSpread({}, s3data.screeningObjectList[i]), {}, {
          gazeData: s3data.taskArr[i]
        });

        newarr.push(obj);
      } // console.log("newarr",newarr);


      return newarr;
    } else {
      return null;
    }
  }, [s3data]);

  var endTime = _react.default.useMemo(function () {
    if (taskArr && taskArr[taskNumber]) {
      console.log("지금꺼정보", taskArr[taskNumber]);
      return taskArr[taskNumber].relativeEndTime.toFixed(2);
    } else {
      return null;
    }
  }, [taskArr, taskNumber]);

  var handleBtnPlay = function handleBtnPlay() {
    if (nowTime * 1 === endTime * 1) {
      set_nowTime("0.00");
    }

    set_isPlaying(!isPlaying);
  };

  _react.default.useEffect(function () {
    set_nowTime('0.00');
  }, [taskNumber]);

  _react.default.useEffect(function () {
    var interval;

    if (isPlaying === true) {
      interval = setInterval(function () {
        set_nowTime(function (nt) {
          if (nt * 1 >= endTime) {
            set_isPlaying(false);
            nt = endTime;
            return nt;
          } else {
            nt = nt * 1 + 1 / playFrame * playSpeed;
            return nt.toFixed(2);
          }
        });
      }, 1000 / playFrame); //프레임 //0.1초마다 얼마큼씩 시간을 증가시킬거냐로
    } else {
      clearInterval(interval);
    }

    return function () {
      clearInterval(interval);
    };
  }, [isPlaying, endTime, playFrame, playSpeed]);

  var _React$useState19 = _react.default.useState(0),
      _React$useState20 = _slicedToArray(_React$useState19, 2),
      targetLeft = _React$useState20[0],
      set_targetLeft = _React$useState20[1];

  var _React$useState21 = _react.default.useState(0),
      _React$useState22 = _slicedToArray(_React$useState21, 2),
      targetTop = _React$useState22[0],
      set_targetTop = _React$useState22[1];

  var setTargetLocation = _react.default.useCallback(function () {
    // console.log("setTargetLocation!!")
    var task = taskArr[taskNumber];
    var st = task.startWaitTime;
    var type = task.type;
    var MONITOR_PX_PER_CM = s3data.monitorInform.MONITOR_PX_PER_CM;

    if (type === 'teleport') {
      if (nowTime * 1 < st * 1) {
        //startcoord
        set_targetLeft(task.startCoord.x + 'px');
        set_targetTop(task.startCoord.y + 'px');
      } else {
        //endcoord
        set_targetLeft(task.endCoord.x + 'px');
        set_targetTop(task.endCoord.y + 'px');
      }
    } else if (type === 'circular') {
      var radian = Math.PI / 180;
      var radius = task.radius;

      if (nowTime * 1 < task.startWaitTime) {
        // console.log("첫 대기")
        var cosTheta = Math.cos(task.startDegree * radian);
        var sineTheta = Math.sin(task.startDegree * radian);
        var sc = {
          x: task.centerCoord.x + radius * cosTheta * MONITOR_PX_PER_CM,
          y: task.centerCoord.y - radius * sineTheta * MONITOR_PX_PER_CM
        };
        set_targetLeft(sc.x + 'px');
        set_targetTop(sc.y + 'px');
      } else if (nowTime * 1 < task.duration * 1 + task.startWaitTime * 1) {
        // console.log(":asfasfasfsafsafasf");
        //nowdegree
        var nowDegree = -((task.startDegree - task.endDegree) * (nowTime - task.startWaitTime) / task.duration - task.startDegree);

        var _cosTheta = Math.cos(nowDegree * radian);

        var _sineTheta = Math.sin(nowDegree * radian);

        var nc = {
          x: task.centerCoord.x + radius * _cosTheta * MONITOR_PX_PER_CM,
          y: task.centerCoord.y - radius * _sineTheta * MONITOR_PX_PER_CM
        };
        set_targetLeft(nc.x + 'px');
        set_targetTop(nc.y + 'px');
      } else {
        // console.log("마지막 0.5초")
        var _cosTheta2 = Math.cos(task.endDegree * radian);

        var _sineTheta2 = Math.sin(task.endDegree * radian);

        var ec = {
          x: task.centerCoord.x + radius * _cosTheta2 * MONITOR_PX_PER_CM,
          y: task.centerCoord.y - radius * _sineTheta2 * MONITOR_PX_PER_CM
        };
        set_targetLeft(ec.x + 'px');
        set_targetTop(ec.y + 'px');
      }
    }
  }, [nowTime, taskArr, taskNumber, s3data]);

  var _React$useState23 = _react.default.useState(1),
      _React$useState24 = _slicedToArray(_React$useState23, 2),
      RPOG_SIZE = _React$useState24[0],
      set_RPOG_SIZE = _React$useState24[1];

  var drawGaze = _react.default.useCallback(function () {
    var task = taskArr[taskNumber];
    var gazeArr = task.gazeData;
    var w = s3data.screenW;
    var h = s3data.screenH; // console.log("w",w);

    var RPOGSIZE = RPOG_SIZE;
    var canvas = canvasRef.current;
    var rctx = canvas.getContext('2d');
    rctx.clearRect(0, 0, w, h); // console.log("drawGaze 호출")

    for (var i = 0; i < gazeArr.length; i++) {
      if (gazeArr[i].relTime <= nowTime * 1 && gazeArr[i].RPOGV) {
        // console.log("야 여기당");
        rctx.beginPath();
        rctx.lineWidth = 0.5;
        rctx.strokeStyle = 'rgb(255,0,0,0.3)';
        rctx.fillStyle = 'rgb(255,0,0,0.3)'; // let x = (gazeArr[i].RPOGX) * w;
        // let y = (gazeArr[i].RPOGY) * h;
        // console.log("x,y",x,y);

        rctx.arc(gazeArr[i].RPOGX * w, gazeArr[i].RPOGY * h, RPOGSIZE, 0, Math.PI * 2);
        rctx.fill();
        rctx.stroke(); //그려
      }
    }
  }, [nowTime, taskArr, taskNumber, s3data, RPOG_SIZE]);

  _react.default.useEffect(function () {
    setTargetLocation();
    drawGaze();
  }, [nowTime, setTargetLocation, drawGaze]);

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "SCRViewer",
    ref: ref
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "left"
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("select", {
    value: taskNumber,
    onChange: function onChange(e) {
      return set_taskNumber(e.target.value * 1);
    }
  }, taskArr.map(function (task, index) {
    return /*#__PURE__*/_react.default.createElement("option", {
      key: "task" + index,
      value: index
    }, index + 1 + "번 task");
  }))), /*#__PURE__*/_react.default.createElement("div", null, "frame", /*#__PURE__*/_react.default.createElement("select", {
    value: playFrame,
    onChange: function onChange(e) {
      return set_playFrame(e.target.value * 1);
    }
  }, /*#__PURE__*/_react.default.createElement("option", null, "10"), /*#__PURE__*/_react.default.createElement("option", null, "20"), /*#__PURE__*/_react.default.createElement("option", null, "30"), /*#__PURE__*/_react.default.createElement("option", null, "60"))), /*#__PURE__*/_react.default.createElement("div", null, "\uBC30\uC18D", /*#__PURE__*/_react.default.createElement("select", {
    value: playSpeed,
    onChange: function onChange(e) {
      return set_playSpeed(e.target.value * 1);
    }
  }, /*#__PURE__*/_react.default.createElement("option", null, "1"), /*#__PURE__*/_react.default.createElement("option", null, "2"), /*#__PURE__*/_react.default.createElement("option", null, "3"), /*#__PURE__*/_react.default.createElement("option", null, "10"))), /*#__PURE__*/_react.default.createElement("div", null, nowTime, "/", endTime), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("button", {
    onClick: handleBtnPlay
  }, isPlaying ? '멈춤' : '재생')), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("input", {
    type: "range",
    style: {
      width: '80%'
    },
    min: 1,
    max: 40,
    value: RPOG_SIZE,
    onChange: function onChange(e) {
      set_RPOG_SIZE(e.target.value * 1);
    }
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "right"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "viewZone"
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: '100%',
      height: '100%'
    },
    ref: gazeRef
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "GC",
    style: {
      width: "".concat(s3data.screenW, "px"),
      height: "".concat(s3data.screenH, "px"),
      transform: "scale(" + innerFrameScale + ")",
      top: "".concat(innerFrameTop, "px"),
      left: "".concat(innerFrameLeft, "px")
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "target",
    style: {
      width: s3data.monitorInform.MONITOR_PX_PER_CM * s3data.target_size + 'px',
      height: s3data.monitorInform.MONITOR_PX_PER_CM * s3data.target_size + 'px',
      left: targetLeft,
      top: targetTop
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "GC-canvasWrapper",
    style: {
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/_react.default.createElement("canvas", {
    className: "gazeCanvas",
    width: s3data.screenW,
    height: s3data.screenH,
    ref: canvasRef
  }))))), /*#__PURE__*/_react.default.createElement("div", {
    className: "barZone"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "rangePlayWrapper"
  }, /*#__PURE__*/_react.default.createElement("input", {
    className: "rangePlay",
    type: "range",
    step: "0.01",
    value: nowTime,
    max: endTime,
    min: "0",
    onChange: function onChange(e) {
      return set_nowTime((e.target.value * 1).toFixed(2));
    }
  })))));
});

var _default = SCRViewer;
exports.default = _default;