FROM ubuntu:22.04

RUN apt update
RUN apt install openssh-server sudo -y
RUN service ssh start

RUN useradd -m -s /bin/bash test
RUN echo 'test:test' | chpasswd
RUN echo 'test ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

RUN apt update

EXPOSE 22
CMD ["/usr/sbin/sshd","-D"]