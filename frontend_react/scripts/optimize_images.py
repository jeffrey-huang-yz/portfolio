"""Generate responsive modern-format variants for local portfolio photography."""

from pathlib import Path

from PIL import Image


ASSET_DIR = Path(__file__).resolve().parents[1] / "src" / "assets"
SOURCE = ASSET_DIR / "profile.png"
WIDTHS = (480, 720, 1080)


def resize_to_width(image: Image.Image, width: int) -> Image.Image:
    height = round(image.height * (width / image.width))
    return image.resize((width, height), Image.Resampling.LANCZOS)


def main() -> None:
    with Image.open(SOURCE) as source:
        source.load()
        for width in WIDTHS:
            resized = resize_to_width(source, width)
            resized.save(
                ASSET_DIR / f"profile-{width}.avif",
                format="AVIF",
                quality=60,
                speed=6,
            )
            resized.save(
                ASSET_DIR / f"profile-{width}.webp",
                format="WEBP",
                quality=78,
                method=6,
            )


if __name__ == "__main__":
    main()
