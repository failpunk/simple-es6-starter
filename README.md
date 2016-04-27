# Datalayer.JS
StudyMode Datalayer Abstraction


#### Install
```
$ npm i
```

#### Development
Watches your files for any changes. On change it calls the development build step.

```
$ grunt
```

#### Development Build
Transpiles javascript and concatinates into a single file. Code will be placed in the dist folder.

```
$ grunt build
```

#### Production Build
Uglify javascript code for deployment.  Code will be placed in the dist folder.

```
$ grunt build-prod
```

#### Versioning
```
$ npm version [major | minor | patch]
$ git push --follow-tags
```
