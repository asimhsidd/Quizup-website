// CI check for .well-known/assetlinks.json, which lets the KWIZ app (live.kwiz.app) open
// kwiz.live/c/… and /i/… links. Android checks it at install, and a wrong file fails
// silently: links just open the browser. So pin what must be true. Run: node scripts/check-assetlinks.mjs
import { readFileSync } from 'node:fs';

const DEBUG_KEY = '1B:2A:C0:E4:4D:DD:4D:14:18:DA:54:9A:68:F3:F9:ED:5A:A7:02:BF:6E:5D:AC:70:13:D0:D6:4C:80:B6:42:14';
const PLAY_SIGNING = 'CE:7A:52:48:0C:2C:37:9A:A5:00:11:9A:1B:57:2D:53:A4:FC:77:B4:DD:CD:A7:14:FC:58:59:15:CD:2B:A0:66';
const UPLOAD = '21:DB:BA:96:19:8B:0B:9B:51:7D:88:5B:74:FE:C2:78:9D:56:4E:68:99:54:25:4D:A9:F1:5C:4D:60:FE:7C:BA';

const doc = JSON.parse(readFileSync(new URL('../.well-known/assetlinks.json', import.meta.url), 'utf8'));
const fail = msg => { console.error(`assetlinks.json: ${msg}`); process.exit(1); };
const [st] = doc;
if (doc.length !== 1) fail('expected one statement');
if (JSON.stringify(st.relation) !== JSON.stringify(['delegate_permission/common.handle_all_urls'])) fail('wrong relation');
if (st.target?.namespace !== 'android_app' || st.target?.package_name !== 'live.kwiz.app') fail('wrong target');
const fps = st.target.sha256_cert_fingerprints ?? [];
// Play App Signing covers every Play install; the upload key, sideloaded release builds.
// Never the debug key: anyone with a debug keystore could then claim our links.
if (fps.includes(DEBUG_KEY)) fail('contains the Android debug key');
if (!fps.includes(PLAY_SIGNING) || !fps.includes(UPLOAD) || fps.length !== 2) fail('must list exactly the Play signing and upload keys');
console.log('assetlinks.json OK: live.kwiz.app, Play signing + upload keys');
