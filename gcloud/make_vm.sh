gcloud beta compute instances create web-host \
  --zone=us-central1-a \
  --machine-type=f1-micro \
  --subnet=default \
  --address=35.223.132.88 \
  --network-tier=PREMIUM \
  --metadata=startup-script='#!/usr/bin/env bash
apt update -y && apt upgrade -y
apt install -y mosh git cmake zsh tmux
apt install -y software-properties-common
add-apt-repository -y ppa:jgmath2000/et
apt update -y
apt install -y et
mkdir /home/ffettes/ -p
curl -fLo /home/ffettes/.vimrc https://raw.githubusercontent.com/FergusFettes/docker-apps/dev/dockerfiles/config/minimal.vim
curl -fLo /home/ffettes/.zshrc https://raw.githubusercontent.com/FergusFettes/docker-apps/dev/dockerfiles/config/minimal.zsh
curl -fLo /home/ffettes/.tmux.conf https://raw.githubusercontent.com/FergusFettes/docker-apps/dev/dockerfiles/config/.tmux.conf
curl -fLo /home/ffettes/docker-install.sh https://raw.githubusercontent.com/FergusFettes/docker-apps/dev/scripts/docker-install-ubuntu.sh
git clone https://github.com/fergusfettes/docker-web-server /home/ffettes/docker-web-server
chown -R ffettes: /home/ffettes/
chown -R ffettes:1000 /home/ffettes/docker-web-server
sh /home/ffettes/docker-install.sh
' \
  --maintenance-policy=MIGRATE \
  --service-account=7476584885-compute@developer.gserviceaccount.com \
  --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append \
  --tags=http-server,https-server \
  --image=ubuntu-1804-bionic-v20200430 \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=10GB \
  --boot-disk-type=pd-ssd \
  --boot-disk-device-name=web-host \
  --no-shielded-secure-boot \
  --shielded-vtpm \
  --shielded-integrity-monitoring \
  --reservation-affinity=any

# commented out ofr now since these persiste even when i kill my main instance
# gcloud compute firewall-rules create default-allow-http \
#   --direction=INGRESS \
#   --priority=1000 \
#   --network=default \
#   --action=ALLOW \
#   --rules=tcp:80 \
#   --source-ranges=0.0.0.0/0 \
#   --target-tags=http-server

# gcloud compute firewall-rules create default-allow-https \
#   --direction=INGRESS \
#   --priority=1000 \
#   --network=default \
#   --action=ALLOW \
#   --rules=tcp:443 \
#   --source-ranges=0.0.0.0/0 \
#   --target-tags=https-server

# gcloud compute firewall-rules create default-allow-udp-mosh \
#   --direction=INGRESS \
#   --priority=1000 \
#   --network=default \
#   --action=ALLOW \
#   --rules=udp:3456 \
#   --source-ranges=0.0.0.0/0 \
#   --target-tags=https-server

# gcloud compute firewall-rules create default-allow-tcp-et \
#   --direction=INGRESS \
#   --priority=1000 \
#   --network=default \
#   --action=ALLOW \
#   --rules=tcp:2022 \
#   --source-ranges=0.0.0.0/0 \
#   --target-tags=https-server
