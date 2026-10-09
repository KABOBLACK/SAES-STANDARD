# KABO SYSTEM V1

KABO SYSTEM is a lightweight personal system for learning, observation, productivity, technology, and project planning.

## Purpose

The project follows the philosophy:

> Observe. Understand. Learn. Adapt. Build.

The initial version is intentionally small and practical. It helps you keep track of:

- learning goals
- AI and technology ideas
- programming concepts and tasks
- money and cash-flow notes
- football objectives and notes
- body and fitness goals
- observations and analysis

## Project structure

```text
kabo-system/
├── index.html
├── style.css
├── app.js
├── README.md
└── .github/workflows/validate.yml
```

## How to run locally

Because this is a static web application, the simplest method is to open the file directly in a browser:

1. Open `kabo-system/index.html` in your browser.
2. Use the navigation panel to move between sections.
3. Add notes and tasks in the section forms.

## How it works

- The app uses semantic HTML5 sections and accessible form labels.
- JavaScript handles note creation, validation, deletion, and display.
- Data is saved to `localStorage` in the current browser.
- Each section stores its own notes independently.

## Important notes about localStorage

The app stores data in the browser on the current device. This is useful for a lightweight personal system, but it is not a sync or backup system.

- Clearing browser storage will delete saved notes.
- Data is not encrypted or synchronized across devices.
- The app does not store accounts, passwords, tokens, or payment data.

## Available validation

This project is designed to be validated with lightweight static checks:

- HTML validation
- JavaScript linting
- simple sanity checks

The repository includes a GitHub Actions workflow for validation on pushes and pull requests.

## Known limitations

This is V1 and intentionally minimal. It does not include:

- user accounts or authentication
- external APIs or cloud storage
- financial integrations
- deployment automation
- advanced analytics or reports

## Future improvements

Possible improvements for later versions include:

- categories and filtering
- data export/import
- more detailed dashboard metrics
- theme options
- improved mobile layout refinements
- optional GitHub Pages deployment

## Security notes

- No secret keys are stored in the app.
- No network requests are required for the core app functionality.
- User input is sanitized before rendering to avoid raw HTML injection.
- This project is for local personal organization only.
