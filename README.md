# Prosemirror Decoupled Plugins

Problem: Prosemirror plugins couple both schema and view.

- App2.js is a simple and contrived example.
- App.tsx is a legit example.


```
cd prosemirror-view
git fetch --all
git diff ad436de  ffd8f3a8659ec7ae0ddeda81c31131d22d7b9536 > ../plugin.patch
```