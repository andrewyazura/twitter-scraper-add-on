CurrentPath=${PWD}
CurrentFolderName=${PWD##*/}

cd "${1:-$ADDONEXPORTPATH}"
rm -rf $CurrentFolderName
mkdir $CurrentFolderName

cp "${CurrentPath}/." "${CurrentFolderName}" -r
