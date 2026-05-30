<div dir="rtl">

# dz-wilaya-api

> واجهة برمجية (REST API) مجانية وسريعة لـ **58 ولاية** و**1541 بلدية** في الجزائر — أسماء بثلاث لغات (العربية / الفرنسية / الإنجليزية)، الرموز البريدية، والإحداثيات الجغرافية. مبنية على [Cloudflare Workers](https://workers.cloudflare.com/) (الطبقة المجانية).

[![CI](https://github.com/HassanMak29/dz-wilaya-api/actions/workflows/ci.yml/badge.svg)](https://github.com/HassanMak29/dz-wilaya-api/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

🇬🇧 English: [README.md](README.md)

---

## المزايا

- ✅ **58 ولاية** — التقسيم الإداري الرسمي لسنة 2021 (الرموز `01`–`58`).
- ✅ **1541 بلدية** — كل البلديات، مرتبطة بولاياتها.
- 🌍 **ثلاث لغات** — أسماء `ar` و`fr` و`en` للولايات والبلديات.
- 📮 **الرموز البريدية** — رمز بريدي من 5 أرقام لكل بلدية.
- 📍 **إحداثيات GPS** — خط العرض والطول لكل بلدية وولاية.
- 🏛️ **الدائرة** — كل بلدية تتضمن دائرتها (بالعربية والفرنسية).
- 🗺️ **المناطق** — تجميع الولايات حسب المناطق الكبرى.
- ⚡ **على الحافة (Edge)** — تعمل على Cloudflare Workers مع تخزين KV اختياري.
- 🔓 **CORS مفعّل** — يمكن استدعاؤها من أي تطبيق متصفح.

## البداية السريعة

<div dir="ltr">

```bash
git clone https://github.com/HassanMak29/dz-wilaya-api.git
cd dz-wilaya-api
npm install
npm run dev        # خادم التطوير المحلي (wrangler)
npm test           # تشغيل الاختبارات
```

نشر نسختك الخاصة (مجاناً):

```bash
npm run deploy     # wrangler deploy
```

</div>

## نقاط النهاية (Endpoints)

عنوان الأساس: رابط الـ Worker الخاص بك (مثل `https://dz-wilaya-api.<you>.workers.dev`).

| الطريقة والمسار                   | الوصف                                                        |
| --------------------------------- | ------------------------------------------------------------ |
| `GET /`                           | معلومات عن الواجهة.                                          |
| `GET /health`                     | فحص الحالة.                                                  |
| `GET /api/wilayas`                | قائمة الـ 58 ولاية (ملخّص بدون بلديات).                      |
| `GET /api/wilayas/:code`          | ولاية واحدة **مع** بلدياتها. الرمز قد يكون `16` أو `1`.      |
| `GET /api/wilayas/:code/communes` | بلديات ولاية معيّنة.                                         |
| `GET /api/communes`               | كل البلديات (قائمة مسطّحة).                                  |
| `GET /api/communes/:postCode`     | البلديات المطابقة لرمز بريدي.                                |
| `GET /api/regions`                | الولايات مجمّعة حسب المنطقة.                                 |
| `GET /api/search?q=`              | بحث في الولايات والبلديات بالاسم (ع/فر/إن) أو الرمز البريدي. |

### شكل الاستجابة

كل الاستجابات الناجحة تتبع:

<div dir="ltr">

```json
{
  "success": true,
  "count": 58,
  "data": [
    /* ... */
  ]
}
```

الأخطاء:

```json
{ "success": false, "error": "Wilaya not found" }
```

</div>

### مثال — `GET /api/wilayas/16`

<div dir="ltr">

```json
{
  "success": true,
  "data": {
    "code": "16",
    "name": { "ar": "الجزائر", "fr": "Alger", "en": "Algiers" },
    "region": "North-Center",
    "lat": 36.730045,
    "lng": 3.073365,
    "communes": [
      {
        "name": { "ar": "عين بنيان", "fr": "Ain Benian", "en": "Ain Benian" },
        "daira": { "ar": "الشراقة", "fr": "Cheraga" },
        "code": "1657",
        "postCode": "16044",
        "lat": 36.791944,
        "lng": 2.933792
      }
    ]
  }
}
```

</div>

## نموذج البيانات

<div dir="ltr">

```ts
interface Wilaya {
  code: string; // "01"–"58"
  name: { ar: string; fr: string; en: string };
  region: string; // North-Center | North-East | North-West | Highlands | South
  lat: number;
  lng: number; // المركز
  communes: Commune[];
}

interface Commune {
  name: { ar: string; fr: string; en: string };
  daira: { ar: string; fr: string };
  code: string; // رمز البلدية الرسمي
  postCode: string | null; // رمز بريدي من 5 أرقام (null إذا غير معروف)
  lat: number;
  lng: number; // المركز (WGS84)
}
```

</div>

> **الرموز البريدية:** حوالي 98% من البلديات لها رمز بريدي مُتحقَّق منه. عدد قليل قيمته `null` حيث لم تتوفّر قيمة موثوقة، بدلاً من التخمين.

## البنية

- **بيئة التشغيل:** Cloudflare Workers + موجّه [Hono](https://hono.dev/).
- **البيانات:** مُولَّدة في `src/data/wilayas.json` ومُضمَّنة داخل الـ Worker.
- **KV (اختياري):** يقرأ الـ Worker من فضاء `WILAYA_KV` أولاً ويعود إلى البيانات المُضمَّنة، فيعمل مع أو بدون KV.

تفعيل تخزين KV:

<div dir="ltr">

```bash
wrangler kv namespace create WILAYA_KV   # ثم ضع المعرّف في wrangler.toml
npm run seed-kv                          # رفع البيانات إلى KV
```

</div>

## إعادة توليد البيانات

ملف `src/data/wilayas.json` المُضمَّن يُولَّد من بيانات إدارية مصدرية:

<div dir="ltr">

```bash
npm run fetch-sources   # تنزيل البيانات المصدرية إلى scripts/.cache
npm run build-data      # إعادة توليد src/data/wilayas.json
```

</div>

يقوم سكربت البناء بإرجاع "الولايات المنتدبة" (المرقّمة 59–69 في بيانات المجتمع) إلى ولاياتها الأم الرسمية، مُنتِجاً تقسيم الـ 58 ولاية الرسمي، ويربط الرموز البريدية بمطابقة الاسم والقرب الجغرافي.

## المصادر والإسناد

الحقائق الإدارية (الأسماء، الرموز البريدية، الإحداثيات) بيانات واقعية أُعيد تجميعها في مخطّط هذا المشروع. مجموعات البيانات المصدرية:

- [ihahachi/Algeria-Cities](https://github.com/ihahachi/Algeria-Cities) — أسماء البلديات (ع/فر)، الدوائر، رموز البلديات، الإحداثيات.
- [Kenandarabeh/algeria-wilayas-communes-2026](https://github.com/Kenandarabeh/algeria-wilayas-communes-2026) — الرموز البريدية.

## الرخصة

[MIT](LICENSE) © HassanMak29

</div>
