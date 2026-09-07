var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_meta = {};
import_dotenv.default.config();
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getAiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new import_genai.GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
var LUXE_SYSTEM_INSTRUCTION = `
You are the elite AI Luxury Concierge of royalJPcar JAPAN (royalJPcar \u516D\u672C\u6728\u30B7\u30E7\u30FC\u30EB\u30FC\u30E0) located at 7-12-8 Roppongi, Minato-ku, Tokyo (\u6771\u4EAC\u90FD\u6E2F\u533A\u516D\u672C\u6728 7-12-8 royalJPcar Building 1F-3F).
You provide exceptional, personalized advice to high-net-worth clients, supercar enthusiasts, and VIP buyers.

SHOWROOM HIGHLIGHTS & VEHICLE INVENTORY:
1. Rolls-Royce Phantom VIII Extended:
   - Price: \xA598,500,000 (~16.2 t\u1EF7 VN\u0110)
   - Specs: 6.75L V12 Twin-Turbo, 563 HP, 0-100 km/h: 5.4s, Top Speed: 250 km/h.
   - Highlights: Starlight Headliner, bespoke rear privacy suite, lambswool carpets.
2. Ferrari 296 GTB Assetto Fiorano:
   - Price: \xA546,800,000 (~7.7 t\u1EF7 VN\u0110)
   - Specs: 3.0L V6 Turbo PHEV (Plug-in Hybrid), 830 HP, 0-100 km/h: 2.9s, Top Speed: 330 km/h.
   - Highlights: Fiorano carbon track package, Michelin Pilot Sport Cup 2R tires.
3. Porsche 911 GT3 RS (992):
   - Price: \xA542,500,000 (~7.0 t\u1EF7 VN\u0110)
   - Specs: 4.0L Naturally Aspirated Boxer-6, 525 HP, 0-100 km/h: 3.2s, Top Speed: 296 km/h.
   - Highlights: Active DRS rear aero wing, Weissach lightweight package, roll cage.
4. Bentley Continental GT Speed Mulliner:
   - Price: \xA543,900,000 (~7.2 t\u1EF7 VN\u0110)
   - Specs: 6.0L W12 TSI Twin-Turbo, 659 HP, 0-100 km/h: 3.6s, Top Speed: 335 km/h.
   - Highlights: Diamond-in-Diamond Mulliner quilting, all-wheel steering, carbon ceramic brakes.
5. Lamborghini Revuelto V12 HPEV:
   - Price: \xA572,000,000 (~11.8 t\u1EF7 VN\u0110)
   - Specs: 6.5L V12 Naturally Aspirated + 3 Electric Motors, 1,015 HP, 0-100 km/h: 2.5s, Top Speed: 350+ km/h.
   - Highlights: Monofuselage carbon tub, futuristic Y-design cockpit, extreme hybrid performance.
6. Mercedes-Maybach S680 4MATIC:
   - Price: \xA541,000,000 (~6.7 t\u1EF7 VN\u0110)
   - Specs: 6.0L V12 Biturbo, 612 HP, 0-100 km/h: 4.5s.
   - Highlights: Two-tone bespoke paint, Executive First-Class reclining rear suite, Burmester 4D sound.
7. Aston Martin DBS 770 Ultimate:
   - Price: \xA552,800,000 (~8.7 t\u1EF7 VN\u0110)
   - Specs: 5.2L V12 Twin-Turbo, 770 HP, 0-100 km/h: 3.4s, Top Speed: 340 km/h.
   - Highlights: Limited 499 units worldwide, carbon aerodynamic bodywork, carbon sport bucket seats.
8. Land Rover Range Rover SV LWB P530:
   - Price: \xA536,800,000 (~6.0 t\u1EF7 VN\u0110)
   - Specs: 4.4L V8 Twin-Turbo, 530 HP.
   - Highlights: Long Wheelbase SV Signature Suite, white ceramic interior controls, refrigerated cooler.

SERVICES OFFERED:
- Private VIP Test Drive (Tokyo Metropolitan Highway C1 circuit & scenic coastal routes, chauffeur escorted).
- Bespoke Individual Customization (Mansory, Novitec, Brabus, and factory bespoke paint/leather options).
- Luxury Financing & Tax Advisory (tailored corporate leasing, bank auto loans with competitive rates in Japan).
- Trade-in Appraisal & Worldwide Transport (Certified JEVIC inspection, door-to-door enclosed trailer transport).
- VIP Lounge in Roppongi: Champagne bar, private consultation room, 24/7 client concierge.
- Contact hotline: 0120-88-8899 | Email: concierge@royaljpcar.com.

COMMUNICATION RULES:
- If language is 'ja', reply in polite, refined Japanese (\u4E01\u5BE7\u306A\u656C\u8A9E\u30FB\u6D17\u7DF4\u3055\u308C\u305F\u30C8\u30FC\u30F3).
- If language is 'vi', reply in polite, hospitable Vietnamese (L\u1ECBch thi\u1EC7p, t\xF4n tr\u1ECDng, chuy\xEAn nghi\u1EC7p, sang tr\u1ECDng).
- Always be helpful, informative, concise, and highlight the vehicle's unique strengths and how to schedule a viewing or test drive.
- Format responses cleanly with brief paragraphs or bullet points where appropriate.
`;
function generateFallbackResponse(userPrompt, language) {
  const isJa = language === "ja";
  const lower = userPrompt.toLowerCase();
  if (lower.includes("rolls") || lower.includes("phantom") || lower.includes("\u30ED\u30FC\u30EB\u30B9")) {
    return isJa ? `\u3010Rolls-Royce Phantom VIII Extended\u3011
\u30FB\u8ECA\u4E21\u4FA1\u683C: \xA598,500,000\uFF08\u7A0E\u8FBC\uFF09
\u30FB\u30D1\u30EF\u30FC\u30C8\u30EC\u30A4\u30F3: 6.75L V12\u30C4\u30A4\u30F3\u30BF\u30FC\u30DC (563\u99AC\u529B)
\u30FB\u88C5\u5099: \u30B9\u30BF\u30FC\u30E9\u30A4\u30C8\u30FB\u30D8\u30C3\u30C9\u30E9\u30A4\u30CA\u30FC\u3001\u30D3\u30B9\u30DD\u30FC\u30AF\u30FB\u30D7\u30E9\u30A4\u30D9\u30FC\u30C8\u30B9\u30A4\u30FC\u30C8\u3001\u906E\u97F3\u30C0\u30D6\u30EB\u30AC\u30E9\u30B9

\u516D\u672C\u6728\u30B7\u30E7\u30FC\u30EB\u30FC\u30E0\u306B\u3066\u5B9F\u8ECA\u5C55\u793A\u4E2D\u3002\u30D7\u30E9\u30A4\u30D9\u30FC\u30C8\u30D3\u30E5\u30FC\u30A4\u30F3\u30B0\u304A\u3088\u3073VIP\u8A66\u4E57\u3092\u3054\u6848\u5185\u53EF\u80FD\u3067\u3059\u3002\u304A\u6C17\u8EFD\u306B\u304A\u7533\u3057\u4ED8\u3051\u304F\u3060\u3055\u3044\u3002` : `\u3010Rolls-Royce Phantom VIII Extended\u3011
\u30FBGi\xE1 ni\xEAm y\u1EBFt: \xA598,500,000 (~16.2 t\u1EF7 VN\u0110)
\u30FB\u0110\u1ED9ng c\u01A1: 6.75L V12 Twin-Turbo (563 m\xE3 l\u1EF1c)
\u30FBTrang b\u1ECB: B\u1EA7u tr\u1EDDi sao Starlight Headliner, khoang th\u01B0\u01A1ng gia c\xE1ch \xE2m tuy\u1EC7t \u0111\u1ED1i, th\u1EA3m l\xF4ng c\u1EEBu.

Xe \u0111ang c\xF3 s\u1EB5n t\u1EA1i Showroom Roppongi (Tokyo). Qu\xFD kh\xE1ch c\xF3 th\u1EC3 \u0111\u1EB7t l\u1ECBch xem xe ri\xEAng t\u01B0 v\xE0 tr\u1EA3i nghi\u1EC7m ngay h\xF4m nay.`;
  }
  if (lower.includes("ferrari") || lower.includes("296") || lower.includes("\u30D5\u30A7\u30E9\u30FC\u30EA")) {
    return isJa ? `\u3010Ferrari 296 GTB Assetto Fiorano\u3011
\u30FB\u8ECA\u4E21\u4FA1\u683C: \xA546,800,000\uFF08\u7A0E\u8FBC\uFF09
\u30FB\u30D1\u30EF\u30FC\u30C8\u30EC\u30A4\u30F3: 3.0L V6\u30CF\u30A4\u30D6\u30EA\u30C3\u30C9 (830\u99AC\u529B)
\u30FB\u52A0\u901F: 0-100km/h \u7D042.9\u79D2
\u30FB\u7279\u9577: \u30D5\u30A3\u30AA\u30E9\u30CE\u30FB\u30C8\u30E9\u30C3\u30AF\u30D1\u30C3\u30B1\u30FC\u30B8\u3001\u30AB\u30FC\u30DC\u30F3\u88FD\u30D5\u30ED\u30F3\u30C8\u30B9\u30D7\u30EA\u30C3\u30BF\u30FC

\u6700\u65B0\u4E16\u4EE3\u306E\u8DF3\u306D\u99AC\u306E\u5727\u5012\u7684\u306A\u4FCA\u654F\u6027\u3092\u516D\u672C\u6728\u30B7\u30E7\u30FC\u30EB\u30FC\u30E0\u306B\u3066\u3054\u4F53\u611F\u3044\u305F\u3060\u3051\u307E\u3059\u3002\u8A66\u4E57\u306E\u3054\u4E88\u7D04\u3092\u627F\u3063\u3066\u304A\u308A\u307E\u3059\u3002` : `\u3010Ferrari 296 GTB Assetto Fiorano\u3011
\u30FBGi\xE1 ni\xEAm y\u1EBFt: \xA546,800,000 (~7.7 t\u1EF7 VN\u0110)
\u30FB\u0110\u1ED9ng c\u01A1: 3.0L V6 Turbo PHEV (830 m\xE3 l\u1EF1c)
\u30FBT\u0103ng t\u1ED1c: 0-100 km/h ch\u1EC9 2.9 gi\xE2y
\u30FB\u0110i\u1EC3m nh\u1EA5n: G\xF3i \u0111ua carbon Fiorano, m\xE2m \u0111a ch\u1EA5u si\xEAu nh\u1EB9, kh\xED \u0111\u1ED9ng h\u1ECDc ch\u1EE7 \u0111\u1ED9ng.

Hi\u1EC7n xe \u0111ang c\xF3 m\u1EB7t t\u1EA1i Showroom. Qu\xFD kh\xE1ch c\xF3 mu\u1ED1n \u0111\u1EB7t l\u1ECBch t\u01B0 v\u1EA5n v\xE0 tr\u1EA3i nghi\u1EC7m l\xE1i th\u1EED kh\xF4ng \u1EA1?`;
  }
  if (lower.includes("porsche") || lower.includes("911") || lower.includes("gt3") || lower.includes("\u30DD\u30EB\u30B7\u30A7")) {
    return isJa ? `\u3010Porsche 911 GT3 RS (992)\u3011
\u30FB\u8ECA\u4E21\u4FA1\u683C: \xA542,500,000\uFF08\u7A0E\u8FBC\uFF09
\u30FB\u30A8\u30F3\u30B8\u30F3: 4.0L \u6C34\u5E73\u5BFE\u54116\u6C17\u7B52\u81EA\u7136\u5438\u6C17 (525\u99AC\u529B / \u6700\u9AD89,000rpm)
\u30FB\u52A0\u901F: 0-100km/h \u7D043.2\u79D2
\u30FB\u88C5\u5099: \u30A2\u30AF\u30C6\u30A3\u30D6DRS\u30EA\u30A2\u30A6\u30A4\u30F3\u30B0\u3001\u30F4\u30A1\u30A4\u30B6\u30C3\u30CF\u30FB\u30D1\u30C3\u30B1\u30FC\u30B8

\u516C\u9053\u3092\u8D70\u308C\u308B\u30EC\u30FC\u30B7\u30F3\u30B0\u30AB\u30FC\u306E\u9802\u70B9\u30E2\u30C7\u30EB\u3067\u3059\u3002\u73FE\u8ECA\u306E\u30B3\u30F3\u30C7\u30A3\u30B7\u30E7\u30F3\u78BA\u8A8D\u3084\u5373\u7D0D\u624B\u914D\u306B\u3064\u3044\u3066\u3054\u6848\u5185\u3044\u305F\u3057\u307E\u3059\u3002` : `\u3010Porsche 911 GT3 RS (992)\u3011
\u30FBGi\xE1 ni\xEAm y\u1EBFt: \xA542,500,000 (~7.0 t\u1EF7 VN\u0110)
\u30FB\u0110\u1ED9ng c\u01A1: 4.0L Boxer-6 h\xFAt kh\xED t\u1EF1 nhi\xEAn (525 m\xE3 l\u1EF1c, tua m\xE1y 9.000 v\xF2ng/ph\xFAt)
\u30FBT\u0103ng t\u1ED1c: 0-100 km/h trong 3.2 gi\xE2y
\u30FB\u0110i\u1EC3m nh\u1EA5n: C\xE1nh gi\xF3 sau DRS ch\u1EE7 \u0111\u1ED9ng, g\xF3i si\xEAu nh\u1EB9 Weissach Package.

Chi\u1EBFc xe \u0111ua \u0111\u01B0\u1EDDng ph\u1ED1 \u0111\u1EC9nh cao s\u1EB5n s\xE0ng giao ngay cho qu\xFD kh\xE1ch.`;
  }
  if (lower.includes("lamborghini") || lower.includes("revuelto") || lower.includes("\u30E9\u30F3\u30DC\u30EB\u30AE\u30FC\u30CB")) {
    return isJa ? `\u3010Lamborghini Revuelto V12 HPEV\u3011
\u30FB\u8ECA\u4E21\u4FA1\u683C: \xA572,000,000\uFF08\u7A0E\u8FBC\uFF09
\u30FB\u30B7\u30B9\u30C6\u30E0\u51FA\u529B: 1,015\u99AC\u529B (6.5L V12\u81EA\u7136\u5438\u6C17 + 3\u57FA\u306E\u30E2\u30FC\u30BF\u30FC)
\u30FB\u52A0\u901F: 0-100km/h \u308F\u305A\u304B2.5\u79D2
\u30FB\u6700\u9AD8\u901F\u5EA6: 350km/h\u4EE5\u4E0A

\u6B21\u4E16\u4EE3\u30CF\u30A4\u30D6\u30EA\u30C3\u30C9\u30FB\u30B9\u30FC\u30D1\u30FC\u30B9\u30DD\u30FC\u30C4\u306E\u6700\u9AD8\u5CF0\u3002\u30B7\u30E7\u30FC\u30EB\u30FC\u30E0\u306B\u3066\u5B9F\u8ECA\u3092\u3054\u78BA\u8A8D\u3044\u305F\u3060\u3051\u307E\u3059\u3002` : `\u3010Lamborghini Revuelto V12 HPEV\u3011
\u30FBGi\xE1 ni\xEAm y\u1EBFt: \xA572,000,000 (~11.8 t\u1EF7 VN\u0110)
\u30FBC\xF4ng su\u1EA5t c\u1EF1c \u0111\u1EA1i: 1.015 m\xE3 l\u1EF1c (V12 6.5L + 3 \u0111\u1ED9ng c\u01A1 \u0111i\u1EC7n)
\u30FBT\u0103ng t\u1ED1c: 0-100 km/h ch\u1EC9 2.5 gi\xE2y
\u30FBV\u1EADn t\u1ED1c t\u1ED1i \u0111a: 350+ km/h

Si\xEAu ph\u1EA9m V12 Plug-in Hybrid \u0111\u1EC9nh cao t\u1EEB \xDD \u0111ang c\xF3 m\u1EB7t t\u1EA1i Luxe Showroom Roppongi.`;
  }
  if (lower.includes("l\xE1i th\u1EED") || lower.includes("test drive") || lower.includes("\u8A66\u4E57") || lower.includes("h\u1EB9n")) {
    return isJa ? `VIP\u8A66\u4E57\u306E\u3054\u4E88\u7D04\u3092\u559C\u3093\u3067\u627F\u308A\u307E\u3059\u3002\u516D\u672C\u6728\u30B7\u30E7\u30FC\u30EB\u30FC\u30E0\u3092\u51FA\u767A\u3057\u3001\u9996\u90FD\u9AD8\u901FC1\u3084\u30EC\u30A4\u30F3\u30DC\u30FC\u30D6\u30EA\u30C3\u30B8\u6CBF\u3044\u306E\u7279\u8A2D\u30C6\u30B9\u30C8\u30C9\u30E9\u30A4\u30D6\u30B3\u30FC\u30B9\u306B\u3066\u3001\u5C02\u4EFB\u30A4\u30F3\u30B9\u30C8\u30E9\u30AF\u30BF\u30FC\u540C\u4E57\u306E\u3082\u3068\u5B58\u5206\u306B\u3054\u4F53\u611F\u3044\u305F\u3060\u3051\u307E\u3059\u3002

\u3054\u5E0C\u671B\u306E\u65E5\u6642\u3001\u8A66\u4E57\u3057\u305F\u3044\u8ECA\u7A2E\uFF08\u30D5\u30A7\u30E9\u30FC\u30EA\u3001\u30DD\u30EB\u30B7\u30A7\u3001\u30ED\u30FC\u30EB\u30B9\u30FB\u30ED\u30A4\u30B9\u306A\u3069\uFF09\u3092\u304A\u77E5\u3089\u305B\u3044\u305F\u3060\u3051\u308C\u3070\u3001\u512A\u5148\u67A0\u3092\u78BA\u4FDD\u3044\u305F\u3057\u307E\u3059\u3002` : `Luxe Showroom r\u1EA5t h\xE2n h\u1EA1nh h\u1ED7 tr\u1EE3 qu\xFD kh\xE1ch \u0111\u0103ng k\xFD tr\u1EA3i nghi\u1EC7m l\xE1i th\u1EED VIP. L\u1ED9 tr\xECnh ch\u1EA1y th\u1EED bao g\u1ED3m cung \u0111\u01B0\u1EDDng cao t\u1ED1c Shuto Expressway C1 v\xE0 cung \u0111\u01B0\u1EDDng ven v\u1ECBnh Tokyo tuy\u1EC7t \u0111\u1EB9p v\u1EDBi chuy\xEAn gia k\u1EF9 thu\u1EADt \u0111\u1ED3ng h\xE0nh.

Qu\xFD kh\xE1ch vui l\xF2ng cho bi\u1EBFt d\xF2ng xe quan t\xE2m (Ferrari, Porsche, Rolls-Royce,...) v\xE0 th\u1EDDi gian mong mu\u1ED1n \u0111\u1EC3 ch\xFAng t\xF4i chu\u1EA9n b\u1ECB \u0111\xF3n ti\u1EBFp chu \u0111\xE1o nh\u1EA5t!`;
  }
  if (lower.includes("\u0111\u1ECBa ch\u1EC9") || lower.includes("\u1EDF \u0111\xE2u") || lower.includes("showroom") || lower.includes("\u5834\u6240") || lower.includes("\u30A2\u30AF\u30BB\u30B9")) {
    return isJa ? `\u3010LUXE SHOWROOM TOKYO\u3011
\u30FB\u4F4F\u6240: \u6771\u4EAC\u90FD\u6E2F\u533A\u516D\u672C\u6728 7-12-8 LUXE Tower 1F-3F
\u30FB\u30A2\u30AF\u30BB\u30B9: \u6771\u4EAC\u30E1\u30C8\u30ED\u65E5\u6BD4\u8C37\u7DDA\u30FB\u90FD\u55B6\u5927\u6C5F\u6238\u7DDA\u300C\u516D\u672C\u6728\u99C5\u300D4a\u51FA\u53E3\u3088\u308A\u5F92\u6B693\u5206
\u30FB\u55B6\u696D\u6642\u9593: 10:00 - 20:00 (\u5E74\u4E2D\u7121\u4F11\u30FBVIP\u4E8B\u524D\u4E88\u7D04\u512A\u5148\u5236)
\u30FB\u76F4\u901A\u756A\u53F7: 0120-88-8899

\u5730\u4E0B\u5C02\u7528VIP\u30D1\u30FC\u30AD\u30F3\u30B0\u3082\u5B8C\u5099\u3057\u3066\u304A\u308A\u307E\u3059\u3002\u304A\u8ECA\u3067\u306E\u3054\u6765\u9928\u3082\u5FC3\u3088\u308A\u304A\u5F85\u3061\u7533\u3057\u4E0A\u3052\u3066\u304A\u308A\u307E\u3059\u3002` : `\u3010LUXE SHOWROOM TOKYO\u3011
\u30FB\u0110\u1ECBa ch\u1EC9: 7-12-8 Roppongi, Minato-ku, Tokyo (LUXE Tower t\u1EA7ng 1-3)
\u30FBCh\u1EC9 d\u1EABn: C\xE1ch Ga Roppongi (Tuy\u1EBFn Hibiya / Oedo) l\u1ED1i ra 4a kho\u1EA3ng 3 ph\xFAt \u0111i b\u1ED9
\u30FBGi\u1EDD m\u1EDF c\u1EEDa: 10:00 - 20:00 h\xE0ng ng\xE0y (\u01AFu ti\xEAn ti\u1EBFp \u0111\xF3n kh\xE1ch VIP c\xF3 h\u1EB9n tr\u01B0\u1EDBc)
\u30FBHotline: 0120-88-8899 | Email: concierge@luxe-japan.com

Showroom c\xF3 t\u1EA7ng h\u1EA7m \u0111\u1EADu xe ri\xEAng t\u01B0 cho kh\xE1ch VIP \u0111\u1EBFn tr\u1EA3i nghi\u1EC7m.`;
  }
  return isJa ? `royalJPcar \u516D\u672C\u6728\u306EAI\u30B3\u30F3\u30B7\u30A7\u30EB\u30B8\u30E5\u3067\u3054\u3056\u3044\u307E\u3059\u3002\u5F53\u5E97\u3067\u306F\u3001\u30D5\u30A7\u30E9\u30FC\u30EA\u3001\u30ED\u30FC\u30EB\u30B9\u30FB\u30ED\u30A4\u30B9\u3001\u30DD\u30EB\u30B7\u30A7\u3001\u30E9\u30F3\u30DC\u30EB\u30AE\u30FC\u30CB\u3001\u30D9\u30F3\u30C8\u30EC\u30FC\u306A\u3069\u306E\u6700\u9AD8\u5CF0\u30B9\u30FC\u30D1\u30FC\u30AB\u30FC\u304A\u3088\u3073\u30E9\u30B0\u30B8\u30E5\u30A2\u30EA\u30FC\u30B5\u30EB\u30FC\u30F3\u3092\u53D6\u308A\u63C3\u3048\u3066\u304A\u308A\u307E\u3059\u3002

\u3054\u5E0C\u671B\u306E\u8ECA\u7A2E\u306E\u4ED5\u69D8\u78BA\u8A8D\u3001\u304A\u898B\u7A4D\u3082\u308A\u3001VIP\u30D7\u30E9\u30A4\u30D9\u30FC\u30C8\u8A66\u4E57\u306E\u3054\u4E88\u7D04\u3001\u4E0B\u53D6\u308A\u67FB\u5B9A\u306A\u3069\u3001\u3069\u306E\u3088\u3046\u306A\u3053\u3068\u3067\u3082\u304A\u6C17\u8EFD\u306B\u3054\u76F8\u8AC7\u304F\u3060\u3055\u3044\u3002` : `K\xEDnh ch\xE0o qu\xFD kh\xE1ch! T\xF4i l\xE0 AI Luxury Concierge c\u1EE7a royalJPcar Roppongi (Tokyo). Ch\xFAng t\xF4i chuy\xEAn cung c\u1EA5p c\xE1c tuy\u1EC7t t\xE1c si\xEAu xe v\xE0 xe sang \u0111\u1ED9c b\u1EA3n: Rolls-Royce, Ferrari, Porsche, Lamborghini, Bentley, Mercedes-Maybach...

Qu\xFD kh\xE1ch \u0111ang quan t\xE2m \u0111\u1EBFn d\xF2ng xe n\xE0o, mu\u1ED1n t\xECm hi\u1EC3u th\xF4ng s\u1ED1 k\u1EF9 thu\u1EADt, b\xE1o gi\xE1 hay \u0111\u1EB7t l\u1ECBch l\xE1i th\u1EED VIP t\u1EA1i Tokyo \u1EA1?`;
}
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, language = "ja" } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Invalid messages format" });
    }
    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage?.content || "";
    const ai = getAiClient();
    if (!ai) {
      const reply = generateFallbackResponse(userPrompt, language);
      return res.json({ reply });
    }
    const formattedContents = messages.map((m) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: formattedContents,
      config: {
        systemInstruction: `${LUXE_SYSTEM_INSTRUCTION}
Preferred response language: ${language === "ja" ? "Japanese (\u65E5\u672C\u8A9E\u30FB\u4E01\u5BE7\u8A9E)" : "Vietnamese (Ti\u1EBFng Vi\u1EC7t l\u1ECBch thi\u1EC7p, sang tr\u1ECDng)"}.`,
        temperature: 0.7
      }
    });
    const replyText = response.text || generateFallbackResponse(userPrompt, language);
    return res.json({ reply: replyText });
  } catch (err) {
    console.error("Gemini API error:", err);
    const fallback = generateFallbackResponse(
      req.body?.messages?.[req.body.messages.length - 1]?.content || "",
      req.body?.language || "ja"
    );
    return res.json({ reply: fallback });
  }
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    aiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LUXE Showroom server listening on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
