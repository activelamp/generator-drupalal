#!/usr/bin/env bash

if [ -d "$DOCUMENT_ROOT/sites/default/files" ]
  then
    echo "Moving files to ~/.drush/..."
    mv $DOCUMENT_ROOT/sites/default/files /root/.drush/
fi

echo "Deleting Drupal and rebuilding..."
rm -rf $DOCUMENT_ROOT

echo "Downloading contributed modules..."
drush make -y $PROJECT_ROOT/drupal/make/dev.make $DOCUMENT_ROOT

echo "Symlink profile..."
ln -nsf $PROJECT_ROOT/drupal/profiles/custom_profile $DOCUMENT_ROOT/profiles/custom_profile

echo "Moving settings.php file to $DOCUMENT_ROOT/sites/default/..."
rm -f $DOCUMENT_ROOT/sites/default/settings*
cp $PROJECT_ROOT/drupal/config/settings.php $DOCUMENT_ROOT/sites/default/
cp $PROJECT_ROOT/drupal/config/settings.local.php $DOCUMENT_ROOT/sites/default/
ln -nsf $PROJECT_ROOT/drupal/config/sync $DOCUMENT_ROOT/sites/default/config
chown -R www-data $PROJECT_ROOT/drupal/config/sync

if [ -d "/root/.drush/files" ]
  then
    cp -Rf /root/.drush/files $DOCUMENT_ROOT/sites/default/
    chmod -R g+w $DOCUMENT_ROOT/sites/default/files
    chgrp -R www-data sites/default/files
fi