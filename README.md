# 六爻裝卦

以搖卦等方式自己起卦﹐再利用本應用裝卦。或以時間取數起卦﹐取中國北京時間的年月日時的農曆日期﹐定應期也是以北京時間推算。根據經驗﹐以他國時間定卦﹐似頗不驗。以時間起卦是屬於梅花易數中介紹的一種﹐也屬於一種偸懶的起卦法﹐適用於心有所感的時候。

如果將來官方的日期控件有更新所請求的功能﹐再考慮給日曆加點功能。

斷卦大約是不會去寫的﹐至少在短期內是不會去寫的。

問卜要明確表逹。若問「有人中某大獎否」，要看兄弟爻是否旺，克應或値應。若問「某人可中某大獎否」，則取六親與財爻的關系。中大獎必須極旺不受克。

## 下載與編譯

```
git clone https://github.com/creatxrgithub/shu-var-app.git
cd shu-var-app
npm install

ionic capacitor add android ##or "ios"
ionic capacitor sync

# ionic capacitor build android --no-open #don't run studio ide　#可能需要執行一次

ionic build
ionic capacitor sync
cd android && ./gradlew assembleRelease && cd ..

"${APKSIGNER_DIR}"/apksigner sign --ks-key-alias alias_name --ks "${KEY_STORE}" "${APK_FILE}"
```

**若問卜以爲非作歹皆不驗**

