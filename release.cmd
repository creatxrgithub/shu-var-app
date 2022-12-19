#!/usr/bin/env bash

set -e

source ../releaseConfig.cmd
#ionic capacitor build android --no-open
ionic build
ionic capacitor sync
#ionic capacitor copy
cd android && ./gradlew assembleRelease && cd ..
"${APKSIGNER_DIR}"/apksigner sign --ks-key-alias alias_name --ks "${KEY_STORE}" "${APK_FILE}"
