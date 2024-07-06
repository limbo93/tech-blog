---
title: "How to setup docker swarm on AWS EC2"
description: "Learn how to setup Docker Swarm on AWS EC2. These instructions cover the installation method with Amazon EC2 and next steps."
keywords: "requirements,dnf,installation,redhat,rehl 9,install,docker,swarm,deploy,aws,ec2"
excerpt: "Docker is indeed a powerful tool for containerization, providing a lightweight and efficient way to package applications with their dependencies. Red Hat Enterprise Linux (RHEL) is a stable release that supports Docker installation. We will be using RHEL 9.4 (Plow) with x86_64 architecture for this setup."
coverImage: "/assets/blog/docker-swarm-ec2/docker_swarm_ec2.jpg"
date: "2024-07-06T01:35:07.322Z"
author:
  name: Md. Mehedi Hasan
  avatar: MH
ogImage:
  url: "/assets/blog/docker-swarm-ec2/docker_swarm_ec2.jpg"
---


Docker is a powerful tool for containerization; providing a lightweight and efficient way to package applications with their dependencies. Docker Swarm made deployment handy as it is easy to maintain and scale applications. I have found it intresting to setup AWS EC2 with docker. Here is the steps that I followed.

### Step 1: Security group.
First we need to login into __AWS Console__ and select select security group.
![Select Security Group](/assets/blog/docker-swarm-ec2/select_security_group.png)

We will create a new security group to setup communication between docker nodes.
![Create Security Group](/assets/blog/docker-swarm-ec2/create_security_group.png)

Docker Swarm uses 2377 (for Docker Swarm management), 7946 (for communication among nodes) & 4789 (for overlay network traffic). We will set inbound rules as follows.
![Inbound Rules](/assets/blog/docker-swarm-ec2/inbound_rules.png)



### Step 2: EC2 instance
We will need two EC2 instances for this cluster, one for __Manager__ node and other for __Worker__ node. While creating EC2 instance, we need to set __Security group__ that we created at the __Step 1__.
![OS Info](/assets/blog/docker-swarm-ec2/network_settings.png)


Once the EC2 instances are created we may check the os and architecture. We are using RHEL 9.4 (Plow) with x86_64 architecture for this setup.
![OS Info](/assets/blog/docker-swarm-ec2/os_info.png)



### Step 3: Install Docker
Official _[Docker documentation](https://docs.docker.com/engine/install/rhel)_ is well resourced. We may follow the mentioned steps to setup docker.

First we need to uninstall old version if any.
```
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine \
                  podman \
                  runc
```

Then we need to install _yum-utils_ package 
```
sudo yum install -y yum-utils
```
![Install yum-utils](/assets/blog/docker-swarm-ec2/yum-utils.png)


After that we need to set up the REHL Docker repository.
```
sudo yum-config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
```
![Repo update](/assets/blog/docker-swarm-ec2/repo_update.png)


And then install Docker Engine.
```
sudo yum install docker-ce \
                  docker-ce-cli \
                  containerd.io \
                  docker-buildx-plugin \
                  docker-compose-plugin
```
![Repo update](/assets/blog/docker-swarm-ec2/install_docker.png)

To start docker engine
```
sudo systemctl start docker
``` 
![Start docker](/assets/blog/docker-swarm-ec2/start_docker.png)

If we want to avoid typing __sudo__ whenever we run the docker command, we need to add username to the docker group.
```
sudo usermod -aG docker ${USER}
```

We need to follow __Step 3__ for both of the EC2 instances (Manager & Worker).



### Step 4: Initialize Docker Swarm on __Manager__ node

We need to run the following on the node that we want to be __Manager__ for docker cluster.

```
docker swarm init
```
![Create manager](/assets/blog/docker-swarm-ec2/docker_swarm_init.png)



### Step 5: Add Worker

We need to copy the output of manager node and run in __Worker__ node to join the cluster.
![Add worker](/assets/blog/docker-swarm-ec2/docker_join_manager.png)



### Step 6: Check
Check node status from __Manager__ node. We will see the _Manager & Worker_ node and their status.

```
sudo docker node ls
```
![Check node](/assets/blog/docker-swarm-ec2/docker_node.png)



### Step 7: Run docker stack on cluster
We are using following _docker-compose.yml_ file to run as docker service.

```
version: '3'

services:
  traefik:
    image: traefik:v3.0
    command:
      - --api.insecure=true
      - --entrypoints.web.address=:80
      - --providers.swarm.endpoint=unix:///var/run/docker.sock
      - --providers.swarm.network=dev-network
      - --log.level=DEBUG
    ports:
      - "80:80"   # HTTP
      - "8080:8080"   # Traefik dashboard
    networks:
      - dev-network
    deploy:
      placement:
        constraints:
          - node.role == manager
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

  docker-poc-1:
    image: limbo93/docker-poc:3
    networks:
      - dev-network
    deploy:
      placement:
        constraints:
          - node.role == manager
    ports:
      - 8091:8091

  docker-poc-2:
    image: limbo93/docker-poc:3
    networks:
      - dev-network
    deploy:
      placement:
        constraints:
          - node.role != manager
    ports:
      - 8093:8091


networks:
  dev-network:
    driver: overlay
```

We may run the file as following assuming a service name _test_. 

```
sudo docker stack deploy -d -c docker-compose.yml test
```
![Docker stack deploy](/assets/blog/docker-swarm-ec2/docker_stack_deploy.png)


If we check the service status, we will see that the three service is running with prefix of _test_
```
sudo docker service ls
```
![Docker service](/assets/blog/docker-swarm-ec2/docker_service.png)


If we check from __Worker__ node, we may see that one container is running as described the compose file.
![Worker container](/assets/blog/docker-swarm-ec2/worker_docker_ps.png)


If we check from __Manager__ node, we may see that two container is running as described the compose file. We may also connect a container of _Manager_ node and _curl_ the container of worker node to check the connectivity.
![Manager container](/assets/blog/docker-swarm-ec2/manager_docker_ps.png)


__Congratulations!__ Docker swarm setup with EC2 is complete!