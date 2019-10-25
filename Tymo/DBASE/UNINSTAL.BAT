echo off
if "==%1" goto Helpunst
for %%f in (A:,a:,B:,b:,C:,c:,D:,d:,E:,e:,F:,f:,G:,g:,H:,h:,Y:,y:) do if %1.==%%f. goto START
for %%f in (I:,i:,J:,j:,K:,k:,L:,l:,M:,m:,N:,n:,O:,o:,P:,p:,Z:,z:) do if %1.==%%f. goto START
for %%f in (Q:,q:,R:,r:,S:,s:,T:,t:,U:,u:,V:,v:,W:,w:,X:,x:) do if %1.==%%f. goto START
goto Badrive
:START
if %2.==access. goto ACCESS
if %2.==ACCESS. goto ACCESS
if %1.==a:. goto Badrive
if %1.==A:. goto Badrive
if "==%2" goto DBASE
if %2.==DBA. goto DBA
if %2.==dba. goto DBA
goto Helpunst
:DBASE
type uninstal.hlp
pause
installh /u p=a t=%1
if exist %1dbase.com goto ErrDbase
echo dBASE III PLUS has been successfully uninstalled.
goto End
:ACCESS
if %1.==a:. goto Floppy
if %1.==A:. goto Floppy
type uninstal.hlp
pause
if exist access.COM rename access.com dbase.com
if exist %1dbase.com goto Edbexist
if exist %1access.com rename %1access.com dbase.com
installh /u p=a t=%1
if exist %1DBASE.COM goto ErrAces
if exist %1ACCESS.COM goto ErrAces
echo ACCESS has been successfully uninstalled.
goto End
:Floppy
if not exist access.COM goto Notexist
if exist dbase.com goto Notexist
rename access.COM DBASE.COM
echo ACCESS has been successfully uninstalled.
goto End
:DBA
type uninstal.hlp
pause
%1
a:installM /u
erase dba.ovl
erase dba.exe
erase dba.ld1
erase help.dbs
erase dbase.msg
erase assist.hlp
a:
if exist %1dba.ld1 goto ErrDBA
echo DBA has been successfully uninstalled.
goto End
:Notexist
echo 
echo ACCESS has not been installed.
goto End
:Helpunst
echo Enter "UNINSTAL <drive:>" to uninstall dBASE III PLUS.
echo Enter "UNINSTAL <drive:> ACCESS" to uninstall ACCESS.
echo Enter "UNINSTAL <drive:> DBA" to uninstall DBA.
echo Uninstall is aborted.
goto End
:Badrive
echo Invalid drive letter specified.  Uninstall is aborted.
goto Helpunst
:Edbexist
echo DBASE.COM exists on the same directory.
goto End
:ErrDbase
echo 
echo dBASE III PLUS uninstall has been aborted.
goto End
:ErrAces
echo 
echo ACCESS uninstall has been aborted.
goto End
:ErrDBA
echo 
echo DBA uninstall has been aborted.
:End
