"""Generate responsive modern-format variants for local portfolio photography."""

from pathlib import Path
import argparse

from PIL import Image


ASSET_DIR = Path(__file__).resolve().parents[1] / "src" / "assets"
SOURCE = ASSET_DIR / "profile.png"
WIDTHS = (480, 720, 1080)


def resize_to_width(image: Image.Image, width: int) -> Image.Image:
    height = round(image.height * (width / image.width))
    return image.resize((width, height), Image.Resampling.LANCZOS)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--project', help='Project slug; source is project-sources/<slug>.png')
    args = parser.parse_args()
    if args.project:
        if not args.project.replace('-', '').isalnum():
            parser.error('Use an alphanumeric project slug with hyphens.')
        root = ASSET_DIR.parents[1]
        with Image.open(root / 'project-sources' / f'{args.project}.png') as source:
            source = source.convert('RGB')
            for width in (480, 800, 1200):
                if width > source.width:
                    continue  # Never manufacture detail by enlarging a screenshot.
                resized = resize_to_width(source, width)
                for extension, format_name, quality in [('avif', 'AVIF', 60), ('webp', 'WEBP', 80), ('jpg', 'JPEG', 85)]:
                    resized.save(root / 'public' / 'project-images' / f'{args.project}-{width}.{extension}', format=format_name, quality=quality)
        return
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
