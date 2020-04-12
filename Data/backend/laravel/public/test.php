<?php
/*
*********************************************************************************
File      /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini in app container
Reason:   Enable the xdebug in container
---------------------------------------------------------------------------------
zend_extension=/usr/local/lib/php/extensions/no-debug-non-zts-20180731/xdebug.so
xdebug.remote_autostart=1
xdebug.remote_enable=1
xdebug.remote_connect_back = 1
xdebug.remote_host=172.172.0.1 ;need to check your IP host.
---------------------------------------------------------------------------------

*********************************************************************************
File      .vscode/launch.json in host machine
Reason:   Enable the xdebug in vscode
---------------------------------------------------------------------------------

{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Listen for XDebug",
      "type": "php",
      "request": "launch",
      "port": 9000,
      "pathMappings": {
        "/var/www": "${workspaceRoot}/Data/laravel"
      }
    }
  ]
}
*/
for ($i = 0; $i < 10; $i++) {
  echo $i;
  echo '</br>';
}
phpinfo();
