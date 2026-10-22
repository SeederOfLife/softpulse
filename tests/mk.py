import sys
s=open(sys.argv[1]).read()
s=s.replace('\nrenderAll();\nrenderHz();','\nwindow.__t={analyse,S,tun,setCtx:(c)=>{ctx=c;},peakDetect,flowStep,renderChimes,showReading};\nrenderAll();\nrenderHz();')
open(sys.argv[2],'w').write(s)
