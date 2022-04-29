# See Code Level Metrics inside you IDE with CodeStream and NewRelic

## Step 1: deploy a plain Flask app to k8s

```bash
# build the docker image
docker buildx build . --platform linux/amd64 -t anthonynguyen334/flask-codestream --progress=plain

# push the docker image
docker tag anthonynguyen334/flask-codestream anthonynguyen334/flask-codestream:latest
docker push anthonynguyen334/flask-codestream:latest

# deploy to your k8s cluster
kubectl apply -f k8s.yaml -n sock-shop

# get public IP address of the service
kubectl get service --watch --namespace=sock-shop

# make sure you connect to it
curl http://<YOURPUBLICIP>/error

# install https://github.com/rakyll/hey
brew install hey

# load test the Flask API
hey -n 2000 http://20.121.251.151/ping
```

## Step 2: Add newrelic apm Agent

```bash
# build newrelic base image
docker buildx build -f NewRelicBaseImageDockerFile . --platform linux/amd64 -t python_newrelic:latest --progress=plain

# update Dockerfile and replace 'FROM python:3.8-slim-buster' to 'FROM python_newrelic:latest' and build image again
docker buildx build . --platform linux/amd64 -t anthonynguyen334/flask-codestream:withNRApm --progress=plain
# push the updated image
docker push anthonynguyen334/flask-codestream:withNRApm

# update the image of the deployment
kubectl set image deployment/flask-simple \
    flask-simple=anthonynguyen334/flask-codestream:withNRApm \
    -n sock-shop

# get your ingest license at one.newrelic.com
set NEW_RELIC_LICENSE_KEY "your-license"


# Set required env variables
kubectl set env deployment/flask-simple \
    NEW_RELIC_LICENSE_KEY=$NEW_RELIC_LICENSE_KEY \
    NEW_RELIC_APP_NAME="Flask - simple" \
    NEW_RELIC_NO_CONFIG_FILE=true \
    NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true \
    NEW_RELIC_METADATA_REPOSITORY_URL=https://github.com/nvhoanganh/flask-python.git \
    NEW_RELIC_METADATA_COMMIT=b2323343c12ae61ce3624ae80253f3483434780b \
    --namespace=sock-shop

# browse http://20.121.251.151/ or http://20.121.251.151/ping or http://20.121.251.151/error
# go to NR One, you should see your app under APM
```

![](2022-04-29-12-29-24.png)

## Step 3: Connect CodeStream and view Code Level Metrics

```bash
# install latest version of Codestream extension for VSCode and connect to NR One using User key
# reload Vscode and open this repository

# install k6 (https://k6.io/docs/getting-started/installation/)
brew install k6

# in VSCode , open app.py file, then in the background, run the load tests
k6 run -e PUBLIC_IP=20.121.251.151 loadtest.js
```

-   you should see this after a minute or two
    ![](2022-04-29-12-34-42.png)
-   click on the Telemetry on top of each method, will show this
    ![](2022-04-29-12-39-54.png)
-   you can click on this link to jump directly to the APM service
    ![](2022-04-29-12-41-09.png)
