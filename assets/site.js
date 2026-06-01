const SITE_CONFIG = {
  brandName: "소통과 상생",
  businessNumber: "397-26-02085",
  FORM_ENDPOINT: "https://docs.google.com/forms/d/e/1FAIpQLSdJMo1Gt0Al9r-ASfDZN7vmU35Xa_8c6A3QvsAdFUjalAIc_w/formResponse",
  FORM_FIELDS: {
    representativeName: "entry.158612063",
    companyName: "entry.623115281",
    industry: "entry.448108551",
    phone: "entry.1220519130",
    businessAge: "entry.1425330353",
    message: "entry.1492899135",
    source: "entry.369129554"
  },
  GTM_ID: "GTM-PVXSDRXH",
  GA4_ID: "G-M32RBBVX85",
  GOOGLE_ADS_ID: "",
  NAVER_CONVERSION_ID: ""
};

const pageVariants = {
  general: {
    eyebrow: "개인사업자 · 소상공인 정책자금 상담",
    title: "사업장 조건에 맞는 정책자금 가능성을 무료로 확인하세요.",
    copy: "업종, 업력, 자금 목적을 기준으로 현재 검토 가능한 자금 방향을 살펴보고 진행 절차를 안내드립니다.",
    note: "소통과 상생은 정부기관이 아니며, 경영컨설팅 관점에서 자금계획 수립과 진행 준비를 돕습니다.",
    source: "general"
  },
  food: {
    eyebrow: "음식점 · 카페 · 요식업 정책자금 상담",
    title: "매출 변동과 운영비 부담이 큰 요식업 사업장이라면 먼저 가능성을 확인하세요.",
    copy: "음식점, 카페, 배달음식점, 주점 등 업종 특성과 사업기간을 기준으로 운영자금 방향을 검토합니다.",
    note: "정책자금 조건은 사업장별 신용, 매출, 업력, 기관 심사 기준에 따라 달라질 수 있습니다.",
    source: "food"
  },
  transport: {
    eyebrow: "운수업 · 화물차주 정책자금 상담",
    title: "유류비와 운영비 부담이 커진 운수업 사업자를 위한 자금 방향을 검토합니다.",
    copy: "화물, 운송, 트럭, 지입 등 개인사업자의 현재 상황을 기준으로 운영자금 가능성과 준비 절차를 안내드립니다.",
    note: "지역과 업종별 신청 절차를 확인해 사업자 상황에 맞는 진행 방향을 상담합니다.",
    source: "transport"
  },
  credit: {
    eyebrow: "기존 대출 보유 사업자 상담",
    title: "대출 부담이나 신용상황 때문에 고민이라면 진행 가능 여부부터 확인하세요.",
    copy: "기존 대출, 매출 감소, 상환 부담 등으로 자금계획이 필요한 개인사업자와 소상공인을 상담합니다.",
    note: "모든 상황에서 진행이 가능한 것은 아니며, 조건 검토 후 가능한 방향만 안내드립니다.",
    source: "credit"
  }
};

function getVariant() {
  const params = new URLSearchParams(window.location.search);
  const explicit = document.body.dataset.variant || params.get("type") || "general";
  return pageVariants[explicit] ? explicit : "general";
}

function getLeadSource() {
  const params = new URLSearchParams(window.location.search);
  const explicitSource = params.get("source");
  if (explicitSource) return explicitSource;

  const baseSource = document.body.dataset.source || params.get("type") || pageVariants[getVariant()].source;
  const campaignParts = [params.get("utm_source"), params.get("utm_medium"), params.get("utm_campaign")]
    .filter(Boolean);

  return campaignParts.length ? `${baseSource} | ${campaignParts.join(" / ")}` : baseSource;
}

function applyVariant() {
  const variant = pageVariants[getVariant()];
  document.querySelectorAll("[data-variant-text]").forEach((node) => {
    const key = node.dataset.variantText;
    if (variant[key]) node.textContent = variant[key];
  });
  const sourceInput = document.querySelector("[name='source']");
  if (sourceInput) sourceInput.value = getLeadSource();
}

function trackEvent(name, detail = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...detail });
}

function bindLeadForm() {
  const form = document.querySelector("[data-lead-form]");
  if (!form) return;

  const error = form.querySelector("[data-form-error]");
  const submit = form.querySelector("[type='submit']");
  const originalSubmitText = submit.textContent;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.classList.remove("show");

    const consent = form.querySelector("[name='privacyConsent']");
    if (!consent.checked) {
      error.textContent = "개인정보 수집 및 이용에 동의해주세요.";
      error.classList.add("show");
      return;
    }

    const formData = new FormData(form);
    const fields = SITE_CONFIG.FORM_FIELDS;
    const endpoint = SITE_CONFIG.FORM_ENDPOINT;
    const activeFields = Object.entries(fields).filter(([, entryId]) => entryId);

    trackEvent("lead_form_submit_attempt", {
      source: formData.get("source") || "unknown"
    });

    if (!endpoint || activeFields.length === 0) {
      const payload = Object.fromEntries(formData.entries());
      window.sessionStorage.setItem("pendingLead", JSON.stringify(payload));
      window.location.href = "../thanks/?mode=preview";
      return;
    }

    const googleData = new FormData();
    activeFields.forEach(([key, entryId]) => {
      googleData.append(entryId, formData.get(key) || "");
    });

    submit.disabled = true;
    submit.textContent = "접수 중입니다";

    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        body: googleData
      });
      trackEvent("lead_form_submit_success", {
        source: formData.get("source") || "unknown"
      });
      window.location.href = `../thanks/?source=${encodeURIComponent(formData.get("source") || "unknown")}`;
    } catch (err) {
      error.textContent = "접수 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      error.classList.add("show");
      submit.disabled = false;
      submit.textContent = originalSubmitText;
    }
  });
}

function trackThanksPage() {
  if (document.body.dataset.page !== "thanks") return;

  const params = new URLSearchParams(window.location.search);
  const detail = {
    source: params.get("source") || params.get("utm_source") || "unknown"
  };

  trackEvent("generate_lead", detail);
  trackEvent("Custom Event - generate_lead", detail);
}

function bindFloatingCta() {
  const floatingCta = document.querySelector(".floating-cta");
  if (!floatingCta || document.body.dataset.source === "v2-diagnostic") return;

  const update = () => {
    const visible = window.matchMedia("(max-width: 640px)").matches && window.scrollY > 320;
    floatingCta.classList.toggle("is-visible", visible);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function init() {
  applyVariant();
  trackThanksPage();
  bindFloatingCta();
  bindLeadForm();
}

document.addEventListener("DOMContentLoaded", init);
