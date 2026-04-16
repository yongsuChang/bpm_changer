.PHONY: dev stop install

# 기본 실행 (백엔드와 프론트엔드 동시 실행)
dev:
	@echo "Starting Backend and Frontend..."
	@(make dev-backend & make dev-frontend & wait)

dev-backend:
	@echo "Starting Backend..."
	@cd backend && uvicorn main:app --reload --port 8000

dev-frontend:
	@echo "Starting Frontend..."
	@cd frontend && pnpm dev --port 5173

# 의존성 한 번에 설치
install:
	@echo "Installing Backend dependencies..."
	@cd backend && pip install -r requirements.txt
	@echo "Installing Frontend dependencies..."
	@cd frontend && pnpm install

# (도커 사용 시) 한 번에 끄기
stop:
	docker compose down
