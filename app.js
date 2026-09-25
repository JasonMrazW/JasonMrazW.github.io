var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var _a, _b, _c, _d, _e, _f, _g, _h, _i;
const STORAGE_KEY = "momo-home-assist-demo";
const IS_LOCAL_PARENT = window.location.port === "4173" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const APP_BASE_PATH = new URL(".", window.location.href).pathname.replace(/\/$/, "");
const ENABLE_DICTATION_ANALYTICS = APP_BASE_PATH === "/memokids" && !IS_LOCAL_PARENT && !window.location.hostname.endsWith(".github.io");
const APP_VERSION = "86";
const OCR_API = IS_LOCAL_PARENT ? `${window.location.protocol}//${window.location.hostname}:8766` : APP_BASE_PATH;
const COMPLETION_AUDIO = "https://memokids-1301721396.cos.ap-shanghai.myqcloud.com/voice-default/%E7%B3%BB%E7%BB%9F/%E6%8F%90%E7%A4%BA/%E5%AE%8C%E6%88%90%E6%8F%90%E7%A4%BA_%E4%BD%A0%E7%9C%9F%E6%A3%92%E5%B7%B2%E5%85%A8%E9%83%A8%E5%90%AC%E5%86%99%E5%AE%8C%E6%88%90.wav";
const ENGLISH_COMPLETION_AUDIO = "https://memokids-1301721396.cos.ap-shanghai.myqcloud.com/voice-default/%E7%B3%BB%E7%BB%9F/%E6%8F%90%E7%A4%BA/%E5%AE%8C%E6%88%90%E6%8F%90%E7%A4%BA_%E8%8B%B1%E6%96%87_4db.wav";
let remoteLessons = [];
const RECALL_CATEGORIES = ["\u8868\u793A\u58F0\u97F3\u7684\u8BCD\u8BED", "\u8868\u793A\u65F6\u95F4\u77ED\u7684\u8BCD\u8BED", "\u4E00\u4EC0\u4E48\u4E0D\u4EC0\u4E48\u5F0F\u8BCD\u8BED"];
const defaultState = {
  screen: "setup",
  lesson: null,
  viewingLessonId: null,
  selectedLessonIds: [],
  setupSubject: null,
  homeSubject: null,
  orderMode: "default",
  drawEnabled: false,
  drawRatio: 0.5,
  playbackMode: "easy",
  wordIntervalSeconds: 3,
  wordRepeatCount: 2,
  selectedWords: [],
  selectedItemMetadata: [],
  excludedKnowledgeCategories: {},
  currentIndex: 0,
  showWordDefault: true,
  showWord: true,
  started: false,
  currentRepeat: 0,
  paused: false,
  results: [],
  history: []
};
const playbackModes = {
  relaxed: { label: "\u8F7B\u677E", description: "\u91CD\u590D 2 \u904D\uFF0C\u95F4\u9694 5 \u79D2", repeatCount: 2, intervalSeconds: 5 },
  easy: { label: "\u70ED\u8EAB", description: "\u91CD\u590D 2 \u904D\uFF0C\u95F4\u9694 3 \u79D2", repeatCount: 2, intervalSeconds: 3 },
  challenge: { label: "\u72C2\u66B4", description: "\u91CD\u590D 1 \u904D\uFF0C\u95F4\u9694 3 \u79D2", repeatCount: 1, intervalSeconds: 3 },
  crazy: { label: "\u75AF\u72C2", description: "\u4E0D\u91CD\u590D\uFF0C\u95F4\u9694 2 \u79D2", repeatCount: 0, intervalSeconds: 2 }
};
const completionPoems = [
  // 开阔想象（24）
  "\u98DE\u6D41\u76F4\u4E0B\u4E09\u5343\u5C3A\uFF0C\u7591\u662F\u94F6\u6CB3\u843D\u4E5D\u5929\u3002",
  "\u9EC4\u6CB3\u4E4B\u6C34\u5929\u4E0A\u6765\uFF0C\u5954\u6D41\u5230\u6D77\u4E0D\u590D\u56DE\u3002",
  "\u957F\u98CE\u51E0\u4E07\u91CC\uFF0C\u5439\u5EA6\u7389\u95E8\u5173\u3002",
  "\u5B64\u5E06\u8FDC\u5F71\u78A7\u7A7A\u5C3D\uFF0C\u552F\u89C1\u957F\u6C5F\u5929\u9645\u6D41\u3002",
  "\u661F\u5782\u5E73\u91CE\u9614\uFF0C\u6708\u6D8C\u5927\u6C5F\u6D41\u3002",
  "\u91CE\u65F7\u5929\u4F4E\u6811\uFF0C\u6C5F\u6E05\u6708\u8FD1\u4EBA\u3002",
  "\u5927\u6F20\u5B64\u70DF\u76F4\uFF0C\u957F\u6CB3\u843D\u65E5\u5706\u3002",
  "\u6708\u4E0B\u98DE\u5929\u955C\uFF0C\u4E91\u751F\u7ED3\u6D77\u697C\u3002",
  "\u4E24\u5CB8\u9752\u5C71\u76F8\u5BF9\u51FA\uFF0C\u5B64\u5E06\u4E00\u7247\u65E5\u8FB9\u6765\u3002",
  "\u5C71\u968F\u5E73\u91CE\u5C3D\uFF0C\u6C5F\u5165\u5927\u8352\u6D41\u3002",
  "\u5929\u63A5\u4E91\u6D9B\u8FDE\u6653\u96FE\uFF0C\u661F\u6CB3\u6B32\u8F6C\u5343\u5E06\u821E\u3002",
  "\u6B32\u628A\u897F\u6E56\u6BD4\u897F\u5B50\uFF0C\u6DE1\u5986\u6D53\u62B9\u603B\u76F8\u5B9C\u3002",
  "\u65E5\u7167\u9999\u7089\u751F\u7D2B\u70DF\uFF0C\u9065\u770B\u7011\u5E03\u6302\u524D\u5DDD\u3002",
  "\u5929\u95E8\u4E2D\u65AD\u695A\u6C5F\u5F00\uFF0C\u78A7\u6C34\u4E1C\u6D41\u81F3\u6B64\u56DE\u3002",
  "\u6C14\u84B8\u4E91\u68A6\u6CFD\uFF0C\u6CE2\u64BC\u5CB3\u9633\u57CE\u3002",
  "\u6E56\u5149\u79CB\u6708\u4E24\u76F8\u548C\uFF0C\u6F6D\u9762\u65E0\u98CE\u955C\u672A\u78E8\u3002",
  "\u4E91\u60F3\u8863\u88F3\u82B1\u60F3\u5BB9\uFF0C\u6625\u98CE\u62C2\u69DB\u9732\u534E\u6D53\u3002",
  "\u82E5\u975E\u7FA4\u7389\u5C71\u5934\u89C1\uFF0C\u4F1A\u5411\u7476\u53F0\u6708\u4E0B\u9022\u3002",
  "\u4E0D\u77E5\u5929\u4E0A\u5BAB\u9619\uFF0C\u4ECA\u5915\u662F\u4F55\u5E74\u3002",
  "\u6CA7\u6D77\u6708\u660E\u73E0\u6709\u6CEA\uFF0C\u84DD\u7530\u65E5\u6696\u7389\u751F\u70DF\u3002",
  "\u6D77\u4E0A\u751F\u660E\u6708\uFF0C\u5929\u6DAF\u5171\u6B64\u65F6\u3002",
  "\u6625\u6C5F\u6F6E\u6C34\u8FDE\u6D77\u5E73\uFF0C\u6D77\u4E0A\u660E\u6708\u5171\u6F6E\u751F\u3002",
  "\u4E00\u9053\u6B8B\u9633\u94FA\u6C34\u4E2D\uFF0C\u534A\u6C5F\u745F\u745F\u534A\u6C5F\u7EA2\u3002",
  "\u767B\u9AD8\u58EE\u89C2\u5929\u5730\u95F4\uFF0C\u5927\u6C5F\u832B\u832B\u53BB\u4E0D\u8FD8\u3002",
  // 自然风景（18）
  "\u6625\u7720\u4E0D\u89C9\u6653\uFF0C\u5904\u5904\u95FB\u557C\u9E1F\u3002",
  "\u4E24\u4E2A\u9EC4\u9E42\u9E23\u7FE0\u67F3\uFF0C\u4E00\u884C\u767D\u9E6D\u4E0A\u9752\u5929\u3002",
  "\u63A5\u5929\u83B2\u53F6\u65E0\u7A77\u78A7\uFF0C\u6620\u65E5\u8377\u82B1\u522B\u6837\u7EA2\u3002",
  "\u5C0F\u8377\u624D\u9732\u5C16\u5C16\u89D2\uFF0C\u65E9\u6709\u873B\u8713\u7ACB\u4E0A\u5934\u3002",
  "\u7B49\u95F2\u8BC6\u5F97\u4E1C\u98CE\u9762\uFF0C\u4E07\u7D2B\u5343\u7EA2\u603B\u662F\u6625\u3002",
  "\u7AF9\u5916\u6843\u82B1\u4E09\u4E24\u679D\uFF0C\u6625\u6C5F\u6C34\u6696\u9E2D\u5148\u77E5\u3002",
  "\u6CBE\u8863\u6B32\u6E7F\u674F\u82B1\u96E8\uFF0C\u5439\u9762\u4E0D\u5BD2\u6768\u67F3\u98CE\u3002",
  "\u7EFF\u6811\u6751\u8FB9\u5408\uFF0C\u9752\u5C71\u90ED\u5916\u659C\u3002",
  "\u78A7\u7389\u5986\u6210\u4E00\u6811\u9AD8\uFF0C\u4E07\u6761\u5782\u4E0B\u7EFF\u4E1D\u7EE6\u3002",
  "\u6E2D\u57CE\u671D\u96E8\u6D65\u8F7B\u5C18\uFF0C\u5BA2\u820D\u9752\u9752\u67F3\u8272\u65B0\u3002",
  "\u6653\u770B\u7EA2\u6E7F\u5904\uFF0C\u82B1\u91CD\u9526\u5B98\u57CE\u3002",
  "\u660E\u6708\u677E\u95F4\u7167\uFF0C\u6E05\u6CC9\u77F3\u4E0A\u6D41\u3002",
  "\u7A7A\u5C71\u65B0\u96E8\u540E\uFF0C\u5929\u6C14\u665A\u6765\u79CB\u3002",
  "\u9EC4\u6885\u65F6\u8282\u5BB6\u5BB6\u96E8\uFF0C\u9752\u8349\u6C60\u5858\u5904\u5904\u86D9\u3002",
  "\u5929\u8857\u5C0F\u96E8\u6DA6\u5982\u9165\uFF0C\u8349\u8272\u9065\u770B\u8FD1\u5374\u65E0\u3002",
  "\u8349\u957F\u83BA\u98DE\u4E8C\u6708\u5929\uFF0C\u62C2\u5824\u6768\u67F3\u9189\u6625\u70DF\u3002",
  "\u6885\u5B50\u9EC4\u65F6\u65E5\u65E5\u6674\uFF0C\u5C0F\u6EAA\u6CDB\u5C3D\u5374\u5C71\u884C\u3002",
  "\u5FFD\u5982\u4E00\u591C\u6625\u98CE\u6765\uFF0C\u5343\u6811\u4E07\u6811\u68A8\u82B1\u5F00\u3002",
  // 童趣生活（6）
  "\u513F\u7AE5\u6025\u8D70\u8FFD\u9EC4\u8776\uFF0C\u98DE\u5165\u83DC\u82B1\u65E0\u5904\u5BFB\u3002",
  "\u5C0F\u5A03\u6491\u5C0F\u8247\uFF0C\u5077\u91C7\u767D\u83B2\u56DE\u3002",
  "\u8DEF\u4EBA\u501F\u95EE\u9065\u62DB\u624B\uFF0C\u6015\u5F97\u9C7C\u60CA\u4E0D\u5E94\u4EBA\u3002",
  "\u7267\u7AE5\u9A91\u9EC4\u725B\uFF0C\u6B4C\u58F0\u632F\u6797\u6A3E\u3002",
  "\u84EC\u5934\u7A1A\u5B50\u5B66\u5782\u7EB6\uFF0C\u4FA7\u5750\u8393\u82D4\u8349\u6620\u8EAB\u3002",
  "\u7AE5\u5B59\u672A\u89E3\u4F9B\u8015\u7EC7\uFF0C\u4E5F\u508D\u6851\u9634\u5B66\u79CD\u74DC\u3002",
  // 温柔治愈（6）
  "\u968F\u98CE\u6F5C\u5165\u591C\uFF0C\u6DA6\u7269\u7EC6\u65E0\u58F0\u3002",
  "\u843D\u7EA2\u4E0D\u662F\u65E0\u60C5\u7269\uFF0C\u5316\u4F5C\u6625\u6CE5\u66F4\u62A4\u82B1\u3002",
  "\u4EBA\u95F2\u6842\u82B1\u843D\uFF0C\u591C\u9759\u6625\u5C71\u7A7A\u3002",
  "\u91C7\u83CA\u4E1C\u7BF1\u4E0B\uFF0C\u60A0\u7136\u89C1\u5357\u5C71\u3002",
  "\u884C\u5230\u6C34\u7A77\u5904\uFF0C\u5750\u770B\u4E91\u8D77\u65F6\u3002",
  "\u665A\u6765\u5929\u6B32\u96EA\uFF0C\u80FD\u996E\u4E00\u676F\u65E0\uFF1F",
  // 友情想象（6）
  "\u6D77\u5185\u5B58\u77E5\u5DF1\uFF0C\u5929\u6DAF\u82E5\u6BD4\u90BB\u3002",
  "\u6843\u82B1\u6F6D\u6C34\u6DF1\u5343\u5C3A\uFF0C\u4E0D\u53CA\u6C6A\u4F26\u9001\u6211\u60C5\u3002",
  "\u529D\u541B\u66F4\u5C3D\u4E00\u676F\u9152\uFF0C\u897F\u51FA\u9633\u5173\u65E0\u6545\u4EBA\u3002",
  "\u83AB\u6101\u524D\u8DEF\u65E0\u77E5\u5DF1\uFF0C\u5929\u4E0B\u8C01\u4EBA\u4E0D\u8BC6\u541B\u3002",
  "\u6545\u4EBA\u897F\u8F9E\u9EC4\u9E64\u697C\uFF0C\u70DF\u82B1\u4E09\u6708\u4E0B\u626C\u5DDE\u3002",
  "\u6211\u5BC4\u6101\u5FC3\u4E0E\u660E\u6708\uFF0C\u968F\u541B\u76F4\u5230\u591C\u90CE\u897F\u3002"
];
const completionPoemSources = {
  "\u98DE\u6D41\u76F4\u4E0B\u4E09\u5343\u5C3A\uFF0C\u7591\u662F\u94F6\u6CB3\u843D\u4E5D\u5929\u3002": "\u51FA\u81EA\u300A\u671B\u5E90\u5C71\u7011\u5E03\u300B - \u5510-\u674E\u767D",
  "\u9EC4\u6CB3\u4E4B\u6C34\u5929\u4E0A\u6765\uFF0C\u5954\u6D41\u5230\u6D77\u4E0D\u590D\u56DE\u3002": "\u51FA\u81EA\u300A\u5C06\u8FDB\u9152\u300B - \u5510-\u674E\u767D",
  "\u957F\u98CE\u51E0\u4E07\u91CC\uFF0C\u5439\u5EA6\u7389\u95E8\u5173\u3002": "\u51FA\u81EA\u300A\u5173\u5C71\u6708\u300B - \u5510-\u674E\u767D",
  "\u5B64\u5E06\u8FDC\u5F71\u78A7\u7A7A\u5C3D\uFF0C\u552F\u89C1\u957F\u6C5F\u5929\u9645\u6D41\u3002": "\u51FA\u81EA\u300A\u9EC4\u9E64\u697C\u9001\u5B5F\u6D69\u7136\u4E4B\u5E7F\u9675\u300B - \u5510-\u674E\u767D",
  "\u661F\u5782\u5E73\u91CE\u9614\uFF0C\u6708\u6D8C\u5927\u6C5F\u6D41\u3002": "\u51FA\u81EA\u300A\u65C5\u591C\u4E66\u6000\u300B - \u5510-\u675C\u752B",
  "\u91CE\u65F7\u5929\u4F4E\u6811\uFF0C\u6C5F\u6E05\u6708\u8FD1\u4EBA\u3002": "\u51FA\u81EA\u300A\u5BBF\u5EFA\u5FB7\u6C5F\u300B - \u5510-\u5B5F\u6D69\u7136",
  "\u5927\u6F20\u5B64\u70DF\u76F4\uFF0C\u957F\u6CB3\u843D\u65E5\u5706\u3002": "\u51FA\u81EA\u300A\u4F7F\u81F3\u585E\u4E0A\u300B - \u5510-\u738B\u7EF4",
  "\u6708\u4E0B\u98DE\u5929\u955C\uFF0C\u4E91\u751F\u7ED3\u6D77\u697C\u3002": "\u51FA\u81EA\u300A\u6E21\u8346\u95E8\u9001\u522B\u300B - \u5510-\u674E\u767D",
  "\u4E24\u5CB8\u9752\u5C71\u76F8\u5BF9\u51FA\uFF0C\u5B64\u5E06\u4E00\u7247\u65E5\u8FB9\u6765\u3002": "\u51FA\u81EA\u300A\u671B\u5929\u95E8\u5C71\u300B - \u5510-\u674E\u767D",
  "\u5C71\u968F\u5E73\u91CE\u5C3D\uFF0C\u6C5F\u5165\u5927\u8352\u6D41\u3002": "\u51FA\u81EA\u300A\u6E21\u8346\u95E8\u9001\u522B\u300B - \u5510-\u674E\u767D",
  "\u5929\u63A5\u4E91\u6D9B\u8FDE\u6653\u96FE\uFF0C\u661F\u6CB3\u6B32\u8F6C\u5343\u5E06\u821E\u3002": "\u51FA\u81EA\u300A\u6E14\u5BB6\u50B2\xB7\u5929\u63A5\u4E91\u6D9B\u8FDE\u6653\u96FE\u300B - \u5B8B-\u674E\u6E05\u7167",
  "\u6B32\u628A\u897F\u6E56\u6BD4\u897F\u5B50\uFF0C\u6DE1\u5986\u6D53\u62B9\u603B\u76F8\u5B9C\u3002": "\u51FA\u81EA\u300A\u996E\u6E56\u4E0A\u521D\u6674\u540E\u96E8\u300B - \u5B8B-\u82CF\u8F7C",
  "\u65E5\u7167\u9999\u7089\u751F\u7D2B\u70DF\uFF0C\u9065\u770B\u7011\u5E03\u6302\u524D\u5DDD\u3002": "\u51FA\u81EA\u300A\u671B\u5E90\u5C71\u7011\u5E03\u300B - \u5510-\u674E\u767D",
  "\u5929\u95E8\u4E2D\u65AD\u695A\u6C5F\u5F00\uFF0C\u78A7\u6C34\u4E1C\u6D41\u81F3\u6B64\u56DE\u3002": "\u51FA\u81EA\u300A\u671B\u5929\u95E8\u5C71\u300B - \u5510-\u674E\u767D",
  "\u6C14\u84B8\u4E91\u68A6\u6CFD\uFF0C\u6CE2\u64BC\u5CB3\u9633\u57CE\u3002": "\u51FA\u81EA\u300A\u671B\u6D1E\u5EAD\u6E56\u8D60\u5F20\u4E1E\u76F8\u300B - \u5510-\u5B5F\u6D69\u7136",
  "\u6E56\u5149\u79CB\u6708\u4E24\u76F8\u548C\uFF0C\u6F6D\u9762\u65E0\u98CE\u955C\u672A\u78E8\u3002": "\u51FA\u81EA\u300A\u671B\u6D1E\u5EAD\u300B - \u5510-\u5218\u79B9\u9521",
  "\u4E91\u60F3\u8863\u88F3\u82B1\u60F3\u5BB9\uFF0C\u6625\u98CE\u62C2\u69DB\u9732\u534E\u6D53\u3002": "\u51FA\u81EA\u300A\u6E05\u5E73\u8C03\xB7\u5176\u4E00\u300B - \u5510-\u674E\u767D",
  "\u82E5\u975E\u7FA4\u7389\u5C71\u5934\u89C1\uFF0C\u4F1A\u5411\u7476\u53F0\u6708\u4E0B\u9022\u3002": "\u51FA\u81EA\u300A\u6E05\u5E73\u8C03\xB7\u5176\u4E00\u300B - \u5510-\u674E\u767D",
  "\u4E0D\u77E5\u5929\u4E0A\u5BAB\u9619\uFF0C\u4ECA\u5915\u662F\u4F55\u5E74\u3002": "\u51FA\u81EA\u300A\u6C34\u8C03\u6B4C\u5934\xB7\u660E\u6708\u51E0\u65F6\u6709\u300B - \u5B8B-\u82CF\u8F7C",
  "\u6CA7\u6D77\u6708\u660E\u73E0\u6709\u6CEA\uFF0C\u84DD\u7530\u65E5\u6696\u7389\u751F\u70DF\u3002": "\u51FA\u81EA\u300A\u9526\u745F\u300B - \u5510-\u674E\u5546\u9690",
  "\u6D77\u4E0A\u751F\u660E\u6708\uFF0C\u5929\u6DAF\u5171\u6B64\u65F6\u3002": "\u51FA\u81EA\u300A\u671B\u6708\u6000\u8FDC\u300B - \u5510-\u5F20\u4E5D\u9F84",
  "\u6625\u6C5F\u6F6E\u6C34\u8FDE\u6D77\u5E73\uFF0C\u6D77\u4E0A\u660E\u6708\u5171\u6F6E\u751F\u3002": "\u51FA\u81EA\u300A\u6625\u6C5F\u82B1\u6708\u591C\u300B - \u5510-\u5F20\u82E5\u865A",
  "\u4E00\u9053\u6B8B\u9633\u94FA\u6C34\u4E2D\uFF0C\u534A\u6C5F\u745F\u745F\u534A\u6C5F\u7EA2\u3002": "\u51FA\u81EA\u300A\u66AE\u6C5F\u541F\u300B - \u5510-\u767D\u5C45\u6613",
  "\u767B\u9AD8\u58EE\u89C2\u5929\u5730\u95F4\uFF0C\u5927\u6C5F\u832B\u832B\u53BB\u4E0D\u8FD8\u3002": "\u51FA\u81EA\u300A\u5E90\u5C71\u8C23\u5BC4\u5362\u4F8D\u5FA1\u865A\u821F\u300B - \u5510-\u674E\u767D",
  "\u6625\u7720\u4E0D\u89C9\u6653\uFF0C\u5904\u5904\u95FB\u557C\u9E1F\u3002": "\u51FA\u81EA\u300A\u6625\u6653\u300B - \u5510-\u5B5F\u6D69\u7136",
  "\u4E24\u4E2A\u9EC4\u9E42\u9E23\u7FE0\u67F3\uFF0C\u4E00\u884C\u767D\u9E6D\u4E0A\u9752\u5929\u3002": "\u51FA\u81EA\u300A\u7EDD\u53E5\u300B - \u5510-\u675C\u752B",
  "\u63A5\u5929\u83B2\u53F6\u65E0\u7A77\u78A7\uFF0C\u6620\u65E5\u8377\u82B1\u522B\u6837\u7EA2\u3002": "\u51FA\u81EA\u300A\u6653\u51FA\u51C0\u6148\u5BFA\u9001\u6797\u5B50\u65B9\u300B - \u5B8B-\u6768\u4E07\u91CC",
  "\u5C0F\u8377\u624D\u9732\u5C16\u5C16\u89D2\uFF0C\u65E9\u6709\u873B\u8713\u7ACB\u4E0A\u5934\u3002": "\u51FA\u81EA\u300A\u5C0F\u6C60\u300B - \u5B8B-\u6768\u4E07\u91CC",
  "\u7B49\u95F2\u8BC6\u5F97\u4E1C\u98CE\u9762\uFF0C\u4E07\u7D2B\u5343\u7EA2\u603B\u662F\u6625\u3002": "\u51FA\u81EA\u300A\u6625\u65E5\u300B - \u5B8B-\u6731\u71B9",
  "\u7AF9\u5916\u6843\u82B1\u4E09\u4E24\u679D\uFF0C\u6625\u6C5F\u6C34\u6696\u9E2D\u5148\u77E5\u3002": "\u51FA\u81EA\u300A\u60E0\u5D07\u6625\u6C5F\u665A\u666F\u300B - \u5B8B-\u82CF\u8F7C",
  "\u6CBE\u8863\u6B32\u6E7F\u674F\u82B1\u96E8\uFF0C\u5439\u9762\u4E0D\u5BD2\u6768\u67F3\u98CE\u3002": "\u51FA\u81EA\u300A\u7EDD\u53E5\u300B - \u5B8B-\u5FD7\u5357",
  "\u7EFF\u6811\u6751\u8FB9\u5408\uFF0C\u9752\u5C71\u90ED\u5916\u659C\u3002": "\u51FA\u81EA\u300A\u8FC7\u6545\u4EBA\u5E84\u300B - \u5510-\u5B5F\u6D69\u7136",
  "\u78A7\u7389\u5986\u6210\u4E00\u6811\u9AD8\uFF0C\u4E07\u6761\u5782\u4E0B\u7EFF\u4E1D\u7EE6\u3002": "\u51FA\u81EA\u300A\u548F\u67F3\u300B - \u5510-\u8D3A\u77E5\u7AE0",
  "\u6E2D\u57CE\u671D\u96E8\u6D65\u8F7B\u5C18\uFF0C\u5BA2\u820D\u9752\u9752\u67F3\u8272\u65B0\u3002": "\u51FA\u81EA\u300A\u6E2D\u57CE\u66F2\u300B - \u5510-\u738B\u7EF4",
  "\u6653\u770B\u7EA2\u6E7F\u5904\uFF0C\u82B1\u91CD\u9526\u5B98\u57CE\u3002": "\u51FA\u81EA\u300A\u6625\u591C\u559C\u96E8\u300B - \u5510-\u675C\u752B",
  "\u660E\u6708\u677E\u95F4\u7167\uFF0C\u6E05\u6CC9\u77F3\u4E0A\u6D41\u3002": "\u51FA\u81EA\u300A\u5C71\u5C45\u79CB\u669D\u300B - \u5510-\u738B\u7EF4",
  "\u7A7A\u5C71\u65B0\u96E8\u540E\uFF0C\u5929\u6C14\u665A\u6765\u79CB\u3002": "\u51FA\u81EA\u300A\u5C71\u5C45\u79CB\u669D\u300B - \u5510-\u738B\u7EF4",
  "\u9EC4\u6885\u65F6\u8282\u5BB6\u5BB6\u96E8\uFF0C\u9752\u8349\u6C60\u5858\u5904\u5904\u86D9\u3002": "\u51FA\u81EA\u300A\u7EA6\u5BA2\u300B - \u5B8B-\u8D75\u5E08\u79C0",
  "\u5929\u8857\u5C0F\u96E8\u6DA6\u5982\u9165\uFF0C\u8349\u8272\u9065\u770B\u8FD1\u5374\u65E0\u3002": "\u51FA\u81EA\u300A\u65E9\u6625\u5448\u6C34\u90E8\u5F20\u5341\u516B\u5458\u5916\u300B - \u5510-\u97E9\u6108",
  "\u8349\u957F\u83BA\u98DE\u4E8C\u6708\u5929\uFF0C\u62C2\u5824\u6768\u67F3\u9189\u6625\u70DF\u3002": "\u51FA\u81EA\u300A\u6751\u5C45\u300B - \u6E05-\u9AD8\u9F0E",
  "\u6885\u5B50\u9EC4\u65F6\u65E5\u65E5\u6674\uFF0C\u5C0F\u6EAA\u6CDB\u5C3D\u5374\u5C71\u884C\u3002": "\u51FA\u81EA\u300A\u4E09\u8862\u9053\u4E2D\u300B - \u5B8B-\u66FE\u51E0",
  "\u5FFD\u5982\u4E00\u591C\u6625\u98CE\u6765\uFF0C\u5343\u6811\u4E07\u6811\u68A8\u82B1\u5F00\u3002": "\u51FA\u81EA\u300A\u767D\u96EA\u6B4C\u9001\u6B66\u5224\u5B98\u5F52\u4EAC\u300B - \u5510-\u5C91\u53C2",
  "\u513F\u7AE5\u6025\u8D70\u8FFD\u9EC4\u8776\uFF0C\u98DE\u5165\u83DC\u82B1\u65E0\u5904\u5BFB\u3002": "\u51FA\u81EA\u300A\u5BBF\u65B0\u5E02\u5F90\u516C\u5E97\u300B - \u5B8B-\u6768\u4E07\u91CC",
  "\u5C0F\u5A03\u6491\u5C0F\u8247\uFF0C\u5077\u91C7\u767D\u83B2\u56DE\u3002": "\u51FA\u81EA\u300A\u6C60\u4E0A\u300B - \u5510-\u767D\u5C45\u6613",
  "\u8DEF\u4EBA\u501F\u95EE\u9065\u62DB\u624B\uFF0C\u6015\u5F97\u9C7C\u60CA\u4E0D\u5E94\u4EBA\u3002": "\u51FA\u81EA\u300A\u5C0F\u513F\u5782\u9493\u300B - \u5510-\u80E1\u4EE4\u80FD",
  "\u7267\u7AE5\u9A91\u9EC4\u725B\uFF0C\u6B4C\u58F0\u632F\u6797\u6A3E\u3002": "\u51FA\u81EA\u300A\u6240\u89C1\u300B - \u6E05-\u8881\u679A",
  "\u84EC\u5934\u7A1A\u5B50\u5B66\u5782\u7EB6\uFF0C\u4FA7\u5750\u8393\u82D4\u8349\u6620\u8EAB\u3002": "\u51FA\u81EA\u300A\u5C0F\u513F\u5782\u9493\u300B - \u5510-\u80E1\u4EE4\u80FD",
  "\u7AE5\u5B59\u672A\u89E3\u4F9B\u8015\u7EC7\uFF0C\u4E5F\u508D\u6851\u9634\u5B66\u79CD\u74DC\u3002": "\u51FA\u81EA\u300A\u590F\u65E5\u7530\u56ED\u6742\u5174\xB7\u5176\u4E03\u300B - \u5B8B-\u8303\u6210\u5927",
  "\u968F\u98CE\u6F5C\u5165\u591C\uFF0C\u6DA6\u7269\u7EC6\u65E0\u58F0\u3002": "\u51FA\u81EA\u300A\u6625\u591C\u559C\u96E8\u300B - \u5510-\u675C\u752B",
  "\u843D\u7EA2\u4E0D\u662F\u65E0\u60C5\u7269\uFF0C\u5316\u4F5C\u6625\u6CE5\u66F4\u62A4\u82B1\u3002": "\u51FA\u81EA\u300A\u5DF1\u4EA5\u6742\u8BD7\xB7\u5176\u4E94\u300B - \u6E05-\u9F9A\u81EA\u73CD",
  "\u4EBA\u95F2\u6842\u82B1\u843D\uFF0C\u591C\u9759\u6625\u5C71\u7A7A\u3002": "\u51FA\u81EA\u300A\u9E1F\u9E23\u6DA7\u300B - \u5510-\u738B\u7EF4",
  "\u91C7\u83CA\u4E1C\u7BF1\u4E0B\uFF0C\u60A0\u7136\u89C1\u5357\u5C71\u3002": "\u51FA\u81EA\u300A\u996E\u9152\xB7\u5176\u4E94\u300B - \u664B-\u9676\u6E0A\u660E",
  "\u884C\u5230\u6C34\u7A77\u5904\uFF0C\u5750\u770B\u4E91\u8D77\u65F6\u3002": "\u51FA\u81EA\u300A\u7EC8\u5357\u522B\u4E1A\u300B - \u5510-\u738B\u7EF4",
  "\u665A\u6765\u5929\u6B32\u96EA\uFF0C\u80FD\u996E\u4E00\u676F\u65E0\uFF1F": "\u51FA\u81EA\u300A\u95EE\u5218\u5341\u4E5D\u300B - \u5510-\u767D\u5C45\u6613",
  "\u6D77\u5185\u5B58\u77E5\u5DF1\uFF0C\u5929\u6DAF\u82E5\u6BD4\u90BB\u3002": "\u51FA\u81EA\u300A\u9001\u675C\u5C11\u5E9C\u4E4B\u4EFB\u8700\u5DDE\u300B - \u5510-\u738B\u52C3",
  "\u6843\u82B1\u6F6D\u6C34\u6DF1\u5343\u5C3A\uFF0C\u4E0D\u53CA\u6C6A\u4F26\u9001\u6211\u60C5\u3002": "\u51FA\u81EA\u300A\u8D60\u6C6A\u4F26\u300B - \u5510-\u674E\u767D",
  "\u529D\u541B\u66F4\u5C3D\u4E00\u676F\u9152\uFF0C\u897F\u51FA\u9633\u5173\u65E0\u6545\u4EBA\u3002": "\u51FA\u81EA\u300A\u6E2D\u57CE\u66F2\u300B - \u5510-\u738B\u7EF4",
  "\u83AB\u6101\u524D\u8DEF\u65E0\u77E5\u5DF1\uFF0C\u5929\u4E0B\u8C01\u4EBA\u4E0D\u8BC6\u541B\u3002": "\u51FA\u81EA\u300A\u522B\u8463\u5927\u300B - \u5510-\u9AD8\u9002",
  "\u6545\u4EBA\u897F\u8F9E\u9EC4\u9E64\u697C\uFF0C\u70DF\u82B1\u4E09\u6708\u4E0B\u626C\u5DDE\u3002": "\u51FA\u81EA\u300A\u9EC4\u9E64\u697C\u9001\u5B5F\u6D69\u7136\u4E4B\u5E7F\u9675\u300B - \u5510-\u674E\u767D",
  "\u6211\u5BC4\u6101\u5FC3\u4E0E\u660E\u6708\uFF0C\u968F\u541B\u76F4\u5230\u591C\u90CE\u897F\u3002": "\u51FA\u81EA\u300A\u95FB\u738B\u660C\u9F84\u5DE6\u8FC1\u9F99\u6807\u9065\u6709\u6B64\u5BC4\u300B - \u5510-\u674E\u767D"
};
const completionPoemsEnglish = [
  "Small steps can carry you farther than you think.",
  "A curious mind can open a thousand doors.",
  "The sky is wide enough for every dream.",
  "Let your questions lead you to new places.",
  "The morning light is a quiet promise to begin again.",
  "A kind word can make a heavy day feel light.",
  "Every page you read adds a window to the world.",
  "The stars are far away, but wonder brings them close.",
  "Keep going; the path becomes clearer with each step.",
  "A little courage can turn a tiny idea into an adventure.",
  "Good friends make ordinary moments shine.",
  "The world is full of stories waiting for your voice.",
  "A bright idea can begin with a quiet question.",
  "The best journeys often start with one brave step.",
  "Clouds drift above us, carrying dreams across the sky.",
  "There is a new wonder hiding in every morning.",
  "Your imagination is a map to places no one else can see.",
  "A patient heart can hear the music in small moments.",
  "The moon makes room for every shining star.",
  "When you learn something new, the world grows wider.",
  "A gentle breeze can turn a page and begin a story.",
  "The smallest seed already knows how to reach the light.",
  "You can be both a learner and an explorer.",
  "Every mistake is a footprint on the road to knowing.",
  "A question is a key that opens the next adventure.",
  "Sunlight finds its way through even the smallest window.",
  "A thoughtful word can travel farther than a loud one.",
  "The river keeps moving, teaching the stones about time.",
  "Dreams grow stronger when you give them a little courage.",
  "The world listens when you speak with a kind heart.",
  "A book can take you farther than any pair of shoes.",
  "Rain writes silver stories on every window.",
  "Your next discovery may be waiting just around the corner.",
  "The quietest moment can hold the biggest idea.",
  "A smile is a small sun you can carry anywhere.",
  "The horizon is an invitation, not a finish line.",
  "Each new word is a tiny bridge to someone else.",
  "Stars remind us that small lights still matter.",
  "A good question can turn an ordinary day into an expedition.",
  "Keep your eyes open; wonder is everywhere.",
  "The wind has no map, yet it always finds a way forward.",
  "Kindness makes a little room for everyone to shine.",
  "You do not need to know everything to begin exploring.",
  "A clear thought can brighten a cloudy afternoon.",
  "Every page is a door, and every word is a key.",
  "The trees stand still, but their stories keep growing.",
  "A new day is a fresh line in your own story.",
  "The courage to try is already a kind of success.",
  "One good idea can light up a whole room.",
  "The sea keeps its secrets for curious listeners.",
  "A friend who shares your wonder makes the road brighter.",
  "Let your mind wander, then bring back something beautiful.",
  "The path may be small, but it can lead to a wide world.",
  "Learning is a garden that grows one question at a time.",
  "A calm breath can make space for a clever thought.",
  "The future begins with what you choose to notice today.",
  "Every kind act leaves a little light behind.",
  "You are never too small to make a difference.",
  "The next page is waiting for the story you will write.",
  "A hopeful heart can find a path through the unknown."
];
const completionPoemSourcesEnglish = completionPoemsEnglish.reduce((sources, poem) => {
  sources[poem] = "\u51FA\u5904\uFF1A\u539F\u521B\u82F1\u6587\u53E5\u5B50";
  return sources;
}, {});
let state = loadState();
const DIAGNOSTICS_KEY = "momo-diagnostics-v1";
const DIAGNOSTIC_TYPES = ["catalog_error", "audio_error", "page_error", "promise_error"];
let diagnosticEvents = readDiagnostics();
let diagnosticsMemoryOnly = false;
let catalogFailed = false;
let catalogRequestId = 0;
let dictationAnalyticsSessionId = null;
let dictationAnalyticsCompleted = false;
let dictationAnalyticsModules = [];
let moduleVisitId = null;
const CATEGORY_MODULES = { "\u8FD1\u4E49\u8BCD": "synonyms", "\u53CD\u4E49\u8BCD": "antonyms", "\u8868\u793A\u58F0\u97F3\u7684\u8BCD\u8BED": "sound", "\u8868\u793A\u65F6\u95F4\u77ED\u7684\u8BCD\u8BED": "short_time", "\u4E00\u4EC0\u4E48\u4E0D\u4EC0\u4E48\u5F0F\u8BCD\u8BED": "pattern" };
function selectedAnalyticsModules() {
  return [...new Set(practiceEntries(getSelectedLessons()).flatMap((entry) => entry.item ? ["knowledge", CATEGORY_MODULES[entry.item.category] || "knowledge_other"] : [getLessonSubject(entry.lesson) === "\u82F1\u8BED" ? "english" : "chinese"]))];
}
function reportModuleSelection() {
  if (!ENABLE_DICTATION_ANALYTICS) return;
  const modules = selectedAnalyticsModules();
  if (!modules.length) return;
  moduleVisitId || (moduleVisitId = createAnalyticsSessionId());
  sendAnalyticsEvent("select", moduleVisitId, modules);
}
function sendAnalyticsEvent(eventName, sid, modules) {
  const url = `${APP_BASE_PATH}/__events/${eventName}?sid=${sid}&modules=${encodeURIComponent(modules.join(","))}`;
  try {
    Promise.resolve(fetch(url, { cache: "no-store", keepalive: true })).catch(() => {
    });
  } catch (e) {
  }
}
function createAnalyticsSessionId() {
  const bytes = new Uint8Array(16);
  try {
    if (!window.crypto || !window.crypto.getRandomValues) throw new Error("Secure random unavailable");
    window.crypto.getRandomValues(bytes);
  } catch (e) {
    for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  }
  bytes[6] = bytes[6] & 15 | 64;
  bytes[8] = bytes[8] & 63 | 128;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
function reportDictationEvent(eventName) {
  if (!ENABLE_DICTATION_ANALYTICS || !dictationAnalyticsSessionId) return;
  sendAnalyticsEvent(eventName, dictationAnalyticsSessionId, dictationAnalyticsModules);
}
function diagnosticEnvironment() {
  const ua = navigator.userAgent || "";
  return {
    device: /iPhone|iPad|iPod/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : "desktop/other",
    browser: /MicroMessenger/.test(ua) ? "WeChat" : /Edg/.test(ua) ? "Edge" : /Chrome|CriOS/.test(ua) ? "Chrome" : /Firefox|FxiOS/.test(ua) ? "Firefox" : /Safari/.test(ua) ? "Safari" : "other",
    secure: window.isSecureContext === true,
    site: IS_LOCAL_PARENT ? "local" : window.location.hostname.endsWith(".github.io") ? "github" : "cloud/other"
  };
}
function safeDiagnostics(events) {
  if (!Array.isArray(events)) return [];
  const now = Date.now();
  return events.filter((e) => e && DIAGNOSTIC_TYPES.includes(e.type) && Number.isFinite(Date.parse(e.time)) && now - Date.parse(e.time) >= 0 && now - Date.parse(e.time) < 7 * 864e5).slice(-50).map((e) => ({
    time: new Date(e.time).toISOString(),
    type: e.type,
    version: /^\d{1,6}$/.test(String(e.version)) ? String(e.version) : "unknown",
    screen: ["setup", "lessons", "lesson-detail", "dictation", "result", "home"].includes(e.screen) ? e.screen : "unknown",
    courses: Array.isArray(e.courses) ? e.courses.filter((id) => typeof id === "string" && /^[\w-]{1,80}$/.test(id)).slice(0, 20) : [],
    entry: Number.isInteger(e.entry) && e.entry >= 0 && e.entry < 1e4 ? e.entry : null,
    status: Number.isInteger(e.status) && e.status >= 100 && e.status <= 599 ? e.status : null,
    line: Number.isInteger(e.line) && e.line >= 0 && e.line < 1e5 ? e.line : null
  }));
}
function readDiagnostics(fallback = []) {
  try {
    return safeDiagnostics(JSON.parse(localStorage.getItem(DIAGNOSTICS_KEY) || "[]"));
  } catch (e) {
    return fallback;
  }
}
function persistDiagnostics() {
  try {
    localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify(diagnosticEvents));
    diagnosticsMemoryOnly = false;
  } catch (e) {
    diagnosticsMemoryOnly = true;
  }
}
function recordDiagnostic(type, details = {}) {
  if (!DIAGNOSTIC_TYPES.includes(type)) return;
  diagnosticEvents = safeDiagnostics([...diagnosticsMemoryOnly ? diagnosticEvents : readDiagnostics(diagnosticEvents), {
    time: (/* @__PURE__ */ new Date()).toISOString(),
    type,
    version: APP_VERSION,
    screen: state.screen,
    courses: state.selectedLessonIds,
    entry: "entry" in details ? details.entry : state.currentIndex,
    status: details.status,
    line: details.line
  }]);
  persistDiagnostics();
}
function diagnosticReport() {
  diagnosticEvents = safeDiagnostics(diagnosticsMemoryOnly ? diagnosticEvents : readDiagnostics(diagnosticEvents));
  persistDiagnostics();
  return JSON.stringify({
    product: "\u5C0F\u5C0F\u542C\u5199\u5458",
    version: APP_VERSION,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    environment: diagnosticEnvironment(),
    events: diagnosticEvents
  }, null, 2);
}
function prepareDiagnostics() {
  const report = diagnosticReport();
  const field = document.querySelector("#diagnostics-text");
  if (field) field.value = report;
  return report;
}
async function copyDiagnostics() {
  var _a2;
  const panel = document.querySelector("#diagnostics-panel");
  if (panel) panel.open = true;
  const report = prepareDiagnostics();
  const status = document.querySelector("#diagnostics-status");
  try {
    if (!window.isSecureContext || !((_a2 = navigator.clipboard) == null ? void 0 : _a2.writeText)) throw new Error("manual-copy");
    await navigator.clipboard.writeText(report);
    if (status) status.textContent = "\u5DF2\u590D\u5236\uFF0C\u8BF7\u53D1\u7ED9\u5DE5\u5177\u4F5C\u8005\uFF0C\u5E76\u8865\u5145\u9047\u5230\u7684\u95EE\u9898\u3002";
  } catch (e) {
    const field = document.querySelector("#diagnostics-text");
    field == null ? void 0 : field.focus();
    field == null ? void 0 : field.select();
    if (status) status.textContent = "\u8BF7\u957F\u6309\u4E0B\u65B9\u6587\u5B57\u5168\u9009\u3001\u590D\u5236\uFF0C\u624B\u52A8\u53D1\u7ED9\u5DE5\u5177\u4F5C\u8005\u3002";
  }
}
function clearDiagnostics() {
  var _a2;
  try {
    (_a2 = localStorage.removeItem) == null ? void 0 : _a2.call(localStorage, DIAGNOSTICS_KEY);
  } catch (e) {
  }
  diagnosticEvents = [];
  persistDiagnostics();
  prepareDiagnostics();
  const status = document.querySelector("#diagnostics-status");
  if (status) status.textContent = diagnosticsMemoryOnly ? "\u672C\u9875\u8BB0\u5F55\u5DF2\u6E05\u7A7A\uFF1B\u6D4F\u89C8\u5668\u5B58\u50A8\u4E0D\u53EF\u7528\uFF0C\u5982\u6709\u65E7\u8BB0\u5F55\u8BF7\u6E05\u9664\u6B64\u7AD9\u70B9\u7684\u6D4F\u89C8\u5668\u6570\u636E\u3002" : "\u672C\u673A\u8BCA\u65AD\u8BB0\u5F55\u5DF2\u6E05\u7A7A\u3002";
}
(_a = window.addEventListener) == null ? void 0 : _a.call(window, "error", (event) => recordDiagnostic("page_error", { line: event.lineno }));
(_b = window.addEventListener) == null ? void 0 : _b.call(window, "unhandledrejection", () => recordDiagnostic("promise_error"));
(_c = window.addEventListener) == null ? void 0 : _c.call(window, "storage", (event) => {
  if (event.key === DIAGNOSTICS_KEY || event.key === null) {
    diagnosticEvents = readDiagnostics();
    diagnosticsMemoryOnly = false;
    const field = document.querySelector("#diagnostics-text");
    if (field) field.value = diagnosticReport();
  }
});
persistDiagnostics();
let speechTimer = null;
let audioPlayer = null;
let audioObjectUrl = null;
let audioContext = null;
let audioSourceNode = null;
let audioContextUnlocked = false;
let playbackToken = 0;
let screenWakeLock = null;
let wakeLockPending = false;
let wakeLockUnavailable = false;
function needsScreenAwake() {
  return state.screen === "dictation" && state.started && !state.paused && document.visibilityState === "visible";
}
function updateWakeLockHint() {
  const hint = document.querySelector("#wake-lock-hint");
  if (hint) {
    hint.hidden = !wakeLockUnavailable || !needsScreenAwake();
    hint.textContent = "\u65E0\u6CD5\u4FDD\u6301\u5C4F\u5E55\u5E38\u4EAE\uFF0C\u8BF7\u6682\u65F6\u5173\u95ED\u81EA\u52A8\u9501\u5C4F\u3002";
  }
}
async function syncScreenWakeLock() {
  updateWakeLockHint();
  if (!needsScreenAwake()) {
    const lock = screenWakeLock;
    screenWakeLock = null;
    if (lock) {
      try {
        await lock.release();
      } catch (e) {
      }
    }
    return;
  }
  if (screenWakeLock || wakeLockPending) return;
  if (!window.isSecureContext || !navigator.wakeLock) {
    wakeLockUnavailable = true;
    updateWakeLockHint();
    return;
  }
  wakeLockPending = true;
  try {
    const lock = await navigator.wakeLock.request("screen");
    if (!needsScreenAwake()) {
      await lock.release();
      return;
    }
    screenWakeLock = lock;
    wakeLockUnavailable = lock.released;
    lock.addEventListener("release", () => {
      if (screenWakeLock !== lock) return;
      screenWakeLock = null;
      wakeLockUnavailable = true;
      updateWakeLockHint();
    });
    if (lock.released) screenWakeLock = null;
  } catch (e) {
    wakeLockUnavailable = true;
  } finally {
    wakeLockPending = false;
    updateWakeLockHint();
  }
}
document.addEventListener("visibilitychange", syncScreenWakeLock);
function loadState() {
  try {
    const saved = __spreadValues(__spreadValues({}, defaultState), JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
    return saved;
  } catch (e) {
    return __spreadValues({}, defaultState);
  }
}
function saveState() {
  var _a2;
  const persist = { history: state.history, lastLesson: ((_a2 = state.lesson) == null ? void 0 : _a2.id) || null };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
}
function setScreen(screen) {
  state.screen = screen;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
const chineseNumberValues = { \u4E00: 1, \u4E8C: 2, \u4E09: 3, \u56DB: 4, \u4E94: 5, \u516D: 6, \u4E03: 7, \u516B: 8, \u4E5D: 9, \u5341: 10 };
function lessonNumber(text) {
  var _a2;
  const value = (_a2 = String(text || "").match(/[一二三四五六七八九十]+/u)) == null ? void 0 : _a2[0];
  if (!value) return null;
  if (value.length === 1) return chineseNumberValues[value] || null;
  if (value === "\u5341") return 10;
  if (value.startsWith("\u5341")) return 10 + (chineseNumberValues[value[1]] || 0);
  if (value.endsWith("\u5341")) return (chineseNumberValues[value[0]] || 0) * 10;
  return (chineseNumberValues[value[0]] || 0) * 10 + (chineseNumberValues[value[2]] || 0);
}
function getLessonSubject(lesson) {
  return (lesson == null ? void 0 : lesson.subject) === "\u82F1\u8BED" ? "\u82F1\u8BED" : "\u8BED\u6587";
}
function getAudioSource(audioEntry, voice = "us") {
  if (typeof audioEntry === "string") return audioEntry;
  if (!audioEntry || typeof audioEntry !== "object") return null;
  return typeof audioEntry[voice] === "string" ? audioEntry[voice] : null;
}
function getAllLessons() {
  return remoteLessons.map((lesson, index) => ({ lesson, index })).sort((a, b) => {
    const subjectOrder = (getLessonSubject(a.lesson) === "\u82F1\u8BED") - (getLessonSubject(b.lesson) === "\u82F1\u8BED");
    if (subjectOrder) return subjectOrder;
    const aIsGarden = /^语文园地/u.test(a.lesson.label || "");
    const bIsGarden = /^语文园地/u.test(b.lesson.label || "");
    const aIsLesson = /第[一二三四五六七八九十]+课/u.test(a.lesson.label || "");
    const bIsLesson = /第[一二三四五六七八九十]+课/u.test(b.lesson.label || "");
    if (aIsGarden !== bIsGarden) return aIsGarden ? -1 : 1;
    if (aIsLesson !== bIsLesson) return aIsLesson ? -1 : 1;
    const aNumber = lessonNumber(a.lesson.label);
    const bNumber = lessonNumber(b.lesson.label);
    if (aNumber !== null && bNumber !== null && aNumber !== bNumber) return bNumber - aNumber;
    return a.index - b.index;
  }).map(({ lesson }) => lesson);
}
function getLesson(id) {
  return getAllLessons().find((item) => item.id === id) || null;
}
function getSelectedLessons() {
  return getAllLessons().filter((lesson) => state.selectedLessonIds.includes(lesson.id));
}
function updateSelectedLessonIds(id, checked) {
  if (!checked) return state.selectedLessonIds.filter((item) => item !== id);
  const selectedLesson = getLesson(id);
  if (!selectedLesson) return state.selectedLessonIds;
  if (selectedLesson.contentKind === "knowledge") return [id];
  const subject = getLessonSubject(selectedLesson);
  return [.../* @__PURE__ */ new Set([...state.selectedLessonIds.filter((item) => {
    const lesson = getLesson(item);
    return lesson && lesson.contentKind !== "knowledge" && getLessonSubject(lesson) === subject;
  }), id])];
}
function buildSession() {
  var _a2, _b2, _c2, _d2, _e2, _f2, _g2;
  const lessons = getSelectedLessons();
  const seen = /* @__PURE__ */ new Set();
  const wordMetadata = {};
  let items = [];
  for (const lesson of lessons) {
    if (lesson.contentKind === "knowledge") {
      for (const question of lesson.items || []) {
        if (!knowledgeCategorySelected(lesson, question.category)) continue;
        const reverse = question.kind === "pair" && Math.random() >= 0.5;
        const word = reverse ? question.answer : question.prompt;
        const metadata = {
          lessonId: lesson.id,
          subject: "\u8BED\u6587",
          questionId: question.id,
          category: question.category,
          kind: question.kind,
          answer: reverse ? question.prompt : question.answer,
          answerAudio: (_a2 = lesson.audio) == null ? void 0 : _a2[reverse ? question.prompt : question.answer],
          directPair: question.kind === "pair" && state.showWordDefault,
          pairAudio: (_b2 = lesson.audio) == null ? void 0 : _b2[`${word}\uFF0C${question.category}\uFF0C${reverse ? question.prompt : question.answer}\u3002`],
          questionAudio: (_c2 = lesson.audio) == null ? void 0 : _c2[`${word}\u7684${question.category}\u662F\u4EC0\u4E48\uFF1F`],
          categoryAudio: (_d2 = lesson.audio) == null ? void 0 : _d2[question.category],
          audio: (_e2 = lesson.audio) == null ? void 0 : _e2[word],
          directWord: question.kind === "dictation" && RECALL_CATEGORIES.includes(question.category)
        };
        items.push({ word, metadata });
      }
      continue;
    }
    for (const word of lesson.words) {
      if (seen.has(word)) continue;
      seen.add(word);
      const metadata = { lessonId: lesson.id, subject: getLessonSubject(lesson), meaning: ((_f2 = lesson.meaning) == null ? void 0 : _f2[word]) || "", audio: ((_g2 = lesson.audio) == null ? void 0 : _g2[word]) || null };
      items.push({ word, metadata });
      wordMetadata[word] = metadata;
    }
  }
  if (state.drawEnabled) {
    items = items.map((item) => ({ item, sort: Math.random() })).sort((a, b) => a.sort - b.sort).slice(0, Math.max(1, Math.round(items.length * state.drawRatio))).map(({ item }) => item);
  } else if (state.orderMode === "random") {
    items = items.map((item) => ({ item, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ item }) => item);
  }
  if (!state.showWordDefault) items = groupRecallItems(items);
  state.lesson = {
    id: lessons.map((lesson) => lesson.id).join("+"),
    displayTitle: lessons.map(formatLessonTitle).join("\u3001"),
    label: lessons.map((lesson) => lesson.label).join("\u3001"),
    title: lessons.map((lesson) => lesson.title).join("\u3001"),
    subject: [...new Set(lessons.map(getLessonSubject))].join("\u3001"),
    audio: Object.keys(wordMetadata).reduce((audio, word) => {
      audio[word] = wordMetadata[word].audio;
      return audio;
    }, {}),
    wordMetadata
  };
  state.selectedWords = items.map(({ word }) => word);
  state.selectedItemMetadata = items.map(({ metadata }) => metadata);
}
function groupRecallItems(items) {
  var _a2, _b2;
  const groups = /* @__PURE__ */ new Map();
  const result = [];
  for (const item of items) {
    if (!item.metadata.directWord) {
      result.push(item);
      continue;
    }
    const key = JSON.stringify([item.metadata.lessonId, item.metadata.category]);
    let group = groups.get(key);
    if (!group) {
      group = { word: "", metadata: __spreadProps(__spreadValues({}, item.metadata), { kind: "recall", answers: [], answerAudios: [], questionAudio: null }) };
      groups.set(key, group);
      result.push(group);
    }
    group.metadata.answers.push(item.word);
    group.metadata.answerAudios.push(item.metadata.audio);
  }
  for (const group of groups.values()) {
    const metadata = group.metadata;
    metadata.count = metadata.answers.length;
    metadata.answer = metadata.answers.join("\u3001");
    group.word = `\u8BF7\u9ED8\u5199${metadata.count}\u4E2A${metadata.category}\u3002`;
    metadata.questionAudio = (_b2 = (_a2 = getLesson(metadata.lessonId)) == null ? void 0 : _a2.audio) == null ? void 0 : _b2[group.word];
  }
  return result;
}
function getSessionWordMetadata(word, index = state.currentIndex) {
  var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2;
  const metadata = (_a2 = state.selectedItemMetadata) == null ? void 0 : _a2[index];
  if (metadata && state.selectedWords[index] === word) return metadata;
  return ((_c2 = (_b2 = state.lesson) == null ? void 0 : _b2.wordMetadata) == null ? void 0 : _c2[word]) || { subject: (_d2 = state.lesson) == null ? void 0 : _d2.subject, meaning: ((_f2 = (_e2 = state.lesson) == null ? void 0 : _e2.meaning) == null ? void 0 : _f2[word]) || "", audio: (_h2 = (_g2 = state.lesson) == null ? void 0 : _g2.audio) == null ? void 0 : _h2[word] };
}
function getCompletionAudio() {
  var _a2;
  return ((_a2 = state.lesson) == null ? void 0 : _a2.subject) === "\u82F1\u8BED" ? ENGLISH_COMPLETION_AUDIO : COMPLETION_AUDIO;
}
function lessonTitleParts(lesson) {
  let label = String(lesson.label || "").trim();
  let title = String(lesson.title || "").trim();
  if (getLessonSubject(lesson) === "\u82F1\u8BED") {
    const unit = label.match(/^Unit\s*(\d+)$/i);
    const titleUnit = title.match(/^Unit\s*(\d+)(?:\s*[-–—·]\s*|$)/i);
    if (unit) label = `Unit ${Number(unit[1])}`;
    if (unit && titleUnit && Number(unit[1]) === Number(titleUnit[1])) {
      title = title.slice(titleUnit[0].length).trim();
    }
  }
  return { label, title };
}
function formatLessonTitle(lesson) {
  const { label, title } = lessonTitleParts(lesson);
  if (label === title) return label;
  const separator = getLessonSubject(lesson) === "\u82F1\u8BED" && /^Unit \d+$/.test(label) ? " - " : " \xB7 ";
  return [label, title].filter(Boolean).join(separator);
}
function isSentenceLesson(lesson) {
  return getLessonSubject(lesson) === "\u82F1\u8BED" && /(?:^|[-–—·])\s*find(?:ing)? the rules?\s*$/i.test((lesson == null ? void 0 : lesson.title) || "");
}
const sentenceSegmenter = typeof Intl.Segmenter === "function" ? new Intl.Segmenter("en", { granularity: "sentence" }) : null;
function sentenceCount(text) {
  if (sentenceSegmenter) return [...sentenceSegmenter.segment(text)].filter((part) => part.segment.trim()).length;
  return (String(text).match(/[^.!?]+(?:[.!?]+|$)/g) || []).filter((part) => part.trim()).length;
}
function contentEntries(lessons) {
  const entries = /* @__PURE__ */ new Map();
  for (const lesson of lessons) {
    if (lesson.contentKind === "knowledge") {
      for (const item of lesson.items || []) {
        entries.set(JSON.stringify([lesson.id, item.id]), { text: `${item.category}\uFF1A${item.prompt}${item.kind === "pair" ? ` \u2194 ${item.answer}` : ""}`, lesson, item });
      }
      continue;
    }
    for (const text of lesson.words || []) {
      if (!entries.has(text)) entries.set(text, { text, lesson });
    }
  }
  return [...entries.values()];
}
function knowledgeCategorySelected(lesson, category) {
  var _a2;
  return !(((_a2 = state.excludedKnowledgeCategories) == null ? void 0 : _a2[lesson.id]) || []).includes(category);
}
function practiceEntries(lessons) {
  return contentEntries(lessons).filter((entry) => !entry.item || knowledgeCategorySelected(entry.lesson, entry.item.category));
}
function renderKnowledgeCategories(lessons) {
  return lessons.filter((lesson) => lesson.contentKind === "knowledge").map((lesson) => `<div class="confirm-section knowledge-categories"><strong>${escapeHtml(formatLessonTitle(lesson))} \xB7 \u9009\u62E9\u5206\u7C7B</strong><div class="order-options">${[...new Set(lesson.items.map((item) => item.category))].map((category) => `<label><input type="checkbox" data-knowledge-category="${escapeHtml(category)}" data-knowledge-lesson="${escapeHtml(lesson.id)}" ${knowledgeCategorySelected(lesson, category) ? "checked" : ""}> ${escapeHtml(category)}\uFF08${lesson.items.filter((item) => item.category === category).length} ${["\u8FD1\u4E49\u8BCD", "\u53CD\u4E49\u8BCD"].includes(category) ? "\u7EC4" : "\u4E2A"}\uFF09</label>`).join("")}</div></div>`).join("");
}
function knowledgePlayback(metadata) {
  if (metadata.directPair) return { first: null, last: metadata.pairAudio, gap: 0 };
  if (metadata.kind === "pair" || metadata.kind === "recall") return { first: null, last: metadata.questionAudio, gap: 0 };
  if (metadata.directWord) return { first: null, last: metadata.audio, gap: 0 };
  return { first: metadata.categoryAudio, last: metadata.audio, gap: 0.45 };
}
function questionInstruction(metadata) {
  if (metadata.kind === "recall") return `\u8BF7\u9ED8\u5199${metadata.count}\u4E2A${metadata.category}`;
  return metadata.kind === "pair" ? metadata.directPair ? "\u8BF7\u542C\u5199\u8FD9\u7EC4\u8BCD\u8BED" : `\u8BF7\u5199\u51FA${metadata.category}` : `\u8BF7\u5199\u4E0B\u4F60\u542C\u5230\u7684${currentContentNoun()}`;
}
function sessionEntries() {
  return state.selectedWords.map((text, index) => {
    const metadata = getSessionWordMetadata(text, index);
    return { text, lesson: getLesson(metadata.lessonId) || state.lesson || {} };
  });
}
function entryNoun({ text, lesson }) {
  if (lesson.contentKind === "knowledge") return "\u9898\u76EE";
  if (isSentenceLesson(lesson)) return /[?？]/.test(text) && sentenceCount(text) > 1 ? "\u5BF9\u8BDD" : "\u53E5\u5B50";
  return getLessonSubject(lesson) === "\u82F1\u8BED" ? "\u5355\u8BCD" : "\u8BCD\u8BED";
}
function contentNoun(entries) {
  const nouns = new Set(entries.map(entryNoun));
  if (nouns.size && [...nouns].every((noun) => noun === "\u5BF9\u8BDD" || noun === "\u53E5\u5B50")) return "\u53E5\u5B50";
  return nouns.size === 1 ? [...nouns][0] : "\u5185\u5BB9";
}
function formatContentCount(entries) {
  const sentences = entries.filter(({ lesson }) => isSentenceLesson(lesson));
  const englishWords = entries.filter(({ lesson }) => getLessonSubject(lesson) === "\u82F1\u8BED" && !isSentenceLesson(lesson));
  const questions = entries.filter(({ lesson }) => lesson.contentKind === "knowledge").length;
  const chineseWords = entries.length - sentences.length - englishWords.length - questions;
  const parts = [];
  if (questions) parts.push(`${questions} \u9053\u9898`);
  if (chineseWords) parts.push(`${chineseWords} \u4E2A\u8BCD\u8BED`);
  if (englishWords.length) parts.push(`${englishWords.length} \u4E2A\u5355\u8BCD`);
  if (sentences.length) {
    const count = sentences.reduce((total, { text }) => total + sentenceCount(text), 0);
    const allDialogues = sentences.every((entry) => entryNoun(entry) === "\u5BF9\u8BDD");
    parts.push(`${count} \u53E5\u8BDD${allDialogues ? `\uFF08${sentences.length} \u7EC4\u5BF9\u8BDD\uFF09` : count > sentences.length ? `\uFF08${sentences.length} \u6761\u5185\u5BB9\uFF09` : ""}`);
  }
  return parts.join("\u3001") || "0 \u6761\u5185\u5BB9";
}
function currentContentNoun() {
  return entryNoun(sessionEntries()[state.currentIndex] || { text: "", lesson: state.lesson || {} });
}
function unitCount(lessons) {
  return new Set(lessons.map((lesson) => `${lesson.grade}|${lessonTitleParts(lesson).label}`)).size;
}
function escapeHtml(value) {
  return String(value != null ? value : "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}
function formatEnglishMeaning(value) {
  const meanings = String(value != null ? value : "").split(/[；;]/u).map((item) => item.trim()).filter(Boolean).slice(0, 2);
  return meanings.length ? `\u89E3\u91CA\uFF1A${meanings.join("\uFF1B")}` : "";
}
function render() {
  const app = document.querySelector("#app");
  const screens = { home: renderSetup, lessons: renderLessons, "lesson-detail": renderLessonDetail, setup: renderSetup, dictation: renderDictation, result: renderResult };
  app.innerHTML = screens[state.screen]();
  bindEvents();
  void syncScreenWakeLock();
}
function getHomeContent() {
  var _a2;
  const available = remoteLessons.filter((lesson) => Array.isArray(lesson.words) && lesson.words.length);
  const history = Array.isArray(state.history) ? state.history : [];
  const recentSets = history.slice().reverse().map((session) => {
    const ids = typeof (session == null ? void 0 : session.lesson) === "string" ? session.lesson.split("+") : [];
    const lessons = ids.map((id) => available.find((lesson) => lesson.id === id));
    return lessons.length && lessons.every(Boolean) && new Set(lessons.map(getLessonSubject)).size === 1 ? lessons : [];
  }).filter((lessons) => lessons.length);
  const subject = ["\u8BED\u6587", "\u82F1\u8BED"].includes(state.homeSubject) ? state.homeSubject : getLessonSubject(((_a2 = recentSets[0]) == null ? void 0 : _a2[0]) || available[0]);
  const courses = available.filter((lesson) => getLessonSubject(lesson) === subject);
  const recent = recentSets.find((lessons) => getLessonSubject(lessons[0]) === subject);
  return { subject, courses, featured: recent || courses.slice(0, 1), isRecent: Boolean(recent) };
}
function renderHome() {
  const { subject, courses, featured, isRecent } = getHomeContent();
  const entries = contentEntries(featured);
  const others = courses.filter((lesson) => !featured.some((item) => item.id === lesson.id)).slice(0, 3);
  return `<section class="view home-view" aria-labelledby="home-title">
    <div class="home-heading"><div><h1 id="home-title">\u4ECA\u5929\u7EC3\u4EC0\u4E48\uFF1F</h1><p>\u9009\u597D\u5185\u5BB9\uFF0C\u628A\u6717\u8BFB\u4EA4\u7ED9\u5C0F\u5C0F\u542C\u5199\u5458\u3002</p></div>
      <div class="home-subjects" role="group" aria-label="\u9009\u62E9\u542C\u5199\u79D1\u76EE">${["\u8BED\u6587", "\u82F1\u8BED"].map((item) => `<button type="button" class="home-subject${item === subject ? " is-active" : ""}" data-action="select-home-subject" data-subject="${item}" aria-pressed="${item === subject}">${item}</button>`).join("")}</div>
    </div>
    <div class="home-content">
      ${featured.length ? `<article class="home-practice" aria-label="${escapeHtml(featured.map(formatLessonTitle).join("\u3001"))}">
        <div class="home-practice-meta"><span class="home-status">${isRecent ? "\u6700\u8FD1\u7EC3\u8FC7" : "\u53EF\u9009\u8BFE\u7A0B"}</span><span>${escapeHtml([...new Set(featured.map((lesson) => lesson.grade).filter(Boolean))].join("\u3001"))} ${subject}</span></div>
        <div class="home-course-titles">${featured.map((lesson) => {
    const { label, title } = lessonTitleParts(lesson);
    return `<div>${label && title && label !== title ? `<p class="home-unit">${escapeHtml(label)}</p>` : ""}<h2${subject === "\u82F1\u8BED" ? ' lang="en"' : ""}>${escapeHtml(title || label)}</h2></div>`;
  }).join("")}</div>
        <p class="home-course-count">${formatContentCount(entries)}</p>
        <div class="home-preview" aria-label="\u5185\u5BB9\u9884\u89C8">${entries.slice(0, 2).map(({ text, lesson }, index) => {
    const dialogue = isSentenceLesson(lesson) && String(text).match(/^(.+?[?？])\s*(.+)$/u);
    const preview = dialogue ? `${escapeHtml(dialogue[1])}<br>${escapeHtml(dialogue[2])}` : escapeHtml(text);
    return `<div class="preview-line${subject === "\u82F1\u8BED" ? " english-row" : ""}"><span class="preview-number">${String(index + 1).padStart(2, "0")}</span><span class="preview-word${subject === "\u82F1\u8BED" ? " english-text" : ""}"${subject === "\u82F1\u8BED" ? ' lang="en"' : ""}>${preview}</span></div>`;
  }).join("")}</div>
        <div class="home-practice-actions"><button class="button button-primary" data-action="home-start">${isRecent ? "\u518D\u7EC3\u4E00\u6B21" : "\u5F00\u59CB\u542C\u5199"}</button><button class="button button-quiet" data-action="home-choose">\u6362\u4E00\u8BFE</button></div>
        <p class="home-action-note">\u5F00\u59CB\u524D\uFF0C\u53EF\u4EE5\u8C03\u6574\u8303\u56F4\u548C\u64AD\u653E\u8282\u594F</p>
      </article>` : `<div class="home-practice home-empty"><span class="home-status">${subject}</span><h2>\u8BFE\u7A0B\u8FD8\u5728\u51C6\u5907\u4E2D</h2><p>\u6682\u65F6\u6CA1\u6709${subject}\u5185\u5BB9\uFF0C\u53EF\u4EE5\u5207\u6362\u79D1\u76EE\u770B\u770B\u3002<br>\u53D1\u5E03\u540E\u7684\u8BFE\u7A0B\u4F1A\u81EA\u52A8\u51FA\u73B0\u5728\u8FD9\u91CC\u3002</p></div>`}
      <section class="home-library" aria-labelledby="home-library-title"><div class="home-library-heading"><h2 id="home-library-title">\u9009\u62E9\u5176\u4ED6\u5185\u5BB9</h2>${courses.length ? '<button class="button button-quiet" data-action="home-choose">\u5168\u90E8\u8BFE\u7A0B</button>' : ""}</div>
        <div class="home-course-list">${others.length ? others.map((lesson) => `<button class="home-course-row" data-action="view-lesson" data-id="${escapeHtml(lesson.id)}"><span><strong>${escapeHtml(formatLessonTitle(lesson))}</strong><small>${escapeHtml(lesson.grade || "")} \xB7 ${formatContentCount(contentEntries([lesson]))}</small></span><span class="home-course-chevron" aria-hidden="true">\u203A</span></button>`).join("") : `<p class="home-library-empty">${courses.length ? "\u5DF2\u7ECF\u663E\u793A\u5168\u90E8\u8BFE\u7A0B\uFF0C\u8BD5\u8BD5\u53E6\u4E00\u79D1\u5427\u3002" : "\u6709\u65B0\u8BFE\u7A0B\u65F6\uFF0C\u8FD9\u91CC\u4F1A\u540C\u6B65\u66F4\u65B0\u3002"}</p>`}</div>
        <div class="home-tip"><strong>\u51C6\u5907\u597D\u7EB8\u548C\u7B14</strong><p>\u5F00\u59CB\u540E\u4F1A\u81EA\u52A8\u6717\u8BFB\uFF0C\u542C\u5199\u65F6\u968F\u65F6\u53EF\u4EE5\u6682\u505C\u6216\u91CD\u64AD\u3002</p></div>
      </section>
    </div>
    <p class="home-privacy">\u65E0\u9700\u767B\u5F55\uFF0C\u7EC3\u4E60\u8BB0\u5F55\u53EA\u4FDD\u5B58\u5728\u8FD9\u53F0\u8BBE\u5907</p>
  </section>`;
}
function renderLessons() {
  const allLessons = getAllLessons();
  return `<section class="view section-view">
    <div class="section-heading"><div><p class="eyebrow">\u9009\u62E9\u4ECA\u5929\u7684\u5185\u5BB9</p><h2>\u4ECE\u4E00\u8BFE\u5F00\u59CB</h2></div><button class="button button-quiet" data-action="home">\u8FD4\u56DE\u542C\u5199\u8BBE\u7F6E</button></div>
    <div class="lesson-grid">${allLessons.length ? allLessons.map((lesson) => `<button class="lesson-card" data-action="view-lesson" data-id="${lesson.id}">
      <div class="lesson-card-meta"><span>${lesson.grade} \xB7 <b class="subject-label">${getLessonSubject(lesson)}</b></span><span>${lesson.review ? "\u9519\u9898\u590D\u4E60" : lesson.custom ? "\u521A\u521A\u5BFC\u5165" : "\u6559\u6750\u5185\u5BB9"}</span></div>
      <h3>${escapeHtml(lessonTitleParts(lesson).label)}</h3><p>${escapeHtml(lessonTitleParts(lesson).title)}</p>
      <div class="lesson-card-footer"><span>${formatContentCount(contentEntries([lesson]))}</span><span>\u67E5\u770B\u5185\u5BB9 \xB7</span></div>
    </button>`).join("") : '<div class="empty-library">\u6682\u65F6\u6CA1\u6709\u53EF\u7528\u5185\u5BB9\uFF0C\u8BF7\u5148\u7531 Admin \u53D1\u5E03\u3002</div>'}</div>
    <div class="hero-note"><span class="hero-note-mark"></span><span>\u5185\u5BB9\u7531\u5C0F\u5C0F\u542C\u5199\u5458\u7EDF\u4E00\u51C6\u5907\uFF0C\u5BB6\u957F\u6253\u5F00\u5C31\u80FD\u5F00\u59CB</span></div>
  </section>`;
}
function renderLessonDetail() {
  const lesson = getLesson(state.viewingLessonId);
  if (!lesson) return renderLessons();
  const noun = contentNoun(contentEntries([lesson]));
  return `<section class="view detail-view">
    <div class="section-heading"><div><p class="eyebrow">${getLessonSubject(lesson)} \xB7 \u5185\u5BB9\u8BE6\u60C5</p><h2>${escapeHtml(lessonTitleParts(lesson).label)}</h2><p>${escapeHtml(lessonTitleParts(lesson).title)}</p></div><button class="button button-quiet" data-action="show-library">\u8FD4\u56DE\u5185\u5BB9\u5E93</button></div>
    <div class="detail-card">
      <div class="detail-card-header"><div><span class="detail-kicker">${getLessonSubject(lesson)} \xB7 ${lesson.grade}</span><h3>${escapeHtml(lessonTitleParts(lesson).title || lessonTitleParts(lesson).label)}</h3></div><span class="card-stamp">${formatContentCount(contentEntries([lesson]))}</span></div>
      <p class="detail-intro">\u672C\u6B21\u542C\u5199\u5C06\u4F7F\u7528\u4E0B\u9762\u8FD9\u4E9B${noun}\u3002\u786E\u8BA4\u5185\u5BB9\u65E0\u8BEF\u540E\uFF0C\u518D\u5F00\u59CB\u542C\u5199\u3002</p>
      <ol class="detail-word-list">${contentEntries([lesson]).map(({ text }, index) => `<li${getLessonSubject(lesson) === "\u82F1\u8BED" ? ' class="english-row"' : ""}><span>${String(index + 1).padStart(2, "0")}</span><strong${getLessonSubject(lesson) === "\u82F1\u8BED" ? ' class="english-text" lang="en"' : ""}>${escapeHtml(text)}</strong></li>`).join("")}</ol>
      <div class="detail-actions"><button class="button button-primary" data-action="start-lesson" data-id="${lesson.id}">\u5F00\u59CB\u542C\u5199</button><button class="button button-quiet" data-action="show-library">\u8FD4\u56DE\u5185\u5BB9\u5E93</button></div>
    </div>
  </section>`;
}
function renderIPhoneAudioHint() {
  if (!/iPhone/i.test(navigator.userAgent)) return "";
  return '<p class="iphone-audio-hint">iOS \u58F0\u97F3\u63D0\u9192\uFF1A\u9700\u5173\u95ED\u9759\u97F3\u6A21\u5F0F</p>';
}
function renderSetupLessonOptions(lessons) {
  const options = (items) => items.map((lesson) => `<label class="lesson-option"><input type="checkbox" data-lesson-toggle="${lesson.id}" ${state.selectedLessonIds.includes(lesson.id) ? "checked" : ""}><span><strong>${escapeHtml(formatLessonTitle(lesson))}</strong><small>${lesson.grade} \xB7 ${formatContentCount(contentEntries([lesson]))}</small></span></label>`).join("");
  const selected = lessons.filter((lesson) => state.selectedLessonIds.includes(lesson.id));
  const knowledge = lessons.filter((lesson) => lesson.contentKind === "knowledge" && !selected.some((item) => item.contentKind !== "knowledge"));
  const ordinary = lessons.filter((lesson) => lesson.contentKind !== "knowledge" && !selected.some((item) => item.contentKind === "knowledge"));
  const canSwitch = selected.length && lessons.some((lesson) => lesson.contentKind === "knowledge") && lessons.some((lesson) => lesson.contentKind !== "knowledge");
  return `${knowledge.length ? `<section class="knowledge-course-group" aria-label="\u77E5\u8BC6\u79EF\u7D2F\u8BFE\u7A0B"><div class="knowledge-group-heading"><strong>\u77E5\u8BC6\u79EF\u7D2F</strong><span>\u5355\u72EC\u7EC3\u4E60 \xB7 \u6BCF\u6B21\u9009\u4E00\u8BFE</span></div><p>\u9009\u4E2D\u540E\u53EA\u663E\u793A\u77E5\u8BC6\u79EF\u7D2F\uFF1B\u53D6\u6D88\u9009\u62E9\u6216\u5207\u6362\u8BFE\u7A0B\u7C7B\u578B\u53EF\u91CD\u65B0\u9009\u62E9\u3002</p><div class="lesson-options">${knowledge.map((lesson) => `${options([lesson])}${state.selectedLessonIds.includes(lesson.id) ? `<div class="knowledge-course-settings">${renderKnowledgeCategories([lesson])}${renderKnowledgePracticeOptions(practiceEntries([lesson]))}</div>` : ""}`).join("")}</div></section>` : ""}
    ${ordinary.length ? `${knowledge.length ? '<h3 class="ordinary-course-heading">\u666E\u901A\u542C\u5199 <small>\u53EF\u591A\u9009\u5408\u5E76</small></h3>' : ""}<div class="lesson-options">${options(ordinary)}</div>` : ""}
    ${canSwitch ? '<button type="button" class="button button-quiet" data-action="switch-course-type">\u5207\u6362\u8BFE\u7A0B\u7C7B\u578B</button>' : ""}`;
}
function renderKnowledgePracticeOptions(entries) {
  const hasRecall = entries.some((entry) => {
    var _a2;
    return ((_a2 = entry.item) == null ? void 0 : _a2.kind) === "dictation" && RECALL_CATEGORIES.includes(entry.item.category);
  });
  const hasPair = entries.some((entry) => {
    var _a2;
    return ((_a2 = entry.item) == null ? void 0 : _a2.kind) === "pair";
  });
  return `<section class="confirm-section knowledge-practice-options" aria-label="\u77E5\u8BC6\u79EF\u7D2F\u7EC3\u4E60\u65B9\u5F0F"><div class="playback-title"><strong>\u77E5\u8BC6\u79EF\u7D2F \xB7 \u7EC3\u4E60\u65B9\u5F0F</strong><span class="setting-recommendation">\u4E8C\u9009\u4E00</span></div>
    <div class="knowledge-mode-options">
      <label class="knowledge-mode-option"><input type="radio" name="word-display-mode" value="show" data-word-display-mode ${state.showWordDefault ? "checked" : ""}><span><strong>${hasRecall || hasPair ? "\u9010\u8BCD\u542C\u5199 \xB7 \u663E\u793A\u7B54\u6848" : "\u663E\u793A\u53C2\u8003\u7B54\u6848"}</strong><small>${hasRecall ? "\u58F0\u97F3\u3001\u65F6\u95F4\u77ED\u548C\u201C\u4E00\u4EC0\u4E48\u4E0D\u4EC0\u4E48\u201D\u5F0F\u8BCD\u8BED\uFF1A\u76F4\u63A5\u9010\u4E2A\u5FF5\u8BCD\u3002" : "\u8FB9\u7EC3\u4E60\u8FB9\u67E5\u770B\u53C2\u8003\u7B54\u6848\u3002"}${hasPair ? "\u8FD1\u4E49\u8BCD\u3001\u53CD\u4E49\u8BCD\u76F4\u63A5\u8BFB\u51FA\u4E24\u4E2A\u8BCD\uFF0C\u5982\u201C\u5FEB\u4E50\uFF0C\u8FD1\u4E49\u8BCD\uFF0C\u6109\u5FEB\u201D\u3002" : ""}</small></span></label>
      <label class="knowledge-mode-option"><input type="radio" name="word-display-mode" value="hide" data-word-display-mode ${!state.showWordDefault ? "checked" : ""}><span><strong>${hasRecall || hasPair ? "\u5206\u7C7B\u9ED8\u5199 \xB7 \u9690\u85CF\u7B54\u6848" : "\u9690\u85CF\u53C2\u8003\u7B54\u6848"}</strong><small>${hasRecall ? "\u58F0\u97F3\u3001\u65F6\u95F4\u77ED\u548C\u201C\u4E00\u4EC0\u4E48\u4E0D\u4EC0\u4E48\u201D\u5F0F\u8BCD\u8BED\uFF1A\u53EA\u5FF5\u4E00\u6B21\u201C\u8BF7\u9ED8\u5199 X \u4E2A\u2026\u201D\uFF1B\u4E0D\u5FF5\u5177\u4F53\u8BCD\u8BED\u3002" : "\u5148\u81EA\u5DF1\u4F5C\u7B54\uFF0C\u9700\u8981\u65F6\u518D\u663E\u793A\u7B54\u6848\u3002"}${hasPair ? "\u8FD1\u4E49\u8BCD\u3001\u53CD\u4E49\u8BCD\u9690\u85CF\u5BF9\u5E94\u7B54\u6848\u3002" : ""}</small></span></label>
    </div>
    ${hasPair ? '<p class="knowledge-mode-note">\u5206\u7C7B\u9ED8\u5199\u65F6\uFF0C\u8FD1\u4E49\u8BCD\u3001\u53CD\u4E49\u8BCD\u4F1A\u63D0\u95EE\uFF1B\u9898\u5E72\u8BCD\u59CB\u7EC8\u663E\u793A\u3002</p>' : ""}
    ${hasRecall ? '<p class="knowledge-mode-note">X \u6309\u672C\u6B21\u6240\u9009\u8BCD\u6570\u8BA1\u7B97\uFF0C\u62BD\u9ED8\u65F6\u6309\u62BD\u53D6\u6570\u91CF\u8BA1\u7B97\uFF1B\u4E66\u5199\u65F6\u95F4\u968F\u8BCD\u6570\u589E\u52A0\u3002</p>' : ""}
  </section>`;
}
function renderSetup() {
  const lessons = getAllLessons();
  const selected = getSelectedLessons();
  const subjects = [...new Set(lessons.map(getLessonSubject))];
  const selectedSubject = selected.length ? getLessonSubject(selected[0]) : null;
  const activeSubject = subjects.includes(state.setupSubject) ? state.setupSubject : selectedSubject || subjects[0] || "\u8BED\u6587";
  const visibleLessons = lessons.filter((lesson) => getLessonSubject(lesson) === activeSubject);
  const selectedSubjects = [...new Set(selected.map(getLessonSubject))];
  const entries = practiceEntries(selected);
  const noun = contentNoun(entries);
  const selectedCount = state.drawEnabled && entries.length ? `\u9884\u8BA1\u62BD\u53D6 ${Math.max(1, Math.round(entries.length * state.drawRatio))} \u6761\u5185\u5BB9` : formatContentCount(entries);
  const selectedSummary = (selectedSubject || activeSubject) === "\u82F1\u8BED" ? `\u5DF2\u9009 ${unitCount(selected)} \u4E2A Unit \xB7 ${selected.length} \u9879\u5185\u5BB9 \xB7 ${selectedCount}` : `\u5DF2\u9009 ${selected.length} \u4E2A\u8BED\u6587\u8BFE\u6B21 \xB7 ${selectedCount}`;
  return `<section class="view setup-view">
    ${catalogFailed ? '<p class="catalog-error" role="alert">\u8BFE\u7A0B\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u91CD\u8BD5\u3002\u4ECD\u6709\u95EE\u9898\u53EF\u5728\u9875\u5E95\u590D\u5236\u8BCA\u65AD\u4FE1\u606F\u3002<button class="button button-quiet" data-action="retry-catalog">\u91CD\u65B0\u52A0\u8F7D\u8BFE\u7A0B</button></p>' : ""}
    <div class="confirm-dialog" role="dialog" aria-labelledby="setup-title">
      <div class="setup-header"><p class="eyebrow">${selectedSubjects.length ? `${selectedSubjects.join(" \xB7 ")} \xB7 ` : ""}\u542C\u5199\u8BBE\u7F6E</p><h2 id="setup-title">\u786E\u8BA4\u4ECA\u5929\u542C\u4EC0\u4E48</h2><p class="lede">${activeSubject === "\u82F1\u8BED" ? "\u53EF\u4EE5\u540C\u65F6\u9009\u62E9\u591A\u4E2A Unit \u7684 Words \u6216 Find the rule\uFF0C\u5185\u5BB9\u4F1A\u81EA\u52A8\u5408\u5E76\u5E76\u53BB\u91CD\u3002" : "\u53EF\u4EE5\u540C\u65F6\u9009\u62E9\u591A\u8BFE\u6216\u591A\u4E2A\u8BED\u6587\u56ED\u5730\uFF0C\u666E\u901A\u8BCD\u8BED\u4F1A\u5408\u5E76\u53BB\u91CD\uFF1B\u77E5\u8BC6\u79EF\u7D2F\u6BCF\u6B21\u5355\u72EC\u9009\u4E00\u8BFE\u7EC3\u4E60\u3002"}</p></div>
      <div class="confirm-section"><div class="confirm-section-title"><strong>\u9009\u62E9\u8BFE\u7A0B</strong><span id="selected-lesson-summary">${selectedSummary}</span></div>
        <div class="lesson-tabs" role="tablist" aria-label="\u9009\u62E9\u79D1\u76EE">${subjects.map((subject) => `<button type="button" class="lesson-tab${subject === activeSubject ? " is-active" : ""}" data-action="select-setup-subject" data-subject="${subject}" role="tab" aria-selected="${subject === activeSubject}">${subject}<span>\uFF08${subject === "\u82F1\u8BED" ? `${unitCount(lessons.filter((lesson) => getLessonSubject(lesson) === subject))} \u4E2A Unit` : `${lessons.filter((lesson) => getLessonSubject(lesson) === subject).length}\u4E2A\u8BFE\u6B21`}\uFF09</span></button>`).join("")}</div>
        ${renderSetupLessonOptions(visibleLessons)}
      </div>
      <div class="confirm-section"><strong class="confirm-section-title-single">\u672C\u6B21\u542C\u5199\u8303\u56F4</strong><div class="draw-options"><label class="draw-option"><input type="radio" name="draw-mode" value="full" data-draw-mode ${!state.drawEnabled ? "checked" : ""}><span><strong>\u5168\u90E8\u542C\u5199\uFF08\u5168\u9ED8\uFF09</strong><small>\u6240\u9009${noun}\u5168\u90E8\u542C\u5199</small></span></label><label class="draw-option"><input type="radio" name="draw-mode" value="draw" data-draw-mode ${state.drawEnabled ? "checked" : ""}><span><strong>\u968F\u673A\u62BD\u53D6\uFF08\u62BD\u9ED8\uFF09</strong><small>\u53EA\u542C\u5199\u90E8\u5206${noun}</small></span></label></div>${state.drawEnabled ? `<label class="draw-ratio">\u62BD\u53D6\u6BD4\u4F8B<select data-draw-ratio><option value="0.25" ${state.drawRatio === 0.25 ? "selected" : ""}>25%</option><option value="0.5" ${state.drawRatio === 0.5 ? "selected" : ""}>50%</option><option value="0.75" ${state.drawRatio === 0.75 ? "selected" : ""}>75%</option></select></label>` : ""}</div>
      ${state.drawEnabled ? '<p class="draw-hint">\u62BD\u9ED8\u6309\u5B8C\u6574\u6761\u76EE\u968F\u673A\u9009\u62E9\uFF0C\u4E0D\u62C6\u5206\u95EE\u7B54\uFF1B\u4E0D\u518D\u4F7F\u7528\u8BFE\u7A0B\u987A\u5E8F\u8BBE\u7F6E\u3002</p>' : `<div class="confirm-section"><strong class="confirm-section-title-single">\u542C\u5199\u987A\u5E8F</strong><div class="order-options"><label><input type="radio" name="order-mode" value="default" data-order-mode ${state.orderMode === "default" ? "checked" : ""}> \u6309\u8BFE\u7A0B\u987A\u5E8F</label><label><input type="radio" name="order-mode" value="random" data-order-mode ${state.orderMode === "random" ? "checked" : ""}> \u968F\u673A\u987A\u5E8F</label></div></div>`}
      ${selected.some((lesson) => lesson.contentKind === "knowledge") ? "" : `<div class="confirm-section"><div class="playback-title"><strong class="confirm-section-title-single">${noun}\u663E\u793A</strong><span class="setting-recommendation">\u5F00\u59CB\u524D\u53EF\u9009\u62E9</span></div><div class="order-options"><label><input type="radio" name="word-display-mode" value="show" data-word-display-mode ${state.showWordDefault ? "checked" : ""}> \u9ED8\u8BA4\u663E\u793A</label><label><input type="radio" name="word-display-mode" value="hide" data-word-display-mode ${!state.showWordDefault ? "checked" : ""}> \u9690\u85CF${noun}</label></div></div>`}
      <div class="confirm-section playback-options"><div class="playback-title"><strong class="confirm-section-title-single">\u6A21\u5F0F\u9009\u62E9</strong><span class="setting-recommendation">\u9009\u4E00\u79CD\u8282\u594F\u5373\u53EF</span></div><p class="playback-description">\u542C\u5199\u5F00\u59CB\u540E\u4F1A\u81EA\u52A8\u64AD\u653E\uFF0C\u4E0D\u9700\u8981\u5BB6\u957F\u64CD\u4F5C\u3002</p><div class="playback-mode-options">${Object.entries(playbackModes).map(([mode, option]) => `<label class="playback-mode-option"><input type="radio" name="playback-mode" value="${mode}" data-playback-mode ${state.playbackMode === mode ? "checked" : ""}><span><strong>${option.label}</strong><small>${option.description}</small></span></label>`).join("")}</div></div>
      ${renderIPhoneAudioHint()}
      <div class="setup-actions"><span class="setup-hint">\u53EF\u4EE5\u5728\u542C\u5199\u9875\u6682\u505C\u3001\u91CD\u64AD\u6216\u8DF3\u8FC7\u5F53\u524D\u5185\u5BB9\u3002</span><button class="button button-primary" data-action="begin-dictation" ${entries.length ? "" : "disabled"}>\u786E\u8BA4\u5E76\u5F00\u59CB</button></div>
    </div>
    <button class="button button-quiet" data-action="show-library">\u6D4F\u89C8\u5185\u5BB9\u5E93</button>
  </section>`;
}
function renderDictation() {
  const word = state.selectedWords[state.currentIndex];
  const wordMetadata = getSessionWordMetadata(word);
  const isEnglish = wordMetadata.subject === "\u82F1\u8BED";
  const meaning = isEnglish ? formatEnglishMeaning(wordMetadata.meaning) : "";
  const showPair = wordMetadata.kind === "pair";
  const isRecall = wordMetadata.kind === "recall";
  const displayedWord = showPair ? `<span class="knowledge-pair-word"><small>\u5F53\u524D\u6717\u8BFB</small><span>${escapeHtml(word)}</span></span><span class="knowledge-pair-arrow" aria-hidden="true">\u2194</span><span class="knowledge-pair-word"><small>\u53C2\u8003\u7B54\u6848</small><span>${state.showWord ? escapeHtml(wordMetadata.answer) : "\uFF1F"}</span></span>` : isRecall ? `${escapeHtml(word)}${state.showWord ? `<p class="knowledge-result-answer">\u53C2\u8003\u7B54\u6848\uFF1A${escapeHtml(wordMetadata.answer)}</p>` : ""}` : state.showWord ? escapeHtml(word) : "\uFF1F";
  const total = state.selectedWords.length;
  const noun = currentContentNoun();
  const progressUnit = sessionEntries().every((entry) => entryNoun(entry) === "\u5BF9\u8BDD") ? "\u7EC4" : "\u6761";
  const isLast = state.currentIndex === total - 1;
  const status = state.paused ? "\u5DF2\u6682\u505C" : state.started ? "\u81EA\u52A8\u64AD\u653E\u4E2D" : "\u51C6\u5907\u5F00\u59CB";
  return `<section class="view dictation-view${isEnglish ? " dictation-view-english" : ""}">
    <div class="dictation-top"><div><p class="eyebrow">${escapeHtml(state.lesson.displayTitle || formatLessonTitle(state.lesson))}</p><span class="progress-copy">\u7B2C ${state.currentIndex + 1} ${progressUnit}\uFF0C\u5171 ${total} ${progressUnit}</span></div><div class="progress-bar"><div class="progress-fill" style="width:${(state.currentIndex + 1) / total * 100}%"></div></div></div>
    <div class="word-stage${isEnglish ? " word-stage-english" : ""}"><span class="stage-label">${status}</span><div class="stage-tile"><small>${wordMetadata.category ? `${escapeHtml(wordMetadata.category)} \xB7 ${escapeHtml(questionInstruction(wordMetadata))}` : state.showWord ? `\u5F53\u524D${noun}` : `\u8BF7\u5199\u4E0B\u4F60\u542C\u5230\u7684${noun}`}</small><div class="stage-word${showPair ? " stage-word-pair" : isRecall ? " stage-word-recall" : ""}${isEnglish ? ` stage-word-english${noun === "\u53E5\u5B50" || noun === "\u5BF9\u8BDD" ? " stage-word-sentence" : ""}` : ""}${state.showWord || showPair || isRecall ? "" : " stage-word-hidden"}">${displayedWord}</div>${state.showWord && meaning ? `<p class="stage-meaning"><strong>\u89E3\u91CA\uFF1A</strong>${escapeHtml(meaning.slice(3))}</p>` : ""}<p class="stage-status">${state.paused ? "\u70B9\u51FB\u201C\u7EE7\u7EED\u201D\u6062\u590D\u81EA\u52A8\u64AD\u653E" : isRecall ? `\u63D0\u793A\u53EA\u8BFB\u4E00\u904D \xB7 \u7559 ${recallWritingSeconds(wordMetadata)} \u79D2\u9ED8\u5199` : `\u6BCF\u6761\u5185\u5BB9\u8BFB ${state.wordRepeatCount + 1} \u904D \xB7 \u6BCF\u904D\u7ED3\u675F\u540E\u7B49\u5F85 ${state.wordIntervalSeconds} \u79D2`}</p></div></div>
    <div class="dictation-controls"><button class="button button-quiet" data-action="toggle-word">${state.showWord ? `\u9690\u85CF${showPair || isRecall ? "\u7B54\u6848" : noun}` : `\u663E\u793A${showPair || isRecall ? "\u7B54\u6848" : noun}`}</button><button class="button button-primary" data-action="speak">\u91CD\u64AD\u5F53\u524D${noun}</button><button class="button button-secondary" data-action="next">${isLast ? "\u5B8C\u6210\u542C\u5199" : isRecall ? "\u5199\u597D\u4E86\uFF0C\u4E0B\u4E00\u9898" : `\u8DF3\u8FC7\u5F53\u524D${noun}`}</button><button class="button button-quiet" data-action="pause">${state.paused ? "\u7EE7\u7EED\u64AD\u653E" : "\u6682\u505C"}</button></div>
    <p class="dictation-tip">\u542C\u5199\u4F1A\u81EA\u52A8\u64AD\u653E\uFF1B\u9700\u8981\u8C03\u6574\u8282\u594F\u65F6\uFF0C\u53EF\u4EE5\u6682\u505C\u6216\u91CD\u64AD\u5F53\u524D${noun}\u3002</p>
    ${renderIPhoneAudioHint()}
    <p id="wake-lock-hint" class="dictation-tip" hidden></p>
  </section>`;
}
function renderResult() {
  var _a2;
  const words = state.selectedWords;
  const entries = sessionEntries();
  const isEnglish = ((_a2 = state.lesson) == null ? void 0 : _a2.subject) === "\u82F1\u8BED";
  const poems = isEnglish ? completionPoemsEnglish : completionPoems;
  const sources = isEnglish ? completionPoemSourcesEnglish : completionPoemSources;
  const poem = poems[Math.floor(Math.random() * poems.length)];
  const poemWidthUnits = [...poem].reduce((width, character) => width + (character === " " ? 0.35 : /[A-Z]/.test(character) ? 0.7 : /[a-z]/.test(character) ? 0.6 : /[.,;:!?']/.test(character) ? 0.45 : 1), 0);
  const poemClass = `result-poem${isEnglish ? " result-poem-english" : ""}`;
  const poemStyle = isEnglish ? `--poem-width-units:${poemWidthUnits.toFixed(2)}` : `--poem-char-count:${[...poem].length}`;
  return `<section class="view result-view">
    <div class="result-hero"><div><p class="eyebrow">${isEnglish ? "Dictation complete" : "\u542C\u5199\u5B8C\u6210"}</p><h2 class="${poemClass}" style="${poemStyle}"${isEnglish ? ' lang="en"' : ""}>${poem}</h2>${isEnglish ? "" : `<p class="result-poem-source">${sources[poem] || ""}</p>`}</div></div>
    <div class="result-card"><h3>\u672C\u6B21\u542C\u5199${contentNoun(entries)}\uFF08${formatContentCount(entries)}\uFF09</h3><div class="result-list">${words.map((word, index) => {
    const metadata = getSessionWordMetadata(word, index);
    return `<button class="result-item${metadata.subject === "\u82F1\u8BED" ? " english-row" : ""}" data-action="result-speak" data-index="${index}" aria-label="\u8BD5\u542C${escapeHtml(word)}"><span class="result-number">${String(index + 1).padStart(2, "0")}</span><span class="result-item-word${metadata.subject === "\u82F1\u8BED" ? " english-text" : ""}"${metadata.subject === "\u82F1\u8BED" ? ' lang="en"' : ""}>${metadata.category ? `<small class="knowledge-result-category">${escapeHtml(metadata.category)}</small>` : ""}${escapeHtml(word)}${metadata.category ? `<small class="knowledge-result-answer">\u53C2\u8003\u7B54\u6848\uFF1A${escapeHtml(metadata.answer)}</small>` : ""}</span><span class="result-play" aria-hidden="true">\u25B6</span></button>`;
  }).join("")}</div></div>
    <div class="result-card"><div class="result-actions"><button class="button button-primary" data-action="finish-result">\u5B8C\u6210</button><button class="button button-secondary" data-action="replay-setup">\u518D\u542C\u4E00\u6B21</button></div></div>
  </section>`;
}
function bindEvents() {
  document.querySelectorAll("[data-knowledge-category]").forEach((element) => element.addEventListener("change", () => {
    var _a2;
    const id = element.dataset.knowledgeLesson;
    const excluded = new Set(((_a2 = state.excludedKnowledgeCategories) == null ? void 0 : _a2[id]) || []);
    if (element.checked) excluded.delete(element.dataset.knowledgeCategory);
    else excluded.add(element.dataset.knowledgeCategory);
    state.excludedKnowledgeCategories = __spreadProps(__spreadValues({}, state.excludedKnowledgeCategories), { [id]: [...excluded] });
    if (element.checked) reportModuleSelection();
    render();
  }));
  document.querySelectorAll("[data-action]").forEach((element) => element.addEventListener("click", () => handleAction(element.dataset.action, element.dataset)));
  document.querySelectorAll("[data-lesson-toggle]").forEach((element) => element.addEventListener("change", (event) => {
    const id = event.target.dataset.lessonToggle;
    state.selectedLessonIds = updateSelectedLessonIds(id, event.target.checked);
    if (event.target.checked) reportModuleSelection();
    render();
  }));
  document.querySelectorAll("[data-order-mode]").forEach((element) => element.addEventListener("change", (event) => {
    state.orderMode = event.target.value;
  }));
  document.querySelectorAll("[data-word-display-mode]").forEach((element) => element.addEventListener("change", (event) => {
    state.showWordDefault = event.target.value === "show";
  }));
  document.querySelectorAll("[data-draw-mode]").forEach((element) => element.addEventListener("change", (event) => {
    state.drawEnabled = event.target.value === "draw";
    render();
  }));
  document.querySelectorAll("[data-draw-ratio]").forEach((element) => element.addEventListener("change", (event) => {
    state.drawRatio = Number(event.target.value);
    render();
  }));
  document.querySelectorAll("[data-playback-mode]").forEach((element) => element.addEventListener("change", (event) => {
    const mode = playbackModes[event.target.value];
    if (!mode) return;
    state.playbackMode = event.target.value;
    state.wordIntervalSeconds = mode.intervalSeconds;
    state.wordRepeatCount = mode.repeatCount;
    render();
  }));
}
function handleAction(action, data = {}) {
  var _a2;
  if (action === "retry-catalog") {
    void loadRemoteCatalog();
    return;
  }
  if (action === "home") {
    stopPlayback();
    setScreen("setup");
    return;
  }
  if (action === "select-home-subject") {
    if (!["\u8BED\u6587", "\u82F1\u8BED"].includes(data.subject)) return;
    state.homeSubject = data.subject;
    render();
    (_a2 = document.querySelector(`.home-subject[data-subject="${data.subject}"]`)) == null ? void 0 : _a2.focus();
    return;
  }
  if (action === "home-start" || action === "home-choose") {
    const { subject, featured } = getHomeContent();
    if (action === "home-start" && !featured.length) return;
    stopPlayback();
    state.setupSubject = subject;
    state.selectedLessonIds = action === "home-start" ? featured.map((lesson) => lesson.id) : [];
    state.currentIndex = 0;
    setScreen("setup");
    return;
  }
  if (action === "switch-course-type") {
    state.selectedLessonIds = [];
    render();
    return;
  }
  if (action === "select-setup-subject") {
    state.setupSubject = data.subject;
    render();
    return;
  }
  if (action === "choose-lesson") {
    stopPlayback();
    state.selectedLessonIds = state.selectedLessonIds.length ? state.selectedLessonIds : getAllLessons()[0] ? [getAllLessons()[0].id] : [];
    setScreen("setup");
    return;
  }
  if (action === "show-library") {
    stopPlayback();
    setScreen("lessons");
    return;
  }
  if (action === "view-lesson") {
    if (!getLesson(data.id)) return;
    state.viewingLessonId = data.id;
    setScreen("lesson-detail");
    return;
  }
  if (action === "start-lesson" || action === "select-lesson") {
    if (!getLesson(data.id)) return;
    state.setupSubject = getLessonSubject(getLesson(data.id));
    state.selectedLessonIds = [data.id];
    state.orderMode = "default";
    state.currentIndex = 0;
    setScreen("setup");
    return;
  }
  if (action === "remove-word") {
    state.selectedWords.splice(Number(data.index), 1);
    render();
    return;
  }
  if (action === "begin-dictation") {
    beginDictation();
    return;
  }
  if (action === "speak") {
    speakCurrent();
    return;
  }
  if (action === "toggle-word") {
    state.showWord = !state.showWord;
    render();
    return;
  }
  if (action === "result-speak") {
    speakResultWord(Number(data.index));
    return;
  }
  if (action === "next") {
    nextWord();
    return;
  }
  if (action === "pause") {
    togglePlaybackPause();
    return;
  }
  if (action === "finish-result") {
    saveSession();
    showToast("\u5DF2\u4FDD\u5B58\u5230\u8FD9\u53F0\u8BBE\u5907");
    setTimeout(() => setScreen("setup"), 750);
    return;
  }
  if (action === "replay-setup") {
    stopPlayback();
    state.currentIndex = 0;
    state.showWord = state.showWordDefault;
    setScreen("setup");
    return;
  }
}
function beginDictation() {
  unlockAudioContext();
  buildSession();
  if (!state.selectedWords.length) return;
  dictationAnalyticsSessionId = ENABLE_DICTATION_ANALYTICS ? createAnalyticsSessionId() : null;
  dictationAnalyticsCompleted = false;
  dictationAnalyticsModules = selectedAnalyticsModules();
  reportModuleSelection();
  reportDictationEvent("start");
  state.currentIndex = 0;
  state.showWord = state.showWordDefault;
  state.currentRepeat = 0;
  state.started = true;
  state.paused = false;
  setScreen("dictation");
  speakCurrent();
}
async function speakResultWord(index) {
  const word = state.selectedWords[index];
  if (!word) return;
  const button = document.querySelector(`[data-action="result-speak"][data-index="${index}"]`);
  const icon = button == null ? void 0 : button.querySelector(".result-play");
  if (button == null ? void 0 : button.disabled) return;
  stopPlayback();
  const token = playbackToken;
  if (button) {
    button.disabled = true;
    if (icon) icon.textContent = "\u25CC";
  }
  const metadata = getSessionWordMetadata(word, index);
  const isEnglish = metadata.subject === "\u82F1\u8BED";
  const source = isEnglish ? getAudioSource(typeof metadata.audio === "object" ? metadata.audio : null) : getAudioSource(metadata.audio);
  try {
    if (metadata.category) {
      const question = knowledgePlayback(metadata);
      if (!question.last || !["pair", "recall"].includes(metadata.kind) && !metadata.directWord && !question.first) throw new Error("\u7F3A\u5C11\u9898\u76EE\u97F3\u9891");
      const answers = metadata.kind === "recall" ? metadata.answerAudios : metadata.kind === "pair" && !metadata.directPair ? [metadata.answerAudio] : [];
      if (!answers || answers.some((audio) => !getAudioSource(audio))) throw new Error("\u7F3A\u5C11\u7B54\u6848\u97F3\u9891");
      await playAudioSequence(question.last, token, question.first, question.gap, 1);
      for (const audio of answers) {
        if (token !== playbackToken) return;
        await playSingleAudio(getAudioSource(audio), token);
      }
      return;
    }
    if (isEnglish && !source) throw new Error("\u7F3A\u5C11\u7F8E\u5F0F\u53D1\u97F3\u97F3\u9891");
    if (source) {
      await playSingleAudio(source, token);
    } else {
      const response = await fetch(`${OCR_API}/api/speak?text=${encodeURIComponent(word)}`);
      if (!response.ok) throw new Error("\u97F3\u9891\u52A0\u8F7D\u5931\u8D25");
      const blobUrl = URL.createObjectURL(await response.blob());
      try {
        await playSingleAudio(blobUrl, token);
      } finally {
        URL.revokeObjectURL(blobUrl);
      }
    }
  } catch (e) {
    if (token === playbackToken) {
      if (metadata.category) {
        showToast("\u9898\u76EE\u97F3\u9891\u64AD\u653E\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
        return;
      }
      if (isEnglish) {
        showToast(source ? "\u64AD\u653E\u5931\u8D25\uFF1A\u7F8E\u5F0F\u53D1\u97F3\u97F3\u9891\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5" : "\u64AD\u653E\u5931\u8D25\uFF1A\u7F3A\u5C11\u7F8E\u5F0F\u53D1\u97F3\u97F3\u9891", { entry: index });
        return;
      }
      try {
        await speakWithBrowserVoice(word, token);
      } catch (e2) {
        if (token === playbackToken) showToast("\u64AD\u653E\u5931\u8D25\uFF0C\u8BF7\u70B9\u51FB\u9875\u9762\u540E\u91CD\u8BD5", { entry: index });
      }
    }
  } finally {
    if (button) {
      button.disabled = false;
      if (icon) icon.textContent = "\u25B6";
    }
  }
}
async function playSingleAudio(source, token) {
  const context = unlockAudioContext();
  if (!context) {
    await playAudioSource(source, token);
    return;
  }
  const response = await fetch(`${source}${source.includes("?") ? "&" : "?"}v=${APP_VERSION}`);
  if (!response.ok) throw new Error("\u97F3\u9891\u52A0\u8F7D\u5931\u8D25");
  const decoded = await context.decodeAudioData(await response.arrayBuffer());
  if (token !== playbackToken) return;
  await context.resume();
  await new Promise((resolve, reject) => {
    audioSourceNode = context.createBufferSource();
    audioSourceNode.buffer = decoded;
    audioSourceNode.connect(context.destination);
    audioSourceNode.onended = () => {
      audioSourceNode = null;
      resolve();
    };
    try {
      audioSourceNode.start();
    } catch (error) {
      audioSourceNode = null;
      reject(error);
    }
  });
}
async function speakCurrent() {
  const text = state.selectedWords[state.currentIndex];
  stopPlayback({ keepPaused: true });
  const token = playbackToken;
  state.paused = false;
  updatePlaybackUi("\u6B63\u5728\u64AD\u653E", `\u7B2C ${state.currentRepeat + 1} \u904D \xB7 \u8BF7\u5199\u4E0B\u4F60\u542C\u5230\u7684${currentContentNoun()}`);
  void syncScreenWakeLock();
  const metadata = getSessionWordMetadata(text);
  const isEnglish = metadata.subject === "\u82F1\u8BED";
  const cosAudio = isEnglish ? getAudioSource(typeof metadata.audio === "object" ? metadata.audio : null) : getAudioSource(metadata.audio);
  if (metadata.category) {
    updatePlaybackUi("\u6B63\u5728\u64AD\u653E", questionInstruction(metadata));
    try {
      const question = knowledgePlayback(metadata);
      if (!question.last || !["pair", "recall"].includes(metadata.kind) && !metadata.directWord && !question.first) throw new Error("\u7F3A\u5C11\u9898\u76EE\u97F3\u9891");
      const complete = await playAudioSequence(question.last, token, question.first, question.gap, metadata.kind === "recall" ? 1 : null);
      finishCurrentPlayback(token, complete);
    } catch (error) {
      if (token !== playbackToken) return;
      state.paused = true;
      render();
      updatePlaybackUi("\u64AD\u653E\u5931\u8D25", "\u9898\u76EE\u97F3\u9891\u4E0D\u53EF\u7528\uFF0C\u8BF7\u91CD\u8BD5");
      showToast("\u9898\u76EE\u97F3\u9891\u64AD\u653E\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
    }
    return;
  }
  if (isEnglish && (!cosAudio || !("Audio" in window))) {
    state.paused = true;
    render();
    updatePlaybackUi("\u64AD\u653E\u5931\u8D25", "\u7F3A\u5C11\u6216\u65E0\u6CD5\u64AD\u653E\u7F8E\u5F0F\u53D1\u97F3\u97F3\u9891");
    showToast(cosAudio ? "\u64AD\u653E\u5931\u8D25\uFF1A\u7F8E\u5F0F\u53D1\u97F3\u97F3\u9891\u65E0\u6CD5\u64AD\u653E" : "\u64AD\u653E\u5931\u8D25\uFF1A\u7F3A\u5C11\u7F8E\u5F0F\u53D1\u97F3\u97F3\u9891");
    return;
  }
  if (cosAudio && "Audio" in window) {
    try {
      const playedAsSequence = await playAudioSequence(cosAudio, token);
      finishCurrentPlayback(token, playedAsSequence);
      return;
    } catch (error) {
      if (token !== playbackToken) return;
      if (isEnglish) {
        state.paused = true;
        render();
        updatePlaybackUi("\u64AD\u653E\u5931\u8D25", "\u7F8E\u5F0F\u53D1\u97F3\u97F3\u9891\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
        showToast("\u64AD\u653E\u5931\u8D25\uFF1A\u7F8E\u5F0F\u53D1\u97F3\u97F3\u9891\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
        return;
      }
      showToast("\u8BFE\u7A0B\u97F3\u9891\u64AD\u653E\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u540E\u91CD\u8BD5");
      return;
    }
  }
  if (token !== playbackToken) return;
  try {
    const response = await fetch(`${OCR_API}/api/speak?text=${encodeURIComponent(text)}`);
    if (!response.ok) throw new Error("\u672C\u673A\u8BED\u97F3\u670D\u52A1\u4E0D\u53EF\u7528");
    const blob = await response.blob();
    if (token !== playbackToken) return;
    const blobUrl = URL.createObjectURL(blob);
    try {
      const playedAsSequence = await playAudioSequence(blobUrl, token);
      finishCurrentPlayback(token, playedAsSequence);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (e) {
    if (token === playbackToken) {
      await speakWithBrowserVoice(text, token);
      finishCurrentPlayback(token);
    }
  }
}
function playAudioSource(source, token, revokeSource = false) {
  return new Promise((resolve, reject) => {
    const cacheBustedSource = source.startsWith("http") || source.startsWith("blob:") ? source : `${source}${source.includes("?") ? "&" : "?"}v=28`;
    audioPlayer = new Audio(cacheBustedSource);
    audioObjectUrl = revokeSource ? source : null;
    audioPlayer.onended = () => {
      resolve();
    };
    audioPlayer.onerror = () => {
      stopAudio();
      reject(new Error("\u97F3\u9891\u52A0\u8F7D\u5931\u8D25"));
    };
    audioPlayer.play().catch(reject);
  });
}
function unlockAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) audioContext = new AudioContextClass();
  if (!audioContextUnlocked) {
    try {
      const silentBuffer = audioContext.createBuffer(1, 1, audioContext.sampleRate);
      const silentSource = audioContext.createBufferSource();
      silentSource.buffer = silentBuffer;
      silentSource.connect(audioContext.destination);
      silentSource.start(0);
      audioContextUnlocked = true;
    } catch (e) {
    }
  }
  if (audioContext.state === "suspended") audioContext.resume().catch(() => {
  });
  return audioContext;
}
async function playAudioSequence(source, token, prefix = null, gapSeconds = 0.45, repeatOverride = null) {
  const context = unlockAudioContext();
  if (!context) {
    if (prefix) {
      await playAudioSource(prefix, token);
      if (token !== playbackToken) return false;
      if (gapSeconds) await new Promise((resolve) => setTimeout(resolve, gapSeconds * 1e3));
      if (token !== playbackToken) return false;
    }
    await playAudioSource(source, token);
    return false;
  }
  const response = await fetch(`${source}${source.includes("?") ? "&" : "?"}v=46`);
  if (!response.ok) throw new Error("\u97F3\u9891\u52A0\u8F7D\u5931\u8D25");
  const encoded = await response.arrayBuffer();
  let decoded = await context.decodeAudioData(encoded.slice(0));
  if (prefix) {
    if (token !== playbackToken) return;
    const response2 = await fetch(prefix);
    if (!response2.ok) throw new Error("\u5206\u7C7B\u97F3\u9891\u52A0\u8F7D\u5931\u8D25");
    const intro = await context.decodeAudioData(await response2.arrayBuffer());
    const gap = Math.round(context.sampleRate * gapSeconds);
    const combined = context.createBuffer(Math.max(intro.numberOfChannels, decoded.numberOfChannels), intro.length + gap + decoded.length, context.sampleRate);
    for (let channel = 0; channel < combined.numberOfChannels; channel += 1) {
      combined.getChannelData(channel).set(intro.getChannelData(Math.min(channel, intro.numberOfChannels - 1)));
      combined.getChannelData(channel).set(decoded.getChannelData(Math.min(channel, decoded.numberOfChannels - 1)), intro.length + gap);
    }
    decoded = combined;
  }
  if (token !== playbackToken) return;
  await context.resume();
  const repeatTotal = repeatOverride != null ? repeatOverride : state.wordRepeatCount + 1;
  const pauseFrames = Math.round(context.sampleRate * state.wordIntervalSeconds);
  const totalFrames = decoded.length * repeatTotal + pauseFrames * Math.max(0, repeatTotal - 1);
  const sequence = context.createBuffer(decoded.numberOfChannels, totalFrames, context.sampleRate);
  for (let channel = 0; channel < decoded.numberOfChannels; channel += 1) {
    const output = sequence.getChannelData(channel);
    const input = decoded.getChannelData(channel);
    for (let repeat = 0; repeat < repeatTotal; repeat += 1) {
      output.set(input, repeat * (decoded.length + pauseFrames));
    }
  }
  await new Promise((resolve, reject) => {
    audioSourceNode = context.createBufferSource();
    audioSourceNode.buffer = sequence;
    audioSourceNode.connect(context.destination);
    audioSourceNode.onended = () => {
      audioSourceNode = null;
      resolve();
    };
    try {
      audioSourceNode.start();
    } catch (error) {
      audioSourceNode = null;
      reject(error);
    }
  });
  return true;
}
function replayCurrentAudio(token) {
  if (token === playbackToken && !state.paused && getSessionWordMetadata(state.selectedWords[state.currentIndex]).category) {
    speakCurrent();
    return;
  }
  if (token !== playbackToken || state.paused || !audioPlayer) return;
  updatePlaybackUi("\u6B63\u5728\u64AD\u653E", `\u7B2C ${state.currentRepeat + 1} \u904D \xB7 \u8BF7\u5199\u4E0B\u4F60\u542C\u5230\u7684${currentContentNoun()}`);
  audioPlayer.onended = () => finishCurrentPlayback(token);
  audioPlayer.onerror = () => {
    if (token !== playbackToken) return;
    stopAudio();
    speakCurrent();
  };
  audioPlayer.currentTime = 0;
  audioPlayer.play().catch(() => {
    if (token !== playbackToken) return;
    stopAudio();
    speakCurrent();
  });
}
function speakWithBrowserVoice(text, token) {
  return new Promise((resolve, reject) => {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      showToast("\u672C\u673A\u8BED\u97F3\u670D\u52A1\u4E0D\u53EF\u7528\uFF0C\u5F53\u524D\u6D4F\u89C8\u5668\u4E5F\u4E0D\u652F\u6301\u6717\u8BFB");
      reject(new Error("\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u6717\u8BFB"));
      return;
    }
    const isEnglish = getLessonSubject({ subject: getSessionWordMetadata(text).subject }) === "\u82F1\u8BED";
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) {
      showToast(`\u672C\u673A\u8BED\u97F3\u670D\u52A1\u4E0D\u53EF\u7528\uFF0C\u6D4F\u89C8\u5668\u6CA1\u6709\u53EF\u7528\u7684${isEnglish ? "\u82F1\u8BED" : "\u4E2D\u6587"}\u97F3\u8272`);
      reject(new Error("\u6CA1\u6709\u53EF\u7528\u97F3\u8272"));
      return;
    }
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = isEnglish ? "en-US" : "zh-CN";
    utterance.rate = 0.72;
    utterance.pitch = 1.03;
    utterance.voice = isEnglish ? voices.find((voice) => /^en(-|_)?US/i.test(voice.lang) || /American|English.*US/i.test(voice.name)) : voices.find((voice) => /^zh(-|_)?CN/i.test(voice.lang) || /Chinese|普通话|中文/i.test(voice.name));
    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
      if (token === playbackToken && event.error !== "canceled" && event.error !== "interrupted") showToast(`\u64AD\u653E\u5931\u8D25\uFF1A${event.error || "\u6D4F\u89C8\u5668\u8BED\u97F3\u5F15\u64CE\u62D2\u7EDD\u64AD\u653E"}`);
      reject(new Error(event.error || "\u6D4F\u89C8\u5668\u8BED\u97F3\u5F15\u64CE\u62D2\u7EDD\u64AD\u653E"));
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  });
}
function updatePlaybackUi(label, status) {
  const labelElement = document.querySelector(".stage-label");
  const statusElement = document.querySelector(".stage-status");
  if (labelElement) labelElement.textContent = label;
  if (statusElement) statusElement.textContent = status;
}
function recallWritingSeconds(metadata) {
  return metadata.count * (state.wordRepeatCount + 1) * state.wordIntervalSeconds;
}
function finishCurrentPlayback(token, completedSequence = false) {
  if (token !== playbackToken || state.paused) return;
  const metadata = getSessionWordMetadata(state.selectedWords[state.currentIndex]);
  if (metadata.kind === "recall") {
    state.currentRepeat = state.wordRepeatCount + 1;
    const seconds = recallWritingSeconds(metadata);
    updatePlaybackUi("\u6B63\u5728\u9ED8\u5199", `\u8BF7\u5199\u51FA ${metadata.count} \u4E2A\u8BCD\u8BED \xB7 ${seconds} \u79D2\u540E\u8FDB\u5165\u4E0B\u4E00\u9898\uFF0C\u4E5F\u53EF\u70B9\u51FB\u201C\u5199\u597D\u4E86\u201D\u63D0\u524D\u7EE7\u7EED`);
    speechTimer = setTimeout(() => {
      speechTimer = null;
      if (token === playbackToken && !state.paused) advanceToNextWord();
    }, seconds * 1e3);
    return;
  }
  state.currentRepeat += completedSequence ? state.wordRepeatCount + 1 : 1;
  const lastPlayback = state.currentRepeat > state.wordRepeatCount;
  updatePlaybackUi("\u7B49\u5F85\u4E0B\u4E00\u904D", `${state.wordIntervalSeconds} \u79D2\u540E${lastPlayback ? "\u8FDB\u5165\u4E0B\u4E00\u6761\u5185\u5BB9" : "\u518D\u8BFB\u5F53\u524D\u5185\u5BB9"}`);
  speechTimer = setTimeout(() => {
    speechTimer = null;
    if (lastPlayback) advanceToNextWord();
    else replayCurrentAudio(token);
  }, state.wordIntervalSeconds * 1e3);
}
function nextWord() {
  stopPlayback();
  advanceToNextWord();
}
function advanceToNextWord() {
  if (state.currentIndex >= state.selectedWords.length - 1) {
    state.results = state.selectedWords.map((word, index) => ({ word, status: index === 1 ? "review" : "ok" }));
    state.paused = false;
    if (!dictationAnalyticsCompleted) {
      dictationAnalyticsCompleted = true;
      reportDictationEvent("complete");
    }
    setScreen("result");
    playCompletionAudio();
  } else {
    state.currentIndex += 1;
    state.started = true;
    state.currentRepeat = 0;
    state.paused = false;
    state.showWord = state.showWordDefault;
    render();
    speakCurrent();
  }
}
async function playCompletionAudio() {
  stopPlayback();
  const completionAudio = getCompletionAudio();
  const token = playbackToken;
  const context = unlockAudioContext();
  if (!context) {
    try {
      audioPlayer = new Audio(completionAudio);
      audioPlayer.onended = () => stopAudio();
      audioPlayer.onerror = () => {
        stopAudio();
        showToast("\u5B8C\u6210\u63D0\u793A\u97F3\u64AD\u653E\u5931\u8D25");
      };
      await audioPlayer.play();
    } catch (e) {
      showToast("\u5B8C\u6210\u63D0\u793A\u97F3\u64AD\u653E\u5931\u8D25\uFF0C\u8BF7\u70B9\u51FB\u9875\u9762\u540E\u91CD\u8BD5");
    }
    return;
  }
  try {
    const response = await fetch(`${completionAudio}?v=${APP_VERSION}`);
    if (!response.ok) throw new Error("\u5B8C\u6210\u63D0\u793A\u97F3\u52A0\u8F7D\u5931\u8D25");
    const decoded = await context.decodeAudioData(await response.arrayBuffer());
    if (token !== playbackToken) return;
    await context.resume();
    audioSourceNode = context.createBufferSource();
    audioSourceNode.buffer = decoded;
    audioSourceNode.connect(context.destination);
    audioSourceNode.onended = () => {
      audioSourceNode = null;
    };
    audioSourceNode.start();
  } catch (e) {
    if (token === playbackToken) showToast("\u5B8C\u6210\u63D0\u793A\u97F3\u64AD\u653E\u5931\u8D25\uFF0C\u8BF7\u70B9\u51FB\u9875\u9762\u540E\u91CD\u8BD5");
  }
}
function stopAudio() {
  if (audioSourceNode) {
    try {
      audioSourceNode.stop();
    } catch (e) {
    }
    audioSourceNode = null;
  }
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    audioPlayer = null;
  }
  if (audioObjectUrl) {
    URL.revokeObjectURL(audioObjectUrl);
    audioObjectUrl = null;
  }
}
function stopPlayback({ keepPaused = false } = {}) {
  playbackToken += 1;
  stopAudio();
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (speechTimer) {
    clearTimeout(speechTimer);
    speechTimer = null;
  }
  if (!keepPaused) state.paused = false;
}
function togglePlaybackPause() {
  if (state.paused) {
    state.paused = false;
    render();
    speakCurrent();
    return;
  }
  stopPlayback({ keepPaused: true });
  state.paused = true;
  render();
  showToast("\u5DF2\u6682\u505C\uFF0C\u51C6\u5907\u597D\u540E\u70B9\u51FB\u201C\u7EE7\u7EED\u64AD\u653E\u201D");
}
function saveSession() {
  state.history.push({ lesson: state.lesson.id, date: (/* @__PURE__ */ new Date()).toISOString(), results: state.results });
  state.homeSubject = getLessonSubject(state.lesson);
  saveState();
}
function showToast(message, diagnosticDetails = {}) {
  var _a2;
  if (/失败|不可用|没有可用/.test(message)) recordDiagnostic("audio_error", diagnosticDetails);
  (_a2 = document.querySelector(".toast")) == null ? void 0 : _a2.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2300);
}
document.addEventListener("click", (event) => {
  if (event.target.matches('[data-action="speak"]')) return;
});
(_e = (_d = document.querySelector("#diagnostics-panel")) == null ? void 0 : _d.addEventListener) == null ? void 0 : _e.call(_d, "toggle", (event) => {
  if (event.target.open) prepareDiagnostics();
});
(_g = (_f = document.querySelector("#diagnostics-copy")) == null ? void 0 : _f.addEventListener) == null ? void 0 : _g.call(_f, "click", copyDiagnostics);
(_i = (_h = document.querySelector("#diagnostics-clear")) == null ? void 0 : _h.addEventListener) == null ? void 0 : _i.call(_h, "click", clearDiagnostics);
render();
loadRemoteCatalog();
async function loadRemoteCatalog() {
  const requestId = ++catalogRequestId;
  let httpStatus = null;
  try {
    const endpoint = IS_LOCAL_PARENT ? `${OCR_API}/api/catalog` : `${APP_BASE_PATH}/catalog.json?v=${APP_VERSION}`;
    const response = await fetch(endpoint);
    if (requestId !== catalogRequestId) return;
    httpStatus = response.status;
    if (!response.ok) throw new Error("catalog-http");
    const payload = await response.json();
    if (requestId !== catalogRequestId) return;
    if (!Array.isArray(payload) && !Array.isArray(payload == null ? void 0 : payload.lessons)) throw new Error("catalog-format");
    remoteLessons = Array.isArray(payload) ? payload : payload.lessons;
    catalogFailed = false;
    if (["home", "lessons", "setup"].includes(state.screen)) render();
  } catch (e) {
    if (requestId !== catalogRequestId) return;
    catalogFailed = true;
    recordDiagnostic("catalog_error", { status: httpStatus });
    if (["home", "setup"].includes(state.screen)) render();
  }
}
