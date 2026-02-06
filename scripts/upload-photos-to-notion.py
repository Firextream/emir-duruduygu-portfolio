"""
Fotoğrafları EXIF bilgileriyle birlikte Notion database'ine yükleyen script.

Kullanım:
1. pip install requests Pillow
2. NOTION_API_KEY, DATABASE_ID ve IMGBB_API_KEY'i ayarla
3. python upload-photos-to-notion.py "C:\\path\\to\\photos"
"""

import os
import sys
import base64
import requests
from pathlib import Path
from datetime import datetime

# pip install Pillow
from PIL import Image
from PIL.ExifTags import TAGS

# ========== AYARLAR ==========
# Use environment variables (works on Vercel, CI, and locally with .env.local)
# NOTION_TOKEN or NOTION_API_KEY
# NOTION_GALLERY_DATABASE_ID (or DATABASE_ID for legacy)
# IMGBB_API_KEY (optional)
# ==============================


def load_env_local(path=".env.local"):
    """Simple .env.local loader for local use (no extra deps)."""
    env = {}
    if not os.path.exists(path):
        return env
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                env[key.strip()] = value.strip()
    except Exception:
        pass
    return env


_env_file = load_env_local()


def get_env(key, fallback_env=_env_file):
    return os.getenv(key) or fallback_env.get(key)


NOTION_API_KEY = get_env("NOTION_TOKEN") or get_env("NOTION_API_KEY")
DATABASE_ID = get_env("NOTION_GALLERY_DATABASE_ID") or get_env("DATABASE_ID")
IMGBB_API_KEY = get_env("IMGBB_API_KEY") or ""
# ==============================

NOTION_API_URL = "https://api.notion.com/v1"
HEADERS = {
    "Authorization": f"Bearer {NOTION_API_KEY}",
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28"
}


def upload_image_to_imgbb(image_path: str) -> str | None:
    """Fotoğrafı imgbb'ye yükler ve URL döner"""
    if not IMGBB_API_KEY:
        print("  ⚠️ IMGBB_API_KEY ayarlanmamış, resim yüklenemiyor")
        return None
    
    try:
        with open(image_path, "rb") as file:
            image_data = base64.b64encode(file.read()).decode("utf-8")
        
        response = requests.post(
            "https://api.imgbb.com/1/upload",
            data={
                "key": IMGBB_API_KEY,
                "image": image_data,
                "name": Path(image_path).stem
            },
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            url = data.get("data", {}).get("url")
            print(f"  📤 Resim yüklendi: {url[:50]}...")
            return url
        else:
            print(f"  ❌ imgbb hatası: {response.text[:100]}")
            return None
    except Exception as e:
        print(f"  ❌ Yükleme hatası: {e}")
        return None


def get_exif_data(image_path: str) -> dict:
    """Fotoğraftan EXIF bilgilerini çıkarır"""
    try:
        image = Image.open(image_path)
        exif_data = image._getexif()
        
        if not exif_data:
            return {}
        
        exif = {}
        for tag_id, value in exif_data.items():
            tag = TAGS.get(tag_id, tag_id)
            exif[tag] = value
        
        # Parsed EXIF
        result = {
            "filename": Path(image_path).name,
            "camera_maker": exif.get("Make", ""),
            "camera_model": exif.get("Model", ""),
            "date_taken": None,
            "aperture": None,
            "shutter_speed": None,
            "iso": None,
            "focal_length": None,
            "dimensions": f"{image.width} x {image.height}",
        }
        
        # Date
        if "DateTimeOriginal" in exif:
            try:
                dt = datetime.strptime(exif["DateTimeOriginal"], "%Y:%m:%d %H:%M:%S")
                result["date_taken"] = dt.isoformat()
            except:
                pass
        
        # Aperture (F-stop)
        if "FNumber" in exif:
            try:
                f = exif["FNumber"]
                if hasattr(f, 'numerator'):
                    result["aperture"] = f"f/{f.numerator / f.denominator:.1f}"
                else:
                    result["aperture"] = f"f/{f}"
            except:
                pass
        
        # Shutter Speed
        if "ExposureTime" in exif:
            try:
                exp = exif["ExposureTime"]
                if hasattr(exp, 'numerator'):
                    if exp.numerator == 1:
                        result["shutter_speed"] = f"1/{exp.denominator}"
                    else:
                        result["shutter_speed"] = f"{exp.numerator}/{exp.denominator}"
                else:
                    result["shutter_speed"] = str(exp)
            except:
                pass
        
        # ISO
        if "ISOSpeedRatings" in exif:
            result["iso"] = str(exif["ISOSpeedRatings"])
        
        # Focal Length
        if "FocalLength" in exif:
            try:
                fl = exif["FocalLength"]
                if hasattr(fl, 'numerator'):
                    result["focal_length"] = f"{int(fl.numerator / fl.denominator)}mm"
                else:
                    result["focal_length"] = f"{fl}mm"
            except:
                pass
        
        return result
        
    except Exception as e:
        print(f"EXIF okuma hatası ({image_path}): {e}")
        return {"filename": Path(image_path).name}


def get_database_properties():
    """Database property'lerini alır"""
    response = requests.post(
        f"{NOTION_API_URL}/databases/{DATABASE_ID}/query",
        headers=HEADERS,
        json={"page_size": 1}
    )
    
    if response.status_code == 200:
        data = response.json()
        if data.get('results'):
            props = data['results'][0].get('properties', {})
            return {k: v['type'] for k, v in props.items()}
    return {}


def upload_to_notion(database_id: str, photo_data: dict, image_url: str | None = None):
    """Fotoğraf bilgilerini Notion database'ine ekler"""
    
    # Database yapısı: Title, Image, Camera, Lens, Aperture, ShutterSpeed, ISO, FocalLength, Category, Place
    properties = {
        "Title": {
            "title": [{"text": {"content": photo_data.get("filename", "Untitled")}}]
        }
    }
    
    # Image (external URL)
    if image_url:
        properties["Image"] = {
            "files": [{"name": photo_data.get("filename", "image"), "external": {"url": image_url}}]
        }
    
    # Camera (Camera + Model birlikte)
    if photo_data.get("camera_model"):
        properties["Camera"] = {
            "rich_text": [{"text": {"content": f"{photo_data.get('camera_maker', '')} {photo_data['camera_model']}".strip()}}]
        }
    
    # Aperture
    if photo_data.get("aperture"):
        properties["Aperture"] = {
            "rich_text": [{"text": {"content": photo_data["aperture"]}}]
        }
    
    # ShutterSpeed (dikkat: boşluksuz)
    if photo_data.get("shutter_speed"):
        properties["ShutterSpeed"] = {
            "rich_text": [{"text": {"content": photo_data["shutter_speed"]}}]
        }
    
    # ISO
    if photo_data.get("iso"):
        properties["ISO"] = {
            "rich_text": [{"text": {"content": photo_data["iso"]}}]
        }
    
    # FocalLength (dikkat: boşluksuz)
    if photo_data.get("focal_length"):
        properties["FocalLength"] = {
            "rich_text": [{"text": {"content": photo_data["focal_length"]}}]
        }
    
    try:
        response = requests.post(
            f"{NOTION_API_URL}/pages",
            headers=HEADERS,
            json={
                "parent": {"database_id": database_id},
                "properties": properties
            }
        )
        
        if response.status_code == 200:
            print(f"  ✅ Notion'a eklendi")
        else:
            error = response.json()
            print(f"  ❌ Notion hatası: {error.get('message', response.text)}")
    except Exception as e:
        print(f"  ❌ Hata: {e}")


def main():
    if len(sys.argv) < 2:
        print("Kullanım: python upload-photos-to-notion.py <fotoğraf_klasörü>")
        print("Örnek: python upload-photos-to-notion.py \"C:\\Users\\edmes\\Downloads\\lightroom-download-2026-02-03T21_44_28Z\"")
        sys.exit(1)
    
    folder_path = sys.argv[1]

    if not NOTION_API_KEY or not DATABASE_ID:
        print("Missing NOTION_TOKEN/NOTION_API_KEY or NOTION_GALLERY_DATABASE_ID.")
        print("Set them in your environment or .env.local before running.")
        sys.exit(1)
    
    if not os.path.exists(folder_path):
        print(f"Klasör bulunamadı: {folder_path}")
        sys.exit(1)
    
    # API key kontrolü
    if not IMGBB_API_KEY:
        print("⚠️ IMGBB_API_KEY ayarlanmamış!")
        print("   Resimler yüklenmeyecek, sadece EXIF bilgileri eklenecek.")
        print("   API key almak için: https://api.imgbb.com/")
        print()
    
    # Database property'lerini kontrol et
    print("Database bağlantısı kontrol ediliyor...")
    props = get_database_properties()
    if props:
        print(f"Mevcut property'ler: {list(props.keys())}")
    else:
        print("⚠️ Database property'leri alınamadı - devam ediliyor...")
    
    # Desteklenen formatlar
    extensions = {".jpg", ".jpeg", ".png", ".tiff", ".tif"}
    
    # Fotoğrafları bul
    photos = [f for f in Path(folder_path).iterdir() 
              if f.suffix.lower() in extensions]
    
    print(f"\n📸 {len(photos)} fotoğraf bulundu\n")
    
    success_count = 0
    for i, photo in enumerate(photos, 1):
        print(f"[{i}/{len(photos)}] {photo.name}")
        
        # EXIF bilgilerini oku
        exif_data = get_exif_data(str(photo))
        
        # Resmi imgbb'ye yükle
        image_url = upload_image_to_imgbb(str(photo))
        
        # Notion'a ekle
        upload_to_notion(DATABASE_ID, exif_data, image_url)
        success_count += 1
    
    print(f"\n✨ Tamamlandı! {success_count}/{len(photos)} fotoğraf işlendi.")


if __name__ == "__main__":
    main()
