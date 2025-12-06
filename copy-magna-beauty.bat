@echo off
cd /d C:\Users\dataf\Downloads\Eishro-Platform_V7

echo Copying Magna Beauty product images...

for %%f in (public\assets\magna-beauty\*.webp public\assets\magna-beauty\*.jpeg) do (
    if /i not "%%~nf"=="slide1.webp" if /i not "%%~nf"=="slide2.webp" if /i not "%%~nf"=="slide3.webp" if /i not "%%~nf"=="slide4.webp" if /i not "%%~nf"=="slide5.webp" (
        copy "%%f" "backend\public\assets\magna-beauty\" /Y > nul
        echo Copied: %%~nf
    )
)

echo Done! All product images have been copied.
pause
