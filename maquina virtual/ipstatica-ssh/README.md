# Configurar VirtualBox para ingresar con SSH e IP estatica
---

### Configurando una IP estatica a una maquina virtual:

La ip que configuraremos sera: 192.168.1.240

Apagamos la maquina virtual Virtual Box

Ingresamos a configuracion y red, habilitamos el **adaptador 2** como se ve en la iamgen:

![Image 1](https://raw.githubusercontent.com/juniorUsca/tutoriales/master/maquina%20virtual/ipstatica-ssh/imgs/vbox_adapter2.png)

Encendemos la maquina virtual

#### Verificamos lo adaptadores de red
```
$ ls /sys/class/net
```

Deberia de aparecer 3 redes, 2 de los adaptadores y la otra de localhost

#### Editamos las interfaces de red

```
$ sudo vim /etc/network/interfaces
```

Dependiendo del nombre del **adaptador 2** que creamos previamente, agregamos lo siguiente, en nuestro caso en nombre es **eth1**:

```
auto eth1
iface eth1 inet static
  address 192.168.56.10
  netmask 255.255.255.0
```

Activamos la red con:
```
$ sudo ifup eth1
```

### Configurando SSH en una maquina virtual:

#### Instalamos SSH en la maquina virtual
```
$ sudo apt-get install openssh-server
```

#### Verificamos la coneccion desde cualquier otra maquina en la misma red
```
$ ping 192.168.56.10
```

#### Para ingresar por ssh a la maquina configurada usamos desde cualquier otra maquina en la misma red
```
$ ssh <usernam>@192.168.56.10
```

## Errores comunes
### Si no hace ping a la maquina virtual, asegurate que este levantado en tu maquina HOST
```
$ sudo ifconfig vboxnet0 up
$ ifconfig
```
### Si no conecta a la maquina virtual, aplicar:
```
$ sudo ifconfig vboxnet 192.168.56.1
$ ifconfig
```

### Referencias:
- http://debugcompany.blogspot.pe/2016/07/configurar-virtualbox-para-ingresar-con.html

- https://muffinresearch.co.uk/howto-ssh-into-virtualbox-3-linux-guests/

- http://askubuntu.com/questions/293816/in-virtualbox-how-do-i-set-up-host-only-virtual-machines-that-can-access-the-in

- http://slopjong.de/2013/05/14/virtualbox-make-your-virtual-machine-accessible-from-your-host-system-but-not-from-the-local-network/
