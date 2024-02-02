# greatgamegal.com
## About
This is just a repo I set up to stop live editing my website, because that was probably poor practice.
This project uses [Bun](https://bun.sh/) to host my website which can be found on the web [here](https://www.greatgamegal.com).
Certbot was used to generate certificates for use on the webhosting service, certbot and instructions to use it can be found [here](https://certbot.eff.org/).
## Setup
This project is relatively simple to get up and running if you follow the following steps.
### Step 0: Requirements
There are a few things needed to run this project. Firstly Bun, the JavaScript Runtime, which you can acquire [here](https://bun.sh/). And secondly a valid SSL certificate, the creation of which is a bit beyond the purview of this guide, but an easy solution is [Let's Encrypt](https://letsencrypt.org/getting-started/).
### Step 1: Clone the Repo
Clone the project! Go to your desired folder and run one of the following commands, depending on if you prefer HTTPS or SSH for git cloning.
SSH
```sh
git clone git@github.com:GreatGameGal/greatgamegal.com.git --recursive
```
or HTML
```sh
git clone https://github.com/GreatGameGal/greatgamegal.com.git --recursive
```
### Step 3: Run Install
First you need to actually go into the project directory using the following command.
```sh
cd greatgamegal.com
```
Then run the following command to install all required dependencies for both the front-end and the backend!
```sh
bun run install
```
### Step 4: Run Build
While the backend doesn't need to be built, the frontend does. The backend has a build script to help you with this!
```sh
bun run build
```
### Step 5: Configure
Rename example.env to .env and begin to configure! `PORT`, `KEY_PATH`, and `CERT_PATH` are required, but `HTTP_PORT`, `GITHUB_SECRET`, `SERVER_REPO`, and `HTTP_REPO` are all optional.
Setting `HTTP_PORT` is recommended will enable redirecting from access on that port to a HTTPS address on PORT.   
Setting `GITHUB_SECRET` and `SERVER_REPO` or `HTTP_REPO` will enable integration to restart on updates to those repos if you've set up a webhook for them.
### Step 6: Run the Project
That's right, the only thing left to do is run the project, you can do this by simply running the following command.
```sh
bun run start
```
