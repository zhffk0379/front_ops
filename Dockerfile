# 1. 빌드 단계
FROM node:16 as build

# 2. 소스코드 
RUN git clone https://github.com/pjs818/front_ops.git

# 작업 디렉터리 설정
WORKDIR /front_ops

# 패키지 설치
#COPY package*.json ./
# 캐시 무효화를 위해 환경 변수를 사용하여 빌드 시점에 항상 새 값이 설정되도록 함
ARG CACHE_BUST=1
RUN npm install

# 애플리케이션 소스 복사
#COPY . .

# React 애플리케이션 빌드
RUN npm run build

# 2. 배포 단계
FROM nginx:alpine

# Nginx 설정 파일 제거 및 빌드된 파일 복사
COPY --from=build /front_ops/build /usr/share/nginx/html

# proxy 설정
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx 서버 실행
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
