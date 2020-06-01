# Web development environment

This is my current web dev environment for building and hosting the website for Schau Wien.

It is designed for the following workflow:
* development happens in the www-dev folder, and run locally using `parcel testX/index.html` (in `www-dev`)
* once an experiment is ready to be published I build it and move it to `config/www` with the `parcel.sh` script (which just builds with `parcel build --no-cache` and seds the index.html so it uses a `localhost` address for the `main.js` instead of a relative path, cause thats the only way I got nginx to work)
* then git flow finish and push, then pull on the server. that should be everything
* if nginx experiments are desired/necessary, they are performed in the `nginx-dev` environment (`make dev`) which points into `www-dev`
* once nginx experiments are complete, the changes are pushed to `config/nginx`, pulled to the server, and its restarted with `make prod`


And thats it! Not sure if this is the best web development workflow ever invented but its good enough to get started.

Some handy scripts for setting up a gcloud micro instance and updating the CORS on a gcloud bucket are in the `gcloud` folder. You have to set the CORS headers if you want to host your own images.
