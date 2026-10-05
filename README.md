# Ritwick Das — AI Strategist & Builder

Personal portfolio, live at **[rdexplore.github.io](https://rdexplore.github.io)**.

The site is laid out as a short strategy deck. Each section is a slide with a full-sentence headline, an exhibit and a source line. Its centerpiece is an interactive table of my live AI applications: filter by capability, or select an app to open its screenshot, description and launch link.

## Applications

| Application | What it demonstrates | Live |
|---|---|---|
| Daily AI Intelligence | MCP-driven workflow automation | [Launch](https://rdexplore-daily-ai.static.hf.space) |
| Signal | Specialized and multimodal models | [Launch](https://rdexplore-signal.hf.space) |
| AI GovLens | Multi-agent validation, ISO 42001 governance | [Launch](https://rdexplore-ai-govlens.hf.space) |
| Mindmap | Human-centred generative AI | [Launch](https://rdexplore-mind-map.hf.space) |

## Tech

Static HTML, CSS and vanilla JavaScript. There is no build step and no dependencies. The only external resource is Google Fonts (Source Serif 4 and Schibsted Grotesk).

```
index.html
assets/
  css/style.css
  js/main.js
  img/            screenshots and portrait
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Update the site

- **Add an application:** add a row to the table in `index.html` (copy an existing `<tr data-app="...">`), then add a matching entry in the `APPS` object at the top of `assets/js/main.js`. Put its screenshot in `assets/img/`.
- **Publish a Thinking piece:** in the Thinking slide of `index.html`, replace the `Coming soon` tag with a link to the PDF, for example `<a class="textlink" href="assets/pdfs/your-file.pdf">Read</a>`.
- **Change colors or type:** edit the variables at the top of `assets/css/style.css`.

## Deploy

Hosted on GitHub Pages from the `main` branch, root folder. Pushing to `main` publishes the site in a minute or two.

## Connect

[LinkedIn](https://www.linkedin.com/in/ritwick-das)

© 2026 Ritwick Das
