from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from pathlib import Path
import uuid

from brain_analyzer import (
    extract_lens,
    evaluate_coupling,
    verify_speech_sentence,
    generate_feedback,
)

app = FastAPI(title="Brain180 Visualization System", version="1.0.0")

STATIC_DIR = Path(__file__).parent / "static"
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

_sessions: dict[str, dict] = {}


# ── 요청 모델 ──────────────────────────────────────────────────

class LensRequest(BaseModel):
    text: str
    author_info: str = ""
    target_iq: int = 150

class CouplingRequest(BaseModel):
    session_id: str
    student_speech: str

class SpeechVerifyRequest(BaseModel):
    session_id: str
    sentence: str
    context: str = ""
    consecutive_verdicts: list[str] = []

class FeedbackRequest(BaseModel):
    session_id: str


# ── 엔드포인트 ──────────────────────────────────────────────────

@app.get("/")
async def root():
    return RedirectResponse(url="/static/index.html")


@app.post("/api/lens")
async def lens_endpoint(req: LensRequest):
    """LENS: 텍스트 → 4차원 뇌인지구조 추출 + 세션 생성"""
    result = extract_lens(req.text, req.author_info, req.target_iq)
    session_id = str(uuid.uuid4())
    _sessions[session_id] = {
        "text": req.text,
        "author_lens": result,
        "speech_history": [],
        "coupling_result": None,
        "feedback_history": [],
        "current_iq": 90,
        "session_count": 1,
    }
    return {"session_id": session_id, **result}


@app.post("/api/coupling")
async def coupling_endpoint(req: CouplingRequest):
    """Coupling: 학생 스피치 → 커플링 점수 (4차원 평가)"""
    session = _sessions.get(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    result = evaluate_coupling(
        session["author_lens"],
        req.student_speech,
        session["text"]
    )
    session["coupling_result"] = result
    return result


@app.post("/api/speech/verify")
async def speech_verify_endpoint(req: SpeechVerifyRequest):
    """Speech: 문장 단위 실시간 검증 (off_lens 감지 포함)"""
    session = _sessions.get(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    result = verify_speech_sentence(
        session["author_lens"],
        req.sentence,
        req.context,
        req.consecutive_verdicts
    )
    session["speech_history"].append({
        "sentence": req.sentence,
        "verdict": result["verdict"],
        "node_hit": result.get("node_hit"),
        "dimension_hit": result.get("dimension_hit", 1),
    })
    return result


@app.post("/api/feedback")
async def feedback_endpoint(req: FeedbackRequest):
    """Feedback: 4차원 종합 분석 + 브레인샷 처방"""
    session = _sessions.get(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if not session["coupling_result"]:
        raise HTTPException(status_code=400, detail="Coupling 단계를 먼저 완료하세요")
    result = generate_feedback(
        session["author_lens"],
        session["coupling_result"],
        session["speech_history"],
        session["session_count"],
        session["current_iq"]
    )
    session["current_iq"] = result["diagnosis"]["current_iq_equivalent"]
    session["session_count"] += 1
    session["feedback_history"].append(result)
    return result


@app.get("/api/session/{session_id}")
async def get_session(session_id: str):
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@app.delete("/api/session/{session_id}")
async def delete_session(session_id: str):
    _sessions.pop(session_id, None)
    return {"status": "deleted"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
