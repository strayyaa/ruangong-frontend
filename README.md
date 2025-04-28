## START:
Based on vite
use `npx vite` to start

### git push:
When meeting problem like:`Failed to connect to github.com port 443 after 21088 ms: Could not connect to server` while VPN is on,use code below before push:
```
git config --global http.proxy 127.0.0.1:<Your Port>
git config --global https.proxy 127.0.0.1:<Your Port>
```
