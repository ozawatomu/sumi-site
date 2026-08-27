# sumicalculator.com

Marketing site, privacy policy and support page for [Sumi: Scientific Calculator](https://sumicalculator.com).
Static HTML and one stylesheet, served by GitHub Pages from `main`.

Preview locally with `python3 -m http.server 8080` and open <http://localhost:8080>.

## Going live on the custom domain

1. At the registrar, add `A` records for `@` → `185.199.108.153`, `185.199.109.153`,
   `185.199.110.153`, `185.199.111.153` and a `CNAME` for `www` → `ozawatomu.github.io`.
2. Once they resolve, run
   `gh api -X PUT repos/ozawatomu/sumi-site/pages -f cname=sumicalculator.com -F https_enforced=true`,
   which commits the `CNAME` file for you.
3. Replace the placeholder store links in `index.html` when the apps are published.
