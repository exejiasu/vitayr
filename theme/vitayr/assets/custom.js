(() => {
  const ALLOWED_LANGUAGES = new Set(["zh-TW", "en-US", "ja-JP"]);
  const FALLBACK_LANGUAGE = "en-US";
  const CHINESE_LANGUAGE = "zh-TW";
  const LANGUAGE_KEY = "language";
  const TRAFFIC_BUTTON_ID = "vitayrTrafficDetailButton";
  const TRAFFIC_MODAL_ID = "vitayrTrafficDetailModal";
  const TRAFFIC_STYLE_ID = "vitayrTrafficDetailStyle";
  const SUBSCRIBE_CONVERTER_ITEM_ID = "vitayrSubscribeConverterItem";
  const SUBSCRIBE_CONVERTER_URL = "https://subconverter.infiniport.xyz";
  const NODE_HISTORY_TIP_ID = "vitayrNodeHistoryTouchTip";
  const CHINESE_LANGUAGE_LABELS = new Set(["中文", "繁体中文", "繁體中文"]);
  const ALLOWED_LANGUAGE_LABELS = new Set(["中文", "繁体中文", "繁體中文", "English", "日本語"]);
  const BLOCKED_LANGUAGE_LABELS = new Set(["简体中文", "簡體中文", "한국어", "Tiếng Việt", "فارسی"]);
  const NODE_STATUS_LABELS = new Set(["节点状态", "節點狀態", "Node Status", "ノード状態", "节点状态 Beta", "節點狀態 Beta", "Node Status Beta", "ノード状態 Beta", "节点状态(BETA)", "節點狀態(BETA)", "Node Status(BETA)", "ノード状態(BETA)"]);

  const languageFromCode = language => {
    const code = String(language || "");
    const lowerCode = code.toLowerCase();

    if (ALLOWED_LANGUAGES.has(code)) return code;
    if (lowerCode.startsWith("zh")) return CHINESE_LANGUAGE;
    if (lowerCode.startsWith("ja")) return "ja-JP";
    if (lowerCode.startsWith("en")) return "en-US";

    return "";
  };
  const browserDefaultLanguage = () => {
    const browserLanguages = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language];

    for (const language of browserLanguages) {
      const normalizedLanguage = languageFromCode(language);
      if (normalizedLanguage) return normalizedLanguage;
    }

    return FALLBACK_LANGUAGE;
  };
  const normalizeLanguage = (language, fallbackLanguage = browserDefaultLanguage()) => languageFromCode(language) || fallbackLanguage;
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
  const browserLanguage = browserDefaultLanguage();
  const preferredLanguage = savedLanguage ? normalizeLanguage(savedLanguage, browserLanguage) : browserLanguage;

  if (window.settings && window.settings.theme) {
    window.settings.theme.default_i18n = preferredLanguage;
  }

  if (!savedLanguage || savedLanguage !== preferredLanguage) {
    localStorage.setItem(LANGUAGE_KEY, preferredLanguage);
  }

  const messages = {
    "zh-TW": {
      button: "流量明細",
      title: "近月流量明細",
      loading: "載入中...",
      empty: "暫無記錄",
      failed: "讀取失敗：",
      recordAt: "記錄時間",
      upload: "實際上行",
	      download: "實際下行",
	      rate: "扣費倍率",
	      total: "合計",
	      subscribeConverter: "訂閱轉換",
	      nodeStatusBeta: "節點狀態"
	    },
	    "en-US": {
	      button: "Transfer Data Details",
      title: "Recent Transfer Data Details",
      loading: "Loading...",
      empty: "No records",
      failed: "Load failed: ",
      recordAt: "Recorded At",
      upload: "Actual Upload",
	      download: "Actual Download",
	      rate: "Deduction Rate",
	      total: "Total",
	      subscribeConverter: "Subscription Converter",
	      nodeStatusBeta: "Node Status"
	    },
	    "ja-JP": {
	      button: "データ通信明細",
      title: "直近のデータ通信明細",
      loading: "読み込み中...",
      empty: "記録はありません",
      failed: "読み込み失敗: ",
      recordAt: "記録日時",
      upload: "アップロード",
	      download: "ダウンロード",
	      rate: "適用レート",
	      total: "合計",
	      subscribeConverter: "サブスク変換",
	      nodeStatusBeta: "ノード状態"
	    }
	  };

  const currentLanguage = () => normalizeLanguage(localStorage.getItem(LANGUAGE_KEY) || (window.settings && window.settings.theme && window.settings.theme.default_i18n));
  const t = key => (messages[currentLanguage()] || messages[FALLBACK_LANGUAGE])[key] || messages[FALLBACK_LANGUAGE][key] || key;
  const cleanText = element => (element.innerText || element.textContent || "").replace(/\s+/g, "").trim();
  const isVisible = element => {
    const box = element.getBoundingClientRect();
    return box.width > 0 && box.height > 0;
  };

  const subscribePatterns = [
    /一[鍵键]訂[閱閲]/,
    /一键订阅/,
    /QuickSubscription/i,
    /ワンクリックインポート/
  ];

	  const resetPatterns = [
    /重置.*流量/,
    /重置.*數據/,
    /重置.*数据/,
    /Reset.*(Data|Traffic|Usage)/i,
    /Data.*Reset/i,
    /データ.*リセット/,
    /リセット/
	  ];

	  const copySubscribePatterns = [
	    /複製.*訂閱/,
	    /复制.*订阅/,
	    /Copy.*Subscription/i,
	    /Subscription.*Copy/i,
	    /購読.*コピー/,
	    /コピー.*購読/
	  ];

	  const qrSubscribePatterns = [
	    /掃描.*二維碼/,
	    /扫描.*二维码/,
	    /QR.*Subscription/i,
	    /Subscription.*QR/i,
	    /二維碼/,
	    /二维码/,
	    /QR/,
	    /コード.*購読/,
	    /購読.*コード/
	  ];

	  const matchesAny = (element, patterns) => {
	    const text = cleanText(element);
	    return patterns.some(pattern => pattern.test(text));
	  };

	  const ensureLanguageMenu = () => {
	    Array.from(document.querySelectorAll("button, a, span, div, li, [role='menuitem']"))
	      .filter(element => {
	        const box = element.getBoundingClientRect();
	        return box.width > 0 && box.height > 0 && CHINESE_LANGUAGE_LABELS.has((element.innerText || element.textContent || "").replace(/\s+/g, " ").trim());
	      })
	      .forEach(element => {
	        element.childNodes.forEach(node => {
	          if (node.nodeType === Node.TEXT_NODE && CHINESE_LANGUAGE_LABELS.has(node.nodeValue.trim())) {
	            node.nodeValue = node.nodeValue.replace(/繁[体體]中文/g, "中文");
	          }
	        });

	        if (CHINESE_LANGUAGE_LABELS.has((element.innerText || element.textContent || "").replace(/\s+/g, " ").trim())) {
	          element.title = element.title ? element.title.replace(/繁[体體]中文/g, "中文") : element.title;
	          element.setAttribute("aria-label", (element.getAttribute("aria-label") || "").replace(/繁[体體]中文/g, "中文"));
	        }
	      });

	    const candidates = Array.from(document.querySelectorAll(".ant-dropdown-menu li, .ant-dropdown-menu a, [role='menuitem'], [class*='ant-dropdown-menu'] a"));

	    candidates.forEach(element => {
	      const text = (element.innerText || element.textContent || "").replace(/\s+/g, " ").trim();
	      if (!text) return;

	      const menuItem = element.closest(".ant-dropdown-menu-item, li, [role='menuitem']") || element;
	      if (BLOCKED_LANGUAGE_LABELS.has(text)) {
	        menuItem.style.display = "none";
	      } else if (ALLOWED_LANGUAGE_LABELS.has(text)) {
	        menuItem.style.display = "";
	      }
	    });
	  };

	  const ensureNodeStatusBetaLabels = () => {
	    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
	    const label = t("nodeStatusBeta");
	    const nodes = [];

	    while (walker.nextNode()) nodes.push(walker.currentNode);

	    nodes.forEach(node => {
	      const text = String(node.nodeValue || "").trim();
	      if (!NODE_STATUS_LABELS.has(text) || text === label) return;
	      node.nodeValue = node.nodeValue.replace(text, label);
	    });
	  };

	  const converterIcon = () => `
	    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" aria-hidden="true">
	      <path fill="currentColor" d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-4.9-2.4-7.3-1.4l4.4 4.4-3.1 3.1-4.5-4.3C.4 7.2.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
	    </svg>
	  `;

	  const ensureStyle = () => {
    if (document.getElementById(TRAFFIC_STYLE_ID)) return;

	    const style = document.createElement("style");
	    style.id = TRAFFIC_STYLE_ID;
	    style.textContent = `
		      #${TRAFFIC_MODAL_ID}{position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.42);display:flex;align-items:center;justify-content:center;padding:24px;animation:antFadeIn .2s linear both}
		      #${TRAFFIC_MODAL_ID}.vitayr-traffic-leave{animation:antFadeOut .2s linear both;pointer-events:none}
		      #${TRAFFIC_MODAL_ID} .vitayr-traffic-box{width:min(860px,calc(100vw - 32px));max-height:calc(100vh - 80px);overflow:auto;background:#fff;color:#111;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,.28);transform-origin:center;animation:antZoomIn .2s cubic-bezier(.08,.82,.17,1) both}
		      #${TRAFFIC_MODAL_ID}.vitayr-traffic-leave .vitayr-traffic-box{animation:antZoomOut .2s cubic-bezier(.78,.14,.15,.86) both}
	      #${TRAFFIC_MODAL_ID} .vitayr-traffic-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee;font-weight:700;font-size:16px}
	      #${TRAFFIC_MODAL_ID} .vitayr-traffic-close{border:0;background:transparent;font-size:22px;line-height:1;cursor:pointer;color:#666}
	      #${TRAFFIC_MODAL_ID} .vitayr-traffic-body{padding:16px 20px}
	      #${TRAFFIC_MODAL_ID} .vitayr-traffic-message{padding:18px;color:#666;text-align:center}
	      #${TRAFFIC_MODAL_ID} table{width:100%;border-collapse:collapse;font-size:13px}
	      #${TRAFFIC_MODAL_ID} th,#${TRAFFIC_MODAL_ID} td{padding:10px 8px;border-bottom:1px solid #eee;text-align:right;white-space:nowrap}
	      #${TRAFFIC_MODAL_ID} th:first-child,#${TRAFFIC_MODAL_ID} td:first-child{text-align:left}
		      @media (prefers-reduced-motion:reduce){#${TRAFFIC_MODAL_ID},#${TRAFFIC_MODAL_ID}.vitayr-traffic-leave,#${TRAFFIC_MODAL_ID} .vitayr-traffic-box,#${TRAFFIC_MODAL_ID}.vitayr-traffic-leave .vitayr-traffic-box{animation:none}}
		    `;
	    document.head.appendChild(style);
	  };

  const escapeHtml = value => String(value == null ? "" : value).replace(/[&<>"']/g, match => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[match]);

  const formatBytes = value => {
    let size = Number(value) || 0;
    const units = ["B", "KB", "MB", "GB", "TB"];
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }

    return `${unitIndex ? size.toFixed(2) : Math.round(size)} ${units[unitIndex]}`;
  };

  const formatDate = value => {
    const date = new Date((Number(value) || 0) * 1000);
    if (Number.isNaN(date.getTime())) return "-";

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("/");
  };

		  const closeTrafficModal = modal => {
		    if (!modal || modal.classList.contains("vitayr-traffic-leave")) return;
		    modal.classList.add("vitayr-traffic-leave");
		    window.setTimeout(() => modal.remove(), 220);
		  };

	  const showModal = html => {
	    ensureStyle();
	    const existingModal = document.getElementById(TRAFFIC_MODAL_ID);

	    if (existingModal && !existingModal.classList.contains("vitayr-traffic-leave")) {
	      const title = existingModal.querySelector(".vitayr-traffic-head span");
	      const body = existingModal.querySelector(".vitayr-traffic-body");

	      if (title) title.textContent = t("title");
	      if (body) body.innerHTML = html;
	      return;
	    }

	    existingModal?.remove();

	    const modal = document.createElement("div");
	    modal.id = TRAFFIC_MODAL_ID;
    modal.innerHTML = `
      <div class="vitayr-traffic-box">
        <div class="vitayr-traffic-head">
          <span>${escapeHtml(t("title"))}</span>
          <button class="vitayr-traffic-close" type="button" aria-label="Close">×</button>
        </div>
        <div class="vitayr-traffic-body">${html}</div>
      </div>
    `;
	    modal.addEventListener("click", event => {
	      if (event.target === modal || event.target.classList.contains("vitayr-traffic-close")) {
	        closeTrafficModal(modal);
	      }
	    });
	    document.body.appendChild(modal);
  };

  const extractRows = json => {
    if (Array.isArray(json && json.data)) return json.data;
    if (Array.isArray(json && json.data && json.data.data)) return json.data.data;
    return [];
  };

	  const openTrafficDetails = async () => {
    showModal(`<div class="vitayr-traffic-message">${escapeHtml(t("loading"))}</div>`);

    try {
      const token = localStorage.getItem("authorization") || "";
      const response = await fetch("/api/v1/user/stat/getTrafficLog", {
        headers: token ? { Authorization: token } : {},
        credentials: "include"
      });
      const json = await response.json();

      if (!response.ok || (json.code && json.code !== 200)) {
        throw new Error(json.message || `HTTP ${response.status}`);
      }

      const rows = extractRows(json);
      if (!rows.length) {
        showModal(`<div class="vitayr-traffic-message">${escapeHtml(t("empty"))}</div>`);
        return;
      }

      showModal(`
        <table>
          <thead>
            <tr>
              <th>${escapeHtml(t("recordAt"))}</th>
              <th>${escapeHtml(t("upload"))}</th>
              <th>${escapeHtml(t("download"))}</th>
              <th>${escapeHtml(t("rate"))}</th>
              <th>${escapeHtml(t("total"))}</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => {
              const rate = Number(row.server_rate) || 0;
              const total = ((Number(row.u) || 0) + (Number(row.d) || 0)) * rate;
              return `
                <tr>
                  <td>${escapeHtml(formatDate(row.record_at))}</td>
                  <td>${escapeHtml(formatBytes(row.u))}</td>
                  <td>${escapeHtml(formatBytes(row.d))}</td>
                  <td>${rate ? escapeHtml(`${rate.toFixed(2)} x`) : "-"}</td>
                  <td>${escapeHtml(formatBytes(total))}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      `);
    } catch (error) {
      showModal(`<div class="vitayr-traffic-message">${escapeHtml(t("failed") + (error.message || error))}</div>`);
    }
	  };

	  const openSubscribeConverter = () => {
	    window.open(SUBSCRIBE_CONVERTER_URL, "_blank");
	  };

	  const ensureSubscribeConverterItem = () => {
	    const items = Array.from(document.querySelectorAll('[class*="mICH9"]')).filter(isVisible);
	    const copyItem = items.find(item => matchesAny(item, copySubscribePatterns));
	    const qrItem = items.find(item => item !== copyItem && matchesAny(item, qrSubscribePatterns));
	    const anchorItem = qrItem || copyItem;

	    if (!copyItem || !anchorItem || !anchorItem.parentElement) return;

	    let converterItem = document.getElementById(SUBSCRIBE_CONVERTER_ITEM_ID);
	    if (converterItem && converterItem.parentElement !== anchorItem.parentElement) {
	      converterItem.remove();
	      converterItem = null;
	    }

	    if (!converterItem) {
	      converterItem = anchorItem.cloneNode(false);
	      converterItem.id = SUBSCRIBE_CONVERTER_ITEM_ID;
	      converterItem.setAttribute("role", "button");
	      converterItem.tabIndex = 0;
	      converterItem.addEventListener("click", event => {
	        event.preventDefault();
	        event.stopPropagation();
	        openSubscribeConverter();
	      });
	      converterItem.addEventListener("keydown", event => {
	        if (event.key === "Enter" || event.key === " ") {
	          event.preventDefault();
	          openSubscribeConverter();
	        }
	      });
	      anchorItem.parentElement.insertBefore(converterItem, anchorItem.nextSibling);
	    } else if (converterItem.previousElementSibling !== anchorItem) {
	      anchorItem.parentElement.insertBefore(converterItem, anchorItem.nextSibling);
	    }

	    converterItem.className = anchorItem.className;
	    converterItem.innerHTML = `${converterIcon()}<span>${escapeHtml(t("subscribeConverter"))}</span>`;
	  };

	  const ensureTrafficButton = () => {
    const buttons = Array.from(document.querySelectorAll("button")).filter(isVisible);
    const subscribeButton = buttons.find(button => matchesAny(button, subscribePatterns));
    if (!subscribeButton || !subscribeButton.parentElement) return;

    const row = subscribeButton.parentElement;
    const rowButtons = Array.from(row.querySelectorAll("button")).filter(isVisible);
    const resetButton = rowButtons.find(button => button !== subscribeButton && button.id !== TRAFFIC_BUTTON_ID && matchesAny(button, resetPatterns))
      || rowButtons.find(button => button !== subscribeButton && button.id !== TRAFFIC_BUTTON_ID);

    if (!resetButton) return;

    let trafficButton = document.getElementById(TRAFFIC_BUTTON_ID);
    if (trafficButton && trafficButton.parentElement !== row) {
      trafficButton.remove();
      trafficButton = null;
    }

    if (!trafficButton) {
      trafficButton = subscribeButton.cloneNode(false);
      trafficButton.id = TRAFFIC_BUTTON_ID;
      trafficButton.type = "button";
      trafficButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        openTrafficDetails();
      });
      row.insertBefore(trafficButton, resetButton);
    } else if (trafficButton.nextElementSibling !== resetButton) {
      row.insertBefore(trafficButton, resetButton);
    }

    const buttonLabel = t("button");
    trafficButton.className = subscribeButton.className;
    if (trafficButton.textContent !== buttonLabel) trafficButton.textContent = buttonLabel;
    if (trafficButton.title !== buttonLabel) trafficButton.title = buttonLabel;
    trafficButton.style.marginLeft = "auto";
    trafficButton.style.whiteSpace = "nowrap";
    trafficButton.style.display = "inline-flex";
    trafficButton.style.alignItems = "center";
    trafficButton.style.justifyContent = "center";

    const rowStyle = getComputedStyle(row);
    const rowGap = rowStyle.columnGap || rowStyle.gap;
    resetButton.style.marginLeft = rowGap && rowGap !== "normal" && rowGap !== "0px" ? "0px" : "8px";
  };

	  let nodeHistoryTipTimer = 0;
	  const hideNodeHistoryTip = () => {
	    window.clearTimeout(nodeHistoryTipTimer);
	    document.getElementById(NODE_HISTORY_TIP_ID)?.remove();
	  };
	  const showNodeHistoryTip = target => {
	    const text = target && target.getAttribute("data-tip");
	    if (!text) return;
	    hideNodeHistoryTip();

	    const tip = document.createElement("div");
	    tip.id = NODE_HISTORY_TIP_ID;
	    tip.className = "vitayr-native-nodes-touch-tip";
	    tip.textContent = text;
	    document.body.appendChild(tip);

	    const targetBox = target.getBoundingClientRect();
	    const tipBox = tip.getBoundingClientRect();
	    const left = Math.max(12, Math.min(window.innerWidth - tipBox.width - 12, targetBox.left + targetBox.width / 2 - tipBox.width / 2));
	    const top = Math.max(12, targetBox.top - tipBox.height - 10);
	    tip.style.left = `${left}px`;
	    tip.style.top = `${top}px`;
	    nodeHistoryTipTimer = window.setTimeout(hideNodeHistoryTip, 3200);
	  };
	  const setupNodeHistoryTips = (() => {
	    let ready = false;

	    return () => {
	      if (ready) return;
	      ready = true;

	      document.addEventListener("pointerdown", event => {
	        const target = event.target && event.target.closest && event.target.closest(".vitayr-native-nodes-history-segment[data-tip]");
	        if (!target) {
	          hideNodeHistoryTip();
	          return;
	        }
	        if (event.pointerType && event.pointerType !== "mouse") showNodeHistoryTip(target);
	      }, true);
	      document.addEventListener("touchstart", event => {
	        const target = event.target && event.target.closest && event.target.closest(".vitayr-native-nodes-history-segment[data-tip]");
	        if (target) showNodeHistoryTip(target);
	      }, { passive: true, capture: true });
	      window.addEventListener("resize", hideNodeHistoryTip);
	      document.addEventListener("scroll", hideNodeHistoryTip, true);
	    };
	  })();

	  const ensureEnhancements = () => {
	    ensureLanguageMenu();
	    ensureNodeStatusBetaLabels();
	    ensureTrafficButton();
	    ensureSubscribeConverterItem();
	    setupNodeHistoryTips();
	  };

	  let pendingEnsureEnhancements = false;
	  const scheduleEnsureEnhancements = () => {
	    if (pendingEnsureEnhancements) return;
	    pendingEnsureEnhancements = true;
	    window.requestAnimationFrame(() => {
	      pendingEnsureEnhancements = false;
	      ensureEnhancements();
	    });
	  };
	  document.addEventListener("DOMContentLoaded", scheduleEnsureEnhancements);
	  window.addEventListener("load", scheduleEnsureEnhancements);
	  window.addEventListener("hashchange", scheduleEnsureEnhancements);
	  new MutationObserver(scheduleEnsureEnhancements).observe(document.documentElement, {
	    childList: true,
	    subtree: true,
	    characterData: true
	  });
	  window.setInterval(ensureEnhancements, 1000);
	})();
