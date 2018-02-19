# Dashboard for the DDD-DApp

This is an experimental dashboard, which can be usesd to visualize the interaction of [DDD-DApp](https://github.com/pirminrehm/ddd-dapp) users. Please visit the [DDD-DApp repository](https://github.com/pirminrehm/ddd-dapp) for more information.

Dashboard template by Creative Tim:
https://github.com/creativetimofficial/material-dashboard-angular

Please note that the providers are mostly raw copies from the DApp and for sustainable development in the dashboard not much time was granted.

## Setup the project
### Prerequisites
1. You have successfully set up the [DDD-DApp Project](https://github.com/pirminrehm/ddd-dapp)
2. Install globals: `Angular-CLI (1.6.0)`
    ```shell
    $ npm install -g @angular/cli
    ```
### Getting started
1. Clone the `ddd-dashboard` project.
2. Install the project's dependencies:
    ```shell
    $ npm install
    ```

## Workflow
### Prerequisites
To monitor a team, an logging contract has to be deployed to the network (see [DDD-DApp Project](https://github.com/pirminrehm/ddd-dapp#compile-and-deploy-smart-contracts)). The creator of a team has to store the contract address in his DDD-DApp settings. 

### Start the dashboard
1. Serve the Dashboard in a second console tab / window:
    ```shell
    $ ng serve
    ```
2. Go to `http://localhost:4200/` to visit the dashboard


#### **Important hint**
If you have changed your ip in `truffle.js` of the DDD-DApp project, follow the following instructions:

1. Open the `truffle.json` and set your local ip (e.g. `192.168.0.150`) as host, just like in the `truffle.js` of the DDD-DApp
2. Restart the dashboard (cancle and start `ng serve`) to make the change effective

### Use the dashboard
1. Enter the address of the logging contract into the top right input field
2. Go to `Teams Overview` and wait for the creator to create the team
3. Select the target team and go to `Team Dashboard`. You can monitor
    - the latest invitation-token
    - pending team members
    - team members
4. If a team was successfully created go to `Team Votings` to monitor
    - open and closed votings
5. Select an open or closed voting to monitor
    - who has voted
    - which locations were voted (distribution of points)
    - which location is the majority/stochastic winner
6. To change the team go to `Teams Overview` to select another one
> Note: If you have something selected, an auto-update cycle is started. You don't have to refresh the page

## License

Licensed under MIT, see [LICENSE.md](./LICENSE.md)
