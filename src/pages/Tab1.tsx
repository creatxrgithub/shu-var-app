import React, { useContext, useState, useRef, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonDatetime, IonLabel, IonList, IonItem, IonButton, IonTextarea, IonModal, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

import moment from 'moment-timezone';
import { MyContext } from "../my-context";
import { SolarLunarObj } from "../common";

function formatSolarLunar(obj: SolarLunarObj, useChineseTerm=true) {
  if (obj===null) return '';
  if (obj===undefined) return '';
  const solarDate = `${obj.year.toString().padStart(4,'0')}-${obj.month.toString().padStart(2,'0')}-${obj.day.toString().padStart(2,'0')}`;
  let lunarDate = '';
  if (useChineseTerm) {
    lunarDate = `${obj.lunarMonth}${obj.chineseTermOffset===0 ? obj.chineseTerm : obj.lunarDay}`;
  } else {
    lunarDate = `${obj.lunarMonth}${obj.lunarDay}`;
  }
  const chineseDate = `${obj.chineseYear}年${obj.chineseMonth}月${obj.chineseDay}日`;
  const ret = `${solarDate}　${lunarDate}　${chineseDate}`;
  return ret;
}


/*
 * 較好的實踐似乎是：可用 async() 給其他屬性屬值，而不是直接作爲屬性返回值。
 * 這是因爲值綁定不接受異步 promised 值。
 */
const Tab1: React.FC = () => {
  const {myCtx, setMyCtx} = useContext(MyContext);
  const [msg, setMsg] = useState('');
  const refTextarea = useRef<HTMLIonTextareaElement>(null);
  const [selectedTime, setSelectedTime] = useState<string|undefined>(moment().format());
  const refModal = useRef<HTMLIonModalElement>(null);
  const [solarLunarObj, setSolarLunarObj] = useState<SolarLunarObj>({"year":0,"month":0,"day":0,"lunarMonth":'',"lunarMonthDigit":0,"lunarDay":'',"lunarDayDigit":0,"isLunarLeapMonth":false,"chineseYear":'',"chineseMonth":'',"chineseDay":'',"chineseTerm":'',"chineseTermOffset":0});
  const [solarLunarText, setSolarLunarText] = useState('');
  const [solarLunarData, setSolarLunarData] = useState<{[key: string]:SolarLunarObj}>({});


  /*//it aim to instead of "const [solarLunarData, setSolarLunarData] = useState<{[key: string]:SolarLunarObj}>({});"

  //const [stateFlag, setStateFlag] = useState(true);

  const solarLunarData = ():{[key: string]:SolarLunarObj} => {
    return myCtx.solarLunarData ?? {};
  }

  const setSolarLunarData = (data:{[key: string]:SolarLunarObj}) => {
    let newCtx = { ...myCtx };
    newCtx.solarLunarData = data;
    setMyCtx({ ...myCtx, solarLunarData: data });
    //setMyCtx({ ...myCtx, solarLunarData: data });
    //setStateFlag(!stateFlag);
  }
  //*/

  const loadSolarLunarData = async(year:string) => {
    try {
      //if (solarLunarData.hasOwnProperty(`${year}-11-11`)) return solarLunarData;
      if (solarLunarData.hasOwnProperty(`${year}-11-11`)) return;
      let options = {
          url: `/assets/calendar_json/${year}.json`,
          headers: { 'X-Fake-Header': 'Fake-Value' },
          params: { size: 'XL' },
        };
      const res = await fetch(options.url);
      const json = await res.json();
      setSolarLunarData(json);
      //return json;
    } catch (e) {
      //setMsg('err:'+e?.toString()); //to show console message on client-side
      return '';
    }
  }

  const onOpenSolarLunarModal = () => {
    //const data = solarLunarData;
    const data = typeof solarLunarData === 'function' ? eval('solarLunarData()') : solarLunarData;
    //const data = solarLunarData(); //用函數代替 useState() 中的變量
    let text = Object.keys(data).map((key,index) => (
      //console.log(index), //由於是在圓括內，這里只能用逗號
      formatSolarLunar(data[key as keyof SolarLunarObj])+'\n'
      //or
      //formatSolarLunar(data[key as keyof typeof solarLunarData])+'\n'
    ));
    setSolarLunarText(text.join(''));
  }

  useEffect(() => {
    //https://devtrium.com/posts/async-functions-useeffect
    const fetchData = async(year:string) => {
      const data = await loadSolarLunarData(year);
      //setSolarLunarData(data);
      //must use variable of useState(),
      //with "varX=data" the "varX" will be initial value after leaving this block.
    }
    const date = moment(selectedTime);
    //must use fetchData(), cannot call async function loadSolarLunarData() here.
    if (date.isValid()) fetchData(moment(date).format('YYYY')).catch(console.error);
  }, [selectedTime]);

  useEffect(() => {
    //const data = solarLunarData;
    const data = typeof solarLunarData === 'function' ? eval('solarLunarData()') : solarLunarData;
    //const data = solarLunarData(); //用函數代替 useState() 中的變量
    setSolarLunarObj(data[moment(selectedTime).format('YYYY-MM-DD') as keyof SolarLunarObj]);
    //console.log(data);
  }, [selectedTime, solarLunarData]); //如果 solarLunarData 是函數，無法偵測變化，從 tab3 返回時不顯示當日農曆

  useIonViewWillEnter(async() => {
    let localTime = moment(myCtx.curTime, moment.ISO_8601);
    if (!localTime.isValid()) {
      localTime = moment();
    }
    setSelectedTime(localTime.format());
  }, [myCtx.curTime]); //[myCtx.curTime]是必須的，否則每次返回 Tab1 時間都會重置。

  useIonViewWillLeave(async() => {
    let newCtx = { ...myCtx };
    newCtx.curTime = selectedTime;
    setMyCtx(newCtx);
  }, [selectedTime]); //僅在離開頁面時設置，以減少不必要的消耗。

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>起卦時間</IonTitle>
        </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem><IonLabel>{formatSolarLunar(solarLunarObj, false)}</IonLabel></IonItem>
          <IonItem>
            <IonDatetime showClearButton={true}
              hour-cycle="h23"
              locale="en-GB"
              min="1901-01-01T00:00:00"
              max="2100-12-31T23:59:59"
              value={selectedTime}
              //value={myCtx.curTime}
              onIonChange={async(e) => {
                  let localTime = moment(e.detail.value?.toString());
                  if (localTime.isValid()) {
                    setSelectedTime(localTime.format());
                  }
                }
              } />
          </IonItem>
          {/*
          <IonItem><IonLabel>{myCtx.curTime!}</IonLabel></IonItem>
          <IonItem><IonLabel>{selectedTime!}</IonLabel></IonItem>
          */}
          <IonItem>
            <IonButton id="open-modal" expand="block">顯示日曆數據</IonButton>
            <IonButton routerLink="/tab2">設定起卦時間，下一步</IonButton>
          </IonItem>
          <IonModal ref={refModal} trigger="open-modal"
            onDidPresent={e => onOpenSolarLunarModal()}
            onDidDismiss={e => setSolarLunarText('')} >
            {/*
            <IonHeader>
              <IonToolbar>
              <IonButton onClick={() => refModal.current?.dismiss()} slot="start">關閉</IonButton>
              </IonToolbar>
            </IonHeader>
            */}
            {/*必須要有 <IonContent> 否則沒有滾動條。*/}
            <IonContent>
              <IonTextarea id="solarLunarArea" readonly={true} rows={404} ref={refTextarea} value={solarLunarText}>
              </IonTextarea>
            </IonContent>
          </IonModal>
          {/* <IonItem><IonLabel>{msg}</IonLabel></IonItem> */}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
