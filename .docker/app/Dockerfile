FROM php:7.3.6-fpm-alpine3.10
RUN apk add --no-cache  bash \
                        mysql-client \
                        openssl \
                        nodejs \
                        npm \
                        freetype-dev \
                        libjpeg-turbo-dev \
                        libpng-dev

RUN touch /root/.bashrc | echo "PS1='\w\$ '" >> /root/.bashrc

RUN apk add -u $PHPIZE_DEPS

RUN docker-php-ext-install pdo pdo_mysql

RUN docker-php-ext-configure gd --with-gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/
RUN docker-php-ext-install -j$(nproc) gd

RUN pecl install xdebug && docker-php-ext-enable xdebug

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /var/www
RUN rm -rf /var/www/html
RUN ln -s public html
RUN mkdir /opt/docker
RUN mkdir /var/www/backend
RUN mkdir /var/www/frontend
RUN mkdir /var/www/.npm-cache

RUN echo "xdebug.remote_autostart=1" | tee -a /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini > /dev/null
RUN echo "xdebug.remote_enable=1" | tee -a /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini > /dev/null
RUN echo "xdebug.remote_connect_back=1" | tee -a /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini > /dev/null
RUN echo "xdebug.remote_host=172.172.0.1" | tee -a /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini > /dev/null

EXPOSE 9000

