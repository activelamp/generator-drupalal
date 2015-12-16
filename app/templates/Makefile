all: init install sync

init:
	bundle
	composer install
	npm install
#	cd drupal/profiles/custom_profile/themes/custom/mytheme && bower install && cd -
#	bundle exec compass compile drupal/profiles/custom_profile/themes/custom/mytheme
	vagrant up --no-parallel

install:
	bin/drush @dev install.sh

rebuild:
	bin/drush @dev rebuild.sh

clean:
	vagrant destroy drupal
	vagrant destroy mysql

mnt:
	mkdir -p docroot
	sshfs -C -p 2222 root@DEV_URL:/var/www/html docroot

sync:
	vagrant rsync-auto drupal

#css:
#	bundle exec compass compile drupal/profiles/apa_profile/themes/custom/mytheme
#
#watch:
#	bundle exec compass watch drupal/profiles/apa_profile/themes/custom/mytheme