import React, { useState, useContext } from 'react';
import { IonHeader, IonTitle, IonToolbar, IonContent, IonItem, IonLabel, IonList, IonListHeader, IonSelect, IonSelectOption, IonPage, IonButton, IonAlert, NavContext } from '@ionic/react';

import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';

import { MyContext } from "../my-context";


const Tab2: React.FC = () => {
  const {myCtx, setMyCtx} = React.useContext(MyContext);
  const { navigate } = useContext(NavContext);
  const [showAlert, setShowAlert] = useState(false);

  const tu2 = '⚋⚊㐅○';
  const [s1, setS1] = useState<string>('');
  const [s2, setS2] = useState<string>('');
  const [s3, setS3] = useState<string>('');
  const [s4, setS4] = useState<string>('');
  const [s5, setS5] = useState<string>('');
  const [s6, setS6] = useState<string>('');
  //const [shuBits, setShuBits] = useState<string>('');
  //const [shuVars, setShuVars] = useState<string>('');

  const clearShuBitsVars = () => {
    setS1('');
    setS2('');
    setS3('');
    setS4('');
    setS5('');
    setS6('');
    setMyCtx({ ...myCtx, shuInfo: undefined });
  }

  const setShuBitsVars = () => {
    let shuInputs = [s6, s5, s4, s3, s2, s1];
    //字段檢查，全設置六爻或全不設
    let bitsCount = 0;
    for(let i=0; i<6; i++) {
      if(shuInputs[i] === '') continue;
      bitsCount++;
    }
    if (bitsCount === 0) { navigate('/tab3'); return; }
    if ((bitsCount!==0) && (bitsCount!==6)) {
      setShowAlert(true);
      return;
    }
    const b1 = tu2.indexOf(s1) % 2;
    const b2 = tu2.indexOf(s2) % 2;
    const b3 = tu2.indexOf(s3) % 2;
    const b4 = tu2.indexOf(s4) % 2;
    const b5 = tu2.indexOf(s5) % 2;
    const b6 = tu2.indexOf(s6) % 2;
    const v1 = tu2.indexOf(s1) > 1 ? 1 : 0;
    const v2 = tu2.indexOf(s2) > 1 ? 1 : 0;
    const v3 = tu2.indexOf(s3) > 1 ? 1 : 0;
    const v4 = tu2.indexOf(s4) > 1 ? 1 : 0;
    const v5 = tu2.indexOf(s5) > 1 ? 1 : 0;
    const v6 = tu2.indexOf(s6) > 1 ? 1 : 0;
    const shuBits = `${b1}${b2}${b3}${b4}${b5}${b6}`;
    const shuVars = `${v1}${v2}${v3}${v4}${v5}${v6}`;
    let newCtx = { ...myCtx };
    newCtx.shuInfo = [parseInt(shuBits, 2), parseInt(shuVars, 2)];
    setMyCtx(newCtx);
    //setMyCtx({ ...myCtx, shuInfo:[parseInt(shuBits, 2), parseInt(shuVars, 2)] });
    navigate('/tab3');
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>選擇爻象，或畧過直接以時間起卦</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          <IonListHeader>
            <IonLabel>
              取三枚銅錢，每卦共搖六次，初次卽初爻，自下而上記錄。
              少陰{tu2[0]}﹝兩枚爲背﹞；少陽{tu2[1]}﹝一枚爲背﹞；
              老陰{tu2[2]}﹝三枚皆字﹞；老陽{tu2[3]}﹝三枚皆背﹞。
            </IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel>六爻</IonLabel>
            <IonSelect value={s6} placeholder="Select One" onIonChange={ e => setS6(e.detail.value) }>
              <IonSelectOption value={tu2[0]}>{tu2[0]}</IonSelectOption>
              <IonSelectOption value={tu2[1]}>{tu2[1]}</IonSelectOption>
              <IonSelectOption value={tu2[2]}>{tu2[2]}</IonSelectOption>
              <IonSelectOption value={tu2[3]}>{tu2[3]}</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>五爻</IonLabel>
            <IonSelect value={s5} placeholder="Select One" onIonChange={ e => setS5(e.detail.value) }>
              <IonSelectOption value={tu2[0]}>{tu2[0]}</IonSelectOption>
              <IonSelectOption value={tu2[1]}>{tu2[1]}</IonSelectOption>
              <IonSelectOption value={tu2[2]}>{tu2[2]}</IonSelectOption>
              <IonSelectOption value={tu2[3]}>{tu2[3]}</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>四爻</IonLabel>
            <IonSelect value={s4} placeholder="Select One" onIonChange={ e => setS4(e.detail.value) }>
              <IonSelectOption value={tu2[0]}>{tu2[0]}</IonSelectOption>
              <IonSelectOption value={tu2[1]}>{tu2[1]}</IonSelectOption>
              <IonSelectOption value={tu2[2]}>{tu2[2]}</IonSelectOption>
              <IonSelectOption value={tu2[3]}>{tu2[3]}</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>三爻</IonLabel>
            <IonSelect value={s3} placeholder="Select One" onIonChange={ e => setS3(e.detail.value) }>
              <IonSelectOption value={tu2[0]}>{tu2[0]}</IonSelectOption>
              <IonSelectOption value={tu2[1]}>{tu2[1]}</IonSelectOption>
              <IonSelectOption value={tu2[2]}>{tu2[2]}</IonSelectOption>
              <IonSelectOption value={tu2[3]}>{tu2[3]}</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>二爻</IonLabel>
            <IonSelect value={s2} placeholder="Select One" onIonChange={ e => setS2(e.detail.value) }>
              <IonSelectOption value={tu2[0]}>{tu2[0]}</IonSelectOption>
              <IonSelectOption value={tu2[1]}>{tu2[1]}</IonSelectOption>
              <IonSelectOption value={tu2[2]}>{tu2[2]}</IonSelectOption>
              <IonSelectOption value={tu2[3]}>{tu2[3]}</IonSelectOption>
            </IonSelect>
          </IonItem>

           <IonItem>
            <IonLabel>初爻</IonLabel>
            <IonSelect value={s1} placeholder="Select One" onIonChange={ e => setS1(e.detail.value) }>
              <IonSelectOption value={tu2[0]}>{tu2[0]}</IonSelectOption>
              <IonSelectOption value={tu2[1]}>{tu2[1]}</IonSelectOption>
              <IonSelectOption value={tu2[2]}>{tu2[2]}</IonSelectOption>
              <IonSelectOption value={tu2[3]}>{tu2[3]}</IonSelectOption>
            </IonSelect>
          </IonItem>
         </IonList>

        <IonButton routerLink="/tab1">上一步</IonButton>
        <IonButton onClick = { e => setShuBitsVars() }>指定六爻，下一步</IonButton>
        <IonButton onClick={ e => clearShuBitsVars() }>清空六爻</IonButton>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="提示"
          subHeader="六爻"
          message="指定全部六爻或淸空"
          buttons={['OK']}
          />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
