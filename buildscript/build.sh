#!/bin/bash
clear
REPO_URL="https://github.com/Telecominfraproject/oopt-gnpy-web-gui.git"
DnldDir="$HOME/TIP_HTML"
PublishDir="$HOME/TIP_HTML/oopt-gnpy-web-gui"

`/bin/rm -rf $DnldDir/*`

if [ ! -d "$DnldDir" ]; then
mkdir -p "$DnldDir"
fi

cd $DnldDir
git init $DnldDir
git clone $REPO_URL

cd $PublishDir
python -m http.server 8000
