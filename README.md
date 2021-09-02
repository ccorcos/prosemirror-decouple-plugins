# Prosemirror Decoupled Plugins

Problem: Prosemirror plugins couple both schema and view.

- App2.js is a simple and contrived example.
- App.tsx is a legit example.


Setup with patch from https://github.com/ProseMirror/rfcs/pull/17
```
cd prosemirror-view
git fetch --all
git diff ad436de  ffd8f3a8659ec7ae0ddeda81c31131d22d7b9536 > ../prosemirror-decouple-plugins/plugin.patch

cd ../prosemirror-decouple-plugins
cd node_modules/prosemirror-view
git init
git apply ../../plugin.patch
npm i
npm run build
rm -rf node_modules/prosemirror-*
```