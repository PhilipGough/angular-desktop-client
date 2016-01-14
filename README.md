#Install Ruby
https://gorails.com/setup/osx/10.9-mavericks (just need to follow up to installing ruby)

#Install SASS
gem install sass

# Install Foreman

```
  npm install -g foreman
```

# Install Convict
```
  npm install -g convict
```

#Install Gulp, Bower and dependancies

```
  cd sparkapp
  npm install -g gulp
  npm install -g bower
  npm install
```

#Install Chrome Mobile App Tools

Follow instructions here https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/Installation.md

#Develop App with livereload server

```
nf start develop
```

#Build App for Browsers

```
nf start web
```

#Build Apps for Mobile

```
nf start mobile
```

#Use CCA to build app for Cordova Platforms

After building for mobile run the following commands to run the app on an iOS device

```
cd cordova
cca prepare
cca run ios
```

#Miscellanious
Environment Variables can be modified for the gulp builds using `convict` in the config folder
Application copy is stored in the copy folder using JSON and interpreted by the app using `angular-translate`
