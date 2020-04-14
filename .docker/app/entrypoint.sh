#!/bin/bash

chown -R www-data:www-data /var/www

chmod -R 777 /var/www/

## FRONT-END
npm config set cache /var/www/.npm-cache --global

## BACK-END

composer install

php artisan key:generate
php artisan migrate

php-fpm