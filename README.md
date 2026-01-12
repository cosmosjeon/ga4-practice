# GA4 AARRR 퍼널 분석 데모 사이트

Google Analytics 4를 활용한 AARRR 퍼널 분석 강의용 샘플 사이트입니다.

## AARRR 퍼널이란?

| 단계 | 설명 | 데모 이벤트 |
|------|------|-------------|
| **A**cquisition (획득) | 사용자가 어떻게 왔는가? | `utm_source` 파라미터 추적 |
| **A**ctivation (활성화) | 첫 가치 경험을 했는가? | 회원가입, CTA 클릭 |
| **R**etention (유지) | 다시 돌아오는가? | 대시보드 재방문, 기능 사용 |
| **R**evenue (수익) | 돈을 지불하는가? | 결제 완료 |
| **R**eferral (추천) | 다른 사람에게 추천하는가? | SNS 공유, 팀원 초대 |

## 데모 페이지 구성

```
├── index.html      # 랜딩 페이지 (Acquisition, Activation)
├── signup.html     # 회원가입 (Activation)
├── dashboard.html  # 대시보드 (Retention)
├── checkout.html   # 결제 (Revenue)
└── styles.css      # 스타일시트
```

## 로컬에서 실행하기

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve

# VS Code
Live Server 확장 프로그램 사용
```

브라우저에서 `http://localhost:8000` 접속

## GA4 연동하기

1. [Google Analytics](https://analytics.google.com)에서 GA4 속성 생성
2. 측정 ID 복사 (G-XXXXXXXXXX)
3. 모든 HTML 파일에서 `G-XXXXXXXXXX`를 실제 ID로 교체

## 이벤트 확인하기

1. 브라우저 개발자 도구 (F12) → Console 탭 열기
2. 각 버튼/링크 클릭 시 이벤트 로그 확인
3. GA4 실시간 보고서에서 이벤트 확인

### 콘솔 출력 예시

```
📊 [Acquisition] 트래픽 소스: google
🎯 [Activation] 활성화 액션: hero_cta_click
🔄 [Retention] 기능 재사용: create_task
💰 [Revenue] 결제: Pro 15000원
📢 [Referral] 공유: kakao
```

## 강의 활용 팁

### 1. Acquisition 시연
```
?utm_source=google
?utm_source=facebook
?utm_source=newsletter
```
URL 파라미터를 변경하며 트래픽 소스별 분석 시연

### 2. Activation 시연
- 랜딩 페이지 CTA 클릭률 분석
- 회원가입 폼 각 단계별 이탈률 분석

### 3. Retention 시연
- 세션 수 증가에 따른 재방문 추적
- 기능별 사용 빈도 분석

### 4. Revenue 시연
- 체크아웃 퍼널 각 단계 분석
- 플랜별 전환율 비교

### 5. Referral 시연
- 공유 채널별 효과 분석
- 팀원 초대 기능 활용

## 기술 스택

- HTML5 / CSS3
- Vanilla JavaScript
- Google Analytics 4 (gtag.js)

---

**GA4 AARRR 퍼널 분석 데모용 사이트입니다.**
