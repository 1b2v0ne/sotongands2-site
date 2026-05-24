# 소통과 상생 사이트

정책자금 컨설팅 사업용 정적 사이트입니다. GitHub Pages에 바로 배포할 수 있도록 HTML, CSS, JavaScript만 사용합니다.

## 구조

- `/` 메인 홈페이지
- `/policy-funding/` 공통 정책자금 랜딩페이지
- `/policy-funding/food/` 요식업/음식업 랜딩페이지
- `/policy-funding/transport/` 운수업/화물차주 랜딩페이지
- `/policy-funding/credit/` 기존 대출/신용상황 상담 랜딩페이지
- `/thanks/` 상담 신청 완료 및 전환 측정 페이지
- `/privacy/` 개인정보처리방침
- `/terms/` 서비스 유의사항

## 연결 상태

- Google Form 상담 신청 연결 완료
- 실제 로고 PNG 적용 완료
- GitHub Pages custom domain용 `CNAME` 추가 완료
- Google Tag Manager `GTM-PVXSDRXH` 설치 완료
- Google Analytics 4 측정 ID `G-M32RBBVX85` 확인 완료

## 배포 전 확인할 일

1. `assets/site.js`의 `GOOGLE_ADS_ID`, `NAVER_CONVERSION_ID`를 실제 값으로 교체합니다.
2. 사업자등록번호, 연락 가능 채널, 개인정보 보관기간을 최종 확인합니다.
3. GA4, Google Ads, 네이버 전환 태그를 GTM에서 연결합니다.

## 로컬 확인

정적 파일이므로 `index.html`을 브라우저에서 열어도 됩니다. 더 정확한 확인은 간단한 로컬 서버로 확인하세요.

```bash
python3 -m http.server 8080
```

그 다음 `http://localhost:8080`에서 확인합니다.
