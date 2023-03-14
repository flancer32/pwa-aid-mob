# pwa-aid-mob
AI Demo PWA

## Configure Apache 2 to proxy Web Sockets

```shell
$ sudo a2enmod proxy
$ sudo a2enmod proxy_http
$ sudo a2enmod proxy_http2
$ sudo a2enmod proxy_wstunnel
$ sudo apache2ctl -M | grep proxy
 proxy_module (shared)
 proxy_http_module (shared)
 proxy_http2_module (shared)
 proxy_wstunnel_module (shared)
```

```apacheconf
<VirtualHost *:443>
    ...
    # Redirect all requests to HTTP2 server.
    RewriteEngine  on
    RewriteCond %{HTTP:Upgrade} !websocket [NC]
    RewriteCond %{HTTP:Connection} !upgrade [NC]
    RewriteRule    "^/(.*)$"  "http://localhost:8080/$1"  [P]

    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://localhost:8080/$1" [P,L]

</VirtualHost>
```