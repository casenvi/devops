<?php
for ($i = 0; $i < 10; $i++) {
  echo $i;
  echo '</br>';
}
phpinfo();
/*
zend_extension=/usr/local/lib/php/extensions/no-debug-non-zts-20180731/xdebug.so
xdebug.remote_autostart=1
xdebug.remote_host=0.0.0.0
xdebug.remote_connect_back = 1
xdebug.remote_handler = dbgp
xdebug.remote_mode = req
xdebug.remote_enable=1
xdebug.remote_port=9001

{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Listen for XDebug",
      "type": "php",
      "request": "launch",
      "port": 9001,
      "pathMappings": {
        "/var/www": "${workspaceRoot}/Data/laravel"
      }
    }
  ]
}

*/
