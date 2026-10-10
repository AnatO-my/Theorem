# Theorem fork roadmap

## Baseline

Upstream integrated through `5a2e821` (v1.5.9 plus subsequent icon/mobile-series fixes). Local branch: `feature/upstream-1.5.9-smart-shelves`. Pre-integration changes remain backed up in `.artifacts/integration-2026-10-08` and the named Git stash.

## Implemented locally

- Folder/subfolder preservation with a flat-import option; confirmed by the user on Windows.
- Full filtered bulk selection, including virtualized offscreen results; confirmed by the user on Windows.
- Smart shelves: native all/any rules for tags, category, author, series, format, reading status, and favorite, with dynamic membership, persistence, and sync. See `smart-shelves.md`.
- Android startup repair and CBR binary-response repair; comic scrolling for CBR and CBZ. See `cbr-android-fix.md` and `comic-scrolling.md` for behavior and validation.

## Incorporated upstream

- Pure-Rust CBR decoding on desktop and Android. A real RAR4 sample decodes all 49 entries; the frontend import/reader binary bridge required an additional local fix.
- Series metadata, batch series assignment, grouping, and next-volume navigation.
- SQLite library/RSS persistence, annotation and sync reliability, and PDF improvements.

## Remaining candidates

1. Metadata enrichment and controlled series inference; preserve user edits and expose reviewable suggestions.
2. Cross-book annotation search and split-view reading.
3. Copy/link import and incremental source-folder rescans.
4. Host-based remote browser reading, followed by Internet connectivity and device pairing.
5. Optional remote backups/state sync, Bubble Zoom, and extensions.

Verify reference implementations and current upstream before each feature. Keep additions independently reviewable. Shared reading access and replication solve different problems and should retain clear user controls.
