# Belnet GUI

This repository contains a cross-platform GUI for controlling and observing stats from a locally-running belnet. See also [beldex-network](https://github.com/Beldex-Coin/belnet).

## Build Instructions
 
Build deps:

* [nvm](https://github.com/nvm-sh/nvm) or [asdf](https://github.com/asdf-vm/asdf)
* git
* wine (for windows builds)
 
Clone the repo:

    $ git clone https://github.com/victor-tucci/Belnet-gui

Build the project:

    $ yarn install --frozen-lockfile
    $ yarn dist

### CI Builds

builds from ci can be obtained from our [ci server](https://deb.beldex.io)

### Env variables

To avoid being asked to start/stop the belnet daemon on every start of this GUI you can set the environment variable
`DISABLE_AUTO_START_STOP=anything` on your system or before starting the GUI.
