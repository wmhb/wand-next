#!/bin/bash
echo "RSYNC SERVER"
rsync -rav -e ssh --exclude='.git/' --exclude=.DS_Store --delete-excluded ./src/api $DEPLOY_USER@$DEPLOY_SERVER:$SERVER_DIR/src
rsync -rav -e ssh --exclude='.git/' --exclude=.DS_Store --delete-excluded ./dist $DEPLOY_USER@$DEPLOY_SERVER:$SERVER_DIR
rsync -rav -e ssh --exclude='.git/' --exclude=.DS_Store --delete-excluded ./package.json $DEPLOY_USER@$DEPLOY_SERVER:$SERVER_DIR
rsync -rav --chmod=Fug+x -e ssh --exclude='.git/' --exclude=.DS_Store --exclude=deploy.sh --delete-excluded ./scripts $DEPLOY_USER@$DEPLOY_SERVER:$SERVER_DIR
echo "INSTALL NEW DEPS & RESTART WAND-SERVER"
ssh -p22 $DEPLOY_USER@$DEPLOY_SERVER "cd $SERVER_DIR && npm install && supervisorctl restart wand-server"
echo "RESTARTED WAND-SERVER SERVICE"
