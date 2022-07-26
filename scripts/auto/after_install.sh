#!/usr/bin/env bash
install_basic_dependencies() {
    if ! rsync --help
    then
        yum install -y rsync
    fi
}

install_nginx() {
    cp scripts/nginx.repo /etc/yum.repos.d/nginx.repo
    sudo -u ec2-user mkdir -p /home/ec2-user/logs

    yum clean metadata
    yum update -y
    yum install -y nginx
    nginx -t && nginx
    nginx -s quit
}

install_nginx_if_necessary() {
    if [ ! -f /etc/yum.repos.d/nginx.repo ]
    then
        install_nginx
    fi
}

update_nginx_config() {
    cp scripts/nginx.conf /etc/nginx/nginx.conf
}

update_website_code() {
    if [ ! -d venv ]
    then
        python3 -m venv venv
    fi
    . venv/bin/activate
    python -m pip install -U pip
    pip install -r requirements.txt
    vanillaplusjs build --no-symlinks
    deactivate
    rsync -avu --delete out/www/ /var/www
}

install_basic_dependencies
install_nginx_if_necessary
update_nginx_config
update_website_code
