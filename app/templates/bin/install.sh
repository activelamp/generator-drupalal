#!/usr/bin/env bash

echo "Moving the contents of composer cache into place..."
mv /tmp/.composer/* /root/.composer/

DRUPAL_PROFILE=custom_profile
DOCUMENT_ROOT=/var/www/html
PROJECT_ROOT=/srv/app

PROJECT_ROOT=$PROJECT_ROOT DOCUMENT_ROOT=$DOCUMENT_ROOT $PROJECT_ROOT/bin/rebuild.sh

echo "Installing Drupal..."
cd $DOCUMENT_ROOT && drush si $DRUPAL_PROFILE --account-pass=admin -y
chgrp -R www-data sites/default/files
rm -rf ~/.drush/files && cp -R sites/default/files ~/.drush/