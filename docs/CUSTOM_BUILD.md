# Building and running your own docker image

You are free to clone the repo and make any changes to the application code that you want, adding your own customization and features. After that you can build a docker image by running `yarn build:docker` or alternatively run `docker build` and pass your own args that is necessary.

For running app container from freshly built image do
```sh
docker run -p 3000:3000 --env-file <path-to-your-env-file> <your-image-tag>
```

e.g
```sh
docker run --name frontend -p 3035:3035 --env-file .env frontend_frontend
```

*Disclaimer* Do not try to generate production build of the app on your local machine (outside the docker). The app will not work as you would expect.
