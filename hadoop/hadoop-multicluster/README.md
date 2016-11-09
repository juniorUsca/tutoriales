# Instalación de Hadoop 2.7.3 en Ubuntu 14.04
---

#### Configurar una IP estatica a cada maquina:

- Maquina Master: 192.168.1.240
- Maquina Slave1: 192.168.1.241
- Maquina Slave2: 192.168.1.242
- Maquina Slave3: 192.168.1.243

#### Instalando Java a cada maquina

```
$ sudo apt-get update
$ sudo add-apt-repository ppa:openjdk-r/ppa
$ sudo apt-get install openjdk-8-jdk
```
Verificamos la instalación de java
```
$ java -version
$ javac -version
```

#### Añadiendo un usuario Hadoop a cada maquina

```
$ sudo addgroup hadoop
$ sudo adduser --ingroup hadoop hduser
```

Damos permisos de administrador como usuario administrador
```
$ sudo adduser hduser sudo
```

#### Instalando SSH a cada maquina

ssh tiene dos principales componentes:
> ssh:  &nbsp;&nbsp;&nbsp;&nbsp;Comando usado para conectar maquinas remotas.
> 
> sshd: &nbsp; El daemon esta corriendo en el servidor y permite al cliente conectarse al servidor.

```
$ sudo apt-get install ssh
```

#### Configurar certificados SSH a cada maquina

Hadoop requiere acceso SSH para manejar los nodos, por ejemplo máquinas remotas o máquinas locales.
Asi que necesitamos tener  SSH levantado y corriendo en nuestras maquinas. 
```
$ su - hduser
$ ssh-keygen -t rsa -P ""
$ cat $HOME/.ssh/id_rsa.pub >> $HOME/.ssh/authorized_keys
```
Para probar que todo salio bien
```
$ ssh localhost
```
Habra ingresado a su propia maquina, salimos para continuar.
```
$ exit
```
#### Autorizando conecciones SSH
Ejecutar en la maquina **master**:
```
$ ssh-copy-id -i $HOME/.ssh/id_rsa.pub hduser@192.168.1.241
$ ssh-copy-id -i $HOME/.ssh/id_rsa.pub hduser@192.168.1.242
$ ssh-copy-id -i $HOME/.ssh/id_rsa.pub hduser@192.168.1.243
```
Ejecutar en la maquina **slave1**:
```
$ ssh-copy-id -i $HOME/.ssh/id_rsa.pub hduser@192.168.1.240
$ ssh-copy-id -i $HOME/.ssh/id_rsa.pub hduser@192.168.1.242
$ ssh-copy-id -i $HOME/.ssh/id_rsa.pub hduser@192.168.1.243
```
Ejecutar en la maquina **slave2**:
```
$ ssh-copy-id -i $HOME/.ssh/id_rsa.pub hduser@192.168.1.240
$ ssh-copy-id -i $HOME/.ssh/id_rsa.pub hduser@192.168.1.241
$ ssh-copy-id -i $HOME/.ssh/id_rsa.pub hduser@192.168.1.242
```
Ejecutar en la maquina **slave3**:
```
$ ssh-copy-id -i $HOME/.ssh/id_rsa.pub hduser@192.168.1.240
$ ssh-copy-id -i $HOME/.ssh/id_rsa.pub hduser@192.168.1.241
$ ssh-copy-id -i $HOME/.ssh/id_rsa.pub hduser@192.168.1.242
```

#### Configurando el hostname

En el **master**:

Editar el archivo **/etc/hostname** y cambiar su contenido por:
```
master
```
Activar usando:
```
$ sudo hostname master
```

En el **slave1**:

Editar el archivo **/etc/hostname** y cambiar su contenido por:
```
slave1
```
Activar usando:
```
$ sudo hostname slave1
```

En el **slave2**:

Editar el archivo **/etc/hostname** y cambiar su contenido por:
```
slave2
```
Activar usando:
```
$ sudo hostname slave2
```

En el **slave3**:

Editar el archivo **/etc/hostname** y cambiar su contenido por:
```
slave3
```
Activar usando:
```
$ sudo hostname slave3
```


#### Configurando los hosts a cada maquina:

Editar **/etc/hosts** y agregamos:

```bash
192.168.1.240 master
192.168.1.241 slave1
192.168.1.242 slave2 
192.168.1.243 slave3
```
Si existe algun host con alguno de estos nombres comentarlo agregando un **#** delante en dicha linea

#### Desactivando IPV6 a cada maquina

Lo desactivamos para no tener conflictos de coneccion en hadoop:

Editamos el archivo **/etc/sysctl.conf**, agregamos al final:

```bash
# disable ipv6
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable_ipv6 = 1
```
Ahora **reiniciamos** cada maquina.

#### Instalando Hadoop 2.7.3 a cada maquina

Descargar Hadoop de su página, la versión binary:

http://hadoop.apache.org/#Download+Hadoop 

Iniciamos sesion como hduser:
```
$ su - hduser
```
Descomprimimos hadoop:
```
$ cd <ubicacion-hadoop>
$ tar xvzf hadoop-2.7.3.tar.gz
```
Moveremos la instalación de Hadoop a /opt/hadoop-2.7.3
```
$ sudo mv hadoop-2.7.3 /opt/
```

#### Configurando Hadoop a cada maquina

Editar **~/.bashrc** para tener acceso a Hadoop:

Agregamos al final lo siguiente:
```bash
#HADOOP VARIABLES START
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export HADOOP_INSTALL=/opt/hadoop-2.7.3
export PATH=$PATH:$HADOOP_INSTALL/bin
export PATH=$PATH:$HADOOP_INSTALL/sbin
export HADOOP_MAPRED_HOME=$HADOOP_INSTALL
export HADOOP_COMMON_HOME=$HADOOP_INSTALL
export HADOOP_HDFS_HOME=$HADOOP_INSTALL
export YARN_HOME=$HADOOP_INSTALL
export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_INSTALL/lib/native
export HADOOP_OPTS="-Djava.library.path=$HADOOP_INSTALL/lib"
#HADOOP VARIABLES END
```
Efectuamos los cambios con:
```
source ~/.bashrc
```
Editamos **/opt/hadoop-2.7.3/etc/hadoop/hadoop-env.sh** y agregamos al final
```bash
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export HADOOP_OPTS=-Djava.net.preferIPv4Stack=true 
```

Generamos una carpeta para datos temporales
```
sudo mkdir -p /app/hadoop/tmp
sudo chown hduser:hadoop /app/hadoop/tmp
```
Editamos **/opt/hadoop-2.7.3/etc/hadoop/core-site.xml**, abrir el archivo y cambiar lo siguiente entre el tag `<configuration> </configuration>`

```xml
<configuration>
 <property>
  <name>hadoop.tmp.dir</name>
  <value>/app/hadoop/tmp</value>
  <description>A base for other temporary directories.</description>
 </property>
 <property>
  <name>fs.default.name</name>
  <value>hdfs://master:54310</value>
  <description>The name of the default file system.</description>
 </property>
 <property>
  <name>dfs.permissions</name>
  <value>false</value>
 </property>
</configuration>
```
Generamos carpetas para namenode y datanode
```
$ sudo mkdir -p /opt/hadoop-2.7.3/hadoop_store/hdfs/namenode
$ sudo mkdir -p /opt/hadoop-2.7.3/hadoop_store/hdfs/datanode
$ sudo chown -R hduser:hadoop /opt/hadoop-2.7.3/hadoop_store
```
Editamos **/opt/hadoop-2.7.3/etc/hadoop/hdfs-site.xml**, abrir el archivo y cambiar lo siguiente entre el tag `<configuration> </configuration>`
```xml
<configuration>
 <property>
  <name>dfs.replication</name>
  <value>4</value>
  <description>Default block replication.</description>
 </property>
 <property>
  <name>dfs.permissions</name>
  <value>false</value>
 </property>
 <property>
   <name>dfs.namenode.name.dir</name>
   <value>file:/opt/hadoop-2.7.3/hadoop_store/hdfs/namenode</value>
 </property>
 <property>
   <name>dfs.datanode.data.dir</name>
   <value>file:/opt/hadoop-2.7.3/hadoop_store/hdfs/datanode</value>
 </property>
</configuration>
```

Copiamos el archivo **/opt/hadoop-2.7.3/etc/hadoop/mapred-site.xml.template** y lo renombramos a **/opt/hadoop-2.7.3/etc/hadoop/mapred-site.xml**
```
cp /opt/hadoop-2.7.3/etc/hadoop/mapred-site.xml.template /opt/hadoop-2.7.3/etc/hadoop/mapred-site.xml
```

El archivo mapred-site.xml es usado para especificar cuál framework está siendo usado por MapReduce.

Editamos **/opt/hadoop-2.7.3/etc/hadoop/mapred-site.xml**, abrir el archivo y cambiar lo siguiente entre el tag `<configuration> </configuration>`

```xml
<configuration>
 <property>
  <name>mapred.job.tracker</name>
  <value>master:54311</value>
  <description>The host and port that the MapReduce job tracker runs
  at</description>
 </property>
 <property>
  <name>mapreduce.framework.name</name>
  <value>yarn</value>
 </property>
</configuration>
```

Editamos **/opt/hadoop-2.7.3/etc/hadoop/yarn-site.xml**, abrir el archivo y cambiar lo siguiente entre el tag `<configuration> </configuration>`

```xml
<configuration>
 <property>
  <name>yarn.nodemanager.aux-services</name>
  <value>mapreduce_shuffle</value>
 </property>
 <property>
  <name>yarn.nodemanager.aux-services.mapreduce_shuffle.class</name>
  <value>org.apache.hadoop.mapred.ShuffleHandler</value>
 </property>
 <property>
  <name>yarn.resourcemanager.resource-tracker.address</name>
  <value>master:8025</value>
 </property>
 <property>
  <name>yarn.resourcemanager.scheduler.address</name>
  <value>master:8030</value>
 </property>
 <property>
  <name>yarn.resourcemanager.address</name>
  <value>master:8050</value>
 </property>
</configuration>
```

Como hemos podido ver todas las configuraciones hechas en cada maquina apuntan al **master**, pero aun no le hemos indicado a hadoop quien sera master y quienes slaves.

#### Configurando Hadoop como Master y como Slave

##### En el Master:

Pondremos el namenode en el Master.

Editar el archivo **/opt/hadoop-2.7.3/etc/hadoop/masters**, si no existe se debe de crear, y cambiar su contenido por:
```
master
```
Pondremos al Master y a los Slaves como datanodes para que todas las maquinas realizen procesos.

Editar el archivo **/opt/hadoop-2.7.3/etc/hadoop/slaves**, y cambiar su contenido por:
```
master
slave1
slave2
slave3
```
##### En el Slave1:

Editar el archivo **/opt/hadoop-2.7.3/etc/hadoop/slaves**, y cambiar su contenido por:
```
slave1
```
##### En el Slave2:

Editar el archivo **/opt/hadoop-2.7.3/etc/hadoop/slaves**, y cambiar su contenido por:
```
slave2
```
##### En el Slave3:

Editar el archivo **/opt/hadoop-2.7.3/etc/hadoop/slaves**, y cambiar su contenido por:
```
slave3
```

#### Iniciando Hadoop MultiNode

##### En el Master:

Formatear el Filesystem:

```
$ hdfs namenode -format
```


Iniciamos el hdfs

```
$ start-dfs.sh
```

Verificamos que se inicio correctamente en:
> 192.168.1.240:50070

Tambien podemos verificar ejecutando `$ jps` en cada maquina:

- En el master deberia aparecer, algo similar:
```
6539 ResourceManager
6451 DataNode
8701 Jps
6895 JobHistoryServer
6234 NameNode
6765 NodeManager
```

- Y en los slaves deberia aparecer, algo similar:
```
8014 NodeManager
7858 DataNode
9868 Jps
```

Iniciamos yarn

```
$ yarn-dfs.sh
```

#### Generando informacion en el Master
Usaremos c++ para generar un archivo con informacion:

El codigo lo podemos encontrar en http://google.com


Lo descargamos con git y lo compilamos
```
$ git clone https://github.com/juniorUsca/hadoop_examples.git
$ cd hadoop_examples
$ g++ main.cpp
$ ./a.out
```
Empezara a generar un archivo llamado `book.txt`, detenemos el script con las teclas:
```
CTRL + C
```

#### Subiendo un Archivo a HDFS en el Master

Ahora subiremos el archivo `book.txt` al sistemas de archivos de Hadoop:

Primero iniciaremos la carpeta del usuario hduser
```
$ hadoop fs -mkdir -p /user/hduser
```
Subimos el archivo
```
$ hadoop fs -copyFromLocal book.txt book.txt
```
Cuando termine de subir el archivo, podemos verificar que lo subio entrando a 192.168.1.240:50070/explorer.html#/user/hduser

![Image 2](https://github.com/juniorUsca/tutoriales/raw/master/hadoop/hadoop-multicluster/imgs/2016-09-15-233818_1366x768_scrot.png)

Ahora probaremos que toda la instalación anterior funciona de manera adecuada, ejecutar:
```
$ hadoop jar /opt/hadoop-2.7.3/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.7.3.jar wordcount book.txt output
```

![Image 3](https://github.com/juniorUsca/tutoriales/raw/master/hadoop/hadoop-multicluster/imgs/2016-09-15-115303_1920x1080_scrot.png)

Al finalizar podemos ver los resultados con:
```
$ hadoop fs -cat output/*
```

#### Ejecutando WordCount y WordMean

Ahora nosotros suponemos que se genero un archivo de 100GB llamado `book.txt`, y que fue ese el que se subio a HDFS.

En el repositorio tambien hay dos ejemplos escritos en java, para probar que se puede usar hadoop MapReduce de la forma que mas nos sea util.

Compilamos el codigo
```
$ cd hadoop_examples
$ mkdir wordcount_classes
$ mkdir wordmean_classes
$ javac -classpath /opt/hadoop-2.7.3/share/hadoop/common/hadoop-common-2.7.3.jar:/opt/hadoop-2.7.3/share/hadoop/common/lib/hadoop-annotations-2.7.3.jar:/opt/hadoop-2.7.3/share/hadoop/mapreduce/hadoop-mapreduce-client-core-2.7.3.jar -d wordcount_classes WordCount.java

$ javac -classpath /opt/hadoop-2.7.3/share/hadoop/common/hadoop-common-2.7.3.jar:/opt/hadoop-2.7.3/share/hadoop/common/lib/hadoop-annotations-2.7.3.jar:/opt/hadoop-2.7.3/share/hadoop/mapreduce/hadoop-mapreduce-client-core-2.7.3.jar -d wordmean_classes WordMean.java
$ jar -cvf WordCount.jar -C wordcount_classes/ . 
$ jar -cvf WordMean.jar -C wordmean_classes/ . 
```
Ejecutamos WordCount
```
$ hadoop jar WordCount.jar WordCount book.txt outputWC
$ hadoop fs -cat outputWC/*
```
Ejecutamos WordMean
```
$ hadoop jar WordMean.jar WordMean book.txt outputWM
$ hadoop fs -cat outputWM/*
```
