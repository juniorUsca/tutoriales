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

Dependiendo del nombre del adaptador 2 que creamos previamente, agregamos lo siguiente:

```diff
+ this will be highlighted in green
- this will be highlighted in red
```