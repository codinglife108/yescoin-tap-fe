#!/bin/sh

################################################################################
# Variables
################################################################################

RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color


SERVER="peuh_adminSSH@peuh.ftp.infomaniak.com:sites/tgbot.5w155.ch/"

function blankLine {
    echo "\n"
}

################################################################################
# Parse and setup flags
################################################################################

if [ ! -z ${1+x} ] && [ $1 = "--prod" ]
then
    SERVER="$PROD_SERVER"
fi

################################################################################
# Start build
################################################################################

blankLine
echo "${GREEN}Building website${NC}"

yarn run build


blankLine
echo "${GREEN}Deploying website${NC}"
scp -r build/* $SERVER

echo "✅ DONE"

blankLine
