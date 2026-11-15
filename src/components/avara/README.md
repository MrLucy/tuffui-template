# Avara UI integrations

The 28 source blocks listed in `sources.json` are from the official [Avara UI registry](https://avaraui.com/docs/nextjs/all-components), distributed under the MIT License by AlgorizeTech. Their original behavior is retained with local adaptations for compact sizing, Chinese copy, Vite/React, and the existing workspace theme. `TooltipBlock.tsx` bridges to the existing Radix primitives to avoid installing a second tooltip system.

Motion variants are used for stacks, folders, memories, sorting and the masonry demo. They do not replace the workspace packing layout, which retains its verified shortest-column placement.

UI demos live in `src/features/studio/avara-demos.tsx`. Supporting SVG assets are bundled locally. All example actions are browser-local and use simulated data.
