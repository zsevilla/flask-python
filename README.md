# See Code Level Metrics inside you IDE with CodeStream and NewRelic

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
