# Apache tips

#### Configurar el iptables

Para ver las reglas en el iptables:
```
$ sudo iptables -L
$ sudo iptables -S
```

#### centOS
```
$ vim /etc/sysconfig/iptables

~ -A INPUT -m state --state NEW -m tcp -p tcp --dport 22 -j ACCEPT
~ -A INPUT -m state --state NEW -m tcp -p tcp --dport 80 -j ACCEPT

$ services iptables restart

```

#### ubuntu
```
$ sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
$ sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
$ sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
$ sudo iptables -I INPUT 1 -i lo -j ACCEPT
```


### Referencias

- https://www.digitalocean.com/community/tutorials/como-configurar-virtual-host-de-apache-en-ubuntu-14-04-lts-es
