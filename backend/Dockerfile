FROM node:6.5.0

MAINTAINER Kurt Lee "kurt@vingle.net"

# Install system programs
RUN apt-get update && apt-get install -y zip build-essential curl openjdk-7-jdk memcached jq && apt-get clean

# # Install npm 5 in order to use package-lock.json
# RUN curl -L https://npmjs.org/install.sh | sh
RUN cd $(npm root -g)/npm && \
    npm install fs-extra && \
    sed -i -e s/graceful-fs/fs-extra/ -e s/fs.rename/fs.move/ ./lib/utils/rename.js
RUN npm install -g npm@5.6.0

# Configure JAVA HOME
ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64
