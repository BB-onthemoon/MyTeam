// ---- CONSTANTS ----

// สีชื่อ agent ใน feed (map ชื่อ → CSS class)
const AGENT_COLOR_CLASS = {
  Elysia: 'agent-elysia',
  Sakura: 'agent-sakura',
  Mobius: 'agent-mobius',
  Aponia: 'agent-aponia',
};

// status → CSS class สำหรับ dot
const STATUS_DOT_CLASS = {
  idle:      'dot-idle',
  working:   'dot-working',
  waiting:   'dot-waiting',
  reviewing: 'dot-reviewing',
  done:      'dot-done',
};

// ---- STATE ----

// บอกว่าเคยโหลดสำเร็จมาก่อนหรือยัง
// ถ้า true และ fetch พลาดอีก → คงข้อมูลเดิม (ไม่ล้าง DOM)
let hasLoadedSuccessfully = false;

// ---- UTILITY FUNCTIONS ----

/**
 * formatTimeAgo — คำนวณเวลาที่ผ่านมาจาก ISO string
 * คืนค่า "X seconds ago" / "X minutes ago" / "X hours ago"
 */
function formatTimeAgo(isoString) {
  const updatedDate = new Date(isoString);
  const now = new Date();

  // clamp ไม่ให้ติดลบ — กรณี timestamp เป็นอนาคต หรือ clock drift เล็กน้อย
  const diffSeconds = Math.max(0, Math.floor((now - updatedDate) / 1000));

  if (diffSeconds < 5) {
    // น้อยกว่า 5 วินาที = "just now" ดูเป็นธรรมชาติกว่า "0 seconds ago"
    return 'อัปเดตเมื่อสักครู่';
  } else if (diffSeconds < 60) {
    return `updated ${diffSeconds} seconds ago`;
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    return `updated ${minutes} min ago`;
  } else {
    const hours = Math.floor(diffSeconds / 3600);
    return `updated ${hours} hr ago`;
  }
}

/**
 * formatHHMM — แปลง ISO timestamp เป็น "HH:MM"
 * แสดงเวลา Bangkok เสมอ ให้ตรงกับ timestamp ที่เก็บ (+07:00)
 * ไม่ใช้ local time ของเครื่อง เพราะผู้เปิดอาจอยู่ต่าง timezone
 */
function formatHHMM(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Bangkok',
  });
}

// ---- UPDATE FUNCTIONS ----

/**
 * updateOfficeStatus — รับ data จาก office_status.json
 * แล้ว update:
 *   1. topbar sub text (session number)
 *   2. sidebar session card (session, step, label, time)
 *   3. topbar "updated X ago" label
 *   4. sidebar team status รายคน (dot, status text, task text)
 *   5. ห้อง: dot สี + task bubble รายคน
 */
function updateOfficeStatus(data) {
  // ---- 1. topbar sub: "Visual Office · Session NNN" ----
  const topbarSub = document.getElementById('js-topbar-sub');
  if (topbarSub && data.current_session != null) {
    topbarSub.textContent = `Visual Office · Session ${data.current_session}`;
  }

  // ---- 2. sidebar session card ----
  const sbSession = document.getElementById('js-sb-session');
  if (sbSession && data.current_session != null) {
    sbSession.textContent = data.current_session;
  }

  const sbStepNum = document.getElementById('js-sb-step-num');
  if (sbStepNum && data.current_step != null) {
    sbStepNum.textContent = `Step ${data.current_step}`;
  }

  const sbStepLabel = document.getElementById('js-sb-step-label');
  if (sbStepLabel && data.step_label != null) {
    sbStepLabel.textContent = data.step_label;
  }

  // sidebar time: "อัปเดตเมื่อ HH:MM · X min ago"
  const sbTime = document.getElementById('js-sb-time');
  if (sbTime && data.updated_at) {
    const hhMM = formatHHMM(data.updated_at);
    const timeAgo = formatTimeAgo(data.updated_at);
    // formatTimeAgo คืนข้อความแบบ "updated X min ago" หรือ "อัปเดตเมื่อสักครู่"
    // ถ้าเป็น "อัปเดตเมื่อสักครู่" ให้แสดงแค่นั้น ไม่ต้องซ้ำ HH:MM
    if (timeAgo === 'อัปเดตเมื่อสักครู่') {
      sbTime.textContent = `อัปเดตเมื่อ ${hhMM} · สักครู่`;
    } else {
      // "updated X min ago" → แปลงเป็น "อัปเดตเมื่อ HH:MM · X min ago"
      const agoShort = timeAgo.replace('updated ', '');
      sbTime.textContent = `อัปเดตเมื่อ ${hhMM} · ${agoShort}`;
    }
  }

  // ---- 3. topbar "updated X ago" label มุมขวาบน ----
  const updatedLabel = document.getElementById('js-updated-label');
  if (updatedLabel && data.updated_at) {
    updatedLabel.textContent = formatTimeAgo(data.updated_at);
  }

  // ---- 4 + 5. วน update แต่ละ agent ----
  const agents = data.agents;
  if (!agents) return;

  Object.keys(agents).forEach(function(agentName) {
    const agentData = agents[agentName];

    // -- 4a. sidebar dot สี --
    const sbDot = document.getElementById(`js-sb-dot-${agentName}`);
    if (sbDot) {
      const allDotClasses = Object.values(STATUS_DOT_CLASS);
      allDotClasses.forEach(function(cls) { sbDot.classList.remove(cls); });
      const newClass = STATUS_DOT_CLASS[agentData.status] || STATUS_DOT_CLASS.idle;
      sbDot.classList.add(newClass);
    }

    // -- 4b. sidebar status text --
    const sbStatus = document.getElementById(`js-sb-status-${agentName}`);
    if (sbStatus) {
      sbStatus.textContent = agentData.status || 'idle';
    }

    // -- 4c. sidebar task text --
    const sbTask = document.getElementById(`js-sb-task-${agentName}`);
    if (sbTask) {
      sbTask.textContent = agentData.task?.trim() || '—';
    }

    // -- 5a. ห้อง: dot สี --
    const roomDot = document.getElementById(`js-dot-${agentName}`);
    if (roomDot) {
      const allDotClasses = Object.values(STATUS_DOT_CLASS);
      allDotClasses.forEach(function(cls) { roomDot.classList.remove(cls); });
      const newClass = STATUS_DOT_CLASS[agentData.status] || STATUS_DOT_CLASS.idle;
      roomDot.classList.add(newClass);
    }

    // -- 5c. ห้อง: ผูกสถานะไว้ที่ workstation (.ws) เพื่อ trigger animation
    //         เช่น working → ตัวละคร bob + จอกะพริบ (CSS อ่านจาก [data-status]) --
    const wsElement = document.querySelector(`.room-inner [data-agent="${agentName}"]`);
    if (wsElement) {
      wsElement.dataset.status = agentData.status || 'idle';
    }

    // -- 5b. ห้อง: task bubble --
    const bubbleElement = document.getElementById(`js-bubble-${agentName}`);
    if (bubbleElement) {
      const taskText = agentData.task || '';
      if (taskText.trim() === '') {
        bubbleElement.hidden = true;
        bubbleElement.textContent = '';
      } else {
        bubbleElement.textContent = taskText;
        bubbleElement.hidden = false;
      }
    }
  });
}

/**
 * updateActivityFeed — รับ array ของ log entries (parsed จาก JSONL)
 * S012: sidebar feed แสดง 5 ล่าสุด, drawer แสดง 10 ล่าสุด (live update ทั้งคู่)
 * เรียงใหม่→เก่าเหมือนกัน, drawer คือ superset ของ sidebar
 */
function updateActivityFeed(logEntries) {
  // js-feed-list ย้ายมาอยู่ใน sidebar แล้ว (Step 4) — id เดิมยังใช้ได้
  // js-feed-count เปลี่ยนเป็น js-sb-feed-count ตาม sidebar HTML ใหม่
  // js-feed-drawer-list คือ list ใน drawer (S012) — อาจไม่มีถ้า markup เก่า
  const feedList = document.getElementById('js-feed-list');
  const feedCount = document.getElementById('js-sb-feed-count');
  const drawerList = document.getElementById('js-feed-drawer-list');
  if (!feedList) return;

  // กรอง entry ที่ไม่มี time หรือ agent (ป้องกัน malformed data)
  const validEntries = logEntries.filter(function(entry) {
    return entry && entry.time && entry.agent;
  });

  // เรียงจากเก่าไปใหม่ก่อน (ascending) แล้วเอา 10 ท้าย = 10 ล่าสุด
  const sorted = validEntries.slice().sort(function(a, b) {
    return new Date(a.time) - new Date(b.time);
  });

  // 10 ล่าสุด เรียงใหม่→เก่า (สำหรับ drawer)
  const latest10 = sorted.slice(-10).reverse();
  // 5 ล่าสุด (สำหรับ sidebar) = 5 ตัวแรกของ latest10
  const latest5 = latest10.slice(0, 5);

  // count ในหัว section = จำนวนที่แสดงใน sidebar
  if (feedCount) {
    feedCount.textContent = `${latest5.length} รายการล่าสุด`;
  }

  // ---- sidebar feed (5 รายการ) ----
  if (latest5.length === 0) {
    feedList.innerHTML = '<li class="feed-empty">ยังไม่มี activity</li>';
  } else {
    feedList.innerHTML = renderFeedItems(latest5);
  }

  // ---- drawer feed (10 รายการ) — render เฉพาะถ้ามี element ----
  if (drawerList) {
    if (latest10.length === 0) {
      drawerList.innerHTML = '<li class="feed-empty">ยังไม่มี activity</li>';
    } else {
      drawerList.innerHTML = renderFeedItems(latest10);
    }
  }
}

/**
 * renderFeedItems — รับ array ของ entry (เรียงไว้แล้ว) → คืน HTML string ของ <li>
 * แยกออกมาเพื่อให้ sidebar (5) และ drawer (10) ใช้ markup เดียวกัน (DRY)
 */
function renderFeedItems(entries) {
  return entries.map(function(entry) {
    const timeText = formatHHMM(entry.time);
    const agentName = entry.agent || 'Unknown';
    const actionText = entry.action || '';

    // หา CSS class สีสำหรับชื่อ agent (fallback = ไม่มีสี)
    const agentClass = AGENT_COLOR_CLASS[agentName] || '';

    // สร้าง HTML ของ <li> แต่ละบรรทัด
    return `<li class="feed-item">
      <span class="feed-time">${escapeHtml(timeText)}</span>
      <span class="feed-agent ${agentClass}">${escapeHtml(agentName)}</span>
      <span class="feed-action">${escapeHtml(actionText)}</span>
    </li>`;
  }).join('');
}

/**
 * escapeHtml — ป้องกัน XSS เวลา inject text ลง innerHTML
 * escape " และ ' เพิ่มเติมด้วย เพื่อ guard กรณีนำค่าไปใส่ใน attribute context ในอนาคต
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---- FETCH FUNCTIONS ----

/**
 * fetchOfficeStatus — ดึง office_status.json แล้วส่งให้ updateOfficeStatus
 * ถ้าล้มเหลวและยังไม่เคยโหลดสำเร็จ → แสดง error banner
 * ถ้าล้มเหลวแต่เคยโหลดสำเร็จแล้ว → คงข้อมูลเดิม (ไม่ทำอะไร)
 */
async function fetchOfficeStatus() {
  try {
    const response = await fetch('./office_status.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    updateOfficeStatus(data);
    return true; // โหลดสำเร็จ
  } catch (error) {
    console.warn('fetchOfficeStatus failed:', error.message);
    return false; // โหลดไม่สำเร็จ
  }
}

/**
 * fetchActivityLog — ดึง activity_log.jsonl
 * แยกทีละบรรทัด parse JSON แต่ละบรรทัด (ข้าม blank line)
 */
async function fetchActivityLog() {
  try {
    const response = await fetch('./activity_log.jsonl', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const rawText = await response.text();

    // แยกบรรทัด → parse JSON ทีละบรรทัด → ข้าม blank line หรือ parse error
    const entries = rawText
      .split('\n')
      .filter(function(line) { return line.trim() !== ''; })
      .map(function(line) {
        try {
          return JSON.parse(line);
        } catch {
          // บรรทัดไหน parse ไม่ได้ → ข้าม (ไม่ให้ทั้งหมดพัง)
          return null;
        }
      })
      .filter(function(entry) { return entry !== null; });

    updateActivityFeed(entries);
    return true;
  } catch (error) {
    console.warn('fetchActivityLog failed:', error.message);
    return false;
  }
}

/**
 * showErrorBanner — แสดง banner เล็กๆ บอกให้ใช้ Live Server
 */
function showErrorBanner() {
  const banner = document.getElementById('js-error-banner');
  if (banner) banner.hidden = false;
}

/**
 * hideErrorBanner — ซ่อน banner เมื่อโหลดสำเร็จ
 */
function hideErrorBanner() {
  const banner = document.getElementById('js-error-banner');
  if (banner) banner.hidden = true;
}

// ---- MAIN REFRESH CYCLE ----

/**
 * refreshAll — fetch ทั้ง 2 ไฟล์พร้อมกัน แล้วจัดการ error state แยกต่อ fetch
 * เรียกตอน init และทุก 5 วินาที
 *
 * Logic:
 * - statusLoaded / logLoaded ประเมินแยกกัน — ถ้า status สำเร็จ ข้อมูลห้องอัปเดตปกติ
 *   แม้ log จะ fail ก็ไม่เขียนทับ label ว่า "โหลดไม่ได้"
 * - hasLoadedSuccessfully = true เมื่อ ทั้งคู่เคยสำเร็จสักครั้ง (เพื่อคง fallback)
 * - error banner หน่วง 1500ms ก่อนแสดงครั้งแรก — ป้องกัน flash ตอน transient
 */
async function refreshAll() {
  const [statusLoaded, logLoaded] = await Promise.all([
    fetchOfficeStatus(),
    fetchActivityLog(),
  ]);

  // ถ้า status สำเร็จแล้วยัง mark ว่า "โหลดได้บางส่วน" อย่าเขียนทับ label
  if (statusLoaded && logLoaded) {
    hasLoadedSuccessfully = true;
    hideErrorBanner();
    return;
  }

  // ถ้าอย่างน้อยหนึ่งอย่างสำเร็จ และเคยโหลดสำเร็จแล้วก่อนหน้า → คงข้อมูลเดิม
  if (hasLoadedSuccessfully) {
    // ไม่ทำอะไร — ข้อมูลเดิมยังค้างอยู่บนหน้าจอ
    return;
  }

  // === กรณีที่ยังไม่เคยโหลดสำเร็จเลย (เช่น เปิดผ่าน file://) ===

  // ถ้า status fetch สำเร็จ → อย่าเขียนทับ label ว่าโหลดไม่ได้
  // ถ้า status fetch ล้มเหลว → แสดง "—" ที่ updated label
  if (!statusLoaded) {
    const updatedLabel = document.getElementById('js-updated-label');
    if (updatedLabel) updatedLabel.textContent = 'ไม่สามารถโหลดข้อมูล';
  }

  // ถ้า log fetch ล้มเหลว → แสดง empty state ใน feed
  if (!logLoaded) {
    const feedList = document.getElementById('js-feed-list');
    if (feedList && feedList.children.length === 0) {
      feedList.innerHTML = '<li class="feed-empty">ไม่สามารถโหลด activity — เปิดผ่าน Live Server</li>';
    }
    const feedCount = document.getElementById('js-sb-feed-count');
    if (feedCount) feedCount.textContent = '—';
  }

  // หน่วง banner ~1500ms ก่อนแสดงครั้งแรก — ป้องกัน flash ตอน transient network
  setTimeout(function() {
    // ตรวจอีกครั้งว่ายังไม่ได้โหลดสำเร็จ ก่อนแสดง banner
    if (!hasLoadedSuccessfully) {
      showErrorBanner();
    }
  }, 1500);
}

// ---- MOBILE SIDEBAR TOGGLE ----

/**
 * initSidebarToggle — ผูก click handler บน #js-sb-toggle-btn
 * กดครั้งหนึ่ง: ยุบ sb-body (เพิ่ม class sb-body--collapsed)
 * กดอีกครั้ง: ขยาย sb-body (ลบ class sb-body--collapsed)
 * sync aria-expanded บน button ด้วยทุกครั้ง
 */
function initSidebarToggle() {
  const toggleBtn = document.getElementById('js-sb-toggle-btn');
  const sbBody = document.getElementById('sb-body');

  // guard: ถ้าไม่เจอ element ทั้งคู่ ไม่ทำอะไร (ป้องกัน console error)
  if (!toggleBtn || !sbBody) return;

  toggleBtn.addEventListener('click', function() {
    const isCurrentlyExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';

    if (isCurrentlyExpanded) {
      // ยุบ: ซ่อน sb-body
      sbBody.classList.add('sb-body--collapsed');
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      // ขยาย: แสดง sb-body
      sbBody.classList.remove('sb-body--collapsed');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });
}

// ---- ACTIVITY DRAWER (S012) ----

/**
 * initFeedDrawer — เปิด/ปิด drawer activity (slide จากซ้าย)
 * เปิด: ปุ่ม "ดูทั้งหมด"  |  ปิด: ปุ่ม X / คลิก backdrop / กด Esc
 *
 * กลไก animation:
 * - เปิด: เอา hidden ออก (element กลับมา render) → รอ 2 เฟรม (reflow) → add .is-open ให้ transition ทำงาน
 * - ปิด: remove .is-open (slide ออก) → ตั้ง timer 300ms (≈ transition) แล้วค่อย hidden=true
 *   ใช้ timer แทน transitionend เพราะ prefers-reduced-motion ปิด transition จะไม่ยิง event
 */
function initFeedDrawer() {
  const drawer = document.getElementById('js-feed-drawer');
  const backdrop = document.getElementById('js-feed-backdrop');
  const openBtn = document.getElementById('js-feed-showall');
  const closeBtn = document.getElementById('js-feed-drawer-close');

  // guard: ถ้า markup ไม่ครบ ไม่ผูก handler (ป้องกัน console error)
  if (!drawer || !backdrop || !openBtn) return;

  let hideTimer = null;

  function openDrawer() {
    // ถ้ากำลังจะ hidden อยู่ ยกเลิกก่อน
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }

    drawer.hidden = false;
    backdrop.hidden = false;

    // รอ 2 เฟรมให้ browser paint state เริ่มต้น (translateX -100%) ก่อน slide
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        drawer.classList.add('is-open');
        backdrop.classList.add('is-open');
      });
    });

    openBtn.setAttribute('aria-expanded', 'true');
    // ย้าย focus ไปปุ่มปิด เพื่อ keyboard/screen-reader
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    openBtn.setAttribute('aria-expanded', 'false');

    // คืน focus ไปปุ่มที่เปิด
    openBtn.focus();

    // หลัง slide ออกจบ → ซ่อนสนิท (display:none) กัน tab เข้า drawer ที่ปิดอยู่
    hideTimer = setTimeout(function() {
      drawer.hidden = true;
      backdrop.hidden = true;
      hideTimer = null;
    }, 300);
  }

  openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // Esc ปิด drawer (a11y) — เฉพาะตอนเปิดอยู่
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

// ---- COLOR PANEL TOGGLE (S015) ----

/**
 * initColorPanel — เปิด/ปิด floating color-panel มุมล่างขวา
 * เปิด : คลิก #js-color-trigger
 * ปิด  : คลิก #js-color-panel-close | กด Esc ขณะ panel เปิด | คลิก trigger อีกครั้ง (toggle)
 *
 * กลไก show/hide:
 * - ใช้ HTML attribute `hidden` (ไม่มี slide animation — panel pop in/out ตาม CSS)
 * - aria-expanded บน trigger sync ทุกครั้ง เพื่อ screen reader
 *
 * Esc handler: add document keydown listener แยก (ไม่ใช่ handler รวมศูนย์)
 * — pattern เดียวกับ initFeedDrawer ที่มีอยู่แล้ว
 */
function initColorPanel() {
  const trigger = document.getElementById('js-color-trigger');
  const panel   = document.getElementById('js-color-panel');
  const closeBtn = document.getElementById('js-color-panel-close');

  // guard: ถ้าหา element หลักไม่เจอ ไม่ผูก handler (ป้องกัน console error)
  if (!trigger || !panel) return;

  // --- helper: เปิด panel ---
  function openPanel() {
    panel.removeAttribute('hidden');
    trigger.setAttribute('aria-expanded', 'true');
  }

  // --- helper: ปิด panel ---
  function closePanel() {
    panel.setAttribute('hidden', '');
    trigger.setAttribute('aria-expanded', 'false');
  }

  // --- trigger: toggle เปิด/ปิด ---
  trigger.addEventListener('click', function() {
    const isPanelOpen = !panel.hasAttribute('hidden');
    if (isPanelOpen) {
      closePanel();
    } else {
      openPanel();
    }
  });

  // --- ปุ่มปิด (X) ใน panel header ---
  if (closeBtn) {
    closeBtn.addEventListener('click', closePanel);
  }

  // --- Esc ปิด panel (a11y) — เฉพาะตอน panel เปิดอยู่ ---
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !panel.hasAttribute('hidden')) {
      closePanel();
    }
  });
}

// ---- WINDOW TINT (F) ----

/**
 * updateWindowTint — เปลี่ยนโทน "กระจก" หน้าต่างตามช่วงเวลาจริง (ผนังไม่เปลี่ยน)
 * เซ็ต --window-glass บน :root → .wall-window ทุกบานรับไปใช้พร้อมกัน
 * เรียกครั้งเดียวตอน load (ช่วงเวลาเปลี่ยนช้า ไม่ต้อง loop)
 */
function updateWindowTint() {
  const hour = new Date().getHours();
  let glass;
  if (hour >= 22 || hour < 6) {
    glass = '#1a2a4a'; // กลางคืน — navy เข้ม
  } else if (hour >= 10 && hour < 16) {
    glass = '#a8d6ec'; // กลางวัน — ฟ้าสว่าง
  } else {
    glass = '#e0b878'; // เช้า/เย็น — ส้มอมเหลืองอุ่น
  }
  document.documentElement.style.setProperty('--window-glass', glass);
}

// ---- COLOR THEME (S015) ----

/**
 * ค่า default ของสีทั้ง 4 element
 * เก็บเป็น const ร่วมกันเพื่อให้ initColorTheme + resetColorTheme ใช้ค่าเดียวกัน
 * ไม่ hardcode ซ้ำในหลายที่
 */
const DEFAULT_COLORS = {
  floor: '#ddd5a8',
  wall:  '#5a6b3a',
  desk:  '#c8a455',
  rug:   '#8b4a3a',
};

/**
 * config ของ CSS variables ที่ derive จากสีหลักแต่ละ target
 * รูปแบบ: { cssVar: '--var-name', shade: <percent> }
 *   shade บวก = สว่างขึ้น (lighten)
 *   shade ลบ  = เข้มลง (darken)
 *   shade 0   = สีหลัก (base)
 *
 * ใช้ data structure แทน if-else ยาว — อ่านง่าย ขยาย target ใหม่ได้ง่าย
 */
const COLOR_VAR_MAP = {
  floor: [
    { cssVar: '--floor-a',    shade:   0 },  // base
    { cssVar: '--floor-b',    shade:  -7 },  // เข้มลง 7% (tile สลับเข้มกว่าพื้นหลัก ตรงทิศ token เดิม #ccc494)
    { cssVar: '--floor-line', shade: -12 },  // เข้มลง 12%
  ],
  wall: [
    { cssVar: '--wall-color',  shade:   0 },  // base
    { cssVar: '--wall-top',    shade:  -8 },  // เข้มลง 8%
    { cssVar: '--wall-side',   shade: -10 },  // เข้มลง 10%
    { cssVar: '--wall-border', shade: -20 },  // เข้มลง 20%
  ],
  desk: [
    { cssVar: '--desk-surface', shade:   0 },  // base
    { cssVar: '--desk-edge',    shade: -20 },  // เข้มลง 20%
    { cssVar: '--desk-border',  shade: -30 },  // เข้มลง 30%
  ],
  rug: [
    { cssVar: '--rug-base',    shade:   0 },  // base
    { cssVar: '--rug-border',  shade: -15 },  // เข้มลง 15%
    { cssVar: '--rug-pattern', shade:  +8 },  // สว่างขึ้น 8%
  ],
};

/**
 * shadeHex — lighten หรือ darken สี hex ตาม percent
 *
 * วิธีทำงาน:
 *   1. แปลง #rrggbb → R, G, B แต่ละ channel (0–255)
 *   2. บวก/ลบ channel ด้วย percent ของ 255 (ไม่ใช่ของค่าปัจจุบัน)
 *      เหตุผล: consistent — เปลี่ยน 10% ของ 255 = 25.5 units เสมอ
 *              ไม่ว่าสีเริ่มต้นจะสว่างหรือเข้มแค่ไหน
 *   3. clamp ทุก channel ให้อยู่ใน [0, 255]
 *   4. แปลงกลับเป็น #rrggbb
 *
 * @param {string} hex     - สี input เช่น "#ddd5a8" (ต้อง 6 หลักเสมอ จาก input type=color)
 * @param {number} percent - เปอร์เซ็นต์ปรับ: +8 = สว่าง 8%, -12 = เข้ม 12%, 0 = ไม่เปลี่ยน
 * @returns {string} hex 6 หลัก เช่น "#e9e1be"
 */
function shadeHex(hex, percent) {
  // defensive: ถ้า input ไม่ใช่ #rrggbb คืนค่าเดิม (ป้องกัน parse error)
  if (typeof hex !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return hex;
  }

  const redChannel   = parseInt(hex.slice(1, 3), 16);
  const greenChannel = parseInt(hex.slice(3, 5), 16);
  const blueChannel  = parseInt(hex.slice(5, 7), 16);

  // amount = จำนวน unit ที่จะบวก/ลบ (percent ของ 255)
  const amount = Math.round((percent / 100) * 255);

  const clamp = function(value) { return Math.min(255, Math.max(0, value)); };

  const newRed   = clamp(redChannel   + amount);
  const newGreen = clamp(greenChannel + amount);
  const newBlue  = clamp(blueChannel  + amount);

  // แปลงกลับเป็น hex 2 หลักต่อ channel (padStart ป้องกัน "f" → "0f")
  const toHex = function(value) { return value.toString(16).padStart(2, '0'); };

  return '#' + toHex(newRed) + toHex(newGreen) + toHex(newBlue);
}

/**
 * applyColorTheme — รับ target + hex สีหลัก แล้ว derive เฉดย่อยและ setProperty ทั้งหมด
 *
 * วิธีทำงาน:
 *   1. หา config ของ target จาก COLOR_VAR_MAP
 *   2. วน derive แต่ละ CSS var ด้วย shadeHex
 *   3. setProperty บน :root (document.documentElement)
 *   4. อัปเดต swatch ให้แสดงสีหลัก (hex เดิม ไม่ใช่ derived)
 *
 * @param {string} target - "floor" | "wall" | "desk" | "rug"
 * @param {string} hex    - สีหลัก เช่น "#ddd5a8"
 */
function applyColorTheme(target, hex) {
  const varList = COLOR_VAR_MAP[target];

  // defensive: ถ้า target ไม่รู้จัก ไม่ทำอะไร
  if (!varList) return;

  // derive และ setProperty ทุก CSS var ใน target นี้
  varList.forEach(function(item) {
    const derivedColor = shadeHex(hex, item.shade);
    document.documentElement.style.setProperty(item.cssVar, derivedColor);
  });

  // อัปเดต swatch ให้แสดงสีหลักที่ user เลือก (ไม่ใช่ derived)
  const swatchEl = document.getElementById('js-swatch-' + target);
  if (swatchEl) {
    swatchEl.style.background = hex;
  }
}

/**
 * saveColorsToStorage — บันทึกสี 4 target ลง localStorage
 * key: "office-colors" เป็น JSON { floor, wall, desk, rug }
 *
 * ครอบ try/catch เพื่อรองรับกรณี localStorage ไม่พร้อม
 * (เช่น browser ปิด storage หรือ quota เต็ม)
 *
 * @param {Object} colors - { floor: "#hex", wall: "#hex", desk: "#hex", rug: "#hex" }
 */
function saveColorsToStorage(colors) {
  try {
    localStorage.setItem('office-colors', JSON.stringify(colors));
  } catch (storageError) {
    // ไม่ throw ต่อ — localStorage ไม่ available ไม่ถือว่า critical
    console.warn('saveColorsToStorage: localStorage unavailable', storageError.message);
  }
}

/**
 * loadColorsFromStorage — อ่านสีจาก localStorage
 * คืน object { floor, wall, desk, rug } หรือ null ถ้าไม่มี/parse ไม่ได้
 *
 * @returns {{ floor: string, wall: string, desk: string, rug: string } | null}
 */
function loadColorsFromStorage() {
  try {
    const raw = localStorage.getItem('office-colors');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (parseError) {
    // ถ้า localStorage มีข้อมูล corrupt → fallback default (ไม่ crash)
    console.warn('loadColorsFromStorage: JSON parse failed, falling back to default', parseError.message);
    return null;
  }
}

/**
 * initColorTheme — โหลดสีจาก localStorage และผูก event บน color input ทุกตัว
 *
 * ทำงานตอนหน้าโหลด (ไม่รอให้ panel เปิด) เพื่อให้สีห้องถูกต้องตั้งแต่เริ่ม
 *
 * กระบวนการ:
 *   1. อ่าน localStorage → ถ้าไม่มี ใช้ DEFAULT_COLORS
 *   2. applyColorTheme + sync input.value + sync swatch ทุก target
 *   3. ผูก event 'input' บน color input ทุกตัว → realtime preview + persist
 *   4. ผูก event 'click' บน #js-color-reset → reset ทุก target กลับ default
 */
function initColorTheme() {
  // สถานะสีปัจจุบัน — เริ่มจาก localStorage หรือ default
  const savedColors = loadColorsFromStorage();
  const currentColors = {
    floor: (savedColors && savedColors.floor) ? savedColors.floor : DEFAULT_COLORS.floor,
    wall:  (savedColors && savedColors.wall)  ? savedColors.wall  : DEFAULT_COLORS.wall,
    desk:  (savedColors && savedColors.desk)  ? savedColors.desk  : DEFAULT_COLORS.desk,
    rug:   (savedColors && savedColors.rug)   ? savedColors.rug   : DEFAULT_COLORS.rug,
  };

  // --- apply ทุก target ตอนโหลด ---
  // ทำให้สีห้องตรงกับ localStorage และ swatch ไม่ว่างตั้งแต่เริ่ม
  Object.keys(currentColors).forEach(function(target) {
    const hex = currentColors[target];
    applyColorTheme(target, hex);

    // sync input.value ให้ color picker แสดงสีที่เคยเลือก
    const inputEl = document.getElementById('color-' + target);
    if (inputEl) {
      inputEl.value = hex;
    }
  });

  // --- ผูก event 'input' บน color input ทุกตัว (realtime preview) ---
  const colorInputs = document.querySelectorAll('.color-row__input');
  colorInputs.forEach(function(inputEl) {
    inputEl.addEventListener('input', function() {
      const hex    = inputEl.value;
      const target = inputEl.dataset.target;

      // ไม่รู้จัก target → ข้าม (defensive)
      if (!target || !COLOR_VAR_MAP[target]) return;

      // update สี + swatch ทันที (realtime preview)
      applyColorTheme(target, hex);

      // persist ลง localStorage — อัปเดต target ที่เปลี่ยนเท่านั้น
      currentColors[target] = hex;
      saveColorsToStorage(currentColors);
    });
  });

  // --- ผูก event Reset ---
  const resetBtn = document.getElementById('js-color-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      // ล้าง localStorage ก่อน
      try {
        localStorage.removeItem('office-colors');
      } catch (storageError) {
        console.warn('resetColorTheme: localStorage.removeItem failed', storageError.message);
      }

      // reset ทุก target กลับ DEFAULT_COLORS
      Object.keys(DEFAULT_COLORS).forEach(function(target) {
        const defaultHex = DEFAULT_COLORS[target];

        // คืนสีห้องและ swatch กลับ default
        applyColorTheme(target, defaultHex);

        // sync input.value ให้ color picker แสดงสี default
        const inputEl = document.getElementById('color-' + target);
        if (inputEl) {
          inputEl.value = defaultHex;
        }

        // sync currentColors ให้ตรงด้วย (ป้องกัน 'input' event ถัดไปใช้ค่าเก่า)
        currentColors[target] = defaultHex;
      });
    });
  }
}

// ---- INIT ----

// เรียก toggle init หลัง DOM พร้อม (script อยู่ก่อน </body> แล้ว)
initSidebarToggle();

// ผูก event ของ activity drawer (S012)
initFeedDrawer();

// ผูก event เปิด/ปิด color panel (S015)
initColorPanel();

// โหลดสีจาก localStorage และผูก event color input + reset (S015)
// ต้องเรียกตอน init (ไม่ใช่ตอนเปิด panel) เพื่อให้สีห้องถูกต้องตั้งแต่เริ่ม
initColorTheme();

// ปรับโทนหน้าต่างตามเวลาจริง (F)
updateWindowTint();

// โหลดครั้งแรกทันทีที่หน้าเปิด
refreshAll();

// auto-refresh ทุก 5 วินาที
setInterval(refreshAll, 5000);
