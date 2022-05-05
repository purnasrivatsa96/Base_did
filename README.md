# se-project1) Unzip frontend and backend into same folder\\
2)make sure you node version 10
    I)MAC - one time installation(backend/conFusionServer) - go to backend/conFusionServer folder
    a)install nvm :- "brew install nvm"
    b)mkdir ~/.nvm 
    c)export NVM_DIR="$HOME/.nvm"
    [ -s "$(brew --prefix)/opt/nvm/nvm.sh" ] && . "$(brew --prefix)/opt/nvm/nvm.sh" # This loads nvm
    [ -s "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm" ] && . "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm" # This loads nvm bash_completion
    d)nvm install 10
    e)nvm use 10  
    f)"nvm list" :- should show node version 10
    g)"node --version" :- check node version is 10.x.x
    h)"npm --version" :- npm version should be 6.x.x
    i)"npm install"
    j)node_modules folder should be created

    II)MAC  - One time installation(frontend) - go to frontend folder
    a) source ~/.nvm/nvm.sh
    b) nvm use 10   
    c) npm install
    d)node_modules folder should be created

3)Create keys - 
    a)go to backend/conFusionServer/bin
    b)openssl genrsa 1024 > private.key
    c)openssl req -new -key private.key -out cert.csr
    d)openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem

3)To run the app
    a)go to frontend folder 
        i)source ~/.nvm/nvm.sh
        ii)nvm use 10
        ii)grunt watch
    b)go to backend/conFusionServer
        i)source ~/.nvm/nvm.sh
        ii)nvm use 10
        iii)npm run watch

    c)visit https://localhost/3443





source ~/.nvm/nvm.sh
