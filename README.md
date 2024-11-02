# greatgamegal.com

## About

This is just a repo I set up to stop live editing my website, because that was probably poor practice.
This project uses [Bun](https://bun.sh/) to host my website which can be found on the web [here](https://www.greatgamegal.com).
Certbot was used to generate certificates for use on the webhosting service, certbot and instructions to use it can be found [here](https://certbot.eff.org/).

## Setup

This project is relatively simple to get up and running if you follow the following steps.

### Step 0: Docker Requirements

There are a few things needed to run this project. Firstly Bun, the JavaScript Runtime, which you can acquire [here](https://bun.sh/). And secondly a valid SSL certificate, the creation of which is a bit beyond the purview of this guide, but an easy solution is [Let's Encrypt](https://letsencrypt.org/getting-started/).

### Step 1: Clone the Repo

Clone the project! Go to your desired folder and run one of the following commands, depending on if you prefer HTTPS or SSH for git cloning.
SSH

```sh
git clone git@github.com:GreatGameGal/greatgamegal.com.git --recursive
```

or HTTPS

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
bun run installAll
```

### Step 4: Run Build

While the backend doesn't need to be built, the frontend does. The backend has a build script to help you with this!

```sh
bun run build
```

### Step 5: Configure

Copy example.env to .env and begin to configure! `PORT`, `KEY_PATH`, and `CERT_PATH` are required, but `HTTP_PORT`, `GITHUB_SECRET`, `SERVER_REPO`, and `HTTP_REPO` are all optional.
Setting `HTTP_PORT` is recommended, this will enable redirecting from access on that port to a HTTPS address on PORT. `HTTP_PORT` may be a single port or a comma separated list of ports.
Setting `GITHUB_SECRET` and `SERVER_REPO` or `HTTP_REPO` will enable integration to restart on updates to those repos if you've set up a webhook for them.

### Step 6: Run the Project

That's right, the only thing left to do is run the project, you can do this by simply running the following command.

```sh
bun run start
```

## Running with Docker

Getting the project up and running in Docker is (theoretically) incredibly simple too with the following steps!

### Step 0: Docker Requirements

An obviously important step is installing Docker, if you don't already have it you can get it [here](https://docs.docker.com/get-docker/).
And of course you still need a valid SSL certificate.

### Step 1: Running the Project!

That's right, there's really only one step once you have docker installed and your SSL certs made! But you can do this the easy way or the hard way.

#### The Easy Way

The easy way is to go to a directory you don't mind a bash script hanging out in and running the following commands, replacing the appropriate all caps text with what it indicates it wants.

```sh
curl https://raw.githubusercontent.com/GreatGameGal/greatgamegal.com/main/run-dicker.sh -o docker-greatgamegal.com.sh
sh ./docker-greatgamegal.com.sh -p REPLACE_WITH_PORT -h REPLACE_WITH_HTTP_PORT -s /PATH/TO/FOLDER/CONTAINING/KEY_AND_CERT
```

#### The Hard Way

The more complicated way, though with technically fewer steps, is by running the following command and substituting out the import-to-replace text. This can be simplified with environment variables but those are a bit different on Windows making this really the "compatability" way, with the suggested solution on Windows being running the "easy way" with [WSL](https://learn.microsoft.com/en-us/windows/wsl/).

```sh
docker run -d -v /PATH/TO/FOLDER/CONTAINING/KEY_AND_CERT:/home/bun/ssl -e PORT=REPLACE_WITH_PORT -p REPLACE_WITH_PORT:REPLACE_WITH_PORT --expose REPLACE_WITH_PORT -e HTTP_PORT=REPLACE_WITH_HTTP_PORT -p REPLACE_WITH_HTTP_PORT:REPLACE_WITH_HTTP_PORT --expose REPLACE_WITH_HTTP_PORT greatgamegal/greatgamegal.com:latest
```
