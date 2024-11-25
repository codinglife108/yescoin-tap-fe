# yescoin-tap-fe

## Testing

It's possible to enable a console on the app by adding the following to the index.html file:

<script src="https://cdn.jsdelivr.net/npm/eruda"></script>

<script>
    // Initialize Eruda
    eruda.init();
</script>


## Deployment

Done through firebase, to deploy, build the app locally with:
yarn install && yarn run build

then deploy on firebase with (to be installed with "npm install -g firebase-tools")

firebase deploy

or

yarn build && yarn deploy