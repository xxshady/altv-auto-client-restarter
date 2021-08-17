# altv-auto-client-restarter

This is a tool for automatic full restart of the alt:V client and game due to the crash or during modding process

Short demo of the immediate termination of alt:V and gta using ctrl+c and restart using `re` command
[![youtube](http://img.youtube.com/vi/EB11J1sAYRw/0.jpg)](http://www.youtube.com/watch?v=EB11J1sAYRw)

Full demo with auto restart on game crash
https://youtu.be/EB11J1sAYRw

# Installation

## Prerequisites

-   NodeJS 14+

## Install

Clone it from GitHub and install only prod dependencies if you do not plan to change the source code

```
npm install --only=prod
```

```
yarn install --prod=true
```

## Usage

1. Specify the path to your folder with the client alt:V
in `config.js` key `altvPath`

2. Grant administrator rights to the console from which you will run this script

3. 

```
npm run start
```

```
yarn run start
```
