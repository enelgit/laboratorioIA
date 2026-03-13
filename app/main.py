from fastapi import FastAPI, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import json, os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

DATA_DIR = BASE_DIR / "data"
VALID_LANGS = {"en", "es", "pt", "it"}


def _load(lang: str, filename: str):
    if lang not in VALID_LANGS:
        lang = "en"
    with open(DATA_DIR / lang / filename, encoding="utf-8") as f:
        return json.load(f)


app = FastAPI(title="Vibe Coding Course Platform")


# API routes
@app.get("/api/course")
def get_course(lang: str = Query("en")):
    return _load(lang, "course.json")


@app.get("/api/slides/{module_id}")
def get_slides(module_id: str, lang: str = Query("en")):
    slides = _load(lang, "slides.json")
    return slides.get(module_id, [])


@app.get("/api/labs/{module_id}")
def get_lab(module_id: str, lang: str = Query("en")):
    labs = _load(lang, "labs.json")
    return labs.get(module_id, {})


# Serve static files
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")


# SPA fallback — serve index.html for root
@app.get("/")
def index():
    return FileResponse(str(BASE_DIR / "static" / "index.html"))


if __name__ == "__main__":
    import sys, uvicorn
    sys.path.insert(0, str(BASE_DIR))
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
