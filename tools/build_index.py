"""Turn web/soft-pulse.html into the Android WebView page: local fonts instead of Google Fonts, full document skeleton.
usage: python3 tools/build_index.py web/soft-pulse.html android/assets/index.html"""
import sys,re
HDR='<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light dark">\n<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}html{-webkit-tap-highlight-color:transparent}</style>'
FONTS='@font-face{font-family:"Figtree";font-style:normal;font-weight:400;font-display:swap;src:url(fonts/figtree-latin-400-normal.woff2) format("woff2")}\n@font-face{font-family:"Figtree";font-style:normal;font-weight:500;font-display:swap;src:url(fonts/figtree-latin-500-normal.woff2) format("woff2")}\n@font-face{font-family:"Figtree";font-style:normal;font-weight:600;font-display:swap;src:url(fonts/figtree-latin-600-normal.woff2) format("woff2")}\n@font-face{font-family:"Figtree";font-style:normal;font-weight:700;font-display:swap;src:url(fonts/figtree-latin-700-normal.woff2) format("woff2")}\n@font-face{font-family:"Big Shoulders Display";font-style:normal;font-weight:600;font-display:swap;src:url(fonts/big-shoulders-display-latin-600-normal.woff2) format("woff2")}\n@font-face{font-family:"Big Shoulders Display";font-style:normal;font-weight:800;font-display:swap;src:url(fonts/big-shoulders-display-latin-800-normal.woff2) format("woff2")}\n@font-face{font-family:"JetBrains Mono";font-style:normal;font-weight:500;font-display:swap;src:url(fonts/jetbrains-mono-latin-500-normal.woff2) format("woff2")}'
src=open(sys.argv[1]).read()
fonts='<style>\n'+FONTS+'\n</style>'
src=re.sub(r'<link rel="preconnect"[^\n]*\n','',src)
src=re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^\n]*',lambda m:fonts,src)
i=src.index('</style>',src.index(fonts)+len(fonts))+len('</style>')
src=src[:i]+'\n\n</head><body>'+src[i:]
open(sys.argv[2],'w').write(HDR+'\n'+src.rstrip('\n')+'\n\n</body></html>')
