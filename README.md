# SE Project: Base

## Prerequisite (Unix: OSX/Linux)
### Shell
- OSX:   Terminal (pre-installed)
- Linux: Terminal (pre-installed)
### Git
- Download [here](https://git-scm.com/downloads)

## Backend Installation (Unix: OSX/Linux)
### Install MongoDB
- Download [here](https://www.mongodb.com/docs/manual/installation/)
### Clone the repository
```
cd ~
gh repo clone purnasrivatsa96/se-project
```
### Install Node (Version >= 10)
- Navigate backend directory in the repository
```
cd ~/se-project/backend/
```
- Install NVM
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
```
- Install Node version >= 10
```
nvm install 10
nvm use 10
nvm list # should show node version 10
```
- Verify package versions
```
node --version # version should be 10.x.x
npm  --version # version should be  6.x.x
```
- Install required packages
```
npm install # should create a node_modules directory
```
## Frontend Installation (Unix: OSX/Linux)
- Navigate frontend directory in the repository
```
cd ~/se-project/front-end/
```
- Install required packages
```
nvm use 10
npm install # should create a node_modules directory
```
- Install Grunt
```
npm install grunt --save-dev
```

## Generate keys (Unix: OSX/Linux)
- Navigate to bin directory
```
cd ~/se-project/backend/bin
```
- Generate keys
```
openssl genrsa 1024 > private.key
openssl req -new -key private.key -out cert.csr
openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem
```

## How to run the tests
To run the test cases:

```
cd backend
npm test
```

![Unit Test expected output](https://github.com/purnasrivatsa96/Base-Research-tool/blob/main/test_images/test_output.png)

## How to run the app
To run the app, open two terminal instances.

In terminal instance 1:
```
cd ~/se-project/front-end
source ~/.nvm/nvm.sh
nvm use 10
grunt watch
```

In terminal instance 2:
```
cd ~/se-project/backend
source ~/.nvm/nvm.sh
nvm use 10
npm run watch
```

Visit `https://localhost:3443/login` in web-browser.

## Specifc use case example

Use case - Create repository.
1. First login from the login page with valid credentials or signup if you do not have credentials
2. You will be redirected to dashboard page.
3. Click on add repository button on top left.
4. Give a repository name in the popup and click "ok"
5. The repository will be added and shown in the left side bar.

## Support
For any program-specific support, please contact any of the following:
- Abhinav Sethi (abhinavsethi@vt.edu, github: abhinav_vt)
- Gautam Sharma (gautams@vt.edu, github: gtmshrm)
- Nivishree Palvannan (nivipal@vt.edu, github: nivishree)
- Purna Srivatsa (purnasrivatsa@vt.edu, github: purnasrivatsa96)
