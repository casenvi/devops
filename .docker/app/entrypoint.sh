#!/bin/bash
## FRONT-END
npm config set cache /var/www/.npm-cache --global

## BACK-END

composer install

php artisan key:generate
php artisan migrate

php-fpm