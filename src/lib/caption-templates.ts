export interface CaptionTemplate {
  name: string;
  en: string;
  ja: string;
  tags: string[];
}

export const CAPTION_TEMPLATES: CaptionTemplate[] = [
  {
    name: "Morning Light",
    en: "Morning breaks, and gentle silver light sweeps across the city. Enjoy a traditional Japanese breakfast in your room, watching as {{location}} eases into a new pace of living.",
    ja: "朝日が柔らかに差し込む客室で、窓一面に広がる都会の景色を眺めながら味わう和朝食。静かな朝に、丁寧に仕立てられた一品が心と身体を優しく満たしてくれます。",
    tags: ["Aman", "{{property}}", "朝食"],
  },
  {
    name: "Seasonal Journey",
    en: "As the seasons turn, {{location}} reveals its quieter beauty — a landscape shaped by time, where every moment invites stillness.",
    ja: "季節が移ろうとき、{{location}}は静かな美しさを見せてくれます。時が織りなす風景の中、すべての瞬間が静寂を誘います。",
    tags: ["Aman", "{{property}}", "{{season}}"],
  },
  {
    name: "Sensory Experience",
    en: "A moment suspended in warmth and fragrance. At {{property}}, every detail is an invitation to slow down and savour the present.",
    ja: "温もりと香りに包まれた、時が止まるような瞬間。{{property}}では、あらゆるディテールが今この瞬間を味わう招待状です。",
    tags: ["Aman", "{{property}}"],
  },
  {
    name: "Architectural Calm",
    en: "Where architecture meets nature, silence becomes a language. {{property}} stands as a testament to the art of serene design.",
    ja: "建築と自然が出会う場所で、静寂はひとつの言語になります。{{property}}は、穏やかなデザインの芸術を体現しています。",
    tags: ["Aman", "{{property}}", "Architecture"],
  },
  {
    name: "Culinary Art",
    en: "Each dish tells a story of the land — ingredients drawn from the earth, prepared with reverence, served with grace.",
    ja: "一皿一皿がこの土地の物語を語ります。大地から届けられた食材を、敬意を込めて調理し、優雅にお届けします。",
    tags: ["Aman", "{{property}}", "Gastronomy"],
  },
  {
    name: "Water & Stone",
    en: "Water finds its way over ancient stone, carrying with it the patience of centuries. Here, time moves at its own pace.",
    ja: "水は古い石の上を流れ、何世紀もの忍耐を運びます。ここでは、時間は独自のペースで流れています。",
    tags: ["Aman", "{{property}}"],
  },
  {
    name: "Night Stillness",
    en: "As twilight deepens, {{property}} transforms into a sanctuary of golden light and whispered conversations.",
    ja: "夕暮れが深まるとき、{{property}}は黄金色の光と囁きの会話に包まれた聖域へと姿を変えます。",
    tags: ["Aman", "{{property}}", "Evening"],
  },
  {
    name: "Simple Discovery",
    en: "The most extraordinary journeys begin with the simplest discovery — a path, a scent, a view that changes everything.",
    ja: "最も特別な旅は、最もシンプルな発見から始まります。一本の小道、ひとつの香り、すべてを変える眺め。",
    tags: ["Aman", "{{property}}", "Journey"],
  },
];

export const AMAN_PROPERTIES = [
  "Aman Tokyo", "Aman Kyoto", "Amanemu", "Amanpuri", "Amangiri",
  "Aman Venice", "Amanzoe", "Aman New York", "Amangalla",
  "Amanjiwo", "Amankora", "Amanoi", "Aman Sveti Stefan",
];

export const SEASONS = [
  "Spring", "Summer", "Autumn", "Winter",
  "春", "夏", "秋", "冬",
];

export function fillTemplate(
  template: string,
  vars: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}

export function formatCaption(
  template: CaptionTemplate,
  vars: Record<string, string>,
  mode: "bilingual" | "en" | "ja"
): string {
  const en = fillTemplate(template.en, vars);
  const ja = fillTemplate(template.ja, vars);
  const tags = template.tags.map((t) => "#" + fillTemplate(t, vars).replace(/\s+/g, "")).join(" ");

  switch (mode) {
    case "en":
      return `${en}\n\n${tags}`;
    case "ja":
      return `${ja}\n\n${tags}`;
    case "bilingual":
    default:
      return `${en}\n\n${ja}\n\n${tags}`;
  }
}
