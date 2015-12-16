FROM ubuntu:trusty

# set environment variables
ENV PROJECT_ROOT /srv/app
ENV DOCUMENT_ROOT /var/www/html
ENV DRUPAL_PROFILE=its_profile

# Install packages.
RUN apt-get update
RUN apt-get install -y \
	vim \
	git \
	apache2 \
	php-apc \
	php5-fpm \
	php5-cli \
	php5-mysql \
	php5-gd \
	php5-curl \
	libapache2-mod-php5 \
	curl \
	mysql-client \
	openssh-server \
	phpmyadmin \
	wget \
	unzip \
	supervisor
RUN apt-get clean

# Configure X Debug
# RUN apt-get install -y php5-xdebug
# RUN echo "\nxdebug.max_nesting_level=256\nxdebug.default_enable=1\nxdebug.remote_enable=1\nxdebug.remote_handler=dbgp\nxdebug.remote_host=192.168.100.1\nxdebug.remote_port=9000\nxdebug.remote_autostart=0" >> /etc/php5/apache2/conf.d/20-xdebug.ini
# RUN /etc/init.d/apache2 restart

# Install Composer.
RUN curl -sS https://getcomposer.org/installer | php
RUN mv composer.phar /usr/local/bin/composer

# Setup SSH.
RUN mkdir /root/.ssh && chmod 700 /root/.ssh && touch /root/.ssh/authorized_keys && chmod 600 /root/.ssh/authorized_keys
RUN echo 'root:root' | chpasswd
RUN sed -i 's/PermitRootLogin without-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN mkdir /var/run/sshd && chmod 0755 /var/run/sshd
RUN mkdir -p /root/.ssh
COPY keys/id_rsa.pub /root/.ssh/authorized_keys
RUN chmod 600 /root/.ssh/authorized_keys
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

# Install Drush
RUN composer global require drush/drush:DRUSH_VERSION
RUN ln -nsf /root/.composer/vendor/bin/drush /usr/local/bin/drush

# Move Composer cache, is put back in install.sh
RUN mv /root/.composer /tmp/

# Setup PHP.
RUN sed -i 's/display_errors = Off/display_errors = On/' /etc/php5/apache2/php.ini
RUN sed -i 's/display_errors = Off/display_errors = On/' /etc/php5/cli/php.ini

# Setup Apache.
RUN sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf
RUN a2enmod rewrite

# Setup Supervisor.
RUN echo '[program:apache2]\ncommand=/bin/bash -c "source /etc/apache2/envvars && exec /usr/sbin/apache2 -DFOREGROUND"\nautorestart=true\n\n' >> /etc/supervisor/supervisord.conf
RUN echo '[program:sshd]\ncommand=/usr/sbin/sshd -D\n\n' >> /etc/supervisor/supervisord.conf

WORKDIR $PROJECT_ROOT
EXPOSE 80 22
CMD exec supervisord -n