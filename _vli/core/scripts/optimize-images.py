#!/usr/bin/env python3
"""
Otimizador de imagens para Landing Pages de imóvel.

Redimensiona, otimiza e converte imagens para WebP nos tamanhos esperados
pelos templates (hero, galeria, plantas, Open Graph).

Uso:
    python optimize-images.py <pasta_entrada> <pasta_saida>

Organize a pasta de entrada assim (o nome do arquivo define o preset):

    entrada/
      hero.jpg              -> 1600x900 WebP (preset: hero)
      og.jpg                -> 1200x630 WebP (preset: og)
      galeria/
        fachada.jpg         -> 1600x1200 WebP full + 800x600 thumb
        sala.jpg
        cozinha.jpg
        ...
      plantas/
        planta-187.jpg      -> 1200x1200 WebP (preset: planta)

Saída (mesma estrutura, .webp):

    saida/
      hero.webp
      og.webp
      galeria/
        fachada.webp
        fachada-thumb.webp
        ...
      plantas/
        planta-187.webp

Requisitos:
    pip install Pillow
"""

from __future__ import annotations

import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    print("ERRO: Pillow não instalado. Rode:  pip install Pillow", file=sys.stderr)
    sys.exit(1)


# (largura, altura, qualidade)
PRESETS: dict[str, tuple[int, int, int]] = {
    "hero":        (1600, 900,  82),
    "og":          (1200, 630,  85),
    "galeria":     (1600, 1200, 80),
    "galeria-thumb": (800, 600, 78),
    "planta":      (1200, 1200, 85),
}

VALID_INPUT = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}


def convert(src: Path, dst: Path, preset: str) -> None:
    w, h, q = PRESETS[preset]
    dst.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(src) as img:
        img = ImageOps.exif_transpose(img)
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGB")
        # fit = cobre o tamanho, recortando excesso para manter proporção
        img = ImageOps.fit(img, (w, h), method=Image.Resampling.LANCZOS)
        img.save(dst, format="WEBP", quality=q, method=6)

    print(f"  {src.name}  ->  {dst.relative_to(dst.parents[1])}  ({w}x{h}, q{q})")


def process(entrada: Path, saida: Path) -> None:
    if not entrada.is_dir():
        print(f"ERRO: pasta de entrada não existe: {entrada}", file=sys.stderr)
        sys.exit(1)

    saida.mkdir(parents=True, exist_ok=True)
    total = 0

    for src in entrada.rglob("*"):
        if not src.is_file() or src.suffix.lower() not in VALID_INPUT:
            continue

        rel = src.relative_to(entrada)
        parent = rel.parent.as_posix()
        stem = rel.stem.lower()

        # Determinar preset pelo caminho relativo
        if parent == "." and stem in ("hero", "fachada-hero"):
            preset = "hero"
            dst = saida / f"{rel.stem}.webp"
            convert(src, dst, preset); total += 1
        elif parent == "." and stem == "og":
            dst = saida / "og.webp"
            convert(src, dst, "og"); total += 1
        elif parent.startswith("galeria"):
            dst_full = saida / rel.with_suffix(".webp")
            convert(src, dst_full, "galeria"); total += 1
            dst_thumb = saida / rel.parent / f"{rel.stem}-thumb.webp"
            convert(src, dst_thumb, "galeria-thumb"); total += 1
        elif parent.startswith("plantas"):
            dst = saida / rel.with_suffix(".webp")
            convert(src, dst, "planta"); total += 1
        else:
            # default: trata como galeria sem thumb
            dst = saida / rel.with_suffix(".webp")
            convert(src, dst, "galeria"); total += 1

    print(f"\nOK — {total} arquivos gerados em {saida}")


def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    process(Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve())


if __name__ == "__main__":
    main()
