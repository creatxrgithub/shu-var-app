import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonList, IonItem, IonButton, IonInput, IonTextarea, IonModal, IonAccordionGroup, IonAccordion, IonAlert } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab3.css';
import React, { useState, useRef, useEffect, useContext } from 'react';

import moment from 'moment-timezone';
import Prediction from "shu-var-negative";
import { Drivers, Storage } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

import { MyContext } from "../my-context";
import { SolarLunarObj } from "../common";

const timeZone = 'Asia/Shanghai';
//const tiangan = '甲乙丙丁戊己庚辛壬癸';
const storage = new Storage({
  name: '__mydb',
  driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
});

(async () => {
  await storage.create();
})(); //end top async()


function isNullOrUndefined(obj:any) {
  if (obj === null) return true;
  if (obj === undefined) return true;
  return false;
}


class LogToStr {
  constructor() {
  }

  static target = '';

  static clear() {
    LogToStr.target = '';
  }

  static log(arg: string) {
    if(arg!=null) {
      LogToStr.target += arg + '\n';
    } else {
      LogToStr.target += '\n';
    }
  }
}


interface PredictionRecord {
  reason: string,
  results: string,
  forecast: string
}

const Tab3: React.FC = () => {
  const {myCtx, setMyCtx} = useContext(MyContext);
  const [predictTime, setPredictTime] = useState('');
  const [chinaTime, setChinaTime] = useState('');
  const [reason, setReason] = useState('');
  const [results, setResults] = useState('起卦測試');
  const [forecast, setForecast] = useState('未記錄結論及應期');
  const refModal = useRef<HTMLIonModalElement>(null);
  const refReaderModal = useRef<HTMLIonModalElement>(null);
  const [book, setBook] = useState('');
  const refAccordionGroup = useRef<HTMLIonAccordionGroupElement>(null);
  const [predictionHistory, setPredictionHistory] = useState<{[key: string]:PredictionRecord}>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let localTime = moment(myCtx.curTime, moment.ISO_8601);
    if (!localTime.isValid()) localTime = moment();
    setPredictTime(localTime.format());
  }, [myCtx.curTime]);

  useEffect(() => {
    setChinaTime(moment(predictTime).clone().tz(timeZone).format());
  }, [predictTime]);

  const doPrediction = async() => {
    if (reason.trim() === '') {
      setAlertMessage('尙未記錄因何問卜');
      setShowAlert(true);
      return;
    }
    if (chinaTime === '') return; //以中國時間爲準起卦
    const dizhi = '子丑寅卯辰巳午未申酉戌亥';
    const shuHourMap = [1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,1];
    const chineseHourMap = Array.from('子丑丑寅寅卯卯辰辰巳巳午午未未申申酉酉戌戌亥亥子');
    const selMoment = moment(chinaTime).clone().tz(timeZone);
    const selYear = selMoment.format('YYYY');
    const selDate = selMoment.format('YYYY-MM-DD');
    let selCalendarInfo: SolarLunarObj;
    //if (myCtx.solarLunarData !== undefined && myCtx.solarLunarData.hasOwnProperty(selDate)) {
    if (myCtx?.solarLunarData?.hasOwnProperty(selDate)) {
      //將整年的日曆放在 useContext() 中，似乎很有問題，比如選定的日期沒更新，不知是否由於資源消耗的問題引起的。
      selCalendarInfo = myCtx.solarLunarData[selDate];
    } else {
      const options = {
          url: `assets/calendar_json/${selYear}.json`,
          headers: { 'X-Fake-Header': 'Fake-Value' },
          params: { size: 'XL' },
        };
      const res = await fetch(options.url);
      const json = await res.json();
      selCalendarInfo = json[selDate];
    }

    let yaoTu:string|number, yaoVar:string|number;

    if (isNullOrUndefined(myCtx.shuInfo)) {
      const shuYear = dizhi.indexOf(selCalendarInfo.chineseYear[1])+1;
      const shuMonth = selCalendarInfo.lunarMonthDigit;
      const shuDay = selCalendarInfo.lunarDayDigit;
      const shuHour = shuHourMap[parseInt(selMoment.format('HH'))];  //注意小寫的 'hh' 是上下午 12 小時制
      //由於易數是負數，其象是同餘的正數，因此無需查表。
      yaoTu = (8-(shuYear+shuMonth+shuDay+shuHour)%8)%8*Math.pow(2,3) + (8-(shuYear+shuMonth+shuDay)%8)%8;
      yaoVar = 1 << (6-(shuYear+shuMonth+shuDay+shuHour)%6)%6;
    } else {
      [yaoTu, yaoVar] = myCtx.shuInfo;
    }
    const memo = reason;
    const prediction = new Prediction(`起卦時間：${predictTime}\n北京時間：${chinaTime}\n農曆：${selCalendarInfo.lunarMonth}${selCalendarInfo.lunarDay}\n${selCalendarInfo.chineseYear}年 ${selCalendarInfo.chineseMonth}月${selCalendarInfo.chineseDay}日 ${chineseHourMap[parseInt(selMoment.format('HH'))]}時`,yaoTu,yaoVar, memo);
    prediction.getInfo();
    LogToStr.clear();
    prediction.print(LogToStr.log);
    setResults(`${LogToStr.target}`);
  };

  const savePrediction = async() => {
    await storage.set(`${new Date().toISOString()}`, {reason: reason, results: results.toString(), forecast: forecast});
    setAlertMessage('已經保存');
    setShowAlert(true);
  }

  const clearPrediction = async() => {
    await storage.clear();
    refModal.current?.dismiss();
  }

  const removePrediction = async() => {
    //if (refAccordionGroup.current?.value !== null && refAccordionGroup.current?.value !== undefined) {
    if (!isNullOrUndefined(refAccordionGroup.current?.value)) {
      if (typeof refAccordionGroup.current?.value === 'string') {
        await storage.remove(refAccordionGroup.current.value.toString());
        delete predictionHistory[refAccordionGroup.current.value];
        document.getElementById(refAccordionGroup.current.value)?.remove();
      }
    }
  }

  const updatePrediction = async() => {
    if (refAccordionGroup.current?.value !== null && refAccordionGroup.current?.value !== undefined) {
      if (typeof refAccordionGroup.current?.value === 'string') {
        await storage.set(refAccordionGroup.current.value, predictionHistory[refAccordionGroup.current.value]);
        setAlertMessage('已經保存');
        setShowAlert(true);
      }
    }
  }

  const loadPredictionHistory = async() => {
    try {
      const keys = await storage.keys();
      const history:{[key: string]: PredictionRecord} = {};
      for (const key of keys) {
        history[key] = await storage.get(key);
      }
      setPredictionHistory(history);
    } catch(e) {
      setMsg('err:'+e?.toString());
    }
  }

  const onModalDismiss = async() => {
    //setMsg('onDidDismiss');
  }

  const onOpenReaderModal = async(uri:string) => {
    const options = {
        url: `assets/books/${uri}`,
        headers: { 'X-Fake-Header': 'Fake-Value' },
        params: { size: 'XL' },
      };
    const res = await fetch(options.url);
    setBook(await res.text());
  }

  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>卦象﹝若問卜以爲非作歹皆不驗﹞</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <IonHeader collapse="condense">
      <IonToolbar>
        <IonTitle size="large">Tab 3</IonTitle>
      </IonToolbar>
      </IonHeader>
      <ExploreContainer name="Tab 3 page" />
      <IonList>
        {/*<IonItem><IonLabel>當前時間：{moment().toString()}</IonLabel></IonItem>*/}
        <IonItem><IonLabel>起卦時間：{predictTime!}</IonLabel></IonItem>
        <IonItem><IonLabel>北京時間：{chinaTime!}</IonLabel></IonItem>
        {/** 使用 onIonInput 而非 onIonChange */}
        <IonItem>
          <IonLabel color="primary">因何問卜：</IonLabel>
          <IonInput value={reason} onIonInput={ e => setReason(e.target?.value?.toString() ?? '') } required placeholder='說明自占或代占關系及因何問卜' />
        </IonItem>
        <IonItem style={{'overflowX': 'scroll'}}>{/*todo: horizontal scroll*/}
          <IonButton onClick={ e => doPrediction() }>起卦問卜</IonButton>
          <IonButton onClick={ e => { setResults(''); setReason(''); } }>淸空卦象</IonButton>
          <IonButton onClick={ e => savePrediction() }>保存結論</IonButton>
          <IonButton id="history" expand="block">歷史記錄</IonButton>
          <IonButton id="reader" expand="block">易數傳眞</IonButton>
        </IonItem>
        <IonItem>
          <IonLabel color="primary">推定應期：</IonLabel>
          <IonInput value={forecast} onIonInput={ e => setForecast(e.target?.value?.toString() ?? '') } placeholder='推定結論及其應期' />
        </IonItem>
        <IonItem>
          {/** 加 <pre></pre> 以根據 \r\n 分行 */}
          <IonLabel>六爻卦象：<pre>{results}</pre></IonLabel>
        </IonItem>
        {/* <IonItem><IonLabel>{msg}</IonLabel></IonItem> */}
        {/** trigger 値必須和 tab1 中的不同，否則在 android 上不會觸發 */}
        <IonModal ref={refModal} trigger="history" onDidPresent={loadPredictionHistory} onDidDismiss={onModalDismiss}>
          <IonHeader>
            <IonToolbar>
              <IonButton onClick={() => refModal.current?.dismiss()} slot="start">關閉</IonButton>
              <IonButton onClick={updatePrediction} slot="end">保存</IonButton>
              <IonButton onClick={clearPrediction} slot="end">淸空</IonButton>
              <IonButton onClick={removePrediction} slot="end">刪除</IonButton>
            </IonToolbar>
          </IonHeader>
          {/*必須要有 <IonContent> 否則沒有滾動條。*/}
          <IonContent>
            <IonList>
              {
              <IonAccordionGroup ref={refAccordionGroup} data-source={predictionHistory}>{
                //must set item's "key" prop
                Object.keys(predictionHistory).reverse().map((key,index) => (
                  //設 id 以便使用 document.getElementById
                  <IonAccordion id={key} key={key} value={key}>
                    <IonItem slot="header" color="light">
                      <IonLabel>{key}　{predictionHistory[key]?.reason}</IonLabel>
                    </IonItem>
                    <div className="ion-padding" slot="content">
                    <IonItem>
                      <IonLabel color="primary">預期：</IonLabel>
                      <IonInput value={predictionHistory[key].forecast}
                        onIonInput={ e => predictionHistory[key].forecast = e.target?.value!.toString()
                        }
                      required placeholder='結論' />
                      </IonItem>
                      <IonTextarea readonly={true} rows={16} value={predictionHistory[key]?.results}>
                      </IonTextarea>
                    </div>
                  </IonAccordion>
                ))}
              </IonAccordionGroup>
              }
            </IonList>
          </IonContent>
        </IonModal>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header=""
          subHeader=""
          message={alertMessage}
          buttons={['OK']}
          />

        <IonModal ref={refReaderModal} trigger="reader"
          onDidPresent={ e => onOpenReaderModal('creatxr.manual.shu_var.txt') }
          onDidDismiss={ e => setBook('') } >
          <IonContent>
            <IonTextarea readonly={true} rows={404} value={book}>
            </IonTextarea>
          </IonContent>
        </IonModal>
      </IonList>
    </IonContent>
    </IonPage>
  );
};

export default Tab3;
