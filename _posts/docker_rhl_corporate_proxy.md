---
title: "How to install docker on Red Hat Enterprise Linux 8"
excerpt: "Docker is indeed a powerful tool for containerization, providing a lightweight and efficient way to package applications with their dependencies. Red Hat Enterprise Linux (RHEL) 8.7 (Ootpa) is a stable release that supports Docker installation. We will be using RHEL 8.7 (Ootpa) with x86_64 architecture for this setup."
coverImage: "/assets/blog/docker-rhl-corporate-proxy/docker_rhl_corporate_proxy.jpg"
date: "2024-06-23T05:35:07.322Z"
author:
  name: Md. Mehedi Hasan
  avatar: MH
ogImage:
  url: "/assets/blog/docker-rhl-corporate-proxy/docker_rhl_corporate_proxy.jpg"
---


Docker is indeed a powerful tool for containerization, providing a lightweight and efficient way to package applications with their dependencies.

Red Hat Enterprise Linux (RHEL) 8.7 (Ootpa) is a stable release that supports Docker installation. We will be using RHEL 8.7 (Ootpa) with x86_64 architecture for this setup.

![OS Info](/assets/blog/docker-rhl-corporate-proxy/enable_docker.png)

Setting up Docker on Red Hat Enterprise Linux (RHEL) when behind a corporate proxy can indeed be challenging due to the need to configure Docker to work with the proxy settings. Here's a detailed guide on how to set up Docker on RHEL 8.7 when using a corporate proxy.



### Step 1: Set Corporate Proxy to dnf
Run `sudo vi /etc/dnf/dnf.conf` and add your corporate proxy as follows `proxy=http://proxy-ip:port`


### Step 2: Uninstall any such older versions before attempting to install a new version, along with associated dependencies along with "Podman"

```
sudo dnf -y remove docker \
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

### Step 3: Enable Docker CE Repository
```
sudo dnf config-manager --add-repo=https://download.docker.com/linux/rhel/docker-ce.repo
```

### Step 4: Install the latest version
```
sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Step 5: Enable Docker
```
sudo systemctl enable docker
```

![Enable Docker](/assets/blog/docker-rhl-corporate-proxy/enable_docker.png)

### Step 6: Start Docker
```
sudo systemctl start docker
```

### Step 7: Check Docker Status
```
sudo systemctl status docker
```

![Docker Status](/assets/blog/docker-rhl-corporate-proxy/docker_status.png)

### Step 8: Verify Docker Installation
```
docker --version
```

![Docker Status](/assets/blog/docker-rhl-corporate-proxy/docker_version.png)

### Step 9: Add Users to the Docker Group (Optional)
If you want to avoid typing `sudo` whenever you run the docker command, add your username to the docker group
```
sudo usermod -aG docker ${USER}
```

Congratulations! Docker setup complete!

Installing Docker on Red Hat Enterprise Linux 8.7 (Ootpa) involves adding the Docker CE repository, installing Docker, starting the Docker service and optionally adding users to the Docker group for simplified command execution.

By following these steps, you should now have Docker installed and ready to use on your RHEL 8.7 system, allowing you to leverage the benefits of containerization for your applications. If you encounter any issues during the installation process, checking the [Docker documentation](https://docs.docker.com/engine/install/rhel).