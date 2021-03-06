# @kvanttori/huukki

A minimal express server that executes shell commands based on GitHub webhooks.

🚧 This package is in its alpha stage, so don't expect it to work flawlessly.

## Quick start

The absolute quickest way to run the server is by using `npx`. This way you don't need to clone the repository, install dependencies and build the project manually. Simply run the correct npx command in the folder where you want to run the server.

### Run the server as a daemon (recommended)

```bash
npx @kvanttori/huukki --daemon
```

or

```bash
npx @kvanttori/huukki --daemon=start
```

This will run the server as a [PM2](https://pm2.keymetrics.io/) background process under the name `huukki`. This means the server will automatically restart upon crash.

You can access the logs for the server by installing `pm2` globally and running `pm2 logs` or `pm2 logs huukki`

### Stop the daemon server

`npx @kvanttori/huukki --daemon=stop`

This stops the PM2 process.

### Run the server as a normal node process

`npx @kvanttori/huukki`

This will launch the server as a normal `node` process, if you don't want to use PM2 (although it is highly recommended).

### Run the server without npx/npm

`npx` or `npm` might give you problems on some machines. To avoid this you can run the server normally by cloning this repository, installing the dependencies using `npm i`, building the project using `npm run build`, and then running `npm start` to start the server. When running it this way, you'll need to create the `huukki.yaml` file inside the repository.

## Configuration

The server uses the following default configuration:

```yaml
# configuration for the underlying HTTP server
server:
  port: 8080 # required
  route: / # required
  secret: changeme # optional

# Configuration for each branch you want to run commands for.
# For each branch, you must define the 'commands' field. 'dir' is optional and defaults to './'
branch:
  master:
    dir: ./ # optional
    commands:
      - git pull
```

You can customize the huukki server by creating a file called `huukki.yaml` in the same directory where you run the huukki server or command.

You can define different directories and commands for each branch, for example:

```yaml
# huukki.yaml

server:
  port: 8080 # required
  route: / # required
  secret: changeme # optional

branch:
  # different set of commands for production
  master:
    dir: ./
    commands:
      - git pull
      - npm ci --only=production
      - npm run build
      - npm start

  # different folder and/or commands when pushing to 'development' branch
  development:
    dir: ./path/to/some/folder
    commands:
      - git pull
      - npm i
      - npm run build
      - npm run dev

  some-branch:
    commands:
      - echo "this is a test"
```

### GitHub webhook

The GitHub webhook **must** have `application/json` as its content type. With the configurations defined above, and an example IP of `localhost`, the GitHub webhook URL should look like this: `http://localhost:8080/webhook`, and the webhook's secret should be `ultra-secret-secret`.

## Important notes

- If you're running `git pull` as one of the commands, make sure that git has the credentials saved so that it won't try to ask for them every time. You can make Git store the username and password with the following command: `git config --global credential.helper store`. Note that you'll need to input the credentials once after this command to save them.

- Changing directories does not transfer from one command to the next, because each command is executed as a separate process. This means that the following won't work as expected:

```yaml
# ... rest of the config
some-branch:
  dir: /
  commands:
    - cd ./some/folder
    - pwd # this will print '/' and not '/some/folder'
```

## Development

First install the dependencies and build the server:

- `npm i`

And to start the server in dev mode, simply run `npm run dev`.

To build a production version, simply run `npm run build`.
This will create a `dist` folder with the built server inside, which can be run with `npm start`
