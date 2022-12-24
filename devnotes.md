Development Notes

# Summary

Development notes aim to detail the steps and problems met and its solutions so that someone can start the next project with clear steps.

## Reason of choice with Ionic + React + Typescript:

1: cross-platform: write once, run anywhere with same codebase.
2: light: using web browser for debug, it's not required to run the heavy duty "android studio".
3: which has good development documents.
4: Typescript has more source-to-source compiler.

# Setup environment
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
nvm install --lts # using a node version manager to "Resolving Permission Errors​"
npm install -g typescript
npm uninstall -g ionic
npm install -g @ionic/cli
```

# Start project

in projects directory open a terminal window, then run command:
```
ionic start
```
(options with no wizard and React and tabs)
**after finishing, you could package it for next time use with change the config as project's name in "capacitor.config.json"**
React apps must use Capacitor to build native mobile apps. However, Ionic Native (and therefore, Cordova plugins) can still be used. In Capacitor projects, Cordova plugins are just regular npm dependencies.
```
cd "shu-var-app"
npm install @ionic/storage cordova-sqlite-storage localforage-cordovasqlitedriver --save
npm install moment-timezone --save
npm install shu-var-negative --save
```
maybe need:
```
npm install @types/node --save-dev
```

# Add platforms

## Setup environment
setup global variable in ~/.bashrc then <b>close and reopen terminal</b>
```
export CAPACITOR_ANDROID_STUDIO_PATH="YOUR_PATH/android-studio/bin/studio.sh"
export ANDROID_HOME="YOUR_PATH/Android/Sdk"
```
local setting (if needed)
in YOUR_PROJECT/android/local.properties (if needed)
```
sdk.dir=YOUR_PATH
```
YOUR_PROJECT/android/gradle.properties  (if needed, for auto sign)
```
RELEASE_STORE_FILE=YOUR_PATH
RELEASE_STORE_PASSWORD=
RELEASE_KEY_ALIAS=
RELEASE_KEY_PASSWORD=
```

## Add platform and build
```
ionic capacitor add android ## ios
ionic capacitor sync

# ionic capacitor build android --no-open #don't run studio ide
```

# Debug with android device
https://ionicframework.com/docs/cli/commands/capacitor-run
```
ionic capacitor run android --livereload --external
ionic capacitor run android -l --external
```

# Release android apk
```
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
```
release shell script
```
#!/usr/bin/env bash
set -e
source ../releaseConfig.cmd

#ionic capacitor build android --no-open #could only run once when add platform　#it may need run once
ionic build
ionic capacitor sync

#ionic capacitor copy
cd android && ./gradlew assembleRelease && cd ..
"${APKSIGNER_DIR}"/apksigner sign --ks-key-alias alias_name --ks "${KEY_STORE}" "${APK_FILE}"
```

## Update resources, e.g. icons
```

#https://github.com/ionic-team/capacitor-assets
npm install @capacitor/assets -g
npx capacitor-assets generate --assetPath public/assets/icon --android
```

# Troubleshooting

## SDK licenses
download command line tools from:
https://developer.android.com/studio
```
./sdkmanager --licenses
```

## useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave
```
//must use aysnc(), otherwise it cannot get the right value
useIonViewWillEnter(async() => { }, [listeningItems]);
```
the "listeningItems" is also required. cause it will render every time when it back to its page. e.g. In this project, I set a variable (myCtx.curTime) with useContext() in Tab1, after I visit other page then return to Tab1, the value of myCtx.curtime is always changed. It takes me about one day to find the problem and resolve it.

## useEffect()
The hooks may be like I've reviewed before the VueJs 's compute() and watch().

### https://www.w3schools.com/react/react_useeffect.asp
```
useEffect(() => {
//Runs on every render
});

useEffect(() => {
//Runs only on the first render
}, []);

useEffect(() => {
//Runs on the first render
//And any time any dependency value changes
}, [prop, state]);
```
take care! do not have a circle useEffect(). e.g.
```
useEffect(() => {
//modify itemB
}, [itemA]);

useEffect(() => {
//modify itemA
}, [itemB]);
```
the code above will cause an infinite loop to render. it's better to draw a tree view of listening items to get a better comprehension.

### useEffect() cannot detect object (array) 's change
e.g.
```
useEffect(() => {
}, [oneObject]);

//delete oneObject.key //unable to detect oneObject's element's change
```

## Use async function in useEffect()

### https://devtrium.com/posts/async-functions-useeffect
```
  useEffect(() => {
    const fetchData = async(year:string) => {
      const data = await loadSolarLunarData(year);
      setSolarLunarData(data);
      //must use variable of useState(),
      //with "varX=data" the "varX" will be initial value after leaving this block.
    }
    const date = moment(myCtx.curTime);
    //must use fetchData(), cannot call async function loadSolarLunarData() here.
    if (date.isValid()) fetchData(moment(date).format('YYYY')).catch(console.error);
  }, [myCtx.curTime]);
```

## Use iso8601 formated datetime string only:
moment().format() or new Date().toISOString(true)
```
moment().toISOString(); //new Date().toISOString(); //without timezone
moment().toISOString(SetTrueToKeepOffset); //timezone and millisecond
moment().format(); //timezone
new Date().toUTCString(); //it get a incompleted datetime string sometime
```

### \<IonModal\> cannot use same trigger name in tabs
```
<IonModal trigger="cannot-with-same-name-even-in-other-tabs-otherwise-it-cannot-open-in-android">
```

### about \<textarea\>
```
/**
  * https://reactjs.org/docs/forms.html
  * In HTML, a <textarea> element defines its text by its children.
  * In React, a <textarea> uses a value attribute instead.
  */
<IonTextarea value={text}>
{text} //if with both (between mark and attribute), it will cause unable to select text in device (android).
</IonTextarea>
```
\<textarea\> must included in a \<IonContent\> to get scrollable

### about \<IonAccordionGroup\> and \<IonAccordion\>
there is no kindly way to remove items from a group. even if you can get children with:
```
Array.from(refAccordionGroup.current?.children)
```
but it works with:
```
document.getElementById('relId').remove()
```

### CapacitorHttp unable to open asset URL on Android
```
import { Capacitor, CapacitorHttp, HttpResponse } from '@capacitor/core';
let res: HttpResponse = await CapacitorHttp.get(options);  //not work on android: MalformedURLException
//https://github.com/capacitor-community/http/issues/279
```

### horizontal scroll
```
<IonItem style={{'overflowX': 'scroll'}}>
```

## Remark knowedges

### TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '() => any'.
```
//console.log(someobj['varStringKey']); //it cause error when "someobj" is a function
console.log(someobj['varStringKey' as keyof typeof someobj]);
//or
console.log(someobj['varStringKey' as keyof someobjType]);
```

### TS2551: Property 'select' does not exist on type 'HTMLElement'. Did you mean 'onselect'?
TODO: scroll to specify line, e.g. current date.
https://www.w3schools.com/jsref/prop_element_scrolltop.asp
```
const eleArea = document.getElementById('solarLunarArea') as HTMLInputElement;
```
getElementById can return any HTMLElements. In your case you know its an input element so you can tell TypeScript that by using a type assertion.

### To accept all kind of key-value paired variables in Context
useState<**{[key: string]:any}**>({})
```
import React, { createContext, useState } from "react";

interface Props {
  children?: React.ReactNode;
}

export const MyContext = createContext<any>(undefined);

export const MyProvider: React.FC<Props> = ({ children }) => {
  const [myCtx, setMyCtx] = useState<{[key: string]:any}>({});

  let state = {
    myCtx,
    setMyCtx
  };

  //wrap the application in the provider
  return <MyContext.Provider value={state}>{children}</MyContext.Provider>;
};
```

### About "null safe"
```
console.log(nullableVariable?.x);
console.log(nullableVariable!.x);
console.log(nullableVariable.x ?? 'defaultValue');

interface Props {
  nullableVariable?: CustomType;
}

<label>{}</label>
```
in JSX
```
<IonLabel>{nullableVariable!}</IonLabel>
<IonLabel>{nullableVariable.x!}</IonLabel>
<IonLabel>{nullableVariable.x ?? 'defaultValue'}</IonLabel>
```

### fetch() is better. use "const" everywhere if it doesn't need assign value again after after initialization.
```
const res = await fetch(uri);
const json = await res.json();
const text = await res.text();
```

### \<pre\>\</pre\>
use to display pre-formatted string:
```
const str = 'abc\ndef\ng';
<pre>{str}</pre>
```
but it has a problem that the content within tag \<pre\> cannot be selected and copied on the device.

### Top level async/await
```
(async () => {
  await storage.create();
})();
```

### about null check
```
function isNullOrUndefined(obj:any) {
  if (obj === null) return true;
  if (obj === undefined) return true;
  return false;
}

const removePrediction = async() => {
  //if (refAccordionGroup.current?.value !== null && refAccordionGroup.current?.value !== undefined) {
  if (!isNullOrUndefined(refAccordionGroup.current?.value)) {
    //refAccordionGroup.current.value //it can pass compile
  }
}
```

### Wrap promise for object to use async/await:
```
await new Promise(fulfilled => yourObj.on("event", fulfilled));
```

### binding value {varX}
a better pratice is use "const doFn = async()" function to "setStateValue(varX)". it's because the binding {varX} doesn't accept a promised value return with {doAsyncFunctionReturnValue}
must call setVarX() to set the binding value, the input field doesn't auto change the binding value {varX}.

### how to define a key-value pair type
```
const history:{[key: string]: PredictionRecord} = {};
```

## references:

https://reactjs.org/docs/introducing-jsx.html
https://www.w3schools.com/react/react_hooks.asp
  The useRef Hook can also be used to keep track of previous state values.
  useRef() only returns one item. It returns an Object called current. e.g. refVar.current
https://devtrium.com/posts/async-functions-useeffect
https://www.w3schools.com/react/react_useeffect.asp
https://www.w3schools.com/jsref/jsref_gettimezoneoffset.asp
https://github.com/capacitor-community/sqlite/blob/master/docs/Ionic-React-Usage.md
https://github.com/capacitor-community/sqlite
https://github.com/jepiqueau/react-sqlite-app-starter
https://github.com/thgreasi/localForage-cordovaSQLiteDriver
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment
https://hooks.reactivers.com/use-global-state
https://sebhastian.com/react-global-variable/ //it seems that it does not works
//and it seems that dotenv only work with VueJs
markdown in browser editor: https://stackedit.io/app

thanks for them and plus the people who work for the freeware.
