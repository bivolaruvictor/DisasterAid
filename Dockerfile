#stage 1
FROM node:16-bullseye-slim as base

# Setup env
ENV PATH=/home/node/.local/bin:$PATH

# Install OS packages
RUN apt-get update \
    && apt-get -y upgrade \
    && apt-get -y install sudo git curl expect \
    && apt-get clean \
    && usermod -a -G sudo node \
    && echo "node ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers 
    
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod
#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/DisasterAid /usr/share/nginx/html