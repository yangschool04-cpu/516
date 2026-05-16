// 현재 연도 (버튼으로 변경 가능)
let currentYear = new Date().getFullYear();

// 각 월별 일수 계산 함수 (윤년 적용)
function getDaysInMonth(year, month) {
    if (month === 2) {
        // 4의 배수 연도는 29일, 그 외는 28일 (일반적인 윤년 계산식 적용)
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            return 29;
        } else {
            return 28;
        }
    }
    // 나머지 월 일수 설정
    const days = {
        1: 31, 3: 31, 4: 30, 5: 31, 6: 30,
        7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
    };
    return days[month];
}

// 학교 달력 기준 (3월부터 시작)
const schoolMonths = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];

// 현재 선택된 월 (초기값 3월)
let currentMonth = 3;

document.addEventListener('DOMContentLoaded', () => {
    initMonthTabs();
    
    // 연도(학년도) 이동 버튼 이벤트 등록
    document.getElementById('prev-year').addEventListener('click', () => {
        currentYear--;
        changeMonth(currentMonth);
    });
    document.getElementById('next-year').addEventListener('click', () => {
        currentYear++;
        changeMonth(currentMonth);
    });
    
    // 첫 화면 렌더링 및 알림 체크
    changeMonth(currentMonth);
    checkNotifications();

    // 인쇄 버튼 이벤트
    document.getElementById('print-btn').addEventListener('click', () => {
        window.print();
    });

    // AI 피드백 버튼 이벤트
    document.getElementById('ai-feedback-btn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        getAIFeedback();
    });

    // 모달 닫기 이벤트 (X 버튼)
    document.querySelector('.close-modal').onclick = (e) => {
        e.stopPropagation();
        document.getElementById('ai-modal').style.display = 'none';
    };

    // 모달 바깥쪽 클릭 시 닫기
    window.onclick = (event) => {
        const modal = document.getElementById('ai-modal');
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});

// 하단 월 선택 탭 생성
function initMonthTabs() {
    const tabsContainer = document.getElementById('month-tabs');
    
    schoolMonths.forEach(i => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${i === currentMonth ? 'active' : ''}`;
        btn.textContent = `${i}월`;
        btn.onclick = () => changeMonth(i);
        tabsContainer.appendChild(btn);
    });
}

// 계절별 실제 자연 환경 고화질 사진 (assets 폴더 경로)
const natureBackgrounds = {
    1: "url('assets/bg_winter.png')",
    2: "url('assets/bg_winter.png')",
    3: "url('assets/bg_spring.png')",
    4: "url('assets/bg_spring.png')",
    5: "url('assets/bg_spring.png')",
    6: "url('assets/bg_summer.png')",
    7: "url('assets/bg_summer.png')",
    8: "url('assets/bg_summer.png')",
    9: "url('assets/bg_autumn.png')",
    10: "url('assets/bg_autumn.png')",
    11: "url('assets/bg_autumn.png')",
    12: "url('assets/bg_winter.png')"
};

// 빨간날에 들어갈 귀여운 일러스트 목록 (상대 경로)
const cuteImages = [
    "assets/cute_holiday_1.png",
    "assets/cute_holiday_2.png"
];

// 월 변경 처리
function changeMonth(month) {
    currentMonth = month;
    
    // 1월과 2월은 학년도(currentYear)의 다음 해로 계산
    const displayYear = (month === 1 || month === 2) ? currentYear + 1 : currentYear;
    
    // 타이틀 업데이트: 2026학년도라면 1월은 2027년으로 표시
    document.getElementById('current-month-title').textContent = `${displayYear}년 ${month}월 스케줄표`;
    
    // 배경을 해당 월의 자연 환경 사진으로 변경
    document.body.style.backgroundImage = natureBackgrounds[month];
    
    // 탭 활성화 상태 변경
    document.querySelectorAll('.tab-btn').forEach((btn, index) => {
        if (index + 1 === month) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderCalendar(month);
}

// 연도별 공휴일 반환 함수 (2026년 당해 연도 전체 공휴일 적용)
function getHoliday(year, month, day) {
    const dateKey = `${month}-${day}`;
    
    // 2026년 당해 연도 공휴일 (설날, 추석, 부처님오신날, 대체공휴일, 지방선거일 포함)
    if (year === 2026) {
        const holidays2026 = {
            '1-1': '신정',
            '2-16': '설날 연휴',
            '2-17': '설날',
            '2-18': '설날 연휴',
            '3-1': '삼일절',
            '3-2': '대체공휴일(삼일절)',
            '5-5': '어린이날',
            '5-24': '부처님오신날',
            '5-25': '대체공휴일(부처님오신날)',
            '6-3': '제9회 전국동시지방선거',
            '6-6': '현충일',
            '7-17': '제헌절',
            '8-15': '광복절',
            '9-24': '추석 연휴',
            '9-25': '추석',
            '9-26': '추석 연휴',
            '10-3': '개천절',
            '10-9': '한글날',
            '12-25': '크리스마스'
        };
        return holidays2026[dateKey];
    }
    
    // 2026년 이외의 연도일 경우 기본 양력 공휴일만 반환
    const fixedHolidays = {
        '1-1': '신정', '3-1': '삼일절', '5-5': '어린이날', '6-6': '현충일',
        '7-17': '제헌절', '8-15': '광복절', '10-3': '개천절', '10-9': '한글날', '12-25': '크리스마스'
    };
    return fixedHolidays[dateKey];
}

// 기분 좋아지는 응원 문구 모음
const cheerMessages = [
    "선생님, 고생 많으셨어요! 🌸",
    "잠시 쉬어가는 시간 ☕",
    "오늘도 빛나는 하루 ✨",
    "행복이 가득한 휴일 🍀",
    "달콤한 휴식 시간 🍬",
    "에너지 충전 완료! 🔋",
    "미소 짓는 하루 되세요 😊",
    "수고한 나에게 박수를 👏",
    "여유로운 하루 보내세요 🌿",
    "소소한 행복을 즐겨요 🎈"
];

// 달력 그리기
function renderCalendar(month) {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = ''; // 기존 내용 지우기
    
    // 1월과 2월은 다음 연도로 처리
    const displayYear = (month === 1 || month === 2) ? currentYear + 1 : currentYear;
    
    const totalDays = getDaysInMonth(displayYear, month);
    
    // 해당 월 1일의 요일 구하기 (0: 일요일 ~ 6: 토요일)
    const firstDay = new Date(displayYear, month - 1, 1).getDay();

    // 1일 이전의 빈 칸 채우기
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'empty-cell';
        grid.appendChild(emptyCell);
    }
    
    for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';
        
        // 현재 날짜의 요일 (0: 일, 6: 토)
        const currentDayOfWeek = (firstDay + day - 1) % 7;
        const holidayName = getHoliday(displayYear, month, day);
        
        // 날짜 표시 (공휴일 이름 포함)
        const dayNum = document.createElement('div');
        dayNum.className = 'day-number';
        
        const dateSpan = document.createElement('span');
        dateSpan.textContent = day;
        dayNum.appendChild(dateSpan);
        
        // 일요일, 토요일, 공휴일 텍스트 색상 처리
        if (currentDayOfWeek === 0 || holidayName) {
            dateSpan.style.color = '#e57373'; // 일요일/공휴일 빨간색
        } else if (currentDayOfWeek === 6) {
            dateSpan.style.color = '#64b5f6'; // 토요일 파란색
        }
        
        // 공휴일 라벨 추가
        if (holidayName) {
            const holSpan = document.createElement('span');
            holSpan.className = 'holiday-text';
            holSpan.textContent = holidayName;
            dayNum.appendChild(holSpan);
        }
        
        cell.appendChild(dayNum);
        
        // 일요일 및 공휴일(빨간날)은 요일 상관없이 모두 빈칸 처리
        if (currentDayOfWeek === 0 || holidayName) {
            cell.classList.add('weekend-cell');
            
            // 귀여운 그림(일러스트)과 문구를 추가
            const cheerDiv = document.createElement('div');
            cheerDiv.className = 'cheer-text';
            
            const img = document.createElement('img');
            img.src = cuteImages[Math.floor(Math.random() * cuteImages.length)];
            img.className = 'cheer-img';
            cheerDiv.appendChild(img);

            const textSpan = document.createElement('span');
            textSpan.textContent = cheerMessages[Math.floor(Math.random() * cheerMessages.length)];
            cheerDiv.appendChild(textSpan);
            
            cell.appendChild(cheerDiv);
        } else {
            // 평일 및 토요일은 3분할 입력칸 생성
            cell.appendChild(createInputSection('section-top', '보고 및 공문 입력', displayYear, month, day));
            cell.appendChild(createInputSection('section-mid', '업무 및 할일 입력', displayYear, month, day));
            cell.appendChild(createInputSection('section-bot', '복무 (예: 연가, 출장)', displayYear, month, day));
        }
        
        grid.appendChild(cell);
    }
}

// 텍스트 영역(textarea) 생성 헬퍼 함수
function createInputSection(className, placeholderText, year, month, day) {
    const section = document.createElement('div');
    section.className = `input-section ${className}`;
    
    const textarea = document.createElement('textarea');
    textarea.placeholder = placeholderText;
    
    // localStorage를 위한 고유 키 생성 (예: 2027-1-16-section-top)
    const storageKey = `${year}-${month}-${day}-${className}`;
    
    // 기존 저장된 데이터 불러오기
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
        textarea.value = savedData;
    }
    
    // 텍스트 입력 시 실시간으로 localStorage에 자동 저장
    textarea.addEventListener('input', () => {
        localStorage.setItem(storageKey, textarea.value);
    });
    
    section.appendChild(textarea);
    return section;
}

// 보고/공문 알림 팝업 띄우기 함수
function checkNotifications() {
    const today = new Date();
    const tYear = today.getFullYear();
    const tMonth = today.getMonth() + 1;
    const tDay = today.getDate();
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tmYear = tomorrow.getFullYear();
    const tmMonth = tomorrow.getMonth() + 1;
    const tmDay = tomorrow.getDate();
    
    // 오늘 '보고 공문' 확인 (section-top)
    const todayKey = `${tYear}-${tMonth}-${tDay}-section-top`;
    const todayData = localStorage.getItem(todayKey);
    if (todayData && todayData.trim() !== '') {
        showNotification(`[오늘 마감] ${todayData}`);
    }
    
    // 내일 '보고 공문' 확인
    const tomorrowKey = `${tmYear}-${tmMonth}-${tmDay}-section-top`;
    const tomorrowData = localStorage.getItem(tomorrowKey);
    if (tomorrowData && tomorrowData.trim() !== '') {
        showNotification(`[내일 마감] ${tomorrowData}`);
    }
}

// 화면 우측 상단에 알림 팝업(토스트) 표시
function showNotification(message) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const popup = document.createElement('div');
    popup.className = 'notification-popup';
    popup.textContent = message;
    
    container.appendChild(popup);
    
    // 10초 후 팝업 자동 사라짐
    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.5s ease';
        setTimeout(() => popup.remove(), 500);
    }, 10000);
}

// Gemini API를 이용한 업무 분석 및 조언 가져오기
async function getAIFeedback() {
    const modal = document.getElementById('ai-modal');
    const resultContainer = document.getElementById('ai-result-table-container');
    
    // 1. env.js에서 키 찾기 -> 2. 로컬스토리지에서 기존 저장된 키 찾기
    let apiKey = (window.ENV && window.ENV.GEMINI_API_KEY) ? window.ENV.GEMINI_API_KEY : localStorage.getItem('GEMINI_API_KEY');
    
    // 키가 없으면 사용자에게 직접 입력받기 (배포 환경 대응)
    if (!apiKey) {
        const userInput = prompt("🤖 Gemini AI 조언을 받으려면 API 키가 필요합니다.\n\n구글에서 발급받은 키를 입력해 주세요. 입력하신 키는 선생님의 브라우저(localStorage)에만 안전하게 저장됩니다:");
        if (userInput && userInput.trim() !== "") {
            apiKey = userInput.trim();
            localStorage.setItem('GEMINI_API_KEY', apiKey);
        } else {
            alert("API 키가 없으면 AI 조언 기능을 사용할 수 없습니다.");
            return;
        }
    }

    // 현재 페이지(달력)에 입력된 모든 업무 내용 수집
    let allTasks = "";
    document.querySelectorAll('textarea').forEach(ta => {
        if (ta.value.trim() !== "") {
            // 어느 날짜의 업무인지 표시 (placeholder를 통해 구분)
            allTasks += `- ${ta.placeholder}: ${ta.value}\n`;
        }
    });

    if (!allTasks) {
        alert("분석할 업무 내용이 없습니다. 먼저 달력에 업무를 입력해 주세요!");
        return;
    }

    modal.style.display = 'block';
    // 모달이 열릴 때 결과창 초기화 및 로딩 메시지
    resultContainer.innerHTML = "<p style='color: blue; font-weight: bold;'>🤖 Gemini AI가 업무를 분석하고 조언을 작성 중입니다... (약 5~10초 소요)</p>";

    const aiPrompt = `당신은 초등학교 수석 교사 업무 도우미입니다. 다음은 교사가 작성한 오늘의 업무 리스트입니다:\n\n${allTasks}\n\n이 내용을 분석하여 다음 3가지 항목을 포함한 HTML 표(Table) 형식으로 조언해 주세요. 
    1. 중요도(상/중/하) 2. 업무 핵심 요약 3. 효율적인 수행 팁. 
    표의 클래스명은 'ai-table'로 설정해 주세요. 한국어로 답변해 주세요. HTML 코드만 출력해 주세요.`;

    try {
        console.log("Gemini API 호출 시작...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: aiPrompt }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }
        
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("AI가 답변을 생성하지 못했습니다. (내용이 너무 짧거나 안전 필터에 의해 차단되었을 수 있습니다.)");
        }
        
        const aiResponse = data.candidates[0].content.parts[0].text;
        console.log("AI 답변 수신 성공");
        
        // 마크다운 태그가 포함되어 있다면 제거
        const cleanedHtml = aiResponse.replace(/```html|```/g, "").trim();
        resultContainer.innerHTML = cleanedHtml;

    } catch (error) {
        console.error("AI 분석 오류:", error);
        resultContainer.innerHTML = `<p>오류가 발생했습니다: ${error.message}</p><p>API 키가 유효한지 확인해 주세요.</p>`;
    }
}
