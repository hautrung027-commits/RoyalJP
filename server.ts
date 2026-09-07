import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI lazily or when available
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const LUXE_SYSTEM_INSTRUCTION = `
You are the elite AI Luxury Concierge of royalJPcar JAPAN (royalJPcar 六本木ショールーム) located at 7-12-8 Roppongi, Minato-ku, Tokyo (東京都港区六本木 7-12-8 royalJPcar Building 1F-3F).
You provide exceptional, personalized advice to high-net-worth clients, supercar enthusiasts, and VIP buyers.

SHOWROOM HIGHLIGHTS & VEHICLE INVENTORY:
1. Rolls-Royce Phantom VIII Extended:
   - Price: ¥98,500,000 (~16.2 tỷ VNĐ)
   - Specs: 6.75L V12 Twin-Turbo, 563 HP, 0-100 km/h: 5.4s, Top Speed: 250 km/h.
   - Highlights: Starlight Headliner, bespoke rear privacy suite, lambswool carpets.
2. Ferrari 296 GTB Assetto Fiorano:
   - Price: ¥46,800,000 (~7.7 tỷ VNĐ)
   - Specs: 3.0L V6 Turbo PHEV (Plug-in Hybrid), 830 HP, 0-100 km/h: 2.9s, Top Speed: 330 km/h.
   - Highlights: Fiorano carbon track package, Michelin Pilot Sport Cup 2R tires.
3. Porsche 911 GT3 RS (992):
   - Price: ¥42,500,000 (~7.0 tỷ VNĐ)
   - Specs: 4.0L Naturally Aspirated Boxer-6, 525 HP, 0-100 km/h: 3.2s, Top Speed: 296 km/h.
   - Highlights: Active DRS rear aero wing, Weissach lightweight package, roll cage.
4. Bentley Continental GT Speed Mulliner:
   - Price: ¥43,900,000 (~7.2 tỷ VNĐ)
   - Specs: 6.0L W12 TSI Twin-Turbo, 659 HP, 0-100 km/h: 3.6s, Top Speed: 335 km/h.
   - Highlights: Diamond-in-Diamond Mulliner quilting, all-wheel steering, carbon ceramic brakes.
5. Lamborghini Revuelto V12 HPEV:
   - Price: ¥72,000,000 (~11.8 tỷ VNĐ)
   - Specs: 6.5L V12 Naturally Aspirated + 3 Electric Motors, 1,015 HP, 0-100 km/h: 2.5s, Top Speed: 350+ km/h.
   - Highlights: Monofuselage carbon tub, futuristic Y-design cockpit, extreme hybrid performance.
6. Mercedes-Maybach S680 4MATIC:
   - Price: ¥41,000,000 (~6.7 tỷ VNĐ)
   - Specs: 6.0L V12 Biturbo, 612 HP, 0-100 km/h: 4.5s.
   - Highlights: Two-tone bespoke paint, Executive First-Class reclining rear suite, Burmester 4D sound.
7. Aston Martin DBS 770 Ultimate:
   - Price: ¥52,800,000 (~8.7 tỷ VNĐ)
   - Specs: 5.2L V12 Twin-Turbo, 770 HP, 0-100 km/h: 3.4s, Top Speed: 340 km/h.
   - Highlights: Limited 499 units worldwide, carbon aerodynamic bodywork, carbon sport bucket seats.
8. Land Rover Range Rover SV LWB P530:
   - Price: ¥36,800,000 (~6.0 tỷ VNĐ)
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
- If language is 'ja', reply in polite, refined Japanese (丁寧な敬語・洗練されたトーン).
- If language is 'vi', reply in polite, hospitable Vietnamese (Lịch thiệp, tôn trọng, chuyên nghiệp, sang trọng).
- Always be helpful, informative, concise, and highlight the vehicle's unique strengths and how to schedule a viewing or test drive.
- Format responses cleanly with brief paragraphs or bullet points where appropriate.
`;

// Helper for fallback response if Gemini key is absent or request fails
function generateFallbackResponse(userPrompt: string, language: string): string {
  const isJa = language === 'ja';
  const lower = userPrompt.toLowerCase();

  if (lower.includes('rolls') || lower.includes('phantom') || lower.includes('ロールス')) {
    return isJa
      ? `【Rolls-Royce Phantom VIII Extended】\n・車両価格: ¥98,500,000（税込）\n・パワートレイン: 6.75L V12ツインターボ (563馬力)\n・装備: スターライト・ヘッドライナー、ビスポーク・プライベートスイート、遮音ダブルガラス\n\n六本木ショールームにて実車展示中。プライベートビューイングおよびVIP試乗をご案内可能です。お気軽にお申し付けください。`
      : `【Rolls-Royce Phantom VIII Extended】\n・Giá niêm yết: ¥98,500,000 (~16.2 tỷ VNĐ)\n・Động cơ: 6.75L V12 Twin-Turbo (563 mã lực)\n・Trang bị: Bầu trời sao Starlight Headliner, khoang thương gia cách âm tuyệt đối, thảm lông cừu.\n\nXe đang có sẵn tại Showroom Roppongi (Tokyo). Quý khách có thể đặt lịch xem xe riêng tư và trải nghiệm ngay hôm nay.`;
  }

  if (lower.includes('ferrari') || lower.includes('296') || lower.includes('フェラーリ')) {
    return isJa
      ? `【Ferrari 296 GTB Assetto Fiorano】\n・車両価格: ¥46,800,000（税込）\n・パワートレイン: 3.0L V6ハイブリッド (830馬力)\n・加速: 0-100km/h 約2.9秒\n・特長: フィオラノ・トラックパッケージ、カーボン製フロントスプリッター\n\n最新世代の跳ね馬の圧倒的な俊敏性を六本木ショールームにてご体感いただけます。試乗のご予約を承っております。`
      : `【Ferrari 296 GTB Assetto Fiorano】\n・Giá niêm yết: ¥46,800,000 (~7.7 tỷ VNĐ)\n・Động cơ: 3.0L V6 Turbo PHEV (830 mã lực)\n・Tăng tốc: 0-100 km/h chỉ 2.9 giây\n・Điểm nhấn: Gói đua carbon Fiorano, mâm đa chấu siêu nhẹ, khí động học chủ động.\n\nHiện xe đang có mặt tại Showroom. Quý khách có muốn đặt lịch tư vấn và trải nghiệm lái thử không ạ?`;
  }

  if (lower.includes('porsche') || lower.includes('911') || lower.includes('gt3') || lower.includes('ポルシェ')) {
    return isJa
      ? `【Porsche 911 GT3 RS (992)】\n・車両価格: ¥42,500,000（税込）\n・エンジン: 4.0L 水平対向6気筒自然吸気 (525馬力 / 最高9,000rpm)\n・加速: 0-100km/h 約3.2秒\n・装備: アクティブDRSリアウイング、ヴァイザッハ・パッケージ\n\n公道を走れるレーシングカーの頂点モデルです。現車のコンディション確認や即納手配についてご案内いたします。`
      : `【Porsche 911 GT3 RS (992)】\n・Giá niêm yết: ¥42,500,000 (~7.0 tỷ VNĐ)\n・Động cơ: 4.0L Boxer-6 hút khí tự nhiên (525 mã lực, tua máy 9.000 vòng/phút)\n・Tăng tốc: 0-100 km/h trong 3.2 giây\n・Điểm nhấn: Cánh gió sau DRS chủ động, gói siêu nhẹ Weissach Package.\n\nChiếc xe đua đường phố đỉnh cao sẵn sàng giao ngay cho quý khách.`;
  }

  if (lower.includes('lamborghini') || lower.includes('revuelto') || lower.includes('ランボルギーニ')) {
    return isJa
      ? `【Lamborghini Revuelto V12 HPEV】\n・車両価格: ¥72,000,000（税込）\n・システム出力: 1,015馬力 (6.5L V12自然吸気 + 3基のモーター)\n・加速: 0-100km/h わずか2.5秒\n・最高速度: 350km/h以上\n\n次世代ハイブリッド・スーパースポーツの最高峰。ショールームにて実車をご確認いただけます。`
      : `【Lamborghini Revuelto V12 HPEV】\n・Giá niêm yết: ¥72,000,000 (~11.8 tỷ VNĐ)\n・Công suất cực đại: 1.015 mã lực (V12 6.5L + 3 động cơ điện)\n・Tăng tốc: 0-100 km/h chỉ 2.5 giây\n・Vận tốc tối đa: 350+ km/h\n\nSiêu phẩm V12 Plug-in Hybrid đỉnh cao từ Ý đang có mặt tại Luxe Showroom Roppongi.`;
  }

  if (lower.includes('lái thử') || lower.includes('test drive') || lower.includes('試乗') || lower.includes('hẹn')) {
    return isJa
      ? `VIP試乗のご予約を喜んで承ります。六本木ショールームを出発し、首都高速C1やレインボーブリッジ沿いの特設テストドライブコースにて、専任インストラクター同乗のもと存分にご体感いただけます。\n\nご希望の日時、試乗したい車種（フェラーリ、ポルシェ、ロールス・ロイスなど）をお知らせいただければ、優先枠を確保いたします。`
      : `Luxe Showroom rất hân hạnh hỗ trợ quý khách đăng ký trải nghiệm lái thử VIP. Lộ trình chạy thử bao gồm cung đường cao tốc Shuto Expressway C1 và cung đường ven vịnh Tokyo tuyệt đẹp với chuyên gia kỹ thuật đồng hành.\n\nQuý khách vui lòng cho biết dòng xe quan tâm (Ferrari, Porsche, Rolls-Royce,...) và thời gian mong muốn để chúng tôi chuẩn bị đón tiếp chu đáo nhất!`;
  }

  if (lower.includes('địa chỉ') || lower.includes('ở đâu') || lower.includes('showroom') || lower.includes('場所') || lower.includes('アクセス')) {
    return isJa
      ? `【LUXE SHOWROOM TOKYO】\n・住所: 東京都港区六本木 7-12-8 LUXE Tower 1F-3F\n・アクセス: 東京メトロ日比谷線・都営大江戸線「六本木駅」4a出口より徒歩3分\n・営業時間: 10:00 - 20:00 (年中無休・VIP事前予約優先制)\n・直通番号: 0120-88-8899\n\n地下専用VIPパーキングも完備しております。お車でのご来館も心よりお待ち申し上げております。`
      : `【LUXE SHOWROOM TOKYO】\n・Địa chỉ: 7-12-8 Roppongi, Minato-ku, Tokyo (LUXE Tower tầng 1-3)\n・Chỉ dẫn: Cách Ga Roppongi (Tuyến Hibiya / Oedo) lối ra 4a khoảng 3 phút đi bộ\n・Giờ mở cửa: 10:00 - 20:00 hàng ngày (Ưu tiên tiếp đón khách VIP có hẹn trước)\n・Hotline: 0120-88-8899 | Email: concierge@luxe-japan.com\n\nShowroom có tầng hầm đậu xe riêng tư cho khách VIP đến trải nghiệm.`;
  }

  return isJa
    ? `royalJPcar 六本木のAIコンシェルジュでございます。当店では、フェラーリ、ロールス・ロイス、ポルシェ、ランボルギーニ、ベントレーなどの最高峰スーパーカーおよびラグジュアリーサルーンを取り揃えております。\n\nご希望の車種の仕様確認、お見積もり、VIPプライベート試乗のご予約、下取り査定など、どのようなことでもお気軽にご相談ください。`
    : `Kính chào quý khách! Tôi là AI Luxury Concierge của royalJPcar Roppongi (Tokyo). Chúng tôi chuyên cung cấp các tuyệt tác siêu xe và xe sang độc bản: Rolls-Royce, Ferrari, Porsche, Lamborghini, Bentley, Mercedes-Maybach...\n\nQuý khách đang quan tâm đến dòng xe nào, muốn tìm hiểu thông số kỹ thuật, báo giá hay đặt lịch lái thử VIP tại Tokyo ạ?`;
}

// AI Chat API Route
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { messages, language = "ja" } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage?.content || "";

    const ai = getAiClient();

    if (!ai) {
      // Graceful fallback when API key is not configured
      const reply = generateFallbackResponse(userPrompt, language);
      return res.json({ reply });
    }

    // Build context history for Gemini
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: formattedContents,
      config: {
        systemInstruction: `${LUXE_SYSTEM_INSTRUCTION}\nPreferred response language: ${language === "ja" ? "Japanese (日本語・丁寧語)" : "Vietnamese (Tiếng Việt lịch thiệp, sang trọng)"}.`,
        temperature: 0.7,
      },
    });

    const replyText = response.text || generateFallbackResponse(userPrompt, language);
    return res.json({ reply: replyText });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    // Fallback gracefully so client always receives an answer
    const fallback = generateFallbackResponse(
      req.body?.messages?.[req.body.messages.length - 1]?.content || "",
      req.body?.language || "ja"
    );
    return res.json({ reply: fallback });
  }
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    aiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LUXE Showroom server listening on port ${PORT}`);
  });
}

startServer();
