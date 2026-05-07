import anthropic
import json
from pathlib import Path

client = anthropic.Anthropic()

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


def _load_prompt(filename: str) -> str:
    return (PROMPTS_DIR / filename).read_text(encoding="utf-8")


def _parse_json_response(response: anthropic.types.Message) -> dict:
    text = response.content[0].text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return json.loads(text.strip())


def extract_lens(text: str, author_info: str = "", target_iq: int = 150) -> dict:
    """LENS 단계: 텍스트에서 저자의 4차원 뇌인지구조 추출"""
    system_prompt = _load_prompt("01_lens.md")
    user_content = f"[텍스트]\n{text}"
    if author_info:
        user_content += f"\n\n[저자 정보]\n{author_info}"
    user_content += f"\n\n[분석 깊이]\n{target_iq}"

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=3000,
        system=system_prompt,
        messages=[{"role": "user", "content": user_content}]
    )
    return _parse_json_response(response)


def evaluate_coupling(
    author_lens: dict,
    student_speech: str,
    target_text: str
) -> dict:
    """Coupling 단계: 학생 스피치와 저자 구조 비교 평가"""
    system_prompt = _load_prompt("02_coupling.md")
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        system=system_prompt,
        messages=[{
            "role": "user",
            "content": json.dumps({
                "author_lens_json": author_lens,
                "student_speech": student_speech,
                "target_text": target_text
            }, ensure_ascii=False, indent=2)
        }]
    )
    return _parse_json_response(response)


def verify_speech_sentence(
    author_lens: dict,
    sentence: str,
    context: str = "",
    consecutive_verdicts: list | None = None
) -> dict:
    """Speech 단계: 문장 단위 실시간 검증"""
    system_prompt = _load_prompt("03_speech.md")
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=256,
        system=system_prompt,
        messages=[{
            "role": "user",
            "content": json.dumps({
                "author_lens_json": author_lens,
                "sentence": sentence,
                "context": context,
                "consecutive_verdicts": consecutive_verdicts or []
            }, ensure_ascii=False)
        }]
    )
    return _parse_json_response(response)


def generate_feedback(
    author_lens: dict,
    coupling_result: dict,
    speech_history: list,
    session_count: int = 1,
    previous_iq: int = 90
) -> dict:
    """Feedback 단계: 종합 피드백 + 4차원 업그레이드 처방"""
    system_prompt = _load_prompt("04_feedback.md")
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2500,
        system=system_prompt,
        messages=[{
            "role": "user",
            "content": json.dumps({
                "author_lens_json": author_lens,
                "student_coupling_result": coupling_result,
                "speech_history": speech_history,
                "session_count": session_count,
                "previous_iq": previous_iq
            }, ensure_ascii=False, indent=2)
        }]
    )
    return _parse_json_response(response)
