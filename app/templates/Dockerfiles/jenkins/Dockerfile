FROM jenkins:1.625.2

USER root

# Install packages.
RUN apt-get update
RUN apt-get install -y \
	git \
	php5-fpm \
	php5-cli \
	php5-curl \
	curl \
	rubygems \
	rubygems-integration \
	ruby2.1-dev \
	build-essential \
	nodejs \
	npm \
	rsync
RUN apt-get clean

# Install Composer.
RUN curl -sS https://getcomposer.org/installer | php
RUN mv composer.phar /usr/local/bin/composer

# Install Drush
RUN composer global require drush/drush:8.0.0-rc3
RUN cp -Rf /root/.composer /usr/share/composer
RUN ln -nsf /usr/share/composer/vendor/bin/drush /usr/local/bin/drush

# Install Bundler
RUN gem install bundler
RUN chown -R jenkins /var/lib/gems /usr/local/bin

# Install Bower
RUN npm install -g bower
RUN ln -s /usr/bin/nodejs /usr/bin/node

#RUN chown -R jenkins /var/jenkins_home/.composer /var/jenkins_home/.drush

#USER jenkins

#COPY build_apa_cms.xml /var/jenkins_home/
COPY keys/id_rsa /root/.ssh/id_rsa
#COPY known_hosts /root/.ssh/
RUN chmod 700 /root/.ssh/id_rsa

RUN git config --global user.email "info@activelamp.com" && git config --global user.name "Jenkins CI"

#RUN java -jar /var/jenkins_home/war/WEB-INF/jenkins-cli.jar -s http://127.0.0.1:8080 create-job build_apa_cms < /var/jenkins_home/build_apa_cms.xml