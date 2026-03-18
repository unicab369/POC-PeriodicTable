  Root cause: GitHub Pages runs Jekyll by default,     
  which ignores directories starting with _. SvelteKit 
  puts all JS/CSS assets in a _app/ directory. Without 
  a .nojekyll file, GitHub Pages was stripping out the 
  entire _app directory from the deployment — so the
  HTML loaded but had zero JavaScript or CSS.

  Fixes applied:                                       
  1. static/.nojekyll — Added an empty .nojekyll file  
  to the static/ directory. SvelteKit automatically
  copies everything in static/ to the build/ output, so
   this file will always be included in builds.
  2. .github/workflows/deploy.yml — Added a touch
  build/.nojekyll step as a safety belt (in case the
  static copy doesn't happen for some reason).

  Commit and push these changes, and the deployment
  should work. The two files to commit are:
  - static/.nojekyll (new file)
  - .github/workflows/deploy.yml (updated)
