# MTID Project Page

Official project website for:

> **Masked Temporal Interpolation Diffusion for Procedure Planning in Instructional Videos**
> ICLR 2025

- [Live project page](https://yuankjing.github.io/MTID-Project-Page/)
- [Paper](https://openreview.net/forum?id=HnpDHiItd2)
- [Code](https://github.com/WiserZhou/MTID)
- [Processed data](https://huggingface.co/datasets/WiserZhou/ProcedurePlanning/tree/main)

## Local preview

The website is plain HTML, CSS, and JavaScript:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Design and assets

The interface follows an academic Swiss-modernist system: an institutional
navy palette, a restrained citation-gold accent, an editorial grid, and subtle
motion with reduced-motion support. Paper figures use WebP for page delivery
and retain their original PNG files as full-resolution fallbacks.

Crimson Pro and Atkinson Hyperlegible are self-hosted under their respective
SIL Open Font License files in `assets/fonts/`.

## Deployment

Pushes to `main` are deployed automatically with the GitHub Pages workflow in
`.github/workflows/static.yml`.
